const Campground=require('../models/campground');
const{cloudinary}=require('../cloudinary');
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken=process.env.MAPBOX_TOKEN
const geocoder=mbxGeocoding({accessToken:mapboxToken})

module.exports.index=async (req,res)=>{
    // console.log('campgroundIndex')
    const campgrounds= await Campground.find();
    res.render('campgrounds/index.ejs',{campgrounds});
}

module.exports.renderNewForm=(req,res)=>{
    res.render('campgrounds/new');
}

module.exports.createCampground=async (req,res,next)=>{
    // console.log(req.files);
    let getData=await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
      })
      .send()
    //   .then(resp=>resp)
    //   console.log(getData);
    // res.send(getData.body.features[0].geometry.coordinates);
    let campground=new Campground(req.body.campground);
    campground.geometry=getData.body.features[0].geometry;
    if(!campground.geometry){
        req.flash('error','Not a valid address');
        return res.redirect('/campgrounds/new')
    }
    campground.images=req.files.map(elt=>({url:elt.path, filename:elt.filename}))
    campground.author=req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success','CONGRADULATION you have add a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
    // res.send('ok guy')
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
    console.log(req.body);
    //Deleting where campground.deleteImage is true
    console.log(req.body.deleteImages)
    let campground =await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const imgs=req.files.map(elt=>({url:elt.path, filename:elt.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
        // console.log('******************************')
        // console.log(campground);
    }
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
