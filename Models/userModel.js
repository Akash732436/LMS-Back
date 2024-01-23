const mongoose = require("mongoose");


const Users = mongoose.Schema({
    userName:{
        type:String,
        required:[true,""],
        unique: [true,""]
    },
    firstName:{
        type:String,
        required:[true,""]
    },
    lastName:{
        type:String,
        required:[true,""]
    },
    password:{
        type:String,
        required: [true,""]
    },
    userType:{
        type:String,
        enum:['student', 'faculty', 'admin'],
        required: [true, ""]
    }
});


module.exports = mongoose.model("Users", Users);