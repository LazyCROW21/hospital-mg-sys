const { Op } = require("sequelize");
const AppointmentModel = require('../models/appointment');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const User = require('../models/user');

AppointmentModel.sync();

const getAllAppointments = async () => {
    return AppointmentModel.findAll({
        include: [
            {
                model: Doctor,
                as: 'doctor',
                include: {
                    model: User,
                    as: 'user'
                }
            },
            {
                model: Patient,
                as: 'patient',
                include: {
                    model: User,
                    as: 'user'
                }
            }
        ],
        order: [['createdAt', 'DESC']]
    });
}

const getAppointmentById = async (id) => {
    return AppointmentModel.findByPk(id, {
        include: [
            {
                model: Doctor,
                as: 'doctor',
                include: {
                    model: User,
                    as: 'user'
                }
            },
            {
                model: Patient,
                as: 'patient',
                include: {
                    model: User,
                    as: 'user'
                }
            }
        ]
    });
}

const getAppointmentsByPatientId = async (patientId) => {
    return AppointmentModel.findAll({
        where: {
            patientId: patientId
        },
        include: [
            {
                model: Doctor,
                as: 'doctor',
                include: {
                    model: User,
                    as: 'user'
                }
            },
            {
                model: Patient,
                as: 'patient',
                include: {
                    model: User,
                    as: 'user'
                }
            }
        ],
        order: [['createdAt', 'DESC']]
    });
}

const getAllNextAppointments = async () => {
    return AppointmentModel.findAndCountAll({
        where: {
            preferredDateTime: {
                [Op.gt]: new Date()
            }
        },
        order: [['createdAt', 'DESC']]
    });
}

const getNextAppointmentsByPatientId = async (patientId) => {
    return AppointmentModel.findAndCountAll({
        where: {
            patientId: patientId,
            preferredDateTime: {
                [Op.gt]: new Date()
            }
        },
        order: [['createdAt', 'DESC']]
    });
}

const getAppointmentsByDoctorId = async (doctorId) => {
    return AppointmentModel.findAll({
        where: {
            doctorId: doctorId,
        },
        include: [
            {
                model: Doctor,
                as: 'doctor',
                include: {
                    model: User,
                    as: 'user'
                }
            },
            {
                model: Patient,
                as: 'patient',
                include: {
                    model: User,
                    as: 'user'
                }
            }
        ],
        order: [['createdAt', 'DESC']]
    });
}

const getNextAppointmentsByDoctorId = async (doctorId) => {
    return AppointmentModel.findAndCountAll({
        where: {
            doctorId: doctorId
        },
        order: [['createdAt', 'DESC']]
    });
}

const addAppointment = async (appointmentData) => {
    appointmentData.status = 'applied';
    const newAppointment = new AppointmentModel(appointmentData);
    await newAppointment.save();
    return newAppointment;
}

const changeAppointmentStatus = async (id, status) => {
    return AppointmentModel.update(
        { status },
        { where: { id } }
    );
}

const updateAppointment = async (id, data) => {
    return AppointmentModel.update(
        data,
        { where: { id, status: 'applied' } }
    );
}

module.exports = {
    getAllAppointments,
    getAppointmentById,
    getAppointmentsByPatientId,
    getAppointmentsByDoctorId,
    addAppointment,
    changeAppointmentStatus,
    getNextAppointmentsByPatientId,
    getNextAppointmentsByDoctorId,
    getAllNextAppointments,
    updateAppointment
}