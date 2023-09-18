const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const EWPlant = require('./models/garbageplants');
const session = require('express-session');
const User = require('./models/user');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = "pk.eyJ1IjoidGl0YW5pdW01OTYiLCJhIjoiY2w2bmIwNWxwMHRqOTNqbzcxNWxzN240ZCJ9.zpgHYiL8reD3OPg-t1_TuQ";
const geocoder = mbxGeocoding({accessToken : mapBoxToken});
const twilio = require('twilio');

const twilioClient = twilio('ACbead2ad03c0ac313b250b57a745ce88f', '52c89e2cdd857e16bcfacc9ee50130c5');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const user = require('./models/user');

mongoose.connect('mongodb://localhost:27017/E-Waste-Dump' , {
    useNewUrlParser : true ,
    useUnifiedTopology : true
});

const db = mongoose.connection;
db.on("error" , console.error.bind(console , "connection error"));
db.once("open" , () => {
    console.log("database connected");
})

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({extended : true}));

app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname , 'views'));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly: true, 
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
};
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use('userLocal' , new LocalStrategy(User.authenticate()));
passport.use('ownerLocal' , new LocalStrategy(EWPlant.authenticate()));

passport.serializeUser(User.serializeUser());
passport.serializeUser(EWPlant.serializeUser());

passport.deserializeUser(User.deserializeUser());
passport.deserializeUser(EWPlant.deserializeUser());

app.use((req , res , next) => {
    res.locals.currentUser = req.user;
    next();
})

app.get('/' , (req , res) => {
    res.render('home');
})

app.post('/userdefloc' , async(req,res,next) => {
    const geodata = await geocoder.forwardGeocode({
        query : req.body.location,
        limit : 1
    }).send()
    const latitude = geodata.body.features[0].geometry.coordinates[1];
    const longitude = geodata.body.features[0].geometry.coordinates[0];
    const distance = 15;
    const unitValue = 1000;
    const plants = await EWPlant.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                maxDistance: distance * unitValue,
                distanceField: 'distance',
                distanceMultiplier: 1 / unitValue,
                key: 'Location'
            }
        },
        {
            $project: {
                _id: 1, 
                distance: 1
            }
        },
        {
            $sort: {
                distance: 1
            }
        },
        { $limit: 5 }
    ]);
    const coordinateData = [];
    const nearPlant = [];
    const nearPlantName = [];
    for(i = 0 ; i < plants.length ; i++){
        const tempplant = await EWPlant.findById(plants[i]._id);
        nearPlant.push(tempplant);
        nearPlantName.push(tempplant.Name);
        coordinateData.push(tempplant.Location.coordinates);
    }
    res.render('showNearBy' , {nearPlant : nearPlant ,coordinateData: JSON.stringify(coordinateData) , nearPlantName: JSON.stringify(nearPlantName)  , lat : latitude , lon: longitude});
    
})

app.post('/getCurrLoc' , async(req, res) => {
    const latitude = parseFloat(req.body.latitude);
    const longitude = parseFloat(req.body.longitude);
    const distance = 15;
    const unitValue = 1000;
    const plants = await EWPlant.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                maxDistance: distance * unitValue,
                distanceField: 'distance',
                distanceMultiplier: 1 / unitValue,
                key: 'Location'
            }
        },
        {
            $project: {
                _id: 1, 
                distance: 1
            }
        },
        {
            $sort: {
                distance: 1
            }
        },
        { $limit: 5 }
    ]);
    const coordinateData = [];
    const nearPlant = [];
    const nearPlantName = [];
    for(i = 0 ; i < plants.length ; i++){
        const tempplant = await EWPlant.findById(plants[i]._id);
        nearPlant.push(tempplant);
        nearPlantName.push(tempplant.Name);
        coordinateData.push(tempplant.Location.coordinates);
    }
    res.render('showNearBy' , {nearPlant : nearPlant ,coordinateData: JSON.stringify(coordinateData) , nearPlantName: JSON.stringify(nearPlantName)  , lat : parseFloat(req.body.latitude) , lon: parseFloat(req.body.longitude)});
})

// Plant owner login routes

app.get('/plantownerlogin' , async (req,res) => {
    res.render('plantowners/ownerlogin');
})

app.post('/plantownerlogin' , passport.authenticate('ownerLocal' , {failureRedirect : '/plantownerlogin'}) , async (req,res) => {
    const ownerData = await EWPlant.findOne({username : req.body.username});
    console.log(ownerData);
    res.render("plantowners/dashboard" , {ownerData});
})

app.get('temp' , (req , res) => {
    res.send(req.user);
})

app.get('/plantdata/:id' , async(req , res ) =>{
    const plant = await EWPlant.findById(req.params.id);
    res.render('show' , {plant});
})

//grant creds route

app.post('/grantcreditpoints' , async(req , res) => {
    let user = await User.findOne({username : req.body.username});
    let curcred = parseInt(user.CreditPoints);
    let newcred = curcred + parseInt(req.body.creditpts);
    user.CreditPoints = newcred;
    await user.save();
    const ownerData = await EWPlant.findOne({username : req.body.plantphone});
    res.render('plantowners/dashboard' , {ownerData});
})

//message route

app.post('/confirm-pickup', async (req, res) => {
    try {
      console.log(req.body);
      const userId = await User.findOne({username : req.body.username});
      const user = await User.findById(userId); // Assuming you have a User model
      console.log(user);
  
    //  Send a confirmation SMS
      const message = await twilioClient.messages.create({
        body: `Your e-waste pickup has been confirmed , Scheduled Date ${user.PendingReq[0].date}`,
        from: '+15714021899',
        to: user.Phone, // Replace with the user's actual phone number
      });

      user.PendingReq.splice(0 , 1);
      user.save();

      const ewplant = await EWPlant.findOne({username : req.body.ewphone});
      ewplant.Requests.splice(req.body.index , 1);
      await ewplant.save();
  
      console.log(`SMS sent with SID: ${message.sid}`);
      res.render('plantowners/dashboard' , {ownerData : ewplant});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


//user login registration routes 
//TO-DO place different routes in different folders using express router

app.get('/register' , async(req, res) => {
    res.render('users/register');
})

app.post('/register' , async(req ,res) => {
    const {FirstName , LastName , email , Phone , username , password} = req.body;
    const newuser = new User({FirstName , LastName , email , Phone , username});
    newuser.CreditPoints = "0";
    const registeredUser = await User.register(newuser , password);
    req.login(registeredUser , err => {
        if(err) return next();
        res.redirect('/');
    })   
})

app.get('/login' , (req , res) => {
    res.render('users/login');
});

app.post('/login' , passport.authenticate('userLocal' , {failureRedirect : '/login'}) , (req,res) => {
    res.redirect('/');
})

app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
}); 

app.get('/userdashboard' , (req , res , next) => {
    res.render('users/userdashboard')
})

app.post('/book-slot' , async(req , res , next) => {
    const user = await User.findOne({username : req.body.username});
    const plant = await EWPlant.findOne({username : req.body.plantphone});
    user.PendingReq = {plantName : plant.Name , plantphno : req.body.plantphone , date : req.body.date};
    const ewplant = await EWPlant.findOne({username : req.body.plantphone});
    ewplant.Requests.push({username : req.body.username , date : req.body.date});
    await ewplant.save();
    await user.save();
    res.redirect('/');
})

app.get('/temp' , (req , res) => {
    res.send(req.user);
})

app.listen(3000 , () => {
    console.log('serving on port 3k');
})