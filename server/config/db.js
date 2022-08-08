const { Sequelize } = require('sequelize');

const DATABASE = 'hospital_mng_sys';
const DB_USER = 'postgres';
const DB_PWD = 'root';
const DB_HOST = 'localhost';

const sequelize = new Sequelize(DATABASE, DB_USER, DB_PWD, {
    host: DB_HOST,
    dialect: 'postgres'
});

module.exports = sequelize;