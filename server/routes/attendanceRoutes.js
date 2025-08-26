const express = require("express");
const router = express.Router();
const {
    markAttendance,
    getAttendanceByLecture, getAttendanceByStudent
} = require("../controller/attendenceController");

router.post("/mark", markAttendance);

// GET: all attendance records for a lecture
router.get("/lecture/:lectureId", getAttendanceByLecture);
router.get("/student/:studentId", getAttendanceByStudent);

module.exports = router;
