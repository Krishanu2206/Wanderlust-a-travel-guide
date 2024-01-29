const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userschema=new Schema({
    email:{
        type:String,
        required:true,
    }
});

//You're free to define your User how you like. Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value

userschema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userschema);