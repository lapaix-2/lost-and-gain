const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create HTTP server
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Online users
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('Umukoresha yaciyeho / connected:', socket.id);

  socket.on('user_online', (userData) => {
    onlineUsers.set(socket.id, {
      ...userData,
      socketId: socket.id
    });

    io.emit(
      'update_online_users',
      Array.from(onlineUsers.values())
    );
  });

  socket.on('user_offline', (userId) => {
    for (const [key, value] of onlineUsers.entries()) {
      if (value.userId === userId) {
        onlineUsers.delete(key);
      }
    }

    io.emit(
      'update_online_users',
      Array.from(onlineUsers.values())
    );
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id);

    io.emit(
      'update_online_users',
      Array.from(onlineUsers.values())
    );
  });
});

async function startServer() {
  try {
    // -----------------------------------------
    // CHECK ENVIRONMENT VARIABLES
    // -----------------------------------------

    console.log('========== DATABASE CONFIG ==========');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('DB_PORT:', process.env.DB_PORT);
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'SET' : 'MISSING');
    console.log('=====================================');

    // Make sure required variables exist
    const requiredEnv = [
      'DB_HOST',
      'DB_USER',
      'DB_PASSWORD',
      'DB_NAME'
    ];

    for (const variable of requiredEnv) {
      if (!process.env[variable]) {
        throw new Error(`Missing environment variable: ${variable}`);
      }
    }

    // -----------------------------------------
    // CREATE MYSQL CONNECTION POOL
    // -----------------------------------------

    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 21221,

      ssl: {
        rejectUnauthorized: false
      },

      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // -----------------------------------------
    // TEST REAL DATABASE CONNECTION
    // -----------------------------------------

    const [testResult] = await pool.query('SELECT 1 AS connected');

    console.log('Database test:', testResult);

    console.log('=====================================');
    console.log('✅ Connected to Aiven Database neza cyane! 🚀');
    console.log('=====================================');

    // Make database available to routes
    app.set('db', pool);

    // -----------------------------------------
    // LOAD ROUTES
    // -----------------------------------------

    const authRoutes = require('./routes/authRoutes');
    const materialRoutes = require('./routes/materialRoutes');

    app.use('/api/auth', authRoutes);
    app.use('/api/materials', materialRoutes);

    // -----------------------------------------
    // TEST API
    // -----------------------------------------

    app.get('/', (req, res) => {
      res.json({
        message: 'Welcome to Lost and Gain API!',
        database: 'connected'
      });
    });

    // -----------------------------------------
    // HEALTH CHECK
    // -----------------------------------------

    app.get('/api/health', async (req, res) => {
      try {
        const [result] = await pool.query(
          'SELECT 1 AS database_connected'
        );

        res.json({
          status: 'OK',
          server: 'running',
          database: result[0].database_connected === 1
            ? 'connected'
            : 'error'
        });
      } catch (error) {
        console.error('Health check database error:', error);

        res.status(500).json({
          status: 'ERROR',
          database: 'disconnected',
          error: error.message
        });
      }
    });

    // -----------------------------------------
    // START SERVER
    // -----------------------------------------

    const PORT = Number(process.env.PORT) || 4000;

    server.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌐 Port: ${PORT}`);
    });

  } catch (err) {
    console.error('❌ Database/server startup failed!');
    console.error('Error:', err.message);
    console.error('Code:', err.code || 'N/A');

    process.exit(1);
  }
}

startServer();