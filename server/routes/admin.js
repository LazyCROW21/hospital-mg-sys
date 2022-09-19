const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');
const access = require('../middlewares/access');

router.get('/', access(['A']),  async (req, res) => {
    const result = await adminController.getAllAdmins();
    if(!result) {
        return res.sendStatus(401);
    }
    return res.send(result);
});

router.get('/:id(\\d+)', access(['A']), async (req, res) => {
    const admin = await adminController.getAdminById(req.params.id);
    if(!admin) {
        return res.sendStatus(404);
    }
    res.send(admin);
});

// router.post('/', async (req, res) => {
//     const admin = await adminController.addAdmin(req.body);
//     res.send(admin);
// });

module.exports = router;