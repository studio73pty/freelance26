const db = require('../config/db');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');


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


//  @Descripcion    Subir imagen del freelancer
//  @Ruta y Metodo  PUT api/v1/freelancers/:id/imagen
//  @Acceso         Privada
exports.subirImagenPerfil = asyncHandler(async (req, res, next) => {
    let id = req.user[0].id;
    const freelancer = await db('freelancers').select().where({ id })

    //  Comprobando si el freelancer existe
    if(!freelancer){
        return next(new ErrorResponse('No se ha conseguido el freelancer', 401))
    }
    //  Comprobando si el usuario ingresado es freelancer o cliente
    if(req.user[0].rol !== 'freelancer'){
        return next(new ErrorResponse('No tiene permiso para esta ruta', 401))
    }
    //  Comprobando si el freelancer ingresado puede modificar el perfil
    if(id.toString() !== req.params.id){
        return next(new ErrorResponse(`No tiene permiso para modificar otro perfil`, 401))
    }
    //  Comprobando si se subio un archivo
    if(!req.files){
        return next(new ErrorResponse('Por favor suba un archivo', 400))
    }

    //  Colocando el objeto de archivo en una variable
    const file = req.files.file;

    //  Comprobando si el archivo subido es ina imagen, sea JPG o PNG
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse('Por favor suba un archivo tipo imagen, PNG o JPG', 400))
    }

    //  Comprobando el tamaño del archivo
    if(file.size > process.env.MAX_FILE_UPLOAD){
        return next(new ErrorResponse(`Por favor suba un archivo inferior a ${process.env.MAX_FILE_UPLOAD}`, 400))
    }

    //  Crear el nombre del archivo personalizado
    file.name = `foto_${freelancer[0].id}${path.parse(file.name).ext}`
    
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.error(err);
            return next(new ErrorResponse('Problema subiendo el archivo', 500))
        }
        //  Guardando el nombre del archivo en la base de datos
        await db('freelancers').where({id}).update({
            imagen: file.name
        })

        res.status(200).json({
            success: true,
            data: file.name
        })
    })
})