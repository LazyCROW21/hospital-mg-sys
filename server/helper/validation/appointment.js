const Joi = require('joi');

const creationSchema = Joi.object({
    patientId: Joi.number().integer().min(0).required(),
    doctorId: Joi.number().integer().min(0).required(),
    subject: Joi.string().alphanum().min(3).max(80).required(),
    message: Joi.string().min(3).max(255).required(),
    preferredDateTime: Joi.date().min(new Date()).required(),
    status: Joi.string().valid('fixed', 'cancelled', 'applied', 'rejected').required(),
});

const changeStatusSchema = Joi.object({
    status: Joi.string().valid('fixed', 'cancelled', 'applied', 'rejected').required(),
});

module.exports = { creationSchema, changeStatusSchema };