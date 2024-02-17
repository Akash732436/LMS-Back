const asynchandler = require("express-async-handler");
const Users = require("../Models/userModel");
const Course = require("../Models/courseModel");
const Section = require("../Models/courseSectionModel");
const Lecture = require("../Models/courseLectureModel");

//@create section for a lecture
//@post
//@public
const createSection = asynchandler(async (req, res) => {
    try {
        const user_name = req.params.user_name;
        const user = await Users.find({ userName: user_name });
        console.log("user id is ", req.params.user_name);
        const user_id = user[0]._id;
        
        const course_name = req.params.course_name;
        const { section_name } = req.body;
        console.log("course name is ", course_name);
        const course = await Course.find({ courseName: course_name, faculty_id: user_id });
        console.log("courses: ", course);
        const course_id = course[0]._id;

        await Section.create({
            name: section_name,
            course_id: course_id
        });

        res.json({ success: "true" });
    }
    catch (Exception) {
        console.log("Error while logging a user ", Exception);
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }
});

//@create section for a lecture
//@update
//@public
const updateSection = asynchandler(async (req, res) => {
    try {
        const user_name = req.params.user_name;
        const user = await Users.find({ userName: user_name });
        const user_id = user[0]._id;
        console.log("user id is ", user_id);
        const course_name = req.params.course_name;
        const { oldSection_name, newSection_name } = req.body;
        console.log("course name is ", course_name);
        const course = await Course.find({ courseName: course_name, faculty_id: user_id });
        console.log("courses: ", course);
        const course_id = course[0]._id;

        const section = await Section.find({name:oldSection_name, course_id:course_id});
        const section_id = section[0]._id;
        console.log("section is ",section);
        section[0].name = newSection_name;
        await Section.findByIdAndUpdate(section_id,{name:section[0].name},{new:true});
        //await section.save();
        

        res.json({ success: "true" });
    }
    catch (Exception) {
        console.log("Error while logging a user ", Exception);
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }
});

//@remove section for a lecture
//@delete
//@public
const removeSection = asynchandler(async (req, res) => {
    try {
        const user_name = req.params.user_name;
        const user = await Users.find({ userName: user_name });
        const user_id = user[0]._id;
        console.log("user id is ", user_id);
        const course_name = req.params.course_name;
        const { section_name } = req.body;
        console.log("course name is ", course_name);
        const course = await Course.find({ courseName: course_name, faculty_id: user_id });
        console.log("courses: ", course);
        const course_id = course[0]._id;

        const section = await Section.find({name:section_name, course_id:course_id});
        const section_id = section[0]._id;

        const lectures = await Lecture.find({section_id : section_id});

        for(const lecture of lectures){
            await Lecture.deleteOne({_id : lecture._id});
        }

        await Section.deleteOne({_id : section_id});

        res.json({ success: "true" });
    }
    catch (Exception) {
        console.log("Error while logging a user ", Exception);
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }
});

module.exports = {createSection, updateSection, removeSection};