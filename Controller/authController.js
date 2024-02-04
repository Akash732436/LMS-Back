const asynchandler = require("express-async-handler");
const User = require("../Models/userModel.js");

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

        res.json({ success: "true", user });
    }
    catch {
        console.log("Error while logging a user ");
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }

})


module.exports = { registerUser, loginUser }