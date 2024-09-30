const Campground=require('../models/campground');
const Review=require('../models/reviews')


module.exports.postReview=async(req,res)=>{
    let {id}=req.params;
    // console.log(req.params)//is empty where is the id??
    //Must setting expressRouter({mergeParams:true}); to keep params in url
    let campground= await Campground.findById(id);
    const review=new Review(req.body.review)
    review.author=req.user._id;
    campground.reviews.push(review);
    // console.log(campground);
    await review.save();
    await campground.save();
    req.flash('success','Review Added successfully')
    res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.deleteReview=async (req,res,next)=>{
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
}