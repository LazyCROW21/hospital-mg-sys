const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const Patient = sequelize.define('Patient', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true
});

Patient.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Patient;