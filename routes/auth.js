const express = require('express');
const {
    register
} = require('../controllers/auth');

const router = express.Router();

router.post('/registro', register);

module.exports = router;