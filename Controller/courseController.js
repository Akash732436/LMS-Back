const asynchandler = require("express-async-handler");
const Users = require("../Models/userModel")
const Course = require("../Models/courseModel");
const Category = require("../Models/courseCategoryModel");
const Section = require("../Models/courseSectionModel");
const Lecture = require("../Models/courseLectureModel");
const { SectionDetail, CourseDetail } = require("../Models/courseDetails");

//@create a course
//@post
//@public
const createCourse = asynchandler(async (req, res) => {
    try {
        const user_name = req.params.user_name;
        const user = await Users.find({ userName: user_name });
        const user_id = user[0]._id;
        const { courseName, courseDesc, categories } = req.body;

        console.log("user id is ", user_id);

        const created = await Course.create({
            courseName,
            courseDesc,
            date_created: Date.now(),
            student_count: 0,
            faculty_id: user_id
        });

        for (const cat of categories) {
            await Category.create({
                course_id: created._id,
                category: cat
            })
        }

        res.json({ success: "true", created });
    }
    catch (Exception) {
        console.log("Error while logging a user ", Exception);
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }
});

//@update a course
//@post
//@public
const updateCourse = asynchandler(async (req, res) => {
    try {
        const user_name = req.params.user_name;
        const user = await Users.find({ userName: user_name });
        const user_id = user[0]._id;
        const { courseOldName,courseNewName, courseDesc } = req.body;

        console.log("user id is ", user_id);

        const course = await Course.find({faculty_id : user_id, courseName : courseOldName});

        course.courseName = courseNewName;
        course.courseDesc = courseDesc;
        await Course.findByIdAndUpdate(course[0]._id,{courseName:courseNewName,courseDesc:courseDesc},{new:true});
        //await course.save();

        res.json({ success: "true" });
    }
    catch (Exception) {
        console.log("Error while logging a user ", Exception);
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }
});

//@ remove a course
//@delete
//@public
const removeCourse = asynchandler(async (req, res) => {
    try {
        const user_name = req.params.user_name;
        const user = await Users.find({ userName: user_name });
        const user_id = user[0]._id;
        const { courseName } = req.body;

        const course = await Course.find({faculty_id : user_id, courseName : courseName});
        
        const sections = await Section.find({course_id : course[0]._id});

        const categories = await Category.find({course_id : course[0]._id});

        for(const section of sections ){
            const lectures = await Lecture.find({section_id:section._id});

            for(const lecture of lectures){
                await Lecture.deleteOne({_id : lecture._id});
            }

            await Section.deleteOne({_id : section._id});
        }
       for(const cat of categories){
        await Category.deleteOne({_id:cat._id});
       }
        await Course.deleteOne({_id : course[0]._id});
        
        res.json({ success: "true" });

    }
    catch (Exception) {
        console.log("Error while logging a user ", Exception);
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
            const categories = await Category.find({ course_id: course._id });
            const sections = await Section.find({ course_id: course._id });
            const sectionList = []
            for (const section of sections) {
                const lecture = await Lecture.find({ section_id: section._id })
                const temp = new SectionDetail(section.name, lecture);
                sectionList.push(temp);
            }

            const coureseDetail = new CourseDetail(course, categories, sectionList);
            response.push(coureseDetail);
        }

        res.json({ success: "true", response });

    }
    catch(err) {
        console.log("Error while logging a user ", err);
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }
})


//@registered-courses
//@get
//@public
const registeredCourses = asynchandler(async (req, res) => {
    try {
        const user_name = req.params.user_name;
        const user = await Users.find({ userName: user_name });
        const user_id = user[0]._id;
        console.log("user name is: ", user_id);

        const courseList = await UserCourse.find({ user_id: user_id });
        console.log("course list is: ", courseList);
        const courseIds = courseList.map(entry => entry.course_id);
        const courses = await Course.find({ _id: { $in: courseIds } });
        console.log("courses: ", courses);
        const response = []
        for (const course of courses) {

            const categories = await Category.find({ course_id: course._id });
            const sections = await Section.find({ course_id: course._id });
            const sectionList = []
            for (const section of sections) {
                const lecture = await Lecture.find({ section_id: section._id })
                const temp = new SectionDetail(section.name, lecture);
                sectionList.push(temp);
            }

            const coureseDetail = new CourseDetail(course, categories, sectionList);
            const isCompleted = courseList.find(cr => cr.course_id.equals(course._id));
            response.push({ coureseDetail, status: isCompleted.course_status });
        }

        res.json({ success: "true", response });
    }
    catch (Exception) {
        console.log("Error while logging a user ", Exception);
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }
});

//@register a student
//@post
//@public
const registerStudent = asynchandler(async (req, res) => {
    try {
        const user_name = req.params.user_name;
        const { course_name, faculty_name } = req.body;
        const user = await Users.find({ userName: user_name });
        const user_id = user[0]._id;

        const faculty = await Users.find({ userName: faculty_name });
        const faculty_id = faculty[0]._id;
        const course = await Course.find({ courseName: course_name, faculty_id: faculty_id });
        console.log("courses: ", course);

        const course_id = course[0]._id;
        await UserCourse.create({
            user_id: user_id,
            course_id: course_id,
            course_status: "Incomplete"
        }
        );
        res.json({ success: "true" });
    }
    catch (Exception) {
        console.log("Error while logging a user ", Exception);
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }
});

//@created-courses
//@get
//@public
const createdCourses = asynchandler(async (req, res) => {
    try {
        const user_name = req.params.user_name;
        const user = await Users.find({ userName: user_name });
        const user_id = user[0]._id;
        console.log("user name is: ", user_id);

        const courses = await Course.find({ faculty_id: user_id });
        console.log("course list is: ", courses);
        //const courseIds = courseList.map(entry => entry.course_id);
        //const courses = await Course.find({ _id: { $in: courseIds } });
        console.log("courses: ", courses);
        const response = []
        for (const course of courses) {

            const categories = await Category.find({ course_id: course._id });
            const sections = await Section.find({ course_id: course._id });
            const sectionList = []
            for (const section of sections) {
                const lecture = await Lecture.find({ section_id: section._id })
                const temp = new SectionDetail(section.name, lecture);
                sectionList.push(temp);
            }

            const coureseDetail = new CourseDetail(course, categories, sectionList);
            response.push({ coureseDetail });
        }

        res.json({ success: "true", response });
    }
    catch (Exception) {
        console.log("Error while logging a user ", Exception);
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }
});

module.exports = {createCourse, updateCourse, removeCourse, registerStudent, registeredCourses, createdCourses, getCourseList};