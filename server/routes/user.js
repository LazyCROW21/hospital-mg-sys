const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const access = require('../middlewares/access');
const mailer = require('../helper/mailer');

router.get('/', async (req, res) => {
    const users = await userController.getAllUsers();
    res.send(users);
});

router.get('/:id(\\d+)', async (req, res) => {
    const { user, role } = await userController.getUserById(req.params.id);
    if (!user) {
        return res.sendStatus(404);
    }
    const joinedUser = { ...user.dataValues, roleDetails: role.dataValues };
    res.send(joinedUser);
});

router.get('/new', async (req, res) => {
    const users = await userController.getAllNewUsers();
    res.send(users);
});

router.delete('/:id(\\d+)',
    access(['A'], null, null, null, ['SA', 'MNG_U']),
    async (req, res) => {
        const result = await userController.deleteUser(req.params.id);
        if (result.length === 0) {
            return res.sendStatus(404);
        }
        res.send(result);
    });


router.patch(
    '/commit/:id(\\d+)',
    access(['A'], null, null, null, ['SA', 'MNG_U']),
    async (req, res) => {
        if(!['A', 'R', 'N', 'X'].includes(req.body.status)) {
            return res.sendStatus(400);
        }
        const user = await userController.commitUser(req.params.id, req.body.status);
        if (!user) {
            return res.sendStatus(404);
        }
        mailer.commitAccountGreeting(user);
        res.send(user);
    });

router.patch('/:id(\\d+)', async (req, res) => {
    const result = await userController.updateUser(req.params.id, req.body);
    if (!result) {
        return res.sendStatus(404);
    }
    res.send(result);
});

router.patch('/changePWD/:id(\\d+)', async (req, res) => {
    const result = await userController.changePWD(req.params.id, req.body.oldPwd, req.body.newPwd);
    if (!result) {
        return res.sendStatus(403);
    }
    res.send(result);
});

module.exports = router;