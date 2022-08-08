const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  pwd: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  role: {
    type: DataTypes.STRING(1),
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING(1),
    allowNull: false
  }
}, {
    timestamps: true
});

module.exports = User;