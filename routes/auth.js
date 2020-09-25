const express = require('express');
const {
    register,
    login,
    getMe
} = require('../controllers/auth');

const router = express.Router();

//  Middleware
const { protect } = require('../middleware/auth');

router.post('/registro', register);
router.post('/login', login);
router.get('/me', protect, getMe)

module.exports = router;