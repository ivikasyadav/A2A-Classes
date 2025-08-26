const express = require('express');
const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Batch = require('../models/batch');
const Lecture = require('../models/lecture');
const mongoose=require("mongoose")

// CREATE
const createLecture = async (req, res) => {
    try {
        const { name, batchId, startTime, endTime, teacher } = req.body;

        if (!name || !batchId || !startTime || !endTime || !teacher) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const batchExists = await Batch.findById(batchId);
        if (!batchExists) return res.status(404).json({ message: "Batch not found" });

        const teacherExists = await Teacher.findById(teacher);
        if (!teacherExists) return res.status(404).json({ message: "Teacher not found" });

        const newLecture = new Lecture({
            name,
            batch: batchId,
            teacher,
            startTime: new Date(startTime),
            endTime: new Date(endTime)
        });

        await newLecture.save();

        return res.status(201).json({ message: "Lecture created", lecture: newLecture });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

// UPDATE
const updateLecture = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, batchId, teacher, startTime, endTime } = req.body;

        const lecture = await Lecture.findById(id);
        if (!lecture) return res.status(404).json({ message: "Lecture not found" });

        if (name) lecture.name = name;
        if (batchId) lecture.batch = batchId;
        if (teacher) lecture.teacher = teacher;
        if (startTime) lecture.startTime = new Date(startTime);
        if (endTime) lecture.endTime = new Date(endTime);

        await lecture.save();

        return res.status(200).json({ message: "Lecture updated", lecture });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

// DELETE
const deleteLecture = async (req, res) => {
    try {
        const { id } = req.params;

        const lecture = await Lecture.findById(id);
        if (!lecture) return res.status(404).json({ message: "Lecture not found" });

        await Lecture.findByIdAndDelete(id);

        return res.status(200).json({ message: "Lecture deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

// GET BY ID
const getLectureById = async (req, res) => {
    try {
        const { id } = req.params;
        const { batchId } = req.query; // batchId comes from frontend

        const lecture = await Lecture.findById(id)
            .populate("batch")
            .populate("teacher");

        if (!lecture) return res.status(404).json({ message: "Lecture not found" });

        // Decide which batch to use
        const batchToUse = batchId || lecture.batch._id;

        // Convert string to ObjectId
        const batchObjectId = new mongoose.Types.ObjectId(batchToUse);


        // Fetch students who have this batch in their selectedBatches array
        const students = await Student.find({
            selectedBatches: {
                $elemMatch: {
                    batch: batchObjectId
                }
            }
        });

        return res.status(200).json({ lecture, students });
    } catch (error) {
        console.error("Error fetching lecture:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// GET ALL
const getAllLectures = async (req, res) => {
    try {
        const lectures = await Lecture.find()
            .populate("batch")
            .populate("teacher");

        return res.status(200).json({ lectures });
    } catch (error) {
        console.error("Error fetching lectures:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// GET BY TEACHER
const getLecturesByTeacher = async (req, res) => {
    try {
        const { id } = req.params;

        const teacherExists = await Teacher.findById(id);
        if (!teacherExists) return res.status(404).json({ message: "Teacher not found" });

        const lectures = await Lecture.find({ teacher: id })
            .populate("batch")
            .populate("teacher");

        return res.status(200).json({ lectures });
    } catch (error) {
        console.error("Error fetching lectures by teacher:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createLecture,
    updateLecture,
    deleteLecture,
    getLectureById,
    getAllLectures,
    getLecturesByTeacher
};
