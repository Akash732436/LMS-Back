const asynchandler = require("express-async-handler");
const User = require("../Models/userModel");

//@add a course category
//@post
//@public
const addCategory = asynchandler(async (req, res) => {
    try {
        const user_name = req.params.user_name;
        const courseName = req.params.course_name;
        const categoryName = req.params.category_name;
        const user = await Users.find({ userName: user_name });
        const user_id = user[0]._id;

        console.log("user id is ", user_id);
        const course = await Course.find({faculty_id : user_id, courseName : courseName});
        await Category.create({
            course_id: course[0]._id,
            category: categoryName
        })

        res.json({ success: "true"});
    }
    catch (Exception) {
        console.log("Error while logging a user ", Exception);
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }
});

//@remove a course category
//@delete
//@public
const removeCategory = asynchandler(async (req, res) => {
    try {
        const user_name = req.params.user_name;
        const courseName = req.params.course_name;
        const categoryName = req.params.category_name;
        const user = await Users.find({ userName: user_name });
        const user_id = user[0]._id;

        console.log("user id is ", user_id);
        const course = await Course.find({faculty_id : user_id, courseName : courseName});
        await Category.deleteOne({course_id : course[0]._id, category : categoryName});

        res.json({ success: "true" });
    }
    catch (Exception) {
        console.log("Error while logging a user ", Exception);
        res.status(500);
        res.json({ success: "false", Error: "Internal Server Error when creating user" });
    }
});