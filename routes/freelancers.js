const express = require('express');
const router = express.Router();
const {
    buscarFreelancers,
    buscarFreelance,
    modificarPerfil
} = require('../controllers/freelancers');

//  Middleware
const { protect } = require('../middleware/auth');

router.route('/')
    .get(buscarFreelancers)

router.route('/:id')
    .get(buscarFreelance)

router.put('/actualizarperfil', protect, modificarPerfil)

module.exports = router;