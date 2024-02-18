const Lecture = require("../Models/courseLectureModel");


const createLecture = async (lectureName, notes, sectionId) => {
    try {
        const lecture = await Lecture.create({
            name: lectureName,
            notes: notes,
            section_id: sectionId
        });

        return lecture;
    }
    catch (Err) {
        console.log("Error while creating a lecture: ", Err);
        return null;
    }
}

const removeLecture = async (lectureName, sectionId) => {
    try {
        const lecture = await Lecture.deleteOne({ name: lectureName, section_id: sectionId });

        return lecture;
    }
    catch (Err) {
        console.log("Error while removing a lecture: ", Err);
        return null;
    }
}

const updateLecture = async (lectureId, lectureName, notes) =>{
    try {
        const lecture = await Lecture.findByIdAndUpdate(lectureId,{name:lectureName,notes:notes},{new:true});

        return lecture;
    }
    catch (Err) {
        console.log("Error while updating a lecture: ", Err);
        return null;
    }
}

const findLecture = async (sectionId) => {
    try {
        const lecture = await Lecture.find({ section_id: sectionId })

        return lecture[0];
    }
    catch (Err) {
        console.log("Error while retierving lecture detail: ", Err);
        return null;
    }
}

module.exports = {createLecture, removeLecture, updateLecture, findLecture};