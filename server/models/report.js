const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Doctor = require('./doctor');
const Patient = require('./patient');

const Report = sequelize.define('Report', {
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dateAdmitted: {
        type: DataTypes.DATE,
        allowNull: false
    },
    dateDischarged: {
        type: DataTypes.DATE,
        allowNull: false
    },
    treatmentType: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    //   detailedReportFile (to be added later)
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'planned'
    },
    patientStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'unchanged'
    }
}, {
    timestamps: true
});

Report.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
Report.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

module.exports = Report;