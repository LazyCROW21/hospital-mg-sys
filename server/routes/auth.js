const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const authJOI = require('../helper/validation/auth');
const validation = require('../middlewares/validation');

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