const AdminModel = require('../models/admin');
const User = require('../models/user');

AdminModel.sync();

const getAllAdmins = async () => {
    return AdminModel.findAll({
        where: {
            "$user.status$": 'A'
        },
        include: {
            model: User,
            as: 'user'
        }
    });
}

const getAdminById = async (id) => {
    return AdminModel.findByPk(id, {
        include: {
            model: User,
            as: 'user'
        }
    });
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