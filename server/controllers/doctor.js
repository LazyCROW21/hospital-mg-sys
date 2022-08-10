const DoctorModel = require('../models/doctor');

DoctorModel.sync();

const getAllDoctors = async () => {
    const doctors = await DoctorModel.findAll();
    return doctors;
}

const getDoctorById = async (id) => {
    const doctor = await DoctorModel.findByPk(id)
    return doctor
}

module.exports = {
    getAllDoctors,
    getDoctorById
}