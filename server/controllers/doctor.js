const Department = require('../models/department');
const DoctorModel = require('../models/doctor');
const User = require('../models/user');

DoctorModel.sync();

const getAllDoctors = async () => {
    const doctors = await DoctorModel.findAll({
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

const addDoctor = async (doctorData) => {
    let doctor = new DoctorModel(doctorData);
    await doctor.save();
    return doctor;
}

module.exports = {
    getAllDoctors,
    getDoctorsByDepartmentId,
    getDoctorById,
    addDoctor
}