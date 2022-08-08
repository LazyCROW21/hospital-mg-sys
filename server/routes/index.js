const express = require('express');
const router = express.Router();
const userRouter = require('./user');
const patientRouter = require('./patient');
const doctorRouter = require('./doctor');

router.use('/user', userRouter);
router.use('/patient', patientRouter);
router.use('/doctor', doctorRouter);

module.exports = router;