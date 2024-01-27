const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const CourseCategory = mongoose.Schema({
    course_id : {
        type:ObjectId,
        require : [true,""]
    },
    category : {
        type: String,
        require : [true,""]
    }
});

module.exports = mongoose.model("CourseCategory",CourseCategory);