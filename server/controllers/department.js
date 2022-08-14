const DepartmentModel = require('../models/department');

DepartmentModel.sync();

const getAllDepartments = async () => {
    const departments = await DepartmentModel.findAll();
    return departments;
}

const getDepartmentById = async (id) => {
    const department = await DepartmentModel.findByPk(id)
    return department
}

const getDepartmentsByParentDepartmentId = async (parentId) => {
    const departments = await DepartmentModel.findAll({
        where: {
            parentDepartmentId: parentId
        }
    });
    return departments
}

const addDepartment = async (departmentData) => {
    const newDepartment = new DepartmentModel(departmentData);
    newDepartment.save();
    return newDepartment;
}



module.exports = {
    getAllDepartments,
    getDepartmentById,
    getDepartmentsByParentDepartmentId,
    addDepartment
}