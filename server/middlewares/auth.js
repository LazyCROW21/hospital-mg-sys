require('dotenv').config({ path: '../.env' });
const jwt = require('jsonwebtoken');
const ACCESS_SECRET = process.env.ACCESS_SECRET;

module.exports = function verifyToken(req, res, next) {
    console.log('----------------------------------------------------');
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        console.log('No Auth Header');
        return res.sendStatus(401);
    }
    let token = authHeader.split(' ')[1];
    if(!token) {
        console.log('No Auth Token');
        return res.sendStatus(401);
    }
    try {
        let payload = jwt.verify(token, ACCESS_SECRET);
        if(!payload) {
        console.log('No Token Payload');
            return res.sendStatus(401);
        }
        console.log(payload);
        req.user = payload.user;
        req.role = payload.role;
        next();
    } catch (err) {
        console.log(err);
        return res.sendStatus(401);
    }
    console.log('----------------------------------------------------');
}