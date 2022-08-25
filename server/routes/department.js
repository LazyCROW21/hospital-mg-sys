const express = require('express');
const router = express.Router();

const departmentValidationSchema = require('../helper/validation/department');
const departmentController = require('../controllers/department');
const validation = require('../middlewares/validation');

router.get('/', async (req, res) => {
    const departments = await departmentController.getAllDepartments();
    res.send(departments);
});

router.get('/:id(\\d+)', async (req, res) => {
    const department = await departmentController.getDepartmentById(req.params.id);
    if(department) {
        return res.send(department);
    }
    return res.sendStatus(404);
});

router.get('/sub-departments/:id(\\d+)', async (req, res) => {
    const departments = await departmentController.getDepartmentsByParentDepartmentId(req.params.id);
    res.send(departments);
});


router.post('/', validation(departmentValidationSchema), async (req, res) => {
    const department = await departmentController.addDepartment(req.body);
    res.send(department);
});

router.patch('/:id(\\d+)', validation(departmentValidationSchema), async (req, res) => {
    const result = await departmentController.updateDepartment(req.params.id, req.body);
    res.send(result);
});


router.delete('/:id(\\d+)', async (req, res) => {
    await departmentController.removeDepartment(req.params.id);
    res.sendStatus(204);
});

module.exports = router;