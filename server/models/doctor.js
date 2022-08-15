const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Department = require('./department');
const User = require('./user');

const Doctor = sequelize.define('Doctor', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  designation: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  specialization: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  experience: {
    type: DataTypes.INTEGER,
  }
}, {
  timestamps: true
});

Doctor.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Doctor.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

module.exports = Doctor;