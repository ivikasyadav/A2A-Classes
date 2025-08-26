const Attendance = require("../models/attendance");
const Lecture = require("../models/lecture");
const Student = require("../models/student");
const twilio = require("twilio");
const dotenv=require('dotenv')

dotenv.config()

const accountSid = process.env.Account_SID;
const authToken = process.env.Token;
const client = twilio(accountSid, authToken);

// Mark attendance (create or update)
const markAttendance = async (req, res) => {
    console.log(req.body);
    const { lectureId, studentId, status } = req.body;

    if (!["Present", "Absent"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
    }

    try {
        // Find student to get their parent's phone number
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ error: "Student not found" });

        // Check if attendance already marked
        let attendance = await Attendance.findOne({ lecture: lectureId, student: studentId });

        if (attendance) {
            attendance.status = status;
            await attendance.save();
        } else {
            attendance = new Attendance({
                lecture: lectureId,
                student: studentId,
                status,
            });
            await attendance.save();
        }

        if (status === "Absent") {
            const lecture = await Lecture.findById(lectureId);
            if (student.parentPhone) { 
                await client.messages.create({
                    body: `Your child ${student.name} is absent in lecture "${lecture.name}".`,
                    from: "+17744822797",
                    to: `+91${student.parentPhone}`

                });
            }
        }

        res.status(attendance.isNew ? 201 : 200).json({
            message: status === "Absent" ? "Attendance updated & SMS sent" : "Attendance updated",
            attendance,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};

// Get all attendance for a lecture
const getAttendanceByLecture = async (req, res) => {
    const { lectureId } = req.params;

    try {
        const records = await Attendance.find({ lecture: lectureId })
            .populate("student", "name email")
            .populate("lecture");
        res.status(200).json(records);
    } catch (err) {
        res.status(500).json({ error: "Error fetching attendance" });
    }
};

const getAttendanceByStudent = async (req, res) => {
    const { studentId } = req.params;

    try {
        const attendanceRecords = await Attendance.find({ student: studentId })
            .populate("lecture") // You can also select specific lecture fields if needed
            .sort({ createdAt: -1 });

        res.status(200).json(attendanceRecords);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch attendance records" });
    }
};


module.exports = { markAttendance, getAttendanceByLecture, getAttendanceByStudent };
