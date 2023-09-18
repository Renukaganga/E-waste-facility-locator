const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const EwastePlantSchema = new Schema({
    Name : String,
    Address : String,
    Street : String,
    Municipality : String,
    Categories : String,
    Phone : String,
    Location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    Password : String,
    Reviews: [{username : String ,
                reviewtext : String}],
    Requests: [
        {
            username : String,
            date : String
        }
    ]
})


EwastePlantSchema.index({Location: "2dsphere"});
EwastePlantSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('EwastePlant' , EwastePlantSchema);