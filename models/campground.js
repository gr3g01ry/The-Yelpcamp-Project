const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require('./reviews');

const ImageSchema=new Schema({
    url:String,
    filename:String
})
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_150/h_150/r_25')
});

ImageSchema.virtual('showCarousel').get(function(){
    return this.url.replace('/upload','/upload/h_400')
})

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema=new Schema({
    title:String,
    images:[ImageSchema],
    price:Number,
    description:String,
    location:String,
    geometry:{
       type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }],
},opts);

CampgroundSchema.post('findOneAndDelete',async (doc)=>{
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
    console.log('you are in campgroundSchema post middleware');
    console.log(doc);
    console.log('deleted');
})

CampgroundSchema.virtual('properties.popupMarker').get(function(){
    return `
    <b><a href="/campgrounds/${this._id}">${this.title.substring(0,15)}...</a></b>
    <p>${this.description.slice(0,20)+"..."}(</p>
    
    `
})

module.exports=mongoose.model('Campground',CampgroundSchema);