const express = require('express');
const router = express.Router();

const userValidationSchema = require('../helper/validation/user');
const validation = require('../middlewares/validation');
const userController = require('../controllers/user');

router.get('/', async (req, res) => {
    const users = await userController.getAllUsers();
    res.send(users);
});

router.get('/new', async (req, res) => {
    const users = await userController.getAllNewUsers();
    res.send(users);
});

router.post('/', validation(userValidationSchema), async (req, res) => {
    let user;
    if(req.body.role === 'P') {
        user = await userController.addPatient(req.body);
    } else if(req.body.role === 'D') {
        user = await userController.addDoctor(req.body);
    } else if(req.body.role === 'A') {
        user = await userController.addAdmin(req.body);
    }
    res.send(user);
});

router.delete('/:id(\\d+)', async (req, res) => {
    const result = await userController.deleteUser(req.params.id);
    if(result.length === 0) {
        return res.sendStatus(404);
    }
    res.send(result);
});


router.patch('/:id(\\d+)', async (req, res) => {
    const result = await userController.commitUser(req.params.id, req.body.status);
    if(!result) {
        return res.sendStatus(404);
    }
    res.send(result);
});

module.exports = router;