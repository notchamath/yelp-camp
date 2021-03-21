const Joi = require('joi');

module.exports.joiSchemaCampground = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        desc: Joi.string().required(),
        image: Joi.string().required(),
        price: Joi.number().required().min(0),
    }).required()
});

module.exports.joiSchemaReview = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    }).required()
});