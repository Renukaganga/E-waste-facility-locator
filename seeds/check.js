const mongoose = require('mongoose');
const EWPlant = require('../models/garbageplants');

mongoose.connect('mongodb://localhost:27017/E-Waste-Dump' , {
    useNewUrlParser : true ,
    useUnifiedTopology : true
});

const latitude = 28.6523392;
const longitude = 77.1588096;
const distance = 15;
const unitValue = 1000;

const nearestLoc = async () => {
    const users = await EWPlant.aggregate([
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
    console.log(users);
}

nearestLoc();



