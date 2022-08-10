const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.get('/', async (req, res) => {
    const users = await userController.getAllUsers();
    res.send(users);
});

router.post('/doctor', async (req, res) => {
    const doctor = await userController.addDoctor(req.body);
    res.send(doctor);
});

router.post('/patient', async (req, res) => {
    const doctor = await userController.addPatient(req.body);
    res.send(doctor);
});

module.exports = router;