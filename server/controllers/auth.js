require('dotenv').config({ path: '../.env' });
const jwt = require('jsonwebtoken');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const UserModel = require('../models/user');

const ACCESS_SECRET = process.env.ACCESS_SECRET;

const _signAccessToken = (user, role) => {
    const payload = { user: user.id, email: user.email, role: user.role, roleId: role.id };
    console.log(ACCESS_SECRET);
    return jwt.sign(payload, ACCESS_SECRET);
}

const loginUser = async (email, pwd) => {

    const user = await UserModel.findOne({
        where: { email },
    });
    if (!user) {
        return null;
    }
    if (user.pwd === pwd) {
        let role;
        const queryOption = { where: { userId: user.id } };
        switch (user.role) {
            case 'P':
                role = await Patient.findOne(queryOption);
                break;
            case 'D':
                role = await Doctor.findOne(queryOption)
                break;
            default:
                role = null;
        }
        return { token: _signAccessToken(user, role), user, role };
    }
    return null;
}

const logoutUser = async () => {

}

module.exports = {
    loginUser,
    logoutUser
}