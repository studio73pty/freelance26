const db = require('../config/db')


//  @Descripcion    Busca todos los usuarios registrados
//  @Ruta y Metodo  GET api/v1/usuarios
//  @Acceso         Privada
exports.buscarUsuarios = async (req, res, next) => {
    const usuarios = await db('usuarios').select()
    res.status(200).json({
        success: true,
        data: usuarios
    })
}

//  @Descripcion    Busca un solo usuario registrado
//  @Ruta y Metodo  GET api/v1/usuarios/:id
//  @Acceso         Privada
exports.buscarUsuario = async (req, res, next) => {
    const { id } = req.params;
    res.status(200).json({
        success: true,
        data: `Usuario ${id} encontrado`
    })
}

//  @Descripcion    Inicia sesion en tabla de usuarios
//  @Ruta y Metodo  POST api/v1/usuarios
//  @Acceso         Privada
exports.iniciarSesion = async (req, res, next) => {
    res.status(200).json({
        success: true,
        data: 'Iniciando sesion...'
    })
}

//  @Descripcion    Modifica un usuario registrado
//  @Ruta y Metodo  PUT api/v1/usuarios/:id
//  @Acceso         Privada
exports.modificarUsuario = async (req, res, next) => {
    const { id } = req.params;
    res.status(201).json({
        success: true,
        data: `Usuario ${id} modificado`
    })
}

//  @Descripcion    Elimina un usuario registradi
//  @Ruta y Metodo  DELETE api/v1/usuarios/:id
//  @Acceso         Privada
exports.eliminarUsuario = async (req, res, next) => {
    const { id } = req.params;
    res.status(200).json({
        success: true,
        data: `usuario ${id} eliminado`
    })
}