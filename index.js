const express=require('express');
const app=express();
const path = require("path");
const mongoose=require('mongoose');
const methodOverride=require('method-override');

const Campground=require('./models/campground')


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

//MIDDLEWARE FOR FORM WITH OVERRIDE METHODE
app.use(methodOverride('_method'));

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
app.post('/campgrounds',async (req,res)=>{
    // let {campground}=req.body;
    let campground=new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})

app.get('/campgrounds/:id',async (req,res)=>{
    let id=req.params.id;
    // console.log(id);
    const campground= await Campground.findById(id);
    res.render('campgrounds/show.ejs',{campground});
});
//EDIT ROAD
app.get('/campgrounds/:id/edit',async(req,res)=>{
    let {id}=req.params;
    const campground= await Campground.findById(id);
    res.render('campgrounds/edit.ejs',{campground});
})
app.patch('/campgrounds/:id',async (req,res)=>{
    let {id}=req.params;
    let campground= await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
})

app.delete('/campgrounds/:id',async (req,res)=>{
    let {id}=req.params;
    let campground= await Campground.findByIdAndDelete(id);
    console.log(campground);
    res.redirect(`/campgrounds`);
})


// app.get('/makeCampground',async (req,res)=>{
//     let camp= new Campground({title:"garden",description:"cheap camping"});
//     await camp.save();
//     res.send(camp)
//     // res.render('home.ejs')
// })


//Route par default always in the end
app.get('*', function (req, res) {
    console.log( req.params);
    res.send(`<h1>What the fuck is this url</h1>`)
})

app.listen(port,()=>{
    try{
    console.log('okay listening port '+ port)
    }catch(e){
        console.log(e);
    }       
})
