const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ======================================================
// UPLOADS DIRECTORY
// ======================================================

const uploadsDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// ======================================================
// MULTER CONFIGURATION
// ======================================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

        cb(null, filename);
    }
});

const upload = multer({
    storage
});

// ======================================================
// VERIFY JWT TOKEN
// ======================================================

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'Token irabuze!'
        });
    }

    try {
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7)
            : authHeader;

        if (!process.env.JWT_SECRET) {
            console.error('❌ JWT_SECRET ntabwo yashyizwe muri environment variables.');

            return res.status(500).json({
                message: 'Server configuration error.'
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (err) {

        console.error('❌ JWT verification error:', err.message);

        return res.status(401).json({
            message: 'Token ntabwo ari yo cyangwa yarashaje!'
        });
    }
};

// ======================================================
// ADMIN - GET ALL POSTS
// ======================================================

router.get('/admin/posts', async (req, res) => {

    const pool = req.app.get('db');

    try {

        const [results] = await pool.query(
            'SELECT * FROM announced ORDER BY date_announced DESC'
        );

        return res.json(results);

    } catch (err) {

        console.error('❌ Admin posts error:', err);

        return res.status(500).json({
            message: err.message
        });
    }
});

// ======================================================
// ADMIN - GET CLAIM REQUESTS
// ======================================================

router.get('/admin/claim-requests', async (req, res) => {

    const pool = req.app.get('db');

    try {

        const [results] = await pool.query(
            'SELECT * FROM claim_requests ORDER BY created_at DESC'
        );

        return res.json(results);

    } catch (err) {

        console.error('❌ Claim requests error:', err);

        return res.status(500).json({
            message: err.message
        });
    }
});

// ======================================================
// GET ALL ANNOUNCEMENTS
// ======================================================

router.get('/', verifyToken, async (req, res) => {

    const pool = req.app.get('db');

    try {

        const [results] = await pool.query(
            'SELECT * FROM announced ORDER BY date_announced DESC'
        );

        return res.json(results);

    } catch (err) {

        console.error('❌ Get announcements error:', err);

        return res.status(500).json({
            message: err.message
        });
    }
});

// ======================================================
// ANNOUNCE LOST / FOUND ITEM
// ======================================================

router.post(
    '/announce',
    verifyToken,
    upload.single('photo'),
    async (req, res) => {

        const pool = req.app.get('db');

        const { material_name } = req.body;

        const announcer_name = req.user.full_name;

        const photo = req.file
            ? req.file.filename
            : null;

        if (!material_name || !material_name.trim()) {

            return res.status(400).json({
                message: 'Shyiramo izina ry\'ikintu!'
            });
        }

        try {

            await pool.query(
                `INSERT INTO announced
                (announcer_name, material_name, photo, status)
                VALUES (?, ?, ?, ?)`,
                [
                    announcer_name,
                    material_name.trim(),
                    photo,
                    'available'
                ]
            );

            return res.status(201).json({
                message: 'Watangaje neza! ✅'
            });

        } catch (err) {

            console.error('❌ Announce error:', err);

            return res.status(500).json({
                message: err.message
            });
        }
    }
);

// ======================================================
// DELETE ANNOUNCEMENT
// ======================================================

router.delete(
    '/delete/:id',
    verifyToken,
    async (req, res) => {

        const pool = req.app.get('db');

        const postId = req.params.id;

        const full_name = req.user.full_name;

        try {

            const [rows] = await pool.query(
                'SELECT * FROM announced WHERE id = ?',
                [postId]
            );

            if (rows.length === 0) {

                return res.status(404).json({
                    message: 'Post ntabwo ibonetse!'
                });
            }

            if (rows[0].announcer_name !== full_name) {

                return res.status(403).json({
                    message: 'Ntushobora gusiba post y\'undi muntu!'
                });
            }

            await pool.query(
                'DELETE FROM announced WHERE id = ?',
                [postId]
            );

            return res.json({
                message: 'Post yasibwe neza! ✅'
            });

        } catch (err) {

            console.error('❌ Delete post error:', err);

            return res.status(500).json({
                message: err.message
            });
        }
    }
);

// ======================================================
// MARK ITEM AS CLAIMED
// ======================================================

router.put(
    '/claim/:id',
    verifyToken,
    async (req, res) => {

        const pool = req.app.get('db');

        const itemId = req.params.id;

        try {

            const [posts] = await pool.query(
                'SELECT * FROM announced WHERE id = ?',
                [itemId]
            );

            if (posts.length === 0) {

                return res.status(404).json({
                    message: 'Ikintu ntikibonetse!'
                });
            }

            await pool.query(
                "UPDATE announced SET status = 'claimed' WHERE id = ?",
                [itemId]
            );

            return res.json({
                message: 'Ikintu cyashyizweho ko cyabonekejwe neza! ✅'
            });

        } catch (err) {

            console.error('❌ Claim error:', err);

            return res.status(500).json({
                message: err.message
            });
        }
    }
);

// ======================================================
// CLAIM REQUEST
// ======================================================

router.post(
    '/claim-request/:id',
    verifyToken,

    upload.fields([
        {
            name: 'id_card_photo',
            maxCount: 1
        },
        {
            name: 'selfie',
            maxCount: 1
        }
    ]),

    async (req, res) => {

        const pool = req.app.get('db');

        const postId = req.params.id;

        const {
            phone,
            full_name,
            province,
            district,
            sector,
            umudugudu,
            id_card
        } = req.body;

        const requester_id = req.user.id;

        const requester_name = req.user.full_name;

        try {

            // ------------------------------
            // Check ID card
            // ------------------------------

            if (!id_card || !id_card.trim()) {

                return res.status(400).json({
                    message:
                        'Nyamuneka shyiramo nimero y\'indangamuntu yawe! ❌'
                });
            }

            // ------------------------------
            // Check uploaded files
            // ------------------------------

            if (
                !req.files ||
                !req.files.id_card_photo ||
                !req.files.selfie
            ) {

                return res.status(400).json({
                    message:
                        'Ugomba kohereza ifoto y\'indangamuntu n\'ifoto yawe ya Selfie! ❌'
                });
            }

            const idCardPhotoFilename =
                req.files.id_card_photo[0].filename;

            const selfieFilename =
                req.files.selfie[0].filename;

            // ------------------------------
            // Get post
            // ------------------------------

            const [posts] = await pool.query(
                'SELECT * FROM announced WHERE id = ?',
                [postId]
            );

            if (posts.length === 0) {

                return res.status(404).json({
                    message: 'Post ntabwo ibonetse!'
                });
            }

            const post = posts[0];

            // ------------------------------
            // Prevent owner claiming own item
            // ------------------------------

            if (post.announcer_name === requester_name) {

                return res.status(400).json({
                    message:
                        'Ntushobora gusaba ikintu waratangaje!'
                });
            }

            // ------------------------------
            // Check item status
            // ------------------------------

            if (post.status === 'claimed') {

                return res.status(400).json({
                    message:
                        'Ikintu cyaboneshejwe kare!'
                });
            }

            // ------------------------------
            // Get user
            // ------------------------------

            const [users] = await pool.query(
                'SELECT * FROM users WHERE id = ?',
                [requester_id]
            );

            if (users.length === 0) {

                return res.status(404).json({
                    message:
                        'Umutumiwa ntabwo abonetse!'
                });
            }

            const user = users[0];

            // ------------------------------
            // Validate user information
            // ------------------------------

            const submittedFullName =
                (full_name || '').trim().toLowerCase();

            const submittedProvince =
                (province || '').trim().toLowerCase();

            const submittedDistrict =
                (district || '').trim().toLowerCase();

            const submittedSector =
                (sector || '').trim().toLowerCase();

            const submittedUmudugudu =
                (umudugudu || '').trim().toLowerCase();

            const submittedIdCard =
                (id_card || '').trim();

            const registeredFullName =
                (user.full_name || '').trim().toLowerCase();

            const registeredProvince =
                (user.province || '').trim().toLowerCase();

            const registeredDistrict =
                (user.district || '').trim().toLowerCase();

            const registeredSector =
                (user.sector || '').trim().toLowerCase();

            const registeredUmudugudu =
                (user.umudugudu || '').trim().toLowerCase();

            const registeredIdCard =
                (user.id_card || '').trim();

            if (
                submittedFullName !== registeredFullName ||
                submittedProvince !== registeredProvince ||
                submittedDistrict !== registeredDistrict ||
                submittedSector !== registeredSector ||
                submittedUmudugudu !== registeredUmudugudu ||
                submittedIdCard !== registeredIdCard
            ) {

                return res.status(400).json({
                    message:
                        'Make sure that your address and ID card information are the same as your account information!'
                });
            }

            // ------------------------------
            // Create claim request
            // ------------------------------

            await pool.query(
                `INSERT INTO claim_requests
                (
                    post_id,
                    material_name,
                    claimer_name,
                    claimer_province,
                    claimer_district,
                    claimer_sector,
                    claimer_umudugudu,
                    claimer_phone,
                    id_card_front,
                    id_card_back
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    postId,
                    post.material_name,
                    requester_name,
                    province,
                    district,
                    sector,
                    umudugudu,
                    phone,
                    idCardPhotoFilename,
                    selfieFilename
                ]
            );

            // ------------------------------
            // Update item status
            // ------------------------------

            await pool.query(
                "UPDATE announced SET status = 'claimed' WHERE id = ?",
                [postId]
            );

            // ------------------------------
            // Notify announcer
            // ------------------------------

            const notificationMessage =
                `${requester_name} yemeje ko icyo watangaje ("${post.material_name}") ari icye kandi yatanze n'ibimenyetso. Nimero ye ni ${phone}.`;

            await pool.query(
                `INSERT INTO notifications
                (user_name, message, is_read)
                VALUES (?, ?, FALSE)`,
                [
                    post.announcer_name,
                    notificationMessage
                ]
            );

            return res.status(201).json({
                message:
                    'Request yoherejwe neza hamwe n\'ibimenyetso byawe! ✅'
            });

        } catch (err) {

            console.error('❌ Claim request error:', err);

            return res.status(500).json({
                message: err.message
            });
        }
    }
);

// ======================================================
// ADMIN - APPROVE CLAIM REQUEST
// ======================================================

router.put(
    '/admin/claim-requests/approve/:id',
    async (req, res) => {

        const pool = req.app.get('db');

        try {

            const [requests] = await pool.query(
                'SELECT * FROM claim_requests WHERE id = ?',
                [req.params.id]
            );

            if (requests.length === 0) {

                return res.status(404).json({
                    message:
                        'Request ntabwo ibonetse!'
                });
            }

            const request = requests[0];

            await pool.query(
                `UPDATE claim_requests
                 SET status = ?
                 WHERE id = ?`,
                [
                    'approved',
                    req.params.id
                ]
            );

            await pool.query(
                `UPDATE announced
                 SET status = ?, updated_at = NOW()
                 WHERE id = ?`,
                [
                    'claimed',
                    request.post_id
                ]
            );

            await pool.query(
                `INSERT INTO lost_found
                (receiver_name, material_name)
                VALUES (?, ?)`,
                [
                    request.claimer_name,
                    request.material_name
                ]
            );

            return res.json({
                message:
                    'Request yemejwe neza! ✅'
            });

        } catch (err) {

            console.error(
                '❌ Approve claim error:',
                err
            );

            return res.status(500).json({
                message: err.message
            });
        }
    }
);

// ======================================================
// ADMIN - REJECT CLAIM REQUEST
// ======================================================

router.put(
    '/admin/claim-requests/reject/:id',
    async (req, res) => {

        const pool = req.app.get('db');

        try {

            const [result] = await pool.query(
                `UPDATE claim_requests
                 SET status = ?
                 WHERE id = ?`,
                [
                    'rejected',
                    req.params.id
                ]
            );

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message:
                        'Request ntabwo ibonetse!'
                });
            }

            return res.json({
                message:
                    'Request yananiwe! ❌'
            });

        } catch (err) {

            console.error(
                '❌ Reject claim error:',
                err
            );

            return res.status(500).json({
                message: err.message
            });
        }
    }
);

// ======================================================
// ALREADY FOUND / CLAIMED ITEMS
// ======================================================

router.get(
    '/already-found',
    async (req, res) => {

        const pool = req.app.get('db');

        try {

            const [results] = await pool.query(
                `SELECT *
                 FROM announced
                 WHERE status = 'claimed'
                 ORDER BY date_announced DESC`
            );

            return res.json(results);

        } catch (err) {

            console.error(
                '❌ Already-found error:',
                err
            );

            return res.status(500).json({
                message: err.message
            });
        }
    }
);

// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;