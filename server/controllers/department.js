const DepartmentModel = require('../models/department');

DepartmentModel.sync();

const getAllDepartments = async () => {
    return DepartmentModel.findAll({ include: {
        model: DepartmentModel,
        as: 'parentDepartment',
    } });
}

const getDepartmentById = async (id) => {
    return DepartmentModel.findByPk(id, { include: {
        model: DepartmentModel,
        as: 'parentDepartment',
    } })
}

const getDepartmentsByParentDepartmentId = async (parentId) => {
    return DepartmentModel.findAll({
        where: {
            parentDepartmentId: parentId
        },
        include: {
            model: DepartmentModel,
            as: 'parentDepartment',
        }
    });
}

const addDepartment = async (departmentData) => {
    const newDepartment = new DepartmentModel(departmentData);
    await newDepartment.save();
    return newDepartment;
}

const updateDepartment = async (id, data) => {
    return DepartmentModel.update(data, {
        where: { id }
    });
}

const removeDepartment = async (id) => {
    return DepartmentModel.destroy({
        where: { id }
    });
}



module.exports = {
    getAllDepartments,
    getDepartmentById,
    getDepartmentsByParentDepartmentId,
    addDepartment,
    removeDepartment,
    updateDepartment
}