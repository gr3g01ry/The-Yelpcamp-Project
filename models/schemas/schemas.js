const Joi=require('joi')

const campgroundSchema=Joi.object({
    campground:Joi.object({
        title:Joi.string().min(6).max(56).required(),
        image:Joi.string().uri({}),
        price:Joi.number().min(0.10).precision(2).required(),
        description:Joi.string().min(15).required(),
        location:Joi.string().required(),
    }).required()
});

module.exports=campgroundSchema;