const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

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

module.exports = Doctor;