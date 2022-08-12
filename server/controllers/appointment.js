const AppointmentModel = require('../models/appointment');

AppointmentModel.sync();

const getAllAppointments = async () => {
    const appointments = await AppointmentModel.findAll();
    return appointments;
}

const getAppointmentById = async (id) => {
    const appointment = await AppointmentModel.findByPk(id)
    return appointment
}

const getAppointmentsByPatientId = async (patientId) => {
    const appointments = await AppointmentModel.findAll({
        where: {
            patientId: patientId
        }
    });
    return appointments
}

const getAppointmentsByDoctorId = async (doctorId) => {
    const appointments = await AppointmentModel.findAll({
        where: {
            doctorId: doctorId
        }
    });
    return appointments
}

const addAppointment = async (appointmentData) => {
    const newAppointment = new AppointmentModel(appointmentData);
    newAppointment.save();
    return newAppointment;
}



module.exports = {
    getAllAppointments,
    getAppointmentById,
    getAppointmentsByPatientId,
    getAppointmentsByDoctorId,
    addAppointment
}