const express = require('express');
const router = express.Router({mergeParams:true});
// const flash = require('connect-flash');
const multer  = require('multer');
const{storage,cloudinary}=require('../cloudinary');
const upload = multer({ storage })

const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/expressError');
const {isLoggedIn, isAuthor, valideCampground}=require('../middleware');

const Campground=require('../models/campground');
const Review=require('../models/reviews');

const {campgroundSchema,reviewSchema}=require('../models/schemas/schemas')

const campgrounds=require('../controllers/campgrounds');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(
        isLoggedIn,
        upload.array('image'),
        valideCampground, 
        catchAsync(campgrounds.createCampground));
        
router.get('/new',isLoggedIn,campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .patch(
        isLoggedIn,
        isAuthor, 
        upload.array('image'),
        valideCampground,
        catchAsync(campgrounds.updateCampground))
    .delete(
        isLoggedIn,
        isAuthor, 
        catchAsync(campgrounds.deleteCampground));

// router.get('/',catchAsync(campgrounds.index));


// router.post('/',isLoggedIn,valideCampground, catchAsync(campgrounds.createCampground));

// router.get('/:id',catchAsync(campgrounds.showCampground));

//EDIT ROAD
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.editCampground));

// router.patch('/:id',isLoggedIn,valideCampground,isAuthor, catchAsync(campgrounds.updateCampground));

//Delete ROAD
// router.delete('/:id',isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports=router;