const {campgroundSchema,reviewSchema}=require('./models/schemas/schemas');
const ExpressError=require('./utils/expressError');
const Campground=require('./models/campground');
const Review=require('./models/reviews')




const isLoggedIn=(req,res,next)=>{
    console.log('start test logged in************************');
    // console.log(`req.user = ${req.user}`);
    // console.log(req.path, req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','YOU MUST BE LOGGED FIRST');
        return res.redirect('/login');
    }
    console.log('End test logged in************************');
    next();
}

const valideCampground=(req,res,next)=>{
    console.log('start test ValidCamp************************');
    console.log(req.body)
    const {error}=campgroundSchema.validate(req.body);
    // console.log(resultJoi);
    if(error){
        const msg=error.details.map(el=>el.message).join('-');
        // throw new ExpressError(resultJoi.error.details,400)
        throw new ExpressError(msg,400)
    }else{
        console.log('End test ValidCamp************************');
        next();
    }
}

const isAuthor=async (req,res,next)=>{
    console.log('start test isAuthor************************');
    let {id}=req.params;
    let campground =await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You are not the yelpcamp\'s owner');
        return res.redirect(`/campgrounds/${id}`);
    }
    console.log('End test isAuthor************************');
    next();
}


const validateReview=(req,res,next)=>{
    console.log('start test ValidReview************************');
    console.log(req.body)
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join('-');
        throw new ExpressError(msg,400)
    }else{
        console.log('End Test ValidReview************************');
        next();
    }
};

const isReviewAuthor=async (req,res,next)=>{
    console.log('start test isReviewAuthor************************');
    let {id,reviewId}=req.params;
    let review =await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You are not the yelpcamp\'s owner');
        return res.redirect(`/campgrounds/${id}`);
    }
    console.log('End test isReviewAuthor************************');
    next();
}


//or module.exports.validecCampground=(req,res,next)=>{Instruction}
module.exports={isLoggedIn, valideCampground,isAuthor,validateReview,isReviewAuthor};