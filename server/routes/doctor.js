const express = require('express');
const router = express.Router();

const doctorController = require('../controllers/doctor');

router.get('/', async (req, res) => {
    const doctors = await doctorController.getAllDoctors();
    res.send(doctors);
});

router.get('/new', async (req, res) => {
    const doctors = await doctorController.getNewDoctorsCount();
    res.send(doctors);
});

router.get('/:id', async (req, res) => {
    const doctor = await doctorController.getDoctorById(req.params.id);
    if(doctor) {
        return res.send(doctor);
    }
    return res.sendStatus(404);
});

router.get('/department/:id', async (req, res) => {
    const doctors = await doctorController.getDoctorsByDepartmentId(req.params.id);
    return res.send(doctors);
});

module.exports = router;