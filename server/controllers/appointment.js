const { Op } = require("sequelize");
const AppointmentModel = require('../models/appointment');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const User = require('../models/user');

AppointmentModel.sync();

const getAllAppointments = async () => {
    const appointments = await AppointmentModel.findAll({
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
    return appointments;
}

const getAppointmentById = async (id) => {
    const appointment = await AppointmentModel.findByPk(id, {
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
    return appointment;
}

const getAppointmentsByPatientId = async (patientId) => {
    const appointments = await AppointmentModel.findAll({
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
        ]
    });
    return appointments;
}

const getAllNextAppointments = async () => {
    const appointments = await AppointmentModel.findAndCountAll({
        where: {
            preferredDateTime: {
                [Op.gt]: new Date()
            }
        },
    });
    return appointments;
}

const getNextAppointmentsByPatientId = async (patientId) => {
    const appointments = await AppointmentModel.findAndCountAll({
        where: {
            patientId: patientId,
            preferredDateTime: {
                [Op.gt]: new Date()
            }
        },
        // include: [
        //     {
        //         model: Doctor,
        //         as: 'doctor',
        //         include: {
        //             model: User,
        //             as: 'user'
        //         }
        //     },
        //     {
        //         model: Patient,
        //         as: 'patient',
        //         include: {
        //             model: User,
        //             as: 'user'
        //         }
        //     }
        // ]
    });
    return appointments;
}

const getAppointmentsByDoctorId = async (doctorId) => {
    const appointments = await AppointmentModel.findAll({
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
        ]
    });
    return appointments;
}

const getNextAppointmentsByDoctorId = async (doctorId) => {
    const appointments = await AppointmentModel.findAndCountAll({
        where: {
            doctorId: doctorId
        },
        // include: [
        //     {
        //         model: Doctor,
        //         as: 'doctor',
        //         include: {
        //             model: User,
        //             as: 'user'
        //         }
        //     },
        //     {
        //         model: Patient,
        //         as: 'patient',
        //         include: {
        //             model: User,
        //             as: 'user'
        //         }
        //     }
        // ]
    });
    return appointments;
}

const addAppointment = async (appointmentData) => {
    appointmentData.status = 'applied';
    const newAppointment = new AppointmentModel(appointmentData);
    await newAppointment.save();
    return newAppointment;
}

const changeAppointmentStatus = async (id, status) => {
    const result = await AppointmentModel.update(
        { status },
        { where: { id } }
    );
    return result;
}

const updateAppointment = async (id, data) => {
    const result = await AppointmentModel.update(
        data,
        { where: { id, status: 'applied' } }
    );
    return result;
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