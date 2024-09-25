const express = require('express');
const router = express.Router({mergeParams:true});
// const flash = require('connect-flash');

const catchAsync=require('../utils/catchAsync');
const Campground=require('../models/campground');
const ExpressError=require('../utils/expressError');
const isLoggedIn=require('../middleware');

const {campgroundSchema,reviewSchema}=require('../models/schemas/schemas')
const Review=require('../models/reviews');



const valideCampground=(req,res,next)=>{
    console.log(req.body)
    const {error}=campgroundSchema.validate(req.body);
    // console.log(resultJoi);
    if(error){
        const msg=error.details.map(el=>el.message).join('-');
        // throw new ExpressError(resultJoi.error.details,400)
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}

router.get('/',async (req,res)=>{
    const campgrounds= await Campground.find();
    res.render('campgrounds/index.ejs',{campgrounds});
});

router.get('/new',isLoggedIn,(req,res)=>{
    // console.log('intermitant')
    // console.log(req);
    
    res.render('campgrounds/new.ejs')
})
router.post('/',isLoggedIn,valideCampground, catchAsync(async (req,res,next)=>{
    // let {campground}=req.body;
    //too basic security
    // if(!req.body.campground)throw new ExpressError('Invalid, Missing data',422)
    //better option use JOI package
    let campground=new Campground(req.body.campground);
    await campground.save();
    req.flash('success','CONGRADULATION you have add a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
    // res.redirect(`/campgrounds`);
}));

router.get('/:id',catchAsync(async (req,res,next)=>{
    // console.log('campground id');
    // console.log(req.params);
    let {id}= req.params;
    console.log(id);
    const campground= await Campground.findById(id).populate('reviews');
    if(!campground){
        req.flash('error','ho no this url not exist');
        res.redirect('/campgrounds');
    }else{
        console.log(campground);
        res.render('campgrounds/show.ejs',{campground});
    }
}));
//EDIT ROAD
router.get('/:id/edit',isLoggedIn,catchAsync(async(req,res,next)=>{
    let {id}=req.params;
    const campground= await Campground.findById(id);
    if(!campground){
        req.flash('error','ho no this url not exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit.ejs',{campground});
}));

router.patch('/:id',isLoggedIn,valideCampground, catchAsync(async (req,res,next)=>{
    let {id}=req.params;
    let campground= await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','ok you have edited campground');
    res.redirect(`/campgrounds/${campground._id}`);
}));

//Delete ROAD
router.delete('/:id',isLoggedIn,catchAsync(async (req,res,next)=>{
    let {id}=req.params;
    let campground= await Campground.findByIdAndDelete(id);
    console.log(campground);
    res.redirect(`/campgrounds`);
}));

module.exports=router;