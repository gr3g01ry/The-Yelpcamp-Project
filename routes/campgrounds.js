const express = require('express');
const router = express.Router({mergeParams:true});
// const flash = require('connect-flash');

const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/expressError');
const {isLoggedIn, isAuthor, valideCampground}=require('../middleware');

const Campground=require('../models/campground');
const Review=require('../models/reviews');

const {campgroundSchema,reviewSchema}=require('../models/schemas/schemas')



// const valideCampground=(req,res,next)=>{
//     console.log(req.body)
//     const {error}=campgroundSchema.validate(req.body);
//     // console.log(resultJoi);
//     if(error){
//         const msg=error.details.map(el=>el.message).join('-');
//         // throw new ExpressError(resultJoi.error.details,400)
//         throw new ExpressError(msg,400)
//     }else{
//         next();
//     }
// }

// const isAuthor=async (req,res,next)=>{
//     let {id}=req.params;
//     let campground =await Campground.findById(id);
//     if(!campground.author.equals(req.user._id)){
//         req.flash('error','You are not the yelpcamp\'s owner');
//         return res.redirect(`/campgrounds/${id}`);
//     }
//     next();
// }

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
    campground.author=req.user._id;
    await campground.save();
    req.flash('success','CONGRADULATION you have add a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
    // res.redirect(`/campgrounds`);
}));

router.get('/:id',catchAsync(async (req,res,next)=>{
    let {id}= req.params;
    // const campground= await Campground.findById(id).populate('reviews').populate('author');
    //a review is with author so we nedd to search author id
    const campground= await Campground.findById(id).populate({
        path:'reviews',
        populate:{path:'author'}
        }).populate('author');
    console.log(campground);
    if(!campground){
        req.flash('error','ho no this url not exist');
        res.redirect('/campgrounds');
    }else{
        // console.log(campground);
        res.render('campgrounds/show.ejs',{campground});
    }
}));
//EDIT ROAD
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(async(req,res,next)=>{
    let {id}=req.params;
    const campground= await Campground.findById(id);
    if(!campground){
        req.flash('error','ho no this url not exist');
        return res.redirect('/campgrounds');
    }
    return res.render('campgrounds/edit.ejs',{campground});

}));

router.patch('/:id',isLoggedIn,valideCampground,isAuthor, catchAsync(async (req,res,next)=>{
    let {id}=req.params;
    let campground =await Campground.findById(id);
    req.flash('success','ok you have edited campground');
    return res.redirect(`/campgrounds/${campground._id}`);
    
}));

//Delete ROAD
router.delete('/:id',isLoggedIn,isAuthor, catchAsync(async (req,res,next)=>{
    let {id}=req.params;
    let campground =await Campground.findByIdAndDelete(id);
    console.log(campground);
    req.flash('success','Ho yeah campground is delete &#50;')
    return res.redirect(`/campgrounds`);
    // return res.redirect(`/campgrounds/${campground._id}`);
}));

module.exports=router;