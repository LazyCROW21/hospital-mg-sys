const UserModel = require('../models/user');
const PatientModel = require('../models/patient');
const DoctorModel = require('../models/doctor');

UserModel.sync();

const getAllUsers = async () => {
    const users = await UserModel.findAll();
    return users;
}

const addPatient = async (userData) => {
    let newUser = new UserModel(userData);
    await newUser.save();
    let newPatient = new PatientModel({ userId: newUser.id, ...userData });
    await newPatient.save();
    return { user: newUser, patient: newPatient };
}

const addDoctor = async (userData) => {
    let newUser = new UserModel(userData);
    await newUser.save();
    let newDoctor = new DoctorModel({ userId: newUser.id, ...userData });
    await newDoctor.save();
    return { user: newUser, doctor: newDoctor };
}

module.exports = {
    getAllUsers,
    addPatient,
    addDoctor
}