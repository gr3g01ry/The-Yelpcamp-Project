const express = require('express');
const router = express.Router({mergeParams:true});

const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/expressError');

const Campground=require('../models/campground');
const Review=require('../models/reviews')
const {campgroundSchema,reviewSchema}=require('../models/schemas/schemas')


const validateReview=(req,res,next)=>{
    console.log(req.body)
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join('-');
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}


router.post('/',validateReview,catchAsync(async(req,res)=>{
    let {id}=req.params;
    // console.log(req.params)//is empty where is the id??
    //Must setting expressRouter({mergeParams:true}); to keep params in url
    let campground= await Campground.findById(id);
    const review=new Review(req.body.review)
    campground.reviews.push(review);
    console.log(campground);
    await review.save()
    await campground.save()
    req.flash('success','Review Added successfully')
    // res.send('<h1>OK CATCh</h1>');
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:reviewId',catchAsync(async (req,res,next)=>{
    let {id,reviewId}=req.params;
    console.log(id);
    console.log(reviewId);
    let campground=await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    console.log(campground);
    let review=await Review.findByIdAndDelete(reviewId);
    console.log(review);
    // res.send('ok deleted');
    // let campground= await Campground.findByIdAndDelete(id);
    // console.log(campground);
    req.flash('success','Deleted successfully')
    res.redirect(`/campgrounds/${id}`);
}));

module.exports=router;