require('dotenv').config();

if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
    console.log("developpement")
}
//use node production with Node== "NODE_ENV=production node index.js"
//else process.env.node_env=developpement
// console.log(process.env.NODE_ENV)

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
const mongoSanitize = require('express-mongo-sanitize');
const helmet=require('helmet');
// const session = require('express-session');
const MongoStore = require('connect-mongo');

const ExpressError=require('./utils/expressError');

//roads
const campgroundsRoad = require('./routes/campgrounds');
const reviewsRoad=require('./routes/reviews');
const usersRoad=require('./routes/user')

const User = require('./models/user');

//Connecting to mongoose
mongoose.set('strictQuery', true);
//We connect our db on a cloud database
//'mongodb://localhost:27017/yelp-camp'
const dbUrl=process.env.DB_URL
// const dbUrl='mongodb://localhost:27017/yelp-camp'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.sotoreCryptoSecret//process.env.crypto_secret
    }
});
store.on("error",function(e){
    console.log("Session store error" +e);
})

mongoose.connect(dbUrl,{
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
    store:store, 
    name:'session_cookie',
    secret: process.env.sessionOptionsSecret, 
    resave: false, 
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        // secure:true, //only use on server secure
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

// To remove data using these defaults:
app.use(mongoSanitize({
    replaceWith: '_',
  }));

//To use helmet security
//automaticly activate all middleware from helmet
// app.use(helmet());//block all external link and src
// app.use(helmet({contentSecurityPolicy:false}));//to display external source , add corssorigin="anonymous" on external link
app.use(helmet());
//now we params content security
const scriptSrcUrls = [
    // "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    // "https://events.mapbox.com/",

];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    // "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [
    "https://cdn.jsdelivr.net/",
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/student-node/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use((req, res, next) => {
    console.log(req.query)
    // console.log(req.user);
    // console.log(req.session);
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
app.get('*', function (req, res) {
    console.log( req.params);
    res.send(`<h1>What the fuck is this url</h1>`)
})

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
