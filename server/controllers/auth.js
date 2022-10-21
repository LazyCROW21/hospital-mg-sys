require('dotenv').config({ path: '../.env' });
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const client = require('../config/redis');
const Admin = require('../models/admin');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const UserModel = require('../models/user');

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

const _signAccessToken = (
        user, email, role, roleDetails
    ) => {
    const payload = { user, email, role, roleDetails };
    return jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: '10m'
    });
}

const _signRefreshToken = (user, email, role, roleDetails) => {
    const payload = { user, email, role, roleDetails };
    return jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: '120m'
    });
}

const loginUser = async (email, pwd) => {
    const user = await UserModel.findOne({
        where: { email, status: { [Op.notIn]: ['X', 'N'] } },
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
            case 'A':
                role = await Admin.findOne(queryOption)
                break;
            default:
                role = null;
        }
        const refreshToken = _signRefreshToken(user.id, user.email, user.role, role);
        const accessToken = _signAccessToken(user.id, user.email, user.role, role);
        await client.set(`${user.id}`, refreshToken, {
            'EX': 36000
        });
        return { accessToken, refreshToken, user, role };
    }
    return null;
}

const generateAccessToken = async (refreshToken) => {
    let payload = jwt.verify(refreshToken, REFRESH_SECRET);
    if(!payload) {
        return null;
    }
    const rfT = await client.get(`${payload.user}`);
    if(rfT !== refreshToken) {
        return null;
    }
    console.log(payload);
    return _signAccessToken(payload.user, payload.email, payload.role, payload.roleDetails);
}

const logoutUser = async (refreshToken) => {
    let payload = jwt.verify(refreshToken, REFRESH_SECRET);
    if(!payload) {
        return null;
    }
    const rfT = await client.get(`${payload.user}`);
    if(rfT !== refreshToken) {
        return null;
    }
    return client.del(`${payload.user}`);
}

module.exports = {
    loginUser,
    logoutUser,
    generateAccessToken
}