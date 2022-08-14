const express = require('express');
const router = express.Router();

const departmentController = require('../controllers/department');

router.get('/', async (req, res) => {
    const departments = await departmentController.getAllDepartments();
    res.send(departments);
});

router.get('/:id', async (req, res) => {
    const department = await departmentController.getDepartmentById(req.params.id);
    if(department) {
        return res.send(department);
    }
    return res.sendStatus(404);
});

router.get('/sub-departments/:id', async (req, res) => {
    const departments = await departmentController.getDepartmentsByParentDepartmentId(req.params.id);
    res.send(departments);
});


router.post('/', async (req, res) => {
    const department = await departmentController.addDepartment(req.body);
    res.send(department);
});

module.exports = router;