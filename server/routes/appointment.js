const express = require('express');
const router = express.Router();

const appointmentController = require('../controllers/appointment');

router.get('/', async (req, res) => {
    const appointments = await appointmentController.getAllAppointments();
    res.send(appointments);
});

router.get('/:id', async (req, res) => {
    const appointment = await appointmentController.getAppointmentById(req.params.id);
    if(appointment) {
        return res.send(appointment);
    }
    return res.sendStatus(404);
});

router.get('/patient/:id', async (req, res) => {
    const appointments = await appointmentController.getAppointmentsByPatientId(req.params.id);
    res.send(appointments);
});

router.get('/doctor/:id', async (req, res) => {
    const appointments = await appointmentController.getAppointmentsByDoctorId(req.params.id);
    res.send(appointments);
});

router.post('/', async (req, res) => {
    const appointment = await appointmentController.addAppointment(req.body);
    res.send(appointment);
});

router.patch('/:id', async (req, res) => {
    const appointment = await appointmentController.changeAppointmentStatus(req.params.id, req.body.status);
    res.send(appointment);
});

module.exports = router;