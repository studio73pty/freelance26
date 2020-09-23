const knex = require('knex');
const mysql = require('mysql');

const connectDB = async () => {
  const conn = await  knex({
        client: 'mysql',
        connection: {
          host : process.env.DB_HOST,
          user : process.env.DB_USER,
          password : process.env.DB_PASSWORD,
          port: 3306,
          database: process.env.DATABASE
        }
    });
    console.log(`Se ha establecido la conexion con la base de datos`.brightMagenta.underline.bold)
}

module.exports = connectDB;