const Joi = require('joi');

const creationSchema = Joi.object({
    patientId: Joi.number().integer().min(0).required(),
    doctorId: Joi.number().integer().min(0).required(),
    subject: Joi.string().min(3).max(80).required(),
    message: Joi.string().min(3).max(255).required(),
    preferredDateTime: Joi.date().min(new Date()).required()
});

const updationSchema = Joi.object({
    patientId: Joi.number().integer().min(0).required(),
    doctorId: Joi.number().integer().min(0).required(),
    subject: Joi.string().min(3).max(80).required(),
    message: Joi.string().min(3).max(255).required(),
    preferredDateTime: Joi.date().min(new Date()).required()
});

const changeStatusSchema = Joi.object({
    patientId: Joi.number().integer().min(0).required(),
    doctorId: Joi.number().integer().min(0).required(),
    subject: Joi.string().min(3).max(80).required(),
    message: Joi.string().min(3).max(255).required(),
    rejectMessage: Joi.string().min(3).max(255).when('status', {
        not: 'rejected',
        then: Joi.allow(null)
    }),
    preferredDateTime: Joi.date().required(),
    status: Joi.string().valid('fixed', 'cancelled', 'applied', 'rejected').required()
});

module.exports = { creationSchema, updationSchema, changeStatusSchema };