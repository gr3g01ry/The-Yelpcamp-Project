const Joi=require('joi');
const { number } = require('joi');

const campgroundSchema=Joi.object({
    campground:Joi.object({
        title:Joi.string().min(6).max(56).required(),
        // images:Joi.string().required(),
        price:Joi.number().min(0.10).precision(2).sign('positive').required(),
        description:Joi.string().min(15).required(),
        location:Joi.string().required(),
    }).required(),
    deleteImages:Joi.array()
});


const reviewSchema=Joi.object({
    review:Joi.object({
        title:Joi.string().min(6).max(56).trim().required(),
        body:Joi.string().min(15).required(),
        rating:Joi.number().min(0).max(10).required(),
    }).required()
});



module.exports={campgroundSchema, reviewSchema};