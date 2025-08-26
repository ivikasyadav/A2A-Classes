const express=require('express')
const router=express.Router()
const { createLecture, updateLecture, deleteLecture, getLectureById, getAllLectures, getLecturesByTeacher,  }=require('../controller/lectureController')


router.post("/create-lecture", createLecture);
router.put("/update-lecture/:id", updateLecture);
router.delete("/delete-lecture/:id", deleteLecture);

router.get("/all-lecture", getAllLectures);
router.get("/:id", getLectureById);         
router.get("/teacher-lecture/:id", getLecturesByTeacher);
// router.get("/student/:studentId", getAttendanceByStudent);







module.exports=router