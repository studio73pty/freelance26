const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const db = require('../config/db');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { get } = require('http');


//  @Descripcion    Registro de usuarios
//  @Ruta y Metodo  POST api/v1/auth/registro
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
            password: hash,
            creado: fecha
        });
        sendTokenResponse(user, 200, res)
        /*
        const token = getSignedJwtToken(user);
       const userToken = await db('usuarios').where({ id: user }).update({     
            token
         })
        res.status(201).json({
            success: true,
            token
        })*/
    }else{
        return next(new ErrorResponse('Por favor ingresa un email valido', 400))
    }
})


//  @Descripcion    Inicio de sesion
//  @Ruta y Metodo  POST api/v1/auth/login
//  @Acceso         Publica
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;


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

    sendTokenResponse(user, 200, res)

})

//  @Descripcion    Obtener el usuario ingresado
//  @Ruta y Metodo  POST api/v1/auth/me
//  @Acceso         Privada
exports.getMe = asyncHandler(async (req, res, next) => {
    const id = req.user[0].id;
    const usuario = await db('usuarios').select().where({ id });


    res.status(200).json({
        success: true,
        data: usuario
    })
})


//  @Descripcion    Contraseña olvidada
//  @Ruta y Metodo  POST api/v1/auth/forgotpassword
//  @Acceso         Publica
exports.forgotPassword = asyncHandler(async (req, res, next) => {
//const id = req.user[0].id;
    let usuario = await db('usuarios').select().where({ email: req.body.email });

    if(usuario.length == 0){
        return next(new ErrorResponse('No hay usuario con el correo ingresado', 404))
    }

    //  Generar y hash el token de password
  const getResetPasswordToken = async (user) => {
        // Generar el token
        const resetToken = crypto.randomBytes(20).toString("hex");

        // Hash el token y guardarlo en el campo de resetPasswordTojen
        let hash = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

         // Generar la expiracion y hacer cambios a la bd
         const date = Date.now() + 10 * 60 * 1000;
         const date2 = new Date(date)
            
        await  db('usuarios').where({ id: user[0].id }).update({     
         resetPasswordToken: hash,
         resetPasswordExpire: date2
    
             })
         return resetToken;
    }

    const resetToken = await getResetPasswordToken(usuario);

    // Creando el URL de reset
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `Ha recibido este correo porque tu (o alguien mas) ha solicitado
    un reset de contraseña. Por favor realiza una solicitud PUT a: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: usuario[0].email,
            subject: 'Nueva contraseña',
            message
        })
        res.status(200).json({ success: true, data: 'Correo Enviado' })
    } catch (err) {
        console.log(err)
       await db('usuarios').where({ id: usuario[0].id }).update({     
            resetPasswordToken: null,
            resetPasswordExpire: null
        })
        return next(new ErrorResponse('El correo no se pudo enviar', 500))
    }


    usuario = await db('usuarios').select().where({ email: req.body.email });
    res.status(200).json({
        success: true,
        data: usuario
    })
})

//  @Descripcion    Reset de contraseña
//  @Ruta y Metodo  PUT api/v1/auth/resetpassword/:resettoken
//  @Acceso         Privada
exports.resetPassword = asyncHandler(async (req, res, next) => {
    //  Obtener el token hashed
    const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');




    const usuario = await db('usuarios')
        .select().where({ 
        resetPasswordToken
         });

    if(!usuario[0]){
        return next(new ErrorResponse('Token invalida', 400))
    }
    if(usuario[0].resetPasswordExpire < Date.now()){
        return next (new ErrorResponse('Fallo con la fecha de exp', 404))
    }

    //  Reemplazar la contraseña
        const hash = bcrypt.hashSync(req.body.password);
        await db('usuarios').where({ id: usuario[0].id }).update({  
        password: hash,   
        resetPasswordToken: null,
        resetPasswordExpire: null
    })

    sendTokenResponse(usuario, 200, res)
})



//  Funcion de generacion de token
const getSignedJwtToken = (user) => {
    return jwt.sign({id: user},
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    )
}
//  Recibiendo el token de la BD, creando una cookie y enviando respuesta
const sendTokenResponse = (user, statusCode, res) => {
    //  Creando el token
    const token = getSignedJwtToken(user);

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
        success: true,
        token
    })

}
