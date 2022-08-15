const express = require('express');
const router = express.Router();
const userRouter = require('./user');
const patientRouter = require('./patient');
const doctorRouter = require('./doctor');
const appointmentRouter = require('./appointment');
const departmentRouter = require('./department');
const recordRouter = require('./record');

router.use('/user', userRouter);
router.use('/patient', patientRouter);
router.use('/doctor', doctorRouter);
router.use('/appointment', appointmentRouter);
router.use('/department', departmentRouter);
router.use('/record', recordRouter);

module.exports = router;