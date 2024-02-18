const Section = require("../Models/courseSectionModel");


const createSection = async (sectionName, courseId) => {
    try {
        const section = await Section.create({
            name: sectionName,
            course_id: courseId
        });

        return section;
    }
    catch (Err) {
        console.log("Error while creating a section: ", Err);
        return null;
    }
}

const removeSection = async (sectionId) => {
    try {
        const section = await Section.deleteOne({_id : sectionId});

        return section;
    }
    catch (Err) {
        console.log("Error while removing a section: ", Err);
        return null;
    }
}

const updateSection = async (sectionId, sectionName) =>{
    try {
        const section = await Section.findByIdAndUpdate(sectionId,{name:sectionName},{new:true});

        return section;
    }
    catch (Err) {
        console.log("Error while updating a section: ", Err);
        return null;
    }
}

const findSection = async (courseId) => {
    try {
        const section = await Section.find({ course_id: courseId });

        return section[0];
    }
    catch (Err) {
        console.log("Error while retierving section detail: ", Err);
        return null;
    }
}

module.exports = {createSection, removeSection, updateSection, findSection};