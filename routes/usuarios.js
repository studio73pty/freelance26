const express = require('express');
const router = express.Router();

router.route('/')
    .get(buscarUsuarios)
    .post(iniciarSesion);

router.route('/:id')
    .get(buscarUsuario)
    .put(modificarUsuario)
    .delete(eliminarUsuario)

module.exports = router;