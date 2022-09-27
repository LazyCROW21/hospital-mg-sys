const express = require('express');
const router = express.Router();

const reportController = require('../controllers/report');
const reportJOI = require('../helper/validation/report');
const validation = require('../middlewares/validation');
const access = require('../middlewares/access');
const mailer = require('../helper/mailer');

router.get('/', async (req, res) => {
    const reports = await reportController.getAllReports();
    res.send(reports);
});

router.get('/:id', async (req, res) => {
    const report = await reportController.getReportById(req.params.id);
    if (report) {
        return res.send(report);
    }
    return res.sendStatus(404);
});

router.get(
    '/doctor/:id',
    access(['A', 'D'], 'params', 'id', 'roleId', ['SA']),
    async (req, res) => {
        const reports = await reportController.getReportsByDoctorId(req.params.id);
        return res.send(reports);
    });

router.get(
    '/patient/:id',
    access(['A', 'P'], 'params', 'id', 'roleId', ['SA']),
    async (req, res) => {
        const reports = await reportController.getReportsByPatientId(req.params.id);
        return res.send(reports);
    });

router.get('/new/:role(patient|doctor|admin)/:id(\\d+)', async (req, res) => {
    const reports = await reportController.getNewReports(req.params.role, req.params.id);
    return res.send(reports);
});

router.post(
    '/',
    access(['D']),
    validation(reportJOI.creationSchema), async (req, res) => {
        const newReport = await reportController.addReport(req.body);
        res.send(newReport);
    });

router.patch(
    '/:id(\\d+)',
    access(['D']),
    validation(reportJOI.updateSchema), async (req, res) => {
        const updateReport = await reportController.updateReport(req.params.id, req.body);
        if(!updateReport) {
            return res.sendStatus(404);
        }
        mailer.updateReportAlert(updateReport);
        return res.send(updateReport);
    });

router.delete(
    '/:id(\\d+)',
    access(['A'], null, null, null, ['SA']),
    async (req, res) => {
        const deleteReport = await reportController.deleteReport(req.params.id);
        return res.send(deleteReport);
    });

module.exports = router;