const db = require('../config/db');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


//  @Descripcion    Mostrar todos los proyectos de un freelancer
//  @Ruta y Metodo  PUT api/v1/proyectos/:id        este id es del freelancer
//  @Acceso         Publica
exports.buscarProyectos = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const proyectos = await db('proyectos').select().where({ freelancer: id });

    if(proyectos.length <= 0){
        return next(new ErrorResponse(`No hay proyectos para el freelancer: ${id}`, 404))
    }

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
    const { nombre, proyecto, descripcion } = req.body;

    if(req.user[0].rol !== 'freelancer'){
        return next(new ErrorResponse('No tiene permiso para agregar un proyecto', 401))
    }


        await db('proyectos').insert({
        freelancer: id,
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

//  @Descripcion    Modificar proyecto para el freelancer que haya iniciado sesion
//  @Ruta y Metodo  PUT api/v1/freelancers/proyectos/:id
//  @Acceso         Privada
exports.modificarProyecto = asyncHandler (async (req, res, next) => {
    let id = req.user[0].id;
    const proyectoId = req.params.id;
    const { nombre, proyecto, descripcion } = req.body;

    if(req.user[0].rol !== 'freelancer'){
        return next(new ErrorResponse('No tiene permiso para modificar un proyecto', 401))
    }

    //  Comprobando si el usuario ingresado es el dueño del proyecto a modificar
    const user = await db('proyectos').select().where({ id: proyectoId })

    if(id.toString() !== user[0].freelancer){
        return next(new ErrorResponse(`No tiene permiso para modificar el proyecto de otro freelancer`, 401))
    }

        await db('proyectos').where({id: proyectoId}).update({
        nombre,
        proyecto,
        descripcion
    })
    
    const proyectos = await db('proyectos').select().where({ id: proyectoId });

    res.status(200).json({
        success: true,
        data: proyectos
    })
})

//  @Descripcion    Eliminar un proyecto
//  @Ruta y Metodo  DELETE api/v1/freelancers/proyectos/:id
//  @Acceso         Privada
exports.eliminarProyecto = asyncHandler(async (req, res, next) => {
    let id = req.user[0].id;
    const proyectoId = req.params.id;

    if(req.user[0].rol !== 'freelancer'){
        return next(new ErrorResponse('No tiene permiso para modificar un proyecto', 401))
    }

        //  Comprobando si el usuario ingresado es el dueño del proyecto a modificar
        const user = await db('proyectos').select().where({ id: proyectoId })

        if(id.toString() !== user[0].freelancer){
            return next(new ErrorResponse(`No tiene permiso para eliminar el proyecto de otro freelancer`, 401))
        }

    await db('proyectos').where({ id: proyectoId }).del();

    res.status(200).json({
        success: true
    })
})