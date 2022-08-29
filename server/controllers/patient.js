// const { Op } = require("sequelize");
const PatientModel = require('../models/patient');
const User = require("../models/user");

PatientModel.sync();

const getAllPatients = async () => {
    const patients = await PatientModel.findAll({
        where: {
            "$user.status$": 'A'
        },
        include: {
            model: User,
            as: 'user'
        }
    });
    return patients;
}

// returns no of patients registered in the week
const getNewPatients = async () => {
    // const d = new Date();
    // d.setDate(d.getDate() - 7);
    const patients = await PatientModel.findAndCountAll({
        where: {
            "$user.status$": 'N'
        },
        include: {
            model: User,
            as: 'user'
        }
    });
    return patients;
}

const getPatientById = async (id) => {
    const patient = await PatientModel.findByPk(id);
    return patient;
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