// const { Op } = require("sequelize");
const AdminModel = require('../models/admin');
const User = require('../models/user');
const { use } = require('../routes/user');

AdminModel.sync();

const getAllAdmins = async () => {
    const admins = await AdminModel.findAll({
        include: {
            model: User,
            as: 'user'
        }
    });
    return admins;
}

const getAdminById = async (id) => {
    const admin = await AdminModel.findByPk(id, {
        include: {
            model: User,
            as: 'user'
        }
    });
    return admin;
}

const addAdmin = async (adminData) => {
    let admin = new AdminModel(adminData);
    await admin.save();
    return admin;
}

module.exports = {
    getAllAdmins,
    getAdminById,
    addAdmin
}