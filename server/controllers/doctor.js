const DoctorModel = require('../models/doctor');

DoctorModel.sync();

const getAllDoctors = async () => {
    const doctors = await DoctorModel.findAll();
    return doctors;
}

const getDoctorsByDepartmentId = async (id) => {
    const doctors = await DoctorModel.findAll({ where: { departmentId: id }})
    return doctors
}

const getDoctorById = async (id) => {
    const doctor = await DoctorModel.findByPk(id)
    return doctor
}

const addDoctor = async (doctorData) => {
    let doctor = new DoctorModel(doctorData);
    await doctor.save();
    return doctor;
}

module.exports = {
    getAllDoctors,
    getDoctorsByDepartmentId,
    getDoctorById,
    addDoctor
}