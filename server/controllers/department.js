const DepartmentModel = require('../models/department');

DepartmentModel.sync();

const getAllDepartments = async () => {
    const departments = await DepartmentModel.findAll({ include: {
        model: DepartmentModel,
        as: 'parentDepartment',
    } });
    return departments;
}

const getDepartmentById = async (id) => {
    const department = await DepartmentModel.findByPk(id, { include: {
        model: DepartmentModel,
        as: 'parentDepartment',
    } })
    return department
}

const getDepartmentsByParentDepartmentId = async (parentId) => {
    const departments = await DepartmentModel.findAll({
        where: {
            parentDepartmentId: parentId
        },
        include: {
            model: DepartmentModel,
            as: 'parentDepartment',
        }
    });
    return departments
}

const addDepartment = async (departmentData) => {
    const newDepartment = new DepartmentModel(departmentData);
    newDepartment.save();
    return newDepartment;
}

const removeDepartment = async (id) => {
    return await DepartmentModel.destroy({
        where: { id }
    });
}



module.exports = {
    getAllDepartments,
    getDepartmentById,
    getDepartmentsByParentDepartmentId,
    addDepartment,
    removeDepartment
}