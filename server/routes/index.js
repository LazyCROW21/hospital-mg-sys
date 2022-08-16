const express = require('express');
const router = express.Router();
const authRouter = require('./auth');
const userRouter = require('./user');
const patientRouter = require('./patient');
const doctorRouter = require('./doctor');
const appointmentRouter = require('./appointment');
const departmentRouter = require('./department');
const reportRouter = require('./report');

const authMiddleware = require('../middlewares/auth');

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/patient', patientRouter);
router.use('/doctor', doctorRouter);
router.use('/appointment', appointmentRouter);
router.use('/department', departmentRouter);
router.use('/report', authMiddleware, reportRouter);

module.exports = router;