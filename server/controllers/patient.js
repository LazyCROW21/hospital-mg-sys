const { Op } = require("sequelize");
const PatientModel = require('../models/patient');

PatientModel.sync();

const getAllPatients = async () => {
    const patients = await PatientModel.findAll();
    return patients;
}

// returns no of patients registered in the week
const getNewPatientsCount = async () => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    const patients = await PatientModel.findAndCountAll({
        where: {
            createdAt: {
                [Op.gt]: d
            }
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
    getNewPatientsCount,
    getPatientById,
    addPatient
}