const Joi = require('joi');

const creationSchema = Joi.object({
    firstName: Joi.string()
        .alphanum()
        .min(1)
        .max(40)
        .required(),
    lastName: Joi.string()
        .alphanum()
        .min(1)
        .max(40)
        .required(),
    phone: Joi.string()
        .phoneNumber()
        .required(),
    emergencyPhone: Joi.string()
        .phoneNumber()
        .required(),
    gender: Joi.string().valid('M', 'F').required(),
    dob: Joi.date().required(),
    line1:  Joi.string()
    .alphanum()
    .min(3)
    .max(255)
    .required(),
    line2:  Joi.string()
    .alphanum()
    .min(3)
    .max(255)
    .required(),
    pincode: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
    city: Joi.string().min(3).max(40).required(),
    state: Joi.string().min(3).max(40).required(),
    email: Joi.string().email().required(),
    pwd: Joi.string().min(8).max(32).required(),
    role: Joi.string().valid('A', 'D', 'P').required(),
});

module.exports = creationSchema;
