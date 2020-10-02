const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const cors = require('cors');
const cookieParser = require('cookie-parser');
//  Cargando env vars
dotenv.config({ path: './config/config.env' });

//  Conectando a la base de datos
//connectDB();

// Llamando al rauter
const usuarios = require('./routes/usuarios');
const auth = require('./routes/auth');

const app = express();


app.use(express.json());
//  Cookie Parser
app.use(cookieParser());
app.use(cors({origin: '*'}));

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//----- Montando el router

// Auth
app.use('/api/v1/auth', auth);


app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(
    PORT,
    console.log(`Servidor corriendo en modo ${process.env.NODE_ENV} en el puerto ${process.env.PORT}`.cyan.bold)
);

// Gestionando unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`ERROR con BD: ${err.message}`.red.bgWhite)
    // Cerrar el servidor y salir del proceso (que la app no corra)
    server.close(() => {
        process.exit(1)
    })
})

    