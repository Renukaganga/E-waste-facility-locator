const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    FirstName : {
        type: String,
        required: true
    },
    CreditPoints : String,
    LastName : String,
    Phone : String,
    PendingReq : [{
        plantName : String,
        plantphno : String,
        date : String,
    }],
    Successful : [
        {
            plantName : String , 
            creditPoints : String,
            cash : String
        }
    ],
    email: {
        type: String,
        required : true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User' , UserSchema);