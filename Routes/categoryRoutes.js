const express = require("express");
const router = express.Router();
const verifyRole = require("../MiddleWare/Auth/authorize")

const {addCategory, removeCategory} = require("../Controller/categoryController");

router.route("/:user_name/:course_name/:category_name/category", verifyRole(["faculty"])).post(addCategory).delete(removeCategory);

module.exports = router;