const express = require('express');
const router = express.Router();
const authRouter = require('./auth');
const userRouter = require('./user');
const publicRouter = require('./public');
const patientRouter = require('./patient');
const doctorRouter = require('./doctor');
const appointmentRouter = require('./appointment');
const departmentRouter = require('./department');
const reportRouter = require('./report');
const adminRouter = require('./admin');
const noticeRouter = require('./notice');

const authMiddleware = require('../middlewares/auth');

router.use('/public', publicRouter);
router.use('/auth', authRouter);
router.use('/user', authMiddleware, userRouter);
router.use('/admin', authMiddleware, adminRouter);
router.use('/patient', authMiddleware, patientRouter);
router.use('/doctor', authMiddleware, doctorRouter);
router.use('/appointment', authMiddleware, appointmentRouter);
router.use('/department', authMiddleware, departmentRouter);
router.use('/report', authMiddleware, reportRouter);
router.use('/notice', authMiddleware, noticeRouter);

module.exports = router;