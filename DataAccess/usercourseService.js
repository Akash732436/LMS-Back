const UserCourse = require("../Models/userCourseModel");

const createUsercourse = async (userId, courseId) => {
    try {
        const category = await UserCourse.create({
            user_id: userId,
            course_id: courseId,
            course_status: "Incomplete"
        }
        );

        return category;
    }
    catch (Err) {
        console.log("Error while registering a student: ", Err);
        return null;
    }
}

const findUsercourse = async (userId) => {
    try {
        const courseList = await UserCourse.find({ user_id: userId });

        return courseList;
    }
    catch (Err) {
        console.log("Error while fetching a registered courses: ", Err);
        return null;
    }
}


module.exports = { createUsercourse, findUsercourse };