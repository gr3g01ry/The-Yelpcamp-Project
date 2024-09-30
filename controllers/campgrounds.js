const Campground=require('../models/campground');


module.exports.index=async (req,res)=>{
    // console.log('campgroundIndex')
    const campgrounds= await Campground.find();
    res.render('campgrounds/index.ejs',{campgrounds});
}

module.exports.renderNewForm=(req,res)=>{
    res.render('campgrounds/new');
}

module.exports.createCampground=async (req,res,next)=>{
    let campground=new Campground(req.body.campground);
    campground.author=req.user._id;
    await campground.save();
    req.flash('success','CONGRADULATION you have add a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground=async (req,res,next)=>{
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
}

module.exports.editCampground=async(req,res,next)=>{
    let {id}=req.params;
    const campground= await Campground.findById(id);
    if(!campground){
        req.flash('error','ho no this url not exist');
        return res.redirect('/campgrounds');
    }
    return res.render('campgrounds/edit.ejs',{campground});

}

module.exports.updateCampground=async (req,res,next)=>{
    let {id}=req.params;
    let campground =await Campground.findById(id);
    req.flash('success','ok you have edited campground');
    return res.redirect(`/campgrounds/${campground._id}`);
    
}

module.exports.deleteCampground=async (req,res,next)=>{
    let {id}=req.params;
    let campground =await Campground.findByIdAndDelete(id);
    console.log(campground);
    req.flash('success','Ho yeah campground is delete &#50;')
    return res.redirect(`/campgrounds`);
    // return res.redirect(`/campgrounds/${campground._id}`);
}
