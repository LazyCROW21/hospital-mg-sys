const Joi = require('joi');

const creationSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    parentDepartmentId: Joi.number()
        .integer()
        .min(0)
        .allow(null),

    description: Joi.string().min(3).max(255).required(),
});

module.exports = creationSchema;