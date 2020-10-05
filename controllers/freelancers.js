const db = require('../config/db');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


//  @Descripcion    Busca todos los usuarios registrados
//  @Ruta y Metodo  GET api/v1/usuarios
//  @Acceso         Privada
exports.buscarFreelancers = async (req, res, next) => {
    const freelancers = await db('freelancers').select()
    res.status(200).json({
        success: true,
        data: freelancers
    })
}

//  @Descripcion    Busca un solo usuario registrado
//  @Ruta y Metodo  GET api/v1/usuarios/:id
//  @Acceso         Privada
exports.buscarFreelance = async (req, res, next) => {
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
}