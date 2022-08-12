const UserModel = require('../models/user');

UserModel.sync();

const getAllUsers = async () => {
    const users = await UserModel.findAll();
    return users;
}

module.exports = {
    getAllUsers
}