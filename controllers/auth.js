const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const db = require('../config/db');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

//  @Descripcion    Registro de usuarios
//  @Ruta y Metodo  POST api/v1/auth/registro
//  @Acceso         Publica
exports.register = asyncHandler(async (req, res, next) => {

    const { email, nombre, password, rol } = req.body;
    const hash = bcrypt.hashSync(password);
    const fecha = new Date();
    const getSignedJwtToken = (user) => {
        return jwt.sign({id: user},
            process.env.JWT_SECRET
        )
    }
    const validateEmail = (email) =>{
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    if(validateEmail(email)){
        const user = await  db('usuarios').insert({
            email,
            nombre,
            rol,
            password: hash,
            creado: fecha
        });
        const token = getSignedJwtToken(user);
       const userToken = await db('usuarios').where({ id: user }).update({     
            token
         })
        res.status(201).json({
            success: true,
            token
        })
    }else{
        return next(new ErrorResponse('Por favor ingresa un email valido', 400))
    }
})


//  @Descripcion    Inicio de sesion
//  @Ruta y Metodo  POST api/v1/auth/login
//  @Acceso         Publica
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const getSignedJwtToken = (user) => {
        return jwt.sign({id: user},
            process.env.JWT_SECRET
        )
    }

    // Validando email y password
    if(!email || !password){
        return next(new ErrorResponse('Por favor ingresa un correo y contraseña', 400))
    }

    // Verificando si el usuario existe
    const user = await db.select().from('usuarios').where({ email })

    if(!user){
        return next(new ErrorResponse('Credenciales invalidas', 401))
    }

    // Comparando las contraseñas
    const isValid = bcrypt.compareSync(password, user[0].password);

    if(!isValid){
        return next(new ErrorResponse('Credenciales invalidas', 401))
    }
        const token = getSignedJwtToken(user);

        res.status(201).json({
            success: true,
            user: user,
            token
        })

})
