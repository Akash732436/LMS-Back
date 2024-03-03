const User = require("../Models/userModel.js");

const createUser = async (userName, firstName, lastName, password, userType) => {

    try{
        const user = await User.create({
            userName,
            firstName,
            lastName,
            password,
            userType
        });
        return user
    }
    catch (Err) {
        console.log("Error while creating a user: ", Err);
        return null;
    }
    
}

const findUser = async (userName, password) => {

    try{
        const user = await User.find({ userName: userName});
        if (user && user.lenght > 0 && user[0].password != password) {
            return {user:null, message:"Incorrect username or password"};
        }
        if (!user || user.length == 0) {
            return {user:null, message:"Acoount does not exist"};
        }
        return {user:user[0], message:"user validated"};
    }
    catch (Err) {
        console.log("Error while validating a user: ", Err);
        return null;
    }
}

module.exports = {createUser, findUser};