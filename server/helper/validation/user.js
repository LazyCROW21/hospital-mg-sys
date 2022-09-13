const Joi = require('joi');
const { accessCodes } = require('../enum');

const creationSchema = Joi.object({
    firstName: Joi.string()
        .min(1)
        .max(40)
        .required(),
    lastName: Joi.string()
        .min(1)
        .max(40)
        .required(),
    phone: Joi.string()
        .pattern(/^[0-9]+$/, 'phone')
        .required(),
    emergencyPhone: Joi.string()
        .pattern(/^[0-9]+$/, 'phone')
        .required().invalid(Joi.ref('phone')),
    gender: Joi.string().valid('M', 'F').required(),
    dob: Joi.date().required(),
    line1: Joi.string()
        .min(3)
        .max(255)
        .required(),
    line2: Joi.string()
        .min(3)
        .max(255)
        .required(),
    pincode: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
    city: Joi.string().min(3).max(40).required(),
    state: Joi.string().min(2).max(40).required(),
    email: Joi.string().email().required(),
    pwd: Joi.string().min(8).max(32).when('role', {
        not: 'A',
        then: Joi.required()
    }),
    role: Joi.string().valid('A', 'D', 'P').required(),
    specialization: Joi.string().min(2).max(40).when('role', {
        is: 'D',
        then: Joi.required()
    }),
    experience: Joi.number().min(0).max(60).when('role', {
        is: 'D',
        then: Joi.required()
    }),
    access: Joi.array().max(10).items(Joi.string().valid(...Object.keys(accessCodes))).unique((a, b) => a === b)
});

module.exports = creationSchema;
