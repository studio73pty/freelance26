const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const cors = require('cors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
//  Cargando env vars
dotenv.config({ path: './config/config.env' });

//  Conectando a la base de datos
//connectDB();

// Llamando al rauter
const freelancers = require('./routes/freelancers');
const auth = require('./routes/auth');
const proyectos = require('./routes/proyectos');

const app = express();


app.use(express.json());
//  Cookie Parser
app.use(cookieParser());
app.use(cors({origin: '*'}));

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//  File Upload
app.use(fileupload());

//  Creando la carpeta estatica
app.use(express.static(path.join(__dirname, 'public')));

//----- Montando el router

// Auth
app.use('/api/v1/auth', auth);

// Freelancers
app.use('/api/v1/freelancers', freelancers);

//  Proyectos
app.use('/api/v1/proyectos', proyectos);


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

    