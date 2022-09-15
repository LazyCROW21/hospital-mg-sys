const express = require('express');
const router = express.Router();
const client = require('../config/redis');

router.get('/:role(patient|doctor|admin)', async (req, res) => {
    const notice = await client.get('notice-'+req.params.role);
    res.send(JSON.parse(notice));
});


router.put('/:role(patient|doctor|admin)', async (req, res) => {
    const notice = { ...req.body, date: new Date() };
    await client.set('notice-'+req.params.role, JSON.stringify(notice), {
        'EX': 84000
    });
    res.send(notice);
});

module.exports = router;