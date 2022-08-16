require('dotenv').config({ path: '../.env' });
const jwt = require('jsonwebtoken');
const ACCESS_SECRET = process.env.ACCESS_SECRET;

module.exports = function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return res.sendStatus(401);
    }
    let token = authHeader.split(' ')[1];
    if(!token) {
        return res.sendStatus(401);
    }
    let payload = jwt.verify(token, ACCESS_SECRET);
    if(!payload) {
        return res.sendStatus(401);
    }
    console.log(payload);
    req.user = payload.user;
    req.role = payload.role;
    next();
}