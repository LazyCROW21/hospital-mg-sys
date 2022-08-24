const Joi = require('joi');

const creationSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    patientId: Joi.number()
        .integer()
        .min(0),
    doctorId: Joi.number()
        .integer()
        .min(0),
    dateAdmitted: Joi.date().required(),
    dateDischarged: Joi.date().required(),
    treatmentType: Joi.string().valid('opertaion', 'vaccine', 'diagonosis', 'surgory').required(),
    description: Joi.string().min(3).max(255).required(),
    status: Joi.string().valid('success', 'fail', 'incomplete').required(),
    patientStatus: Joi.string().valid('unchanged', 'improved', 'cured', 'worsen').required(),
});

module.exports = creationSchema;