const Joi = require('joi');

const creationSchema = Joi.object({
    userId: Joi.number()
        .integer()
        .min(0),
    departmentId: Joi.number()
        .integer()
        .min(0),
    designation: Joi.string()
        .alphanum()
        .min(3)
        .max(40)
        .required(),
    specialization: Joi.string()
        .alphanum()
        .min(3)
        .max(80)
        .required(),
    experience: Joi.number().integer().min(0).required(),
});

const updateSchema = Joi.object({
    departmentId: Joi.number()
        .integer()
        .min(0).required(),
    designation: Joi.string()
        .alphanum()
        .min(3)
        .max(40)
        .required(),
    specialization: Joi.string()
        .alphanum()
        .min(3)
        .max(80)
        .required(),
    experience: Joi.number().integer().min(0).required(),
});

module.exports = { creationSchema, updateSchema };