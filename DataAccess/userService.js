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
        const user = await User.find({ userName: userName, password: password });
        return user[0];
    }
    catch (Err) {
        console.log("Error while creating a user: ", Exception);
        return null;
    }
}

module.exports = {createUser, findUser};