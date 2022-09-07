const Joi = require('joi');

const creationSchema = Joi.object({
    appointmentId: Joi.number().integer().min(0).required(),
    patientId: Joi.number().integer().min(0).required(),
    doctorId: Joi.number().integer().min(0).required(),
    dateAdmitted: Joi.date().required(),
    dateDischarged: Joi.date().required(),
    treatmentType: Joi.string().valid('opertaion', 'vaccine', 'diagonosis', 'surgory').required(),
    description: Joi.string().min(3).max(255).required(),
    status: Joi.string().valid('success', 'fail', 'incomplete').required(),
    patientStatus: Joi.string().valid('unchanged', 'improved', 'cured', 'worsen').required(),
});

module.exports = { creationSchema };