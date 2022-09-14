const Joi = require('joi');
const { reportStatus, treatmentType, patientStatus } = require('../enum');

const creationSchema = Joi.object({
    appointmentId: Joi.number().integer().min(0).required(),
    patientId: Joi.number().integer().min(0).required(),
    doctorId: Joi.number().integer().min(0).required(),
    dateAdmitted: Joi.date().required(),
    dateDischarged: Joi.date().required(),
    treatmentType: Joi.string().valid(...treatmentType).required(),
    description: Joi.string().min(3).max(255).required(),
    status: Joi.string().valid(...reportStatus).required(),
    patientStatus: Joi.string().valid('unchanged', 'improved', 'cured', 'worsen').required(),
});

const updateSchema = Joi.object({
    dateDischarged: Joi.date().required(),
    treatmentType: Joi.string().valid(...treatmentType).required(),
    description: Joi.string().min(3).max(255).required(),
    status: Joi.string().valid(...reportStatus).required(),
    patientStatus: Joi.string().valid(...patientStatus).required(),
});

module.exports = { creationSchema, updateSchema };