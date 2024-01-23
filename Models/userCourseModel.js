const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const User_Course = mongoose.Schema({
    user_id : {
        type : ObjectId
    },
    course_id : {
        type : ObjectId
    },
    course_status: {
        type : String,
        enum : ["Complete", "Incomplete"] 
    }
});

module.exports = mongoose.Schema(User_Course,User_Course);