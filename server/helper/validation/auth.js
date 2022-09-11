const Joi = require('joi');

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    pwd: Joi.string().min(8).max(32).required(),
});

const refreshSchema = Joi.object({
    refreshToken: Joi.string().min(3).required(),
});

module.exports = { loginSchema, refreshSchema };