const db = require('../config/db');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


//  @Descripcion    Mostrar todos los proyectos de un freelancer
//  @Ruta y Metodo  PUT api/v1/proyectos/:id        este id es del freelancer
//  @Acceso         Publica
exports.buscarProyectos = asyncHandler(async (req, res, next) => {
    const proyectos = await db('proyectos').select();
    res.status(200).json({
        "success": true,
        data: proyectos
    })
})

//  @Descripcion    Agregar un proyecto para el freelancer que haya iniciado sesion
//  @Ruta y Metodo  POST api/v1/freelancers/proyectos
//  @Acceso         Privada
exports.agregarProyecto = asyncHandler (async (req, res, next) => {
    const id = req.user[0].id;

    if(req.user[0].rol !== 'freelancer'){
        return next(new ErrorResponse('No tiene permiso para agregar un proyecto', 401))
    }

    const { nombre, proyecto, descripcion } = req.body;
        await db('proyectos').insert({
        id,
        nombre,
        proyecto,
        descripcion
    })
    
    const proyectos = await db('proyectos').select().where({ id });

    res.status(200).json({
        success: true,
        data: proyectos
    })
})