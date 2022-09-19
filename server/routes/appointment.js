const express = require('express');
const router = express.Router();

const appointmentJOI = require('../helper/validation/appointment');
const appointmentController = require('../controllers/appointment');
const reportController = require('../controllers/report');
const validation = require('../middlewares/validation');
const access = require('../middlewares/access');

router.get('/', access(['A']), async (req, res) => {
    const appointments = await appointmentController.getAllAppointments();
    res.send(appointments);
});

router.get('/next', access(['A']), async (req, res) => {
    const appointments = await appointmentController.getAllNextAppointments();
    res.send(appointments);
});

router.get('/:id', async (req, res) => {
    const appointment = await appointmentController.getAppointmentById(req.params.id);
    if(appointment) {
        return res.send(appointment);
    }
    return res.sendStatus(404);
});

router.get(
    '/patient/:id', 
    access(['A', 'P'], 'params', 'id', 'roleId', ['SA', 'MNG_H']),
    async (req, res) => {
    const appointments = await appointmentController.getAppointmentsByPatientId(req.params.id);
    res.send(appointments);
});

router.get(
    '/patient/next/:id', 
    access(['A', 'P'], 'params', 'id', 'roleId', ['SA', 'MNG_H']),
    async (req, res) => {
    const appointments = await appointmentController.getNextAppointmentsByPatientId(req.params.id);
    res.send(appointments);
});

router.get(
    '/doctor/:id', 
    access(['A', 'D'], 'params', 'id', 'roleId', ['SA', 'MNG_H']),
    async (req, res) => {
    const appointments = await appointmentController.getAppointmentsByDoctorId(req.params.id);
    res.send(appointments);
});

router.get(
    '/doctor/next/:id', 
    access(['A', 'D'], 'params', 'id', 'roleId', ['SA', 'MNG_H']),
    async (req, res) => {
    const appointments = await appointmentController.getNextAppointmentsByDoctorId(req.params.id);
    res.send(appointments);
});

router.post(
    '/', 
    validation(appointmentJOI.creationSchema), 
    async (req, res) => {
    switch(req.role) {
        case 'P':
            if(req.body.patientId != req.roleId) {
                return res.sendStatus(401);
            }
            break;
        default:
            return res.sendStatus(403);
    }
    req.body.rejectMessage = null;
    req.body.concludedByPatient = false;
    req.body.concludedByDoctor = false;
    try {
        const appointment = await appointmentController.addAppointment(req.body);
        res.send(appointment);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
});

router.patch('/status/:id', validation(appointmentJOI.changeStatusSchema), async (req, res) => {
    const appointment = await appointmentController.getAppointmentById(req.params.id);
    if(!appointment) {
        return res.sendStatus(404);
    }
    // check Access later
    if(appointment.status === 'fixed' && !['concluded', 'cancelled', 'rejected'].includes(req.body.status)) {
        console.log(appointment.status, req.body.status);
        return res.sendStatus(400);
    } else if(appointment.status === 'applied' && req.body.status === 'concluded') {
        return res.sendStatus(400);
    } else if(['cancelled', 'rejected'].includes(appointment.status)) {
        return res.sendStatus(400);
    }
    appointment.status = req.body.status;
    if(req.body.status === 'rejected') {
        appointment.rejectMessage = req.body.rejectMessage;
    }
    await appointment.save();
    res.send(appointment);
});

router.patch('/conclude/:role(patient|doctor)/:id(\\d+)', async (req, res) => {
    const appointment = await appointmentController.getAppointmentById(req.params.id);
    if(!appointment) {
        return res.sendStatus(404);
    }
    const cond1 = Object.keys(req.body).length !== 1;
    const cond2 = req.params.role === 'patient' && typeof req.body.concludedByPatient !== 'boolean';
    const cond3 = req.params.role === 'doctor' && typeof req.body.concludedByDoctor !== 'boolean';
    const cond4 = appointment.status !== 'fixed';
    if(cond1 && (cond2 || cond3) && cond4) {
        return res.sendStatus(400);
    }

    if(req.params.role === 'patient') {
        appointment.concludedByPatient = req.body.concludedByPatient;
    } else {
        appointment.concludedByDoctor = req.body.concludedByDoctor;
    }
    await appointment.save();
    res.send(appointment);
    if(appointment.concludedByPatient && appointment.concludedByDoctor) {
        reportController.addReport(appointment);
    }
});

router.patch('/:id', validation(appointmentJOI.updationSchema), async (req, res) => {
    const appointment = await appointmentController.updateAppointment(req.params.id, req.body);
    if(!appointment[0]) {
        return res.sendStatus(400);
    }
    res.send(appointment);
});

module.exports = router;