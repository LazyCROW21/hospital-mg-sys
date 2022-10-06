const fs = require('fs');
const path = require('path');
const express = require('express');
const multer  = require('multer')
const router = express.Router();

const userController = require('../controllers/user');
const access = require('../middlewares/access');
const mailer = require('../helper/mailer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file);
        cb(null, path.join(__dirname, '../static'));
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, `user_img_${req.params.id}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

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

router.get('/:id(\\d+)/img', upload.single('profile'), async (req, res) => {
    let userImgPath = path.join(__dirname, '../static/user_img.png');
    try {
        let imgPath = path.join(__dirname, `../static/user_img_${req.params.id}.png`);
        if(fs.existsSync(imgPath)) {
            userImgPath = imgPath;
        }
        res.sendFile(userImgPath);
    } catch (err) {
        console.log(err);
        res.sendFile(userImgPath);
    }
});

router.post(
    '/:id(\\d+)/img',  
    access(['A', 'P', 'D'], 'params', 'id', 'user', ['SA', 'MNG_U']),
    upload.single('profile'), async (req, res) => {
        res.send({ status: 200, msg: 'Image uploaded',userId: req.params.id });
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

router.patch(
    '/:id(\\d+)',
    access(['A', 'P', 'D'], 'params', 'id', 'user', ['SA', 'MNG_U']),
    async (req, res) => {
    const result = await userController.updateUser(req.params.id, req.body);
    if (!result) {
        return res.sendStatus(404);
    }
    res.send(result);
});

router.patch(
    '/changePWD/:id(\\d+)',
    access(['A', 'P', 'D'], 'params', 'id', 'user', ['SA']),
    async (req, res) => {
        const result = await userController.changePWD(req.params.id, req.body.oldPwd, req.body.newPwd);
        if (!result) {
            return res.sendStatus(403);
        }
        res.send(result);
    });

module.exports = router;