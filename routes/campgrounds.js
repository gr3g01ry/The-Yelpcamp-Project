const express = require('express');
const router = express.Router({mergeParams:true});
// const flash = require('connect-flash');

const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/expressError');
const {isLoggedIn, isAuthor, valideCampground}=require('../middleware');

const Campground=require('../models/campground');
const Review=require('../models/reviews');

const {campgroundSchema,reviewSchema}=require('../models/schemas/schemas')

const campgrounds=require('../controllers/campgrounds');




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

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(
        isLoggedIn,
        valideCampground, 
        catchAsync(campgrounds.createCampground));

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .patch(
        isLoggedIn,
        valideCampground,
        isAuthor, 
        catchAsync(campgrounds.updateCampground))
    .delete(
        isLoggedIn,
        isAuthor, 
        catchAsync(campgrounds.deleteCampground));

// router.get('/',catchAsync(campgrounds.index));

router.get('/new',isLoggedIn,campgrounds.renderNewForm)

// router.post('/',isLoggedIn,valideCampground, catchAsync(campgrounds.createCampground));

// router.get('/:id',catchAsync(campgrounds.showCampground));

//EDIT ROAD
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.editCampground));

// router.patch('/:id',isLoggedIn,valideCampground,isAuthor, catchAsync(campgrounds.updateCampground));

//Delete ROAD
// router.delete('/:id',isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports=router;