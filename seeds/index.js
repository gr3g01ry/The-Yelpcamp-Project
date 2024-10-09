const mongoose=require('mongoose');
const Campground=require('../models/campground.js')
const cities=require('./cities.js');
const {descriptors,places}=require ('./seedHelpers.js')

//Connecting to mongoose
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(()=>{console.log("connected to db with mongoose yelp-camp")})
.catch((e)=>{console.log("error MONGO CONNECTION" +e)});

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connecting error:"));
db.once("open",()=>{
    console.log("and database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    // const campFind=Campground.find({});
    // console.log(campFind);
    for (let i = 0; i < 20; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author:'66f3307bf743e8835d4e052a',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price:(Math.random()*100+30).toFixed(2),
            geometry:{
              type:"Point",
              coordinates:[-113.1331,47.0202]
            },
            images:[
                {
                  url: 'https://res.cloudinary.com/student-node/image/upload/v1728065662/YelpCamp2.0/xusaalq3ylh6hlrobhxn.jpg',
                  filename: 'YelpCamp2.0/xusaalq3ylh6hlrobhxn',
                },
                {
                  url: 'https://res.cloudinary.com/student-node/image/upload/v1728065664/YelpCamp2.0/ijwmlbodrtm6pnrwjwb9.jpg',
                  filename: 'YelpCamp2.0/ijwmlbodrtm6pnrwjwb9',
                },
                {
                  url: 'https://res.cloudinary.com/student-node/image/upload/v1728065664/YelpCamp2.0/zrwjpdtg78kaihi5haue.jpg',
                  filename: 'YelpCamp2.0/zrwjpdtg78kaihi5haue',
                }
              ],
            // images:`https://picsum.photos/400?random=${Math.random()}`,
            // // image:'https://api.api-ninjas.com/v1/randomimage?category=nature',
            description:'Je suis la description XDXXDXDXDXDXDXDXDXDDXDXDXDX'
        });
        await camp.save()
        .then( res=>console.log(res))
        .catch(e=>console.log('error save'+e));;
    }
    // const c=new Campground({title:'my bed',price:'50',description:'soft'});
    // await c.save();
}

seedDB().then(() => {
    mongoose.connection.close();
    console.log("database disconnected");
})