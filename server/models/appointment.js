const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Appointment = sequelize.define('Appointment', {
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  preferredDateTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'applied'
  }
}, {
    timestamps: true
});

module.exports = Appointment;