const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  pwd: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  role: {
    type: DataTypes.STRING(1),
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = User;