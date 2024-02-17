const asynchandler = require("express-async-handler");
const Users = require("../Models/userModel");
const Course = require("../Models/courseModel");
const Section = require("../Models/courseSectionModel");
const Lecture = require("../Models/courseLectureModel");


//@create lecture
//@post
//@public
const createLecture = asynchandler(async (req, res) => {
    try {
        const user_name = req.params.user_name;
        const user = await Users.find({ userName: user_name });
        const user_id = user[0]._id;
        const course_name = req.params.course_name;
        const course = await Course.find({ faculty_id: user_id, courseName: course_name });
        const course_id = course[0]._id;
        const section_name = req.params.section_name;
        const section = await Section.find({ course_id: course_id, name: section_name });
        const section_id = section[0]._id;
        const { lecture_name, notes } = req.body;

        await Lecture.create({
            name: lecture_name,
            notes: notes,
            section_id: section_id
        });
        res.json({ success: "true" });
    }
    catch (Exception) {
        console.log("Error while logging a user ", Exception);
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }
});

//@update lecture
//@put
//@public
const updateLecture = asynchandler(async (req, res) => {
    try {
        const user_name = req.params.user_name;
        const user = await Users.find({ userName: user_name });
        const user_id = user[0]._id;
        const course_name = req.params.course_name;
        const course = await Course.find({ faculty_id: user_id, courseName: course_name });
        const course_id = course[0]._id;
        const section_name = req.params.section_name;
        const section = await Section.find({ course_id: course_id, name: section_name });
        const section_id = section[0]._id;
        const { lectureName, oldLectureName, notes } = req.body;
        const lecture = await Lecture.find({ name: oldLectureName });
        const lecture_id = lecture[0]._id;

        lecture.name = lectureName;
        lecture.notes = notes;
        await Lecture.findByIdAndUpdate(lecture_id,{name:lectureName,notes:notes},{new:true});
        //await lecture.save();
        res.json({ success: "true" });
    }
    catch (Exception) {
        console.log("Error while logging a user ", Exception);
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }
});

//@remove lecture
//@delete
//@public
const removeLecture = asynchandler(async (req, res) => {
    try {
        const user_name = req.params.user_name;
        const user = await Users.find({ userName: user_name });
        const user_id = user[0]._id;
        const course_name = req.params.course_name;
        const course = await Course.find({ faculty_id: user_id, courseName: course_name });
        const course_id = course[0]._id;
        const section_name = req.params.section_name;
        const section = await Section.find({ course_id: course_id, name: section_name });
        const section_id = section[0]._id;
        const { lectureName } = req.body;
        const result = await Lecture.deleteOne({ name: lectureName, section_id: section_id });

        if (result.deletedCount > 0) {
            console.log('Lecture removed successfully');
        } else {
            console.log('Lecture not found or no records deleted');
        }
        res.json({ success: "true" });
    }
    catch (Exception) {
        console.log("Error while logging a user ", Exception);
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }
});


module.exports = {createLecture, updateLecture, removeLecture};