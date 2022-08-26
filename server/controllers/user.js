const UserModel = require('../models/user');
const PatientModel = require('../models/patient');
const DoctorModel = require('../models/doctor');
const AdminModel = require('../models/admin');

UserModel.sync();

const getAllUsers = async () => {
    const users = await UserModel.findAll();
    return users;
}

const getAllNewUsers = async () => {
    const users = await UserModel.findAll({
        where: {
            status: 'N'
        }
    });
    return users;
}

const addPatient = async (userData) => {
    userData.status = 'N';
    let newUser = new UserModel(userData);
    await newUser.save();
    let newPatient = new PatientModel({ userId: newUser.id, ...userData });
    await newPatient.save();
    return { user: newUser, patient: newPatient };
}

const addDoctor = async (userData) => {
    userData.status = 'N';
    let newUser = new UserModel(userData);
    await newUser.save();
    let newDoctor = new DoctorModel({ userId: newUser.id, ...userData });
    await newDoctor.save();
    return { user: newUser, doctor: newDoctor };
}

const addAdmin = async (userData) => {
    userData.status = 'A';
    userData.pwd = 'asdf1234';
    userData.access = JSON.stringify(userData.access);
    let newUser = new UserModel(userData);
    await newUser.save();
    let newAdmin = new AdminModel({ userId: newUser.id, ...userData });
    await newAdmin.save();
    return { user: newUser, admin: newAdmin };
}

const commitUser = async (id, commit) => {
    let user = await UserModel.findByPk(id);
    if(!user) {
        return null;
    }
    user.status = commit;
    return await user.save();
}

const deleteUser = async (id) => {
    return await UserModel.update({ status: 'X' }, { where: { id }});
}

module.exports = {
    getAllUsers,
    addPatient,
    addDoctor,
    addAdmin,
    getAllNewUsers,
    deleteUser,
    commitUser
}