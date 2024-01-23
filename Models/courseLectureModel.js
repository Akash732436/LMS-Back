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
        type : ObjectId
    }
});

module.exports = mongoose.model(CourseLecture,CourseLecture);