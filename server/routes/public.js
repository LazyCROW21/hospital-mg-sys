const express = require('express');
const router = express.Router();

const departmentController = require('../controllers/department');

router.get('/department/', async (req, res) => {
    const departments = await departmentController.getAllDepartments();
    res.send(departments);
});

router.get('/department/:id', async (req, res) => {
    const department = await departmentController.getDepartmentById(req.params.id);
    if(department) {
        return res.send(department);
    }
    return res.sendStatus(404);
});

router.get('/sub-departments/:id', async (req, res) => {
    const departments = await departmentController.getDepartmentsByParentDepartmentId(req.params.id);
    res.send(departments);
});

const doctorController = require('../controllers/doctor');

router.get('/', async (req, res) => {
    const doctors = await doctorController.getAllDoctors();
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