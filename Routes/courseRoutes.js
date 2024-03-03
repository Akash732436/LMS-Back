const express = require("express");
const router = express.Router();
const verifyRole = require("../MiddleWare/Auth/authorize")

const {createCourse, updateCourse, removeCourse, registerStudent, registeredCourses, createdCourses, getCourseList} = require("../Controller/courseController");

router.route("/:user_name/course").post(verifyRole(["faculty"]), createCourse).put(verifyRole(["faculty"]), updateCourse).delete(verifyRole(["faculty"]), removeCourse);

router.post("/:user_name/register", verifyRole(["faculty","student"]), registerStudent);

router.get("/:user_name/registeredCourses", verifyRole(["faculty","student"]), registeredCourses);

router.get("/:user_name/createdCourse", verifyRole(["faculty"]), createdCourses);

// router.get((req, res) =>{"courseList",getCourseList)};

router.get("/courseList", getCourseList);


module.exports = router;