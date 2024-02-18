const asynchandler = require("express-async-handler");
const {createUser, findUser} = require("../DataAccess/userService.js")
const jwt = require("jsonwebtoken");


const ADMIN = process.env.ADMIN_KEY;
const USER = process.env.USER_KEY;
const INSTRUCTOR = process.env.INSTRUCTOR_KEY;

//@ create a new user
//@ post
//@ access public
const registerUser = asynchandler(async (req, res) => {

    try {
        //fetch data for the requets
        const { userName, firstName, lastName, password, userType } = req.body;

        const user = await createUser(userName, firstName, lastName, password, userType);

        if (!user) {
            console.log("Error while creating a user: ");
            res.status(500);
            res.json({ success: "false", Error: "Internal Server Error when creating user"});
            return;
        }

        res.json({ success: "true" });
    }
    catch (Exception) {
        console.log("Error while creating a user: ", Exception);
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user: "+ Exception });
    }

})


//@ log in a new user
//@ post
//@ access public
const loginUser = asynchandler(async (req, res) => {

    try {
        
        const { userName, password } = req.body;
        //var user = await User.find({ userName: userName, password: password }).exec();
        var user = await findUser(userName, password);
        if (!user) {
            return res.status(401).json({message:"Account does not exist. Please create a new account"});
        }

        const key = user.userType == 'admin' ? ADMIN : user.userType == "student"?USER: user.userType == "faculty"?INSTRUCTOR:"";
        
        if(!key){
            res.status(401).json({message:"You don't have a specific role"});
            return;
        }

        const token = jwt.sign({userName:user.userName, firstName:user.firstName, lastName:user.lastName, role:user.userType}, key);

        res.json({token});
    }
    catch(err) {
        console.log("Error while logging a user:  ", err);
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }

})


module.exports = { registerUser, loginUser }