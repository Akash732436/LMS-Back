const asynchandler = require("express-async-handler");
const User = require("../Models/userModel.js");
const jwt = require("jsonwebtoken");


const ADMIN = process.env.ADMIN_KEY;
const USER = process.env.USER_KEY;
const INSTRUCTOR = process.env.INSTRUCTOR_KEY;

//@ create a new user
//@ post
//@ access public
const registerUser = asynchandler(async (req, res) => {

    try {
        //fecth data for the requets
        const { userName, firstName, lastName, password, userType } = req.body;
        const user = await User.create({
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
        var user = await User.find({ userName: userName, password: password }).exec();
        if (!user) {
            return res.status(401).json({message:"Your account does not exist"});
        }

        const key = user[0].userType == 'admin' ? ADMIN : user[0].userType == "student"?USER: user[0].userType == "faculty"?INSTRUCTOR:"";
        console.log("user value is: ",user)
        if(!key){
            res.status(401).json({message:"You don't have a specific role"});
            return;
        }

        const token = jwt.sign({userName:user[0].userName, firstName:user[0].firstName, lastName:user[0].lastName, role:user[0].userType}, key);

        res.json({token});
    }
    catch(err) {
        console.log("Error while logging a user:  ", err);
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }

})


module.exports = { registerUser, loginUser }