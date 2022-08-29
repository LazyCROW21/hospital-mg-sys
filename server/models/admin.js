const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const Admin = sequelize.define('Admin', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  access: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true
});

Admin.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Admin;