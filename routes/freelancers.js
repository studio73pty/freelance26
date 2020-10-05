const express = require('express');
const router = express.Router();
const {
    buscarFreelancers,
    buscarFreelance
} = require('../controllers/freelancers');

router.route('/')
    .get(buscarFreelancers)

router.route('/:id')
    .get(buscarFreelance)

module.exports = router;