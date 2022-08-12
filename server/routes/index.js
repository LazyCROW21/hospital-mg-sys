const express = require('express');
const router = express.Router();
const userRouter = require('./user');
const patientRouter = require('./patient');
const doctorRouter = require('./doctor');
const appointmentRouter = require('./appointment');

router.use('/user', userRouter);
router.use('/patient', patientRouter);
router.use('/doctor', doctorRouter);
router.use('/appointment', appointmentRouter);

module.exports = router;