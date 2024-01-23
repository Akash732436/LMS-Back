const { ObjectId, Int32 } = require("mongodb");
const mongoose = require("mongoose");

const Course = mongoose.Schema({
    courseName : {
        type:String,
        require:[true,""]
    },
    courseDesc : {
        type:String,
        require:[true,""]
    },
    date_created : {
        type:Date,
        require:[true,""]
    },
    student_count : {
        type:Number,
        require:[true,""]
    },
    faculty_id : {
        type:ObjectId,
        require:[true,""]
    }
})

module.exports = mongoose.model(Course,Course);