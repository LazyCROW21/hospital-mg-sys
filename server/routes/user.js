const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.get('/', async (req, res) => {
    const users = await userController.getAllUsers();
    res.send(users);
});

router.post('/', async (req, res) => {
    let user;
    if(req.body.role === 'P') {
        user = await userController.addPatient(req.body);
    } else if(req.body.role === 'D') {
        user = await userController.addDoctor(req.body);
    }
    res.send(user);
});

router.post('/login', async (req, res) => {
    
});

router.post('/logout', async (req, res) => {

});

module.exports = router;