const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage });

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Token irabuze!' });
    try {
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
        const decoded = jwt.verify(token, 'lostandgain_secret_key');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token ntabwo ari yo!' });
    }
};

router.get('/admin/posts', async (req, res) => {
    const pool = req.app.get('db');
    try {
        const [results] = await pool.query('SELECT * FROM announced ORDER BY date_announced DESC');
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/admin/claim-requests', async (req, res) => {
    const pool = req.app.get('db');
    try {
        const [results] = await pool.query('SELECT * FROM claim_requests ORDER BY created_at DESC');
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/', verifyToken, async (req, res) => {
    const pool = req.app.get('db');
    try {
        const [results] = await pool.query('SELECT * FROM announced ORDER BY date_announced DESC');
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/announce', verifyToken, upload.single('photo'), async (req, res) => {
    const pool = req.app.get('db');
    const { material_name } = req.body;
    const announcer_name = req.user.full_name;
    const photo = req.file ? req.file.filename : null;
    try {
        await pool.query(
            'INSERT INTO announced (announcer_name, material_name, photo, status) VALUES (?, ?, ?, ?)',
            [announcer_name, material_name, photo, 'available']
        );
        res.status(201).json({ message: 'Watangaje neza!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/delete/:id', verifyToken, async (req, res) => {
    const pool = req.app.get('db');
    const postId = req.params.id;
    const full_name = req.user.full_name;
    try {
        const [rows] = await pool.query('SELECT * FROM announced WHERE id = ?', [postId]);
        if (rows.length === 0) return res.status(404).json({ message: 'Post ntabwo ibonetse!' });
        if (rows[0].announcer_name !== full_name) return res.status(403).json({ message: 'Ntushobora gusiba post y undi muntu!' });
        await pool.query('DELETE FROM announced WHERE id = ?', [postId]);
        res.json({ message: 'Post yasibwe neza!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ROUTE NSHYA: Guhindura status y'ikintu ikaba 'claimed' (Iyi ni yo ivugurura ako kanya ko cyabonekejwe)
router.put('/claim/:id', verifyToken, async (req, res) => {
    const pool = req.app.get('db');
    const itemId = req.params.id;
    try {
        const [posts] = await pool.query('SELECT * FROM announced WHERE id = ?', [itemId]);
        if (posts.length === 0) return res.status(404).json({ message: 'Ikintu ntikibonetse!' });

        await pool.query("UPDATE announced SET status = 'claimed' WHERE id = ?", [itemId]);
        res.json({ message: 'Ikintu cyashyizweho ko cyabonekejwe (claimed) neza!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST — Claim request: Kwakira ifoto y'indangamuntu n'izindi zose nta nkomyi
router.post('/claim-request/:id', verifyToken, upload.fields([
    { name: 'id_card_photo', maxCount: 1 }, 
    { name: 'selfie', maxCount: 1 }
]), async (req, res) => {
    const pool = req.app.get('db');
    const postId = req.params.id;
    const { phone, full_name, province, district, sector, umudugudu, id_card } = req.body;
    const requester_id = req.user.id;
    const requester_name = req.user.full_name;

    try {
        if (!id_card) {
            return res.status(400).json({ message: 'Nyamuneka shyiramo nimero y\'indangamuntu yawe! ❌' });
        }

        if (!req.files || !req.files['id_card_photo'] || !req.files['selfie']) {
            return res.status(400).json({ message: 'Ugomba kohereza ifoto y\'indangamuntu n\'ifoto yawe ya Selfie kugira ngo wemeze ko ari wowe! ❌' });
        }

        const idCardPhotoFilename = req.files['id_card_photo'][0].filename;
        const selfieFilename = req.files['selfie'][0].filename;

        const [posts] = await pool.query('SELECT * FROM announced WHERE id = ?', [postId]);
        if (posts.length === 0) return res.status(404).json({ message: 'Post ntabwo ibonetse!' });
        if (posts[0].announcer_name === requester_name) return res.status(400).json({ message: 'Ntushobora gusaba ikintu waratangaje!' });
        if (posts[0].status === 'claimed') return res.status(400).json({ message: 'Ikintu cyaboneshejwe kare!' });

        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [requester_id]);
        if (users.length === 0) return res.status(404).json({ message: 'Umutumiwa ntabwo abonetse!' });
        const user = users[0];

        if (
            full_name.toLowerCase().trim() !== user.full_name.toLowerCase().trim() ||
            province.toLowerCase().trim() !== user.province.toLowerCase().trim() ||
            district.toLowerCase().trim() !== user.district.toLowerCase().trim() ||
            sector.toLowerCase().trim() !== user.sector.toLowerCase().trim() ||
            umudugudu.toLowerCase().trim() !== user.umudugudu.toLowerCase().trim() ||
            id_card.trim() !== user.id_card.trim()
        ) {
            return res.status(400).json({ message: 'Make sure that your address is the same as your account address!' });
        }

        await pool.query(
            `INSERT INTO claim_requests 
            (post_id, material_name, claimer_name, claimer_province, claimer_district, 
             claimer_sector, claimer_umudugudu, claimer_phone, id_card_front, id_card_back) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [postId, posts[0].material_name, requester_name, province, district,
             sector, umudugudu, phone, idCardPhotoFilename, selfieFilename]
        );

        // Guhita duhindura n'ubundi status y'ikintu ikaba claimed mu gihe claim yasabwe
        await pool.query("UPDATE announced SET status = 'claimed' WHERE id = ?", [postId]);

        const announcer_name = posts[0].announcer_name;
        const material_name = posts[0].material_name;
        const notificationMessage = `${requester_name} yemeje ko icyo watangaje ("${material_name}") ari icye kandi yatanze n'ibimenyetso. Nimero ye ni ${phone}.`;

        await pool.query(
            'INSERT INTO notifications (user_name, message, is_read) VALUES (?, ?, FALSE)',
            [announcer_name, notificationMessage]
        );

        res.status(201).json({ message: 'Request yoherejwe neza hamwe n\'ibimenyetso byawe! ✅' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/admin/claim-requests/approve/:id', async (req, res) => {
    const pool = req.app.get('db');
    try {
        const [requests] = await pool.query('SELECT * FROM claim_requests WHERE id = ?', [req.params.id]);
        if (requests.length === 0) return res.status(404).json({ message: 'Request ntabwo ibonetse!' });
        const request = requests[0];

        await pool.query('UPDATE claim_requests SET status = ? WHERE id = ?', ['approved', req.params.id]);
        await pool.query('UPDATE announced SET status = ?, updated_at = NOW() WHERE id = ?', ['claimed', request.post_id]);
        await pool.query(
            'INSERT INTO lost_found (receiver_name, material_name) VALUES (?, ?)',
            [request.claimer_name, request.material_name]
        );

        res.json({ message: 'Request yemejwe neza!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/admin/claim-requests/reject/:id', async (req, res) => {
    const pool = req.app.get('db');
    try {
        await pool.query('UPDATE claim_requests SET status = ? WHERE id = ?', ['rejected', req.params.id]);
        res.json({ message: 'Request yananiwe!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/already-found', async (req, res) => {
    const pool = req.app.get('db');
    try {
        const query = `
            SELECT * FROM announced 
            WHERE status = 'claimed'
            ORDER BY date_announced DESC
        `;
        const [results] = await pool.query(query);
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;