const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.get('/', async (req, res) => {
    const users = await userController.getAllUsers();
    res.send(users);
});

module.exports = router;