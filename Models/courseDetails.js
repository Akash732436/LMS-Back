class CourseDetail {
    constructor(courseData, categories, sectiondetail){
        this.name = courseData.courseName,
        this.courseDesc = courseData.courseDesc,
        this.date_created = courseData.date_created,
        this.student_count = courseData.student_count,
        this.category = categories
        this.sections = sectiondetail
    }
}

class SectionDetail {
    constructor(sectionName, lecturedetail){
        this.name = sectionName,
        this.lectures = lecturedetail
    }
}

class LectureDetail {
    constructor(lectureData){
        this.name = lectureData.name,
        this.notes = notes
    }
}


module.exports = {CourseDetail, SectionDetail, LectureDetail}