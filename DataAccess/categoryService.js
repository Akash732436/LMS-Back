const Category = require("../Models/courseCategoryModel");

const createCategory = async(courseId, categoryName) => {
    try {
        const category = await Category.create({
                                course_id: courseId,
                                category: categoryName
                                })
        return category;
    }
    catch (Err) {
        console.log("Error while creating a category: ", Err);
        return null;
    }
}

const removeCategory = async (courseId, categoryName) => {
    try {
        const category = await Category.deleteOne({course_id : courseId, category : categoryName});

        return category;
    }
    catch (Err) {
        console.log("Error while removing a category: ", Err);
        return null;
    }
}

const getCategories = async (courseId) => {
    try {
        const categories = await Category.find({ course_id: courseId });

        return categories;
    }
    catch (Err) {
        console.log("Category not found: ", Err);
        return null;
    }
}

module.exports = {createCategory, removeCategory, getCategories}