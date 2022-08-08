const { DataTypes } = require('sequelize');
const sequelize = require('./config/db');

const Patient = sequelize.define('Patient', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = Patient;