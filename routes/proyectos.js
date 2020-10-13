const express = require('express');
const router = express.Router();
const {
    buscarProyectos,
    agregarProyecto,
    modificarProyecto,
    eliminarProyecto
} = require('../controllers/proyectos');

//  Middleware
const { protect } = require('../middleware/auth');

router.route('/')
    .post(protect, agregarProyecto)

router.route('/:id')
    .get(buscarProyectos)
    .put(protect, modificarProyecto)
    .delete(protect, eliminarProyecto)
/*
router.put('/actualizarperfil', protect, modificarPerfil)*/

module.exports = router;