const PatientModel = require('../models/patient');
const User = require("../models/user");

PatientModel.sync();

const getAllPatients = async () => {
    return PatientModel.findAll({
        where: {
            "$user.status$": 'A'
        },
        include: {
            model: User,
            as: 'user'
        }
    });
}

// returns no of patients registered in the week
const getNewPatients = async () => {
    return PatientModel.findAndCountAll({
        where: {
            "$user.status$": 'N'
        },
        include: {
            model: User,
            as: 'user'
        }
    });
}

const getPatientById = async (id) => {
    return PatientModel.findByPk(id);
}

const addPatient = async (patientData) => {
    let patient = new PatientModel(patientData);
    await patient.save();
    return patient;
}

module.exports = {
    getAllPatients,
    getNewPatients,
    getPatientById,
    addPatient
}