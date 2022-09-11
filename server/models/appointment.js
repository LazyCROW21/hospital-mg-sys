const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const Doctor = require('./doctor');
const Patient = require('./patient');

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
  },
  rejectMessage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  concludedByPatient: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  concludedByDoctor: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
    timestamps: true
});

Appointment.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

module.exports = Appointment;