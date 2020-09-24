const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const db = require('../config/db');
const bcrypt = require('bcrypt-nodejs');

//  @Descripcion    Registro de usuarios
//  @Ruta y Metodo  POST api/v1/auth/register
//  @Acceso         Publica
exports.register = asyncHandler(async (req, res, next) => {
    const { email, nombre, password, rol } = req.body;
    const hash = bcrypt.hashSync(password);
    const fecha = new Date();
    const validateEmail = (email) =>{
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    if(validateEmail(email)){
        const user = await  db('usuarios').insert({
            email,
            nombre,
            rol,
            creado: fecha,
            password: hash
        });
        res.status(201).json({
            success: true
        })
    }else{
        res.status(400).json({ success: false,
        err: 'email invalido' })
    }
})