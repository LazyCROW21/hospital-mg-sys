const UserModel = require('../models/user');
const DoctorModel = require('../models/doctor');
const PatientModel = require('../models/patient');

UserModel.sync();

const getAllUsers = async () => {
    const users = await UserModel.findAll();
    return users;
}

const addDoctor = async (userData) => {
    let user = new UserModel(userData);
    await user.save();
    let doctor = new DoctorModel({ userId: user.id, designation: userData.designation });
    await doctor.save();
    return { user, doctor };
}

const addPatient = async (userData) => {
    let user = new UserModel(userData);
    await user.save();
    let patient = new PatientModel({ userId: user.id });
    await patient.save();
    return { user, patient };
}

module.exports = {
    getAllUsers,
    addDoctor,
    addPatient
}