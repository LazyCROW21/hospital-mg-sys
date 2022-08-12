const express = require('express');
const router = express.Router();

const recordController = require('../controllers/record');

router.get('/', async (req, res) => {
    const records = await recordController.getAllRecords();
    res.send(records);
});

router.get('/:id', async (req, res) => {
    const record = await recordController.getRecordById(req.params.id);
    if(record) {
        return res.send(record);
    }
    return res.sendStatus(404);
});

router.post('/', (req, res) => {
    const newRecord = await recordController.addRecord(req.body);
    res.send(newRecord);
});

module.exports = router;