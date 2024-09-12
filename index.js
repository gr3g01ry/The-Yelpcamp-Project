const express=require('express');
const app=express();
const path = require("path");
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const ejsMate = require('ejs-mate');
const Joi = require('joi');

const Campground=require('./models/campground')
const ExpressError=require('./utils/expressError');
const catchAsync=require('./utils/catchAsync');
const campgroundSchema=require('./models/schemas/schemas')

//Connecting to mongoose
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    /*OLD WAY NO MORE NEED */
    // useNewUrlParser:true,
    // useCreateIndex:true,
    // useUnifiedTopology:true
})
.then(()=>{console.log("connected to db with mongoose yelp-camp")})
.catch((e)=>{console.log("error MONGO CONNECTION" +e)});

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connecting error:"));
db.once("open",()=>{
    console.log("and database connected");
});

// MIDDLEWARE express
//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }))
// To parse incoming JSON in POST request body:
//no more need body-parser
app.use(express.json())

// Set EJS as the view engine
app.set("view engine", "ejs");
// Set the views directory
app.set("views", path.join(__dirname, "views"));

//set statics file
app.use(express.static('public'))
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);

//MIDDLEWARE FOR FORM WITH OVERRIDE METHODE
app.use(methodOverride('_method'));

//middleware to JOI validator 
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


const port=3000;

app.get('/',(req,res)=>{
    res.render('home.ejs')
});

app.get('/campgrounds',async (req,res)=>{
    const campgrounds= await Campground.find();
    res.render('campgrounds/index.ejs',{campgrounds});
});

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new.ejs')
})
app.post('/campgrounds',valideCampground, catchAsync(async (req,res,next)=>{
    // let {campground}=req.body;
    //too basic security
    // if(!req.body.campground)throw new ExpressError('Invalid, Missing data',422)
    //better option use JOI package
        let campground=new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
}));

app.get('/campgrounds/:id',catchAsync(async (req,res,next)=>{
    // console.log('campground id');
    // console.log(req.params);
    let {id}= req.params;
    console.log(id);
    const campground= await Campground.findById(id);
    res.render('campgrounds/show.ejs',{campground});
}));
//EDIT ROAD
app.get('/campgrounds/:id/edit',catchAsync(async(req,res,next)=>{
    let {id}=req.params;
    const campground= await Campground.findById(id);
    res.render('campgrounds/edit.ejs',{campground});
}));
app.patch('/campgrounds/:id',valideCampground, catchAsync(async (req,res,next)=>{
    let {id}=req.params;
    let campground= await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id',catchAsync(async (req,res,next)=>{
    let {id}=req.params;
    let campground= await Campground.findByIdAndDelete(id);
    console.log(campground);
    res.redirect(`/campgrounds`);
}));


app.get('/error',(req,res)=>{
    res.render('error.ejs');
})

// app.get('/makeCampground',async (req,res)=>{
//     let camp= new Campground({title:"garden",description:"cheap camping"});
//     await camp.save();
//     res.send(camp)
//     // res.render('home.ejs')
// })


// //Route par default always in the end /*Better way after */
// app.get('*', function (req, res) {
//     console.log( req.params);
//     res.send(`<h1>What the fuck is this url</h1>`)
// })
//Error handler from extends class Error to add before general error handler
//app.all is used for all method road
app.all('*',(req,res,next)=>{
    next(new ExpressError('Page no found',404))
})

//Error handler from express
app.use((err,req,res,next)=>{
    console.log(err.name)
    const { status = 500, message = 'Something Went Wrong , we are lost'} = err;
    console.log(message);
    // res.status(status).send(message+'<br>'+status)
    // res.send('Something Went Wrong , we are lost')
    res.status(status).render('error.ejs',{err})
})



app.listen(port,()=>{
    try{
    console.log('okay listening port '+ port)
    }catch(e){
        console.log(e);
    }       
})
