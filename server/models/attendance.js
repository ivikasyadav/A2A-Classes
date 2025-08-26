const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
        lecture: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lecture", required: true
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student", required: true
        },
        status: {
            type: String, enum: ["Present", "Absent"],
            required: true
        },
    }, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
