const asynchandler = require("express-async-handler");
const Users = require("../Models/userModel")



//@ create a new user
//@ post
//@ access public
const registerUser = asynchandler(async (req,res)=>{
    console.log("received request");
    const {userName, firstName, lastName, password, userType} = req.body;

    const user = Users.create({
        userName,
        firstName,
        lastName,
        password,
        userType      
    });

    res.json(user);
})


//@ log in a new user
//@ post
//@ access public
const loginUser = asynchandler(async (req,res)=>{
    const {userName,  password} = req.body;

    var user;
    user = await Users.find({userName:userName, password:password}).exec();

    res.json(user);
})


const listUsers = asynchandler(async (req,res)=>{
    var list = await Users.find();

    res.json(list);
})

module.exports ={registerUser, loginUser, listUsers};