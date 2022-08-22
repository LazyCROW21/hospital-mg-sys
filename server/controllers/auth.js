require('dotenv').config({ path: '../.env' });
const jwt = require('jsonwebtoken');
const client = require('../config/redis');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const UserModel = require('../models/user');

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

const _signAccessToken = (user, role) => {
    const payload = { user: user.id, email: user.email, role: user.role, roleId: role.id };
    return jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: '10s'
    });
}

const _signRefreshToken = (user, role) => {
    const payload = { user: user.id, email: user.email, role: user.role, roleId: role.id };
    return jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: '1y'
    });
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
        const refreshToken = _signRefreshToken(user, role);
        await client.set(`${user.id}`, refreshToken, {
            'EX': 3600
        });
        return { 
            accessToken: _signAccessToken(user, role), 
            refreshToken,
            user, 
            role 
        };
    }
    return null;
}

const generateAccessToken = async (refreshToken) => {
    let payload = jwt.verify(refreshToken, REFRESH_SECRET);
    if(!payload) {
        return null;
    }
    const rfT = await client.get(`${payload.user}`);
    // console.log(payload);
    // console.log(rfT);
    if(rfT !== refreshToken) {
        return null;
    }
    return _signAccessToken(payload.user, payload.role);
}

const logoutUser = async () => {

}

module.exports = {
    loginUser,
    logoutUser,
    generateAccessToken
}