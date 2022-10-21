const Department = require('../models/department');
const DoctorModel = require('../models/doctor');
const User = require('../models/user');

DoctorModel.sync();

const getAllDoctors = async () => {
    return DoctorModel.findAll({
        where: {
            "$user.status$": 'A'
        },
        include: [
            {
                model: User,
                as: 'user'
            },
            {
                model: Department,
                as: 'department'
            }
        ]
    });
}

// returns no of doctors registered in the week
const getNewDoctors = async () => {
    return DoctorModel.findAll({
        where: {
            '$user.status$': 'N'
        },
        include: {
            model: User,
            as: 'user'
        }
    });
}

const getDoctorsByDepartmentId = async (id) => {
    return DoctorModel.findAll({
        where: { departmentId: id },
        include: [
            {
                model: User,
                as: 'user'
            },
            {
                model: Department,
                as: 'department'
            }
        ]
    });
}

const getDoctorById = async (id) => {
    return DoctorModel.findByPk(id, {
        include: [
            {
                model: User,
                as: 'user'
            },
            {
                model: Department,
                as: 'department'
            }
        ]
    });
}

const getDoctorByUserId = async (id) => {
    return DoctorModel.findOne({
        "$user.id$": id
    }, {
        include: [
            {
                model: User,
                as: 'user'
            },
            {
                model: Department,
                as: 'department'
            }
        ]
    });
}

const addDoctor = async (doctorData) => {
    let doctor = new DoctorModel(doctorData);
    await doctor.save();
    return doctor;
}

const updateDoctorByUserId = async (userId, data) => {
    return DoctorModel.update(data, {
        where: { userId }
    });
}

const updateDoctorById = async (id, data) => {
    return DoctorModel.update(data, {
        where: { id }
    });
}

module.exports = {
    getAllDoctors,
    getNewDoctors,
    getDoctorsByDepartmentId,
    getDoctorById,
    getDoctorByUserId,
    addDoctor,
    updateDoctorByUserId,
    updateDoctorById
}