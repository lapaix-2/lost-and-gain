const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER — Yavuguruwe kugira ngo itabangamira abinjiza indangamuntu
router.post('/register', async (req, res) => {
    const pool = req.app.get('db');
    const { full_name, id_card, province, district, sector, umudugudu, password } = req.body;

    if (!id_card || !id_card.trim()) {
        return res.status(400).json({ message: 'Nyamuneka shyiramo nimero y\'indangamuntu yawe!' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO users (full_name, id_card, province, district, sector, umudugudu, password) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        await pool.query(sql, [full_name, id_card, province, district, sector, umudugudu, hashedPassword]);
        return res.status(201).json({ message: 'Wavuye kwiyandikisha neza! ✅' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'ID card irasanzwe ikoreshwa!' });
        }
        return res.status(500).json({ message: 'Error: ' + err.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const pool = req.app.get('db');
    const { id_card, password } = req.body;

    try {
        const [results] = await pool.query('SELECT * FROM users WHERE id_card = ?', [id_card]);
        if (results.length === 0) {
            return res.status(400).json({ message: 'Umutumiwa ntabwo abonetse!' });
        }

        const user = results[0];

        // Genzura niba user blocked
        if (user.status === 'blocked') {
            return res.status(403).json({ message: 'Account yawe ihagaritswe! Vugana na Admin.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password ntabwo ari yo!' });
        }

        const token = jwt.sign(
            { id: user.id, full_name: user.full_name },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.json({
            message: 'Winjiye neza! ✅',
            token,
            user: { id: user.id, full_name: user.full_name }
        });

    } catch (err) {
        return res.status(500).json({ message: 'Error: ' + err.message });
    }
});

// GET user info by announcer_name (nta ID card)
router.get('/userinfo/:full_name', async (req, res) => {
    const pool = req.app.get('db');
    const full_name = req.params.full_name;
    try {
        const [results] = await pool.query(
            'SELECT full_name, province, district, sector, umudugudu FROM users WHERE full_name = ?',
            [full_name]
        );
        if (results.length === 0) {
            return res.status(404).json({ message: 'Umutumiwa ntabwo abonetse!' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET users bose (admin)
router.get('/admin/users', async (req, res) => {
    const pool = req.app.get('db');
    try {
        const [results] = await pool.query(
            'SELECT id, full_name, province, district, sector, umudugudu, status, created_at FROM users'
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Block user
router.put('/admin/block/:id', async (req, res) => {
    const pool = req.app.get('db');
    try {
        await pool.query('UPDATE users SET status = ? WHERE id = ?', ['blocked', req.params.id]);
        res.json({ message: 'User is blocked! ✅' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Unblock user
router.put('/admin/unblock/:id', async (req, res) => {
    const pool = req.app.get('db');
    try {
        await pool.query('UPDATE users SET status = ? WHERE id = ?', ['active', req.params.id]);
        res.json({ message: 'User is answered! ✅' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST — Kohereza message (user)
router.post('/messages/send', async (req, res) => {
    const pool = req.app.get('db');
    const { sender_name, message } = req.body;
    try {
        await pool.query(
            'INSERT INTO messages (sender_name, message) VALUES (?, ?)',
            [sender_name, message]
        );
        res.status(201).json({ message: 'Message yoherejwe neza! ✅' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET — Reba messages zawe (user)
router.get('/messages/mine/:sender_name', async (req, res) => {
    const pool = req.app.get('db');
    try {
        const [results] = await pool.query(
            'SELECT * FROM messages WHERE sender_name = ? ORDER BY created_at DESC',
            [req.params.sender_name]
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET — Reba messages zose (admin)
router.get('/messages/admin/all', async (req, res) => {
    const pool = req.app.get('db');
    try {
        const [results] = await pool.query(
            'SELECT * FROM messages ORDER BY created_at DESC'
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT — Subira message (admin)
router.put('/messages/reply/:id', async (req, res) => {
    const pool = req.app.get('db');
    const { reply } = req.body;
    try {
        await pool.query(
            'UPDATE messages SET reply = ?, is_read = TRUE, replied_at = NOW() WHERE id = ?',
            [reply, req.params.id]
        );
        res.json({ message: 'Wasubije neza! ✅' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET — Reba settings za user
router.get('/settings/:id', async (req, res) => {
    const pool = req.app.get('db');
    try {
        const [results] = await pool.query(
            'SELECT id, full_name, province, district, sector, umudugudu, profile_pic, language, theme FROM users WHERE id = ?',
            [req.params.id]
        );
        if (results.length === 0) return res.status(404).json({ message: 'User ntabwo abonetse!' });
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT — Hindura theme
router.put('/settings/theme/:id', async (req, res) => {
    const pool = req.app.get('db');
    const { theme } = req.body;
    try {
        await pool.query('UPDATE users SET theme = ? WHERE id = ?', [theme, req.params.id]);
        res.json({ message: 'Theme yahindutse! ✅' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT — Hindura language
router.put('/settings/language/:id', async (req, res) => {
    const pool = req.app.get('db');
    const { language } = req.body;
    try {
        await pool.query('UPDATE users SET language = ? WHERE id = ?', [language, req.params.id]);
        res.json({ message: 'Ururimi rwahinduwe! ✅' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT — Hindura profile picture
router.put('/settings/profilepic/:id', async (req, res) => {
    const pool = req.app.get('db');
    const multer = require('multer');
    const path = require('path');
    const storage = multer.diskStorage({
        destination: (req, file, cb) => { cb(null, 'uploads/'); },
        filename: (req, file, cb) => { cb(null, 'profile_' + Date.now() + path.extname(file.originalname)); }
    });
    const upload = multer({ storage }).single('profile_pic');
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!req.file) return res.status(400).json({ message: 'Nta foto yoherejwe!' });
        try {
            await pool.query('UPDATE users SET profile_pic = ? WHERE id = ?', [req.file.filename, req.params.id]);
            res.json({ message: 'Ifoto yahindutse! ✅', filename: req.file.filename });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
});

// DELETE — Siba profile picture
router.delete('/settings/profilepic/:id', async (req, res) => {
    const pool = req.app.get('db');
    try {
        await pool.query('UPDATE users SET profile_pic = NULL WHERE id = ?', [req.params.id]);
        res.json({ message: 'Ifoto yasibwe! ✅' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET — Reba notifications za user
router.get('/notifications/:user_name', async (req, res) => {
    const pool = req.app.get('db');
    try {
        const [results] = await pool.query(
            'SELECT * FROM notifications WHERE user_name = ? ORDER BY created_at DESC',
            [req.params.user_name]
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT — Soma notification (mark as read)
router.put('/notifications/read/:id', async (req, res) => {
    const pool = req.app.get('db');
    try {
        await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = ?', [req.params.id]);
        res.json({ message: 'Yasomwe! ✅' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT — Soma notifications zose za user
router.put('/notifications/readall/:user_name', async (req, res) => {
    const pool = req.app.get('db');
    try {
        await pool.query('UPDATE notifications SET is_read = TRUE WHERE user_name = ?', [req.params.user_name]);
        res.json({ message: 'Zose zasomwe! ✅' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
