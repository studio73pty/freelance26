const express = require('express');
const router = express.Router();
const {
    buscarUsuarios,
    buscarUsuario,
    iniciarSesion,
    modificarUsuario,
    eliminarUsuario
} = require('../controllers/usuarios');

router.route('/')
    .get(buscarUsuarios)
    .post(iniciarSesion);

router.route('/:id')
    .get(buscarUsuario)
    .put(modificarUsuario)
    .delete(eliminarUsuario)

module.exports = router;