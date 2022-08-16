const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

router.post('/login', async (req, res) => {
    const result = await authController.loginUser(req.body.email, req.body.pwd);
    if(!result) {
        return res.sendStatus(401);
    }
    return res.send(result);
});

router.post('/logout', async (req, res) => {

});

module.exports = router;