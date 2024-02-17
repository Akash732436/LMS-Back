const asynchandler = require("express-async-handler");
const Users = require("../Models/userModel")
const Course = require("../Models/courseModel");
const Category = require("../Models/courseCategoryModel");
const Section = require("../Models/courseSectionModel");
const Lecture = require("../Models/courseLectureModel");
const UserCourse = require("../Models/userCourseModel");
const { SectionDetail, CourseDetail } = require("../Models/courseDetails");
const courseSectionModel = require("../Models/courseSectionModel");






const listUsers = asynchandler(async (req, res) => {
    var list = await Users.find();

    res.json(list);
})

module.exports = { registerUser, loginUser, createCourse, createSection, createLecture, getCourseList, registerStudent, registeredCourses, createdCourses, removeLecture, updateLecture, removeSection, updateSection, updateCourse, removeCourse };