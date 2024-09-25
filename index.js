const express=require('express');
const app=express();
const path = require("path");
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const session=require('express-session');
const flash = require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');

const ExpressError=require('./utils/expressError');

//roads
const campgroundsRoad = require('./routes/campgrounds');
const reviewsRoad=require('./routes/reviews');
const usersRoad=require('./routes/user')

const User = require('./models/user');

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

//Session configuration
const sessionOptions = { 
    name:'session_cookie',
    secret: 'ILoveToLove', 
    resave: false, 
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
    } 
}
//App use session() must be before passeport.session()
app.use(session(sessionOptions));

//flash MIDDLEWARE
app.use(flash());

//passeport
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    // console.log(req.user);
    console.log(req.session);
    res.locals.currentUser=req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



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

// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);

//set statics file (css,js,images)
app.use(express.static(path.join(__dirname,'publics')));
// app.use(express.static('publics'))

//MIDDLEWARE FOR FORM WITH OVERRIDE METHODE
app.use(methodOverride('_method'));


//for express road
app.use('/campgrounds', campgroundsRoad);
app.use('/campgrounds/:id/reviews',reviewsRoad);
// express road register
app.use('/',usersRoad);



const port=3000;

app.get('/',(req,res)=>{
    res.render('home.ejs')
});

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
// app.all('*',(req,res,next)=>{
//     next(new ExpressError('Page no found',404))
// })

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
