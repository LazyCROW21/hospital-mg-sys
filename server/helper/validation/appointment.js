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

    subject: Joi.string()
        .alphanum()
        .min(3)
        .max(80)
        .required(),

    message: Joi.string().min(3).max(255).required(),
    preferredDateTime: Joi.date().min(new Date()).required(),
    status: Joi.string().valid('fixed', 'cancelled', 'applied', 'rejected').required(),
});

module.exports = creationSchema;