const express = require('express');
const router = express.Router();

const patientController = require('../controllers/patient');

router.get('/', async (req, res) => {
    const patients = await patientController.getAllPatients();
    res.send(patients);
});

router.get('/:id', async (req, res) => {
    const patient = await patientController.getPatientById(req.params.id);
    if(patient) {
        return res.send(patient);
    }
    return res.sendStatus(404);
});

module.exports = router;