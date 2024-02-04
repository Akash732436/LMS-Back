const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const CourseLecture = mongoose.Schema({
    name : {
        type : String,
    },
    notes : {
        type : String,
    },
    section_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourseSection',
    }
});

module.exports = mongoose.model("CourseLecture",CourseLecture);