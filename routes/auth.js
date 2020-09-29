const express = require('express');
const {
    register,
    login,
    getMe,
    forgotPassword
} = require('../controllers/auth');

const router = express.Router();

//  Middleware
const { protect } = require('../middleware/auth');

router.post('/registro', register);
router.post('/login', login);
router.get('/me', protect, getMe)
router.post('/forgotpassword', forgotPassword)

module.exports = router;