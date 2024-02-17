const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const CourseSection = mongoose.Schema({
    name : {
        type : String,
    },
    course_id : {
        type : ObjectId
    }
});

module.exports = mongoose.model("CourseSection",CourseSection);