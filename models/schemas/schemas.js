const baseJoi=require('joi');
// const { number } = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include special tag!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = baseJoi.extend(extension)

const campgroundSchema=Joi.object({
    campground:Joi.object({
        title:Joi.string().min(6).max(56).required().escapeHTML(),
        // images:Joi.string().required(),
        price:Joi.number().min(0.10).precision(2).sign('positive').required(),
        description:Joi.string().min(15).required().escapeHTML(),
        location:Joi.string().required().escapeHTML(),
    }).required(),
    deleteImages:Joi.array()
});


const reviewSchema=Joi.object({
    review:Joi.object({
        title:Joi.string().min(6).max(56).trim().required().escapeHTML(),
        body:Joi.string().min(15).required().escapeHTML(),
        rating:Joi.number().min(0).max(10).required(),
    }).required()
});



module.exports={campgroundSchema, reviewSchema};