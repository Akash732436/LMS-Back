const express = require("express");
const router = express.Router();
const verifyRole = require("../MiddleWare/Auth/authorize");

const {createSection, updateSection, removeSection} = require("../Controller/sectionController");


router.route("/:user_name/:course_name/section", verifyRole(["faculty"])).post(createSection).put(updateSection).delete(removeSection);

module.exports = router;