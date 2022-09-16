const Joi = require('joi');

const creationSchema = Joi.object({
    subject: Joi.string().min(3).max(80).required(),
    body: Joi.string().min(3).max(255).required(),
});

module.exports = creationSchema;