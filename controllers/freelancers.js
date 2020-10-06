const db = require('../config/db');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


//  @Descripcion    Busca todos los freelancers registrados
//  @Ruta y Metodo  GET api/v1/freelancers
//  @Acceso         Privada
exports.buscarFreelancers = asyncHandler( async (req, res, next) => {
    const freelancers = await db('freelancers').select()
    res.status(200).json({
        success: true,
        data: freelancers
    })
})

//  @Descripcion    Busca un solo freelancers registrado
//  @Ruta y Metodo  GET api/v1/freelancers/:id
//  @Acceso         Privada
exports.buscarFreelance = asyncHandler( async (req, res, next) => {
    const { id } = req.params;
    const freelancer = await db('freelancers').select().where({ id });

    if(freelancer.length > 0 ){
        res.status(200).json({
            success: true,
            data: freelancer
        })
    } else {
        return next(new ErrorResponse(`El usuario con el id ingresado no existe`, 404))
    }
})

//  @Descripcion    Crear el perfil del freelancer
//  @Ruta y Metodo  PUT api/v1/freelancers/actualizarperfil
//  @Acceso         Privada
exports.modificarPerfil = asyncHandler (async (req, res, next) => {
    const id = req.user[0].id;
    const { categoria, descripcion, telefono, pais, habilidades } = req.body;

        await db('freelancers').where({ id }).update({
        categoria,
        descripcion,
        habilidades,
        telefono,
        pais
    })
    
    const usuario = await db('freelancers').select().where({ id });

    res.status(200).json({
        success: true,
        data: usuario
    })
})