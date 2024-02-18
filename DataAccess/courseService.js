const Course = require("../Models/courseModel");


const createCourse = async (courseName, courseDesc, userId) => {
    try {
        const course = await Course.create({
            courseName,
            courseDesc,
            date_created: Date.now(),
            student_count: 0,
            faculty_id: userId
        });

        return course;
    }
    catch (Err) {
        console.log("Error while creating a course: ", Err);
        return null;
    }
}

const removeCourse= async (courseId) => {
    try {
        const course = await Course.deleteOne({_id : courseId});

        return course;
    }
    catch (Err) {
        console.log("Error while removing a course: ", Err);
        return null;
    }
}

const updateCourse = async (courseId, courseName, courseDesc) =>{
    try {
        const course = await Course.findByIdAndUpdate(courseId,{courseName:courseName,courseDesc:courseDesc},{new:true});

        return course;
    }
    catch (Err) {
        console.log("Error while updating a course: ", Err);
        return null;
    }
}

const findCourse = async (userId, courseName) => {
    try {
        const course = await Course.find({faculty_id : userId, courseName : courseName});

        return course[0];
    }
    catch (Err) {
        console.log("Error while retierving course detail: ", Err);
        return null;
    }
}

module.exports = {createCourse, removeCourse, updateCourse, findCourse};