const express = require("express");
const router = express.Router();

const {registerUser, loginUser, listUsers} = require("../Controller/userController");

router.post("/sign-in",registerUser);
router.post("/log-in",loginUser);
router.get("/hello",(req,res)=>{
    res.send("Request recieved")
})
router.get("/",listUsers);


module.exports = router;

