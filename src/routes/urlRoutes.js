const express = require('express');

const router = express.Router();

const {
    createShortUrl,
    redirectToOriginal,
    getMyUrls,
    getAnalytics
} = require('../controllers/urlController');
const authenticateToken = require('../middleware/authMiddleware');
router.post('/shorten', authenticateToken, createShortUrl);
router.get(
    '/my-urls',
    authenticateToken,
    getMyUrls
);
router.get(
    '/analytics/:shortCode',
    authenticateToken,
    getAnalytics
);
router.get('/:shortCode', redirectToOriginal);

module.exports = router;