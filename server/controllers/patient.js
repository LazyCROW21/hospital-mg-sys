const PatientModel = require('../models/patient');

PatientModel.sync();

const getAllPatients = async () => {
    const patients = await PatientModel.findAll();
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
    getPatientById,
    addPatient
}