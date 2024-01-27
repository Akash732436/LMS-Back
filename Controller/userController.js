const asynchandler = require("express-async-handler");
const Users = require("../Models/userModel")
const Course = require("../Models/courseModel");
const Category = require("../Models/courseCategoryModel");
const Section = require("../Models/courseSectionModel");
const Lecture = require("../Models/courseSectionModel");
const { SectionDetail, CourseDetail } = require("../Models/courseDetails");


//@ create a new user
//@ post
//@ access public
const registerUser = asynchandler(async (req, res) => {

    try {
        //fecth data for the requets
        const { userName, firstName, lastName, password, userType } = req.body;
        const user = await Users.create({
            userName,
            firstName,
            lastName,
            password,
            userType
        });

        res.json({ success: "true" });
    }
    catch (Exception) {
        console.log("Error while creating a user: ",Exception);
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }

})


//@ log in a new user
//@ post
//@ access public
const loginUser = asynchandler(async (req, res) => {

    try {
        const { userName, password } = req.body;
        var user = await Users.find({ userName: userName, password: password }).exec();

        res.json({ success: "true", user });
    }
    catch {
        console.log("Error while logging a user ");
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }

})

//@ return list of courses
//@get
//@public
const getCourseList = asynchandler(async (req, res) => {
    try {
        const { pageNO } = req.body;
        const courses = await Course.find();
        const response = []
        for (const course of courses) {
            const categories = await Category.find({ "course_id": courses.id });
            const sections = await Section.find({ "course_id": courses.id });
            const sectionList = []
            for (const section of sections) {
                const lecture = await Lecture.find({ "section_id": section.id })
                const temp = new SectionDetail(section.name, lecture);
                sectionList.push(temp);
            }

            const coureseDetail = new CourseDetail(course, categories, sectionList);
            response.push(coureseDetail);
        }

        res.json({success:"true",response});

    }
    catch {
        console.log("Error while logging a user ");
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }
})


//@registered-courses
//@get
//@public
const registeredCourses = asynchandler(async (req,res)=>{
    try{
        const { student_id ,pageNO } = req.body;
        const courseList = User_Course.find({"user_id":student_id});
        const courses = await Course.find({_id:{$in:courseList}});
        const response = []
        for (const course of courses) {
            
            const categories = await Category.find({ "_id": courses.id });
            const sections = await Section.find({ "course_id": courses.id });
            const sectionList = []
            for (const section of sections) {
                const lecture = await Lecture.find({ "section_id": section.id })
                const temp = new SectionDetail(section.name, lecture);
                sectionList.push(temp);
            }

            const coureseDetail = new CourseDetail(course, categories, sectionList);
            const isCompleted = courseList.find(cr => cr._id == course._id);
            response.push({coureseDetail, status:isCompleted});
        }

        res.json({success:"true",response});
    }
    catch{
        console.log("Error while logging a user ");
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }
});

//@register a student
//@post
//@public
const registerStudent = asynchandler(async (req,res)=>{
    try{
        const user_id = req.params.student_id;
        const course_id = req.params.course_id;

        await User_Course.create(
            student_id,
            course_id,
            "Incomplete"
        );
        res.json({success:"true"});
    }
    catch{
        console.log("Error while logging a user ");
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }
});



//@create a student
//@post
//@public
const createCourse = asynchandler(async (req,res)=>{
    try{
        const user_name = req.params.user_name;
        const user = await Users.find({userName:user_name});
        const user_id = user[0]._id;
        const {courseName ,courseDesc,} = req.body;

        console.log("user id is ",user_id);

        const created =await Course.create({
            courseName,
            courseDesc,
            date_created:Date.now(),
            student_count:0,
            faculty_id:user_id
        });
        res.json({success:"true",created});
    }
    catch(Exception){
        console.log("Error while logging a user ",Exception);
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }
});

const listUsers = asynchandler(async (req, res) => {
    var list = await Users.find();

    res.json(list);
})

module.exports = { registerUser, loginUser, createCourse };