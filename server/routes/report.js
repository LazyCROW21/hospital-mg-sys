const express = require('express');
const router = express.Router();

const reportController = require('../controllers/report');
const reportJOI = require('../helper/validation/report');
const validation = require('../middlewares/validation');

router.get('/', async (req, res) => {
    const reports = await reportController.getAllReports();
    res.send(reports);
});

router.get('/:id', async (req, res) => {
    const report = await reportController.getReportById(req.params.id);
    if(report) {
        return res.send(report);
    }
    return res.sendStatus(404);
});

router.get('/doctor/:id', async (req, res) => {
    const reports = await reportController.getReportsByDoctorId(req.params.id);
    return res.send(reports);
});

router.get('/patient/:id', async (req, res) => {
    const reports = await reportController.getReportsByPatientId(req.params.id);
    return res.send(reports);
});

router.post('/', validation(reportJOI.creationSchema), async (req, res) => {
    const newReport = await reportController.addReport(req.body);
    res.send(newReport);
});

router.patch('/:id(\\d+)', validation(reportJOI.updateSchema), async (req, res) => {
    const updateReport = await reportController.updateReport(req.params.id, req.body);
    return res.send(updateReport);
});

router.delete('/:id(\\d+)', async (req, res) => {
    const deleteReport = await reportController.deleteReport(req.params.id);
    return res.send(deleteReport);
});

module.exports = router;