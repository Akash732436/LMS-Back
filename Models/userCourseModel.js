const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const UserCourse = mongoose.Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    course_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    course_status: {
        type : String,
        enum : ["Complete", "Incomplete"] 
    }
});

module.exports = mongoose.model("UserCourse",UserCourse);