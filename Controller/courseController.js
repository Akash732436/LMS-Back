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

        if (!user || user.length == 0) {
            console.log("User does not exist");
            res.status(500).json({success:"false", message: "Please login to continue"});
            return;
        }

        if (user[0].userType != 'faculty') {
            console.log("User is not authoorized to access this operation");
            res.status(500).json({success:"false", message: "You are not authoorized to access this operation"});
            return;
        }

        const user_id = user[0]._id;
        const { courseName, courseDesc, categories } = req.body;

        //check for null values in req body
        if ( !courseName || !courseDesc || !categories ) {
            console.log("one or more fields in req body is not filled: ",req.body);
            res.status(400).json({success: "false", Error:"A field in the requset is not filled"});
            return;
        }

        //check for empty field
        if ( courseName.length == 0 || courseDesc.length == 0 ) {
            console.log("one or more empty field in req body: ",req.body);
            res.status(400).json({success: "false", Error:"A field in your requset is empty"});
            return;
        }

        const coursePresent = await Course.find({faculty_id : user_id, courseName : courseName});

        console.log(coursePresent);

        if (coursePresent && coursePresent.length > 0) {
            console.log("User already created the course with the give name: ",courseName);
            res.status(400).json({success: "false", Error:"A course with the given name already exists"});
            return;
        }

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

        res.json({ success: "true", course: created });
    }
    catch (Exception) {
        console.log("Error while creating the course ", Exception);
        res.status(500);
        res.json({ success: "false", Error: "Error while creating the course " });
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
        
        if (!user || user.length == 0) {
            console.log("User does not exist");
            res.status(500).json({success:"false", message: "Please login to continue"});
            return;
        }

        if (user[0].userType != 'faculty') {
            console.log("User is not authoorized to access this operation");
            res.status(500).json({success:"false", message: "You are not authoorized to access this operation"});
            return;
        }

        const { courseOldName,courseNewName, courseDesc } = req.body;

        //check for null values in req body
        if ( !courseOldName || !courseNewName || !courseDesc ) {
            console.log("one or more fields in req body is not filled: ",req.body);
            res.status(400).json({success: "false", Error:"A field in the requset is not filled"});
            return;
        }

        //check for empty field
        if ( courseOldName.length == 0 || courseNewName.length == 0 || courseDesc.length == 0 ) {
            console.log("one or more empty field in req body: ",req.body);
            res.status(400).json({success: "false", Error:"A field in your requset is empty"});
            return;
        }

        console.log("user id is ", user_id);

        const course = await Course.find({faculty_id : user_id, courseName : courseOldName});
        const coursePresent = await Course.find({faculty_id : user_id, courseName : courseNewName});

        console.log(coursePresent);

        if (coursePresent && coursePresent.length > 0) {
            console.log("User already created the course with the give name: ",courseNewName);
            res.status(400).json({success: "false", Error:"A course with the given name already exists"});
            return;
        }

        course.courseName = courseNewName;
        course.courseDesc = courseDesc;
        await Course.findByIdAndUpdate(course[0]._id,{courseName:courseNewName,courseDesc:courseDesc},{new:true});
        //await course.save();

        res.json({ success: "true" });
    }
    catch (Exception) {
        console.log("Error while updating a course ", Exception);
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error" });
    }
});

//@ remove a course
//@delete
//@public
const removeCourse = asynchandler(async (req, res) => {
    try {
        const user_name = req.params.user_name;
        const user = await Users.find({ userName: user_name });

        if (!user || user.length == 0) {
            console.log("User does not exist");
            res.status(500).json({success:"false", message: "Please login to continue"});
            return;
        }

        if (user[0].userType != 'faculty') {
            console.log("User is not authoorized to access this operation");
            res.status(500).json({success:"false", message: "You are not authoorized to access this operation"});
            return;
        }

        const user_id = user[0]._id;
 
        const { courseName } = req.body;

        //check for null values in req body
        if ( !courseName) {
            console.log("one or more fields in req body is not filled: ",req.body);
            res.status(400).json({success: "false", Error:"A field in the requset is not filled"});
            return;
        }

        //check for empty field
        if ( courseName.length == 0 ) {
            console.log("one or more empty field in req body: ",req.body);
            res.status(400).json({success: "false", Error:"A field in your requset is empty"});
            return;
        }

        const course = await Course.find({faculty_id : user_id, courseName : courseName});

        if(!course || course.length == 0 ){
            console.log("no course with the given name");
            res.json({success:"true"});
        }
        
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
        console.log("Error while removing a course ", Exception);
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error" });
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

        if (!user || user.length == 0) {
            console.log("User does not exist");
            res.status(500).json({success:"false", message: "Please login to continue"});
            return;
        }

        if (user[0].userType != 'faculty') {
            console.log("User is not authoorized to access this operation");
            res.status(500).json({success:"false", message: "You are not authoorized to access this operation"});
            return;
        }

        const user_id = user[0]._id;
        console.log("user name is: ", user_id);

        const courseList = await Course.find({ user_id: user_id });
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

        if (!user || user.length == 0) {
            console.log("User does not exist");
            res.status(500).json({success:"false", message: "Please login to continue"});
            return;
        }

        if (user[0].userType != 'faculty') {
            console.log("User is not authoorized to access this operation");
            res.status(500).json({success:"false", message: "You are not authoorized to access this operation"});
            return;
        }

        const user_id = user[0]._id;

        const faculty = await Users.find({ userName: faculty_name });

        if (!faculty || faculty.length == 0) {
            console.log("faculty with the given name: ",faculty_name," does not exist");
            req.res(400).json({success:"false",message:"the given course does not exist. Please refresh"});
        }
        const faculty_id = faculty[0]._id;
        const course = await Course.find({ courseName: course_name, faculty_id: faculty_id });
        console.log("courses: ", course);

        if (!course || course.length == 0) {
            console.log("course with the given name: ",course_name," and the facult ", faculty_name," does not exist");
            req.res(400).json({success:"false",message:"the given course does not exist. Please refresh"});
        }

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

        if (!user || user.length == 0) {
            console.log("User does not exist");
            res.status(500).json({success:"false", message: "Please login to continue"});
            return;
        }

        if (user[0].userType != 'faculty') {
            console.log("User is not authoorized to access this operation");
            res.status(500).json({success:"false", message: "You are not authoorized to access this operation"});
            return;
        }

        const user_id = user[0]._id;

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