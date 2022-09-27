const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '../.env' });
const DATABASE = process.env.DATABASE;
const DB_USER = process.env.DB_USER;
const DB_PWD = process.env.DB_PWD;
const DB_HOST = process.env.DB_HOST;

const sequelize = new Sequelize(DATABASE, DB_USER, DB_PWD, {
    host: DB_HOST,
    dialect: 'postgres'
});

module.exports = sequelize;