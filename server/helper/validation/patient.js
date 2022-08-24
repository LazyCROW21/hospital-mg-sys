const Joi = require('joi');

const creationSchema = Joi.object({

    userId: Joi.number()
        .integer()
        .min(0),

});

module.exports = creationSchema;
