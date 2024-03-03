const asynchandler = require("express-async-handler");
const {createUser, findUser} = require("../DataAccess/userService.js")
const jwt = require("jsonwebtoken");


const ADMIN = process.env.ADMIN_KEY;
const USER = process.env.USER_KEY;
const INSTRUCTOR = process.env.INSTRUCTOR_KEY;

// template to proccess a requets
// 1. check if the req is as expected (e.g => check if a fiedl in req is empty)
// 2. If it's needed 


//@ create a new user
//@ post
//@ access public
const registerUser = asynchandler(async (req, res) => {

    try {
        //fetch data for the requets
        const { userName, firstName, lastName, password, userType } = req.body;

        //check for null values in req body
        if ( !userName || !firstName || !lastName|| !password || !userType ) {
            console.log("one or more fields in req body is not filled: ",req.body);
            res.status(400).json({success: "false", Error:"A field in the requset is not filled"});
            return;
        }

        //check for empty field
        if ( userName.length == 0 || firstName.length == 0 || lastName.length == 0 || password.length == 0 || userType.length == 0 ) {
            console.log("one or more empty field in req body: ",req.body);
            res.status(400).json({success: "false", Error:"A field in your requset is empty"});
            return;
        }

        //check for userType 'student', 'faculty', 'admin'
        if ( userType != 'student' && userType != 'faculty' && userType != 'admin' ) {
            console.log("Error while registering a user: userType ",userType," is not a valid type");
            res.status(400).json({success: "false", Error: "Please select a valid user type"});
            return;
        }

        //check whether a user already exists
        const userListWithSameName = await findUser(userName, password) ;
        if ( userListWithSameName != null ) {
            console.log("userName with name: ",userName," alreday exists");
            res.status(400).json({success: "false", Error:"user name already exist. Please take a unique name"});
            return;
        }

        //create a user account
        const user = await createUser(userName, firstName, lastName, password, userType);

        if ( !user ) {
            console.log("Error while creating the account for requets: ",req.body);
            res.status(500);
            res.json({ success: "false", Error: "Internal Server Error when creating the account"});
            return;
        }

        res.json({ success: "true" });
    }
    catch (Exception) {
        console.log("Error while creating a user: ", Exception);
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user. Please try again"});
    }

})


//@ log in a new user
//@ post
//@ access public
const loginUser = asynchandler(async (req, res) => {

    try {
        
        const { userName, password } = req.body;
        //var user = await User.find({ userName: userName, password: password }).exec();

        //check for null values in req body
        if ( !userName || !password  ) {
            console.log("one or more fields in req body is not filled: ",req.body);
            res.status(400).json({success: "false", Error:"A field in the requset is not filled"});
            return;
        }

        //check for empty field
        if ( userName.length == 0 || password.length == 0 ) {
            console.log("one or more empty field in req body: ",req.body);
            res.status(400).json({success: "false", Error:"A field in your requset is empty"});
            return;
        }

        var {user, message} = await findUser(userName, password);
        if (!user) {
            return res.status(401).json({success:"false", message:message});
        }

        const key = user.userType == 'admin' ? ADMIN : user.userType == "student"?USER: user.userType == "faculty"?INSTRUCTOR:"";
        
        if(!key){
            res.status(401).json({success:"false", message:"You don't have a specific role"});
            return;
        }

        const token = jwt.sign({userName:user.userName, firstName:user.firstName, lastName:user.lastName, role:user.userType}, key);

        res.json({success:"true", token:token, user:{userName:user.userName, firstName:user.firstName, lastName:user.lastName, role:user.userType}});
    }
    catch(err) {
        console.log("Error while logging a user:  ", err);
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }

})


module.exports = { registerUser, loginUser }