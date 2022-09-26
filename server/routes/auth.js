const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const authJOI = require('../helper/validation/auth');
const validation = require('../middlewares/validation');
const userValidationSchema = require('../helper/validation/user');
const mailer = require('../helper/mailer');

router.post('/create', validation(userValidationSchema), async (req, res) => {
    let user;
    if (req.body.role === 'P') {
        user = await userController.addPatient(req.body);
    } else if (req.body.role === 'D') {
        user = await userController.addDoctor(req.body);
    } else if (req.body.role === 'A') {
        user = await userController.addAdmin(req.body);
    }
    mailer.accountReqGreeting(req.body.email);
    res.send(user);
});

router.post('/login', validation(authJOI.loginSchema), async (req, res) => {
    const result = await authController.loginUser(req.body.email, req.body.pwd);
    if(!result) {
        return res.sendStatus(401);
    }
    return res.send(result);
});

router.post('/refresh', validation(authJOI.refreshSchema), async (req, res) => {
    const accessToken = await authController.generateAccessToken(req.body.refreshToken);
    if(!accessToken) {
        return res.sendStatus(401);
    }
    res.send({ accessToken });
});

router.post('/logout', validation(authJOI.refreshSchema), async (req, res) => {
    const result = await authController.logoutUser(req.body.refreshToken);
    if(!result) {
        return res.sendStatus(401);
    }
    res.send({ message: 'logout success' });
});

module.exports = router;