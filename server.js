const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');

//  Cargando env vars
dotenv.config({ path: './config/config.env' });

// Llamando al rauter
const usuarios = require('./routes/usuarios')

const app = express();



app.use(express.json());

//----- Montando el router

// Bootcamps
app.use('/api/v1/usuarios', usuarios);

const PORT = process.env.PORT || 3000;

app.listen(    PORT,
    console.log(`Servidor corriendo en modo ${process.env.NODE_ENV} en el puerto ${process.env.PORT}`.cyan.bold)
    );

// Gestionando unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`ERROR: ${err.message}`.red.bgWhite)
    // Cerrar el servidor y salir del proceso (que la app no corra)
    server.close(() => {
        process.exit(1)
    })
})

    