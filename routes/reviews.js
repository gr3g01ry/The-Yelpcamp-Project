const express = require('express');
const router = express.Router({mergeParams:true});

const catchAsync=require('../utils/catchAsync');
// const ExpressError=require('../utils/expressError');

// const Campground=require('../models/campground');
// const Review=require('../models/reviews')
// const {campgroundSchema,reviewSchema}=require('../models/schemas/schemas')

const {validateReview, isLoggedIn,isAuthor,isReviewAuthor}=require('../middleware');

const reviews=require('../controllers/reviews')

// const validateReview=(req,res,next)=>{
//     console.log(req.body)
//     const {error}=reviewSchema.validate(req.body);
//     if(error){
//         const msg=error.details.map(el=>el.message).join('-');
//         throw new ExpressError(msg,400)
//     }else{
//         next();
//     }
// }


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.postReview));

router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports=router;