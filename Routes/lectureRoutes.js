const express = require("express");
const router = express.Router();
const verifyRole = require("../MiddleWare/Auth/authorize");

const {createLecture, updateLecture, removeLecture} = require("../Controller/lectureController");

router.route("/:course_name/:section_name/lecture", verifyRole(["faculty"])).post(createLecture).put(updateLecture).delete(removeLecture);

module.exports = router;