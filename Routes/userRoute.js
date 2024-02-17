const express = require("express");
const router = express.Router();

const {registerUser, loginUser, createCourse, createSection, createLecture, getCourseList, registerStudent, registeredCourses, createdCourses, removeLecture, updateLecture, removeSection, updateSection, addCategory, removeCategory, updateCourse, removeCourse} = require("../Controller/userController");

router.post("/sign-in",registerUser);
router.post("/log-in",loginUser);
router.post("/faculty/createCourse/:user_name",createCourse);

router.post("/faculty/createSection/:user_name/:course_name",createSection);
router.post("/faculty/createLecture/:user_name/:course_name/:section_name",createLecture);

router.get("/courseList",getCourseList);

router.post("/student/:user_name/register",registerStudent);

router.get("/student/:user_name/registeredList",registeredCourses);

router.get("/faculty/:user_name/createdCourse",createdCourses);
router.delete("/faculty/:user_name/:course_name/:section_name/remove",removeLecture);
router.put("/faculty/:user_name/:course_name/:section_name/update",updateLecture);
router.delete("/faculty/:user_name/:course_name/remove",removeSection);

router.put("/faculty/:user_name/:course_name/update",updateSection);
router.post("/faculty/:user_name/:course_name/:category_name/addCategory",addCategory);
router.delete("/faculty/:user_name/:course_name/:category_name/removeCategory",removeCategory);

router.put("/faculty/:user_name/updateCourse",updateCourse);
router.delete("/faculty/:user_name/removeCourse",removeCourse);



module.exports = router;

