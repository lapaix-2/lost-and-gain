const express = require('express');
const http = require('http'); // 1. Tumiza http module
const { Server } = require('socket.io'); // 2. Tumiza Socket.io
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. Kora HTTP server ukoresheje Express app
const server = http.createServer(app);

// 4. Huza Socket.io na HTTP server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Ububiko bw'abari online ubu
let onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('Umukoresha yaciyeho / connected:', socket.id);

  // Umukoresha iyo yinjiye (Online)
  socket.on('user_online', (userData) => {
    onlineUsers.set(socket.id, { ...userData, socketId: socket.id });
    io.emit('update_online_users', Array.from(onlineUsers.values()));
  });

  // Umukoresha iyo akoze logout
  socket.on('user_offline', (userId) => {
    for (let [key, value] of onlineUsers.entries()) {
      if (value.userId === userId) {
        onlineUsers.delete(key);
      }
    }
    io.emit('update_online_users', Array.from(onlineUsers.values()));
  });

  // Iyo yavuye kuri site cyangwa yafunze browser (Disconnect)
  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id);
    io.emit('update_online_users', Array.from(onlineUsers.values()));
  });
});

async function startServer() {
    try {
        const pool = await mysql.createPool({
            host: '127.0.0.1',
            user: 'laguser',
            password: 'lag123',
            database: 'LFD',
            waitForConnections: true,
            connectionLimit: 10,
        });

        console.log('✅ Connected to LFD database!');
        app.set('db', pool);

        // Aha twahinduye izina rihuye n'iry'iyo muri folder ya routes (authroute.js)
        const authRoutes = require('./routes/authRoutes');
        const materialRoutes = require('./routes/materialRoutes');

        app.use('/api/auth', authRoutes);
        app.use('/api/materials', materialRoutes);

        app.get('/', (req, res) => {
            res.json({ message: 'Welcome to Lost and Gain API!' });
        });

        const PORT = 4000;
        // 5. Hindura app.listen ikaba server.listen kugira ngo Socket.io ikore neza kuri port imwe
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (err) {
        console.log('Database connection failed:', err);
    }
}

startServer();