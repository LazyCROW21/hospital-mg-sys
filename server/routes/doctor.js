const express = require('express');
const router = express.Router();

const doctorController = require('../controllers/doctor');
const validation = require('../middlewares/validation');
const doctorJOI = require('../helper/validation/doctor');

router.get('/', async (req, res) => {
    const doctors = await doctorController.getAllDoctors();
    res.send(doctors);
});

router.get('/new', async (req, res) => {
    const doctors = await doctorController.getNewDoctors();
    res.send(doctors);
});

router.get('/:id(\\d+)', async (req, res) => {
    const doctor = await doctorController.getDoctorById(req.params.id);
    if(doctor) {
        return res.send(doctor);
    }
    return res.sendStatus(404);
});

router.get('/department/:id(\\d+)', async (req, res) => {
    const doctors = await doctorController.getDoctorsByDepartmentId(req.params.id);
    return res.send(doctors);
});

router.get('/user/:id(\\d+)', async (req, res) => {
    const doctors = await doctorController.getDoctorByUserId(req.params.id);
    return res.send(doctors);
});

router.patch('/user/:id(\\d+)/move', validation(doctorJOI.updateSchema), async (req, res) => {
    const result = await doctorController.updateDoctorByUserId(req.params.id, req.body);
    return res.send(result);
});

router.patch('/user/:id(\\d+)', validation(doctorJOI.updateSchema), async (req, res) => {
    const result = await doctorController.updateDoctorById(req.params.id, req.body);
    return res.send(result);
});

module.exports = router;