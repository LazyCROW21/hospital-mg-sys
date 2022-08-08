const { DataTypes } = require('sequelize');
const sequelize = require('./config/db'); 

const Doctor = sequelize.define('Doctor', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  designation: {
    type: DataTypes.STRING(40),
    allowNull: false
  }
}, {
    timestamps: true
});

module.exports = Doctor;