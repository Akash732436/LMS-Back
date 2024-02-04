const asynchandler = require("express-async-handler");
const Users = require("../Models/userModel")
const Course = require("../Models/courseModel");
const Category = require("../Models/courseCategoryModel");
const Section = require("../Models/courseSectionModel");
const Lecture = require("../Models/courseLectureModel");
const UserCourse = require("../Models/userCourseModel");
const { SectionDetail, CourseDetail } = require("../Models/courseDetails");
const courseSectionModel = require("../Models/courseSectionModel");


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
        console.log("Error while creating a user: ", Exception);
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
    catch {
        console.log("Error while logging a user ");
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



//@create section for a lecture
//@post
//@public
const createSection = asynchandler(async (req, res) => {
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

const listUsers = asynchandler(async (req, res) => {
    var list = await Users.find();

    res.json(list);
})

module.exports = { registerUser, loginUser, createCourse, createSection, createLecture, getCourseList, registerStudent, registeredCourses, createdCourses, removeLecture, updateLecture, removeSection, updateSection, addCategory, removeCategory, updateCourse, removeCourse };