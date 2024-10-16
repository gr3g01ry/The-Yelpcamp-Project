const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.cloudinaryCloudName,
    api_key:process.env.cloudinaryApiKey,
    api_secret:process.env.cloudinaryApiSecret,
    secure:true,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'YelpCamp2.0',
        allowedFormats:['jpeg','png','jpg'],
    }
})

cloudinary.api.root_folders('yelptest').then((rep)=>{
    console.log(rep)
})
module.exports={storage,cloudinary};