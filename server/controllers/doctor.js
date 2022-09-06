// const { Op } = require('sequelize');
const Department = require('../models/department');
const DoctorModel = require('../models/doctor');
const User = require('../models/user');

DoctorModel.sync();

const getAllDoctors = async () => {
    const doctors = await DoctorModel.findAll({
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
    return doctors;
}

// returns no of doctors registered in the week
const getNewDoctors = async () => {
    // const d = new Date();
    // d.setDate(d.getDate() - 7);
    const doctors = await DoctorModel.findAll({
        where: {
            '$user.status$': 'N'
        },
        include: {
            model: User,
            as: 'user'
        }
    });
    return doctors;
}

const getDoctorsByDepartmentId = async (id) => {
    const doctors = await DoctorModel.findAll({
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
    return doctors;
}

const getDoctorById = async (id) => {
    const doctor = await DoctorModel.findByPk(id, {
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
    return doctor;
}

const getDoctorByUserId = async (id) => {
    const doctor = await DoctorModel.findOne({
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
    return doctor;
}

const addDoctor = async (doctorData) => {
    let doctor = new DoctorModel(doctorData);
    await doctor.save();
    return doctor;
}

const updateDoctorByUserId = async (userId, data) => {
    const result = await DoctorModel.update(data, {
        where: { userId }
    });
    return result;
}

const updateDoctorById = async (id, data) => {
    const result = await DoctorModel.update(data, {
        where: { id }
    });
    return result;
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