const express = require("express");
const router = express.Router();

const {registerUser, loginUser, createCourse} = require("../Controller/userController");

router.post("/sign-in",registerUser);
router.post("/log-in",loginUser);
router.post("/faculty/createCourse/:user_name",createCourse);



module.exports = router;

