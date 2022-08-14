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
  phone: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  emergencyPhone: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING(1),
    allowNull: false
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  line1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  line2: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pincode: {
    type: DataTypes.STRING(6),
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // country: {
  //   type: DataTypes.STRING,
  //   allowNull: false
  // },
  email: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  pwd: {
    type: DataTypes.STRING(32),
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