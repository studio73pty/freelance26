const express = require('express');
const router = express.Router();
const {
    buscarProyectos,
    agregarProyecto
} = require('../controllers/proyectos');

//  Middleware
const { protect } = require('../middleware/auth');

router.route('/')
    .post(protect, agregarProyecto)

router.route('/:id')
    .get(buscarProyectos)
/*
router.put('/actualizarperfil', protect, modificarPerfil)*/

module.exports = router;