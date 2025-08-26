const express = require('express')
const Teacher = require('../models/teacher')
const Student = require('../models/student')
const Admin = require('../models/admin')
// const student = require('../models/student')
const Batch = require('../models/batch')
const batch = require('../models/batch')
const student = require('../models/student')

const allStudent = async (req, res) => {
    try {
        const allstudent = await Student.find()
        res.status(200).json({ message: "Student fetch successfully", allstudent })
    } catch (error) {
        console.log(error)
    }
}

const pendingStudent = async (req, res) => {
    try {

        const allstudent = await Student.find({ isApproved: false })

        res.status(200).json({ message: "Student fetch successfully", allstudent })
    } catch (err) {
        console.log(err)
    }
}

const approvedStudent = async (req, res) => {
    try {

        const allstudent = await Student.find({ isApproved: true })

        res.status(200).json({ message: "Student fetch successfully", allstudent })
    } catch (err) {
        console.log(err)
    }
}

const updateStatus = async (req, res) => {
    try {

        const { id } = req.params
        const { isApproved } = req.body
        console.log(req.body)
        if (typeof isApproved !== 'boolean') {
            return res.status(400).json({ message: "Data insufficient" });
        }

        const isExist = await student.findById(id)
        if (!isExist) return res.status(400).json({ message: 'Student is not there' })

        isExist.isApproved = isApproved

        await isExist.save()

        // const allstudent = await Student.find({ isApproved: true })

        res.status(200).json({ message: "Student status update successfully" })
    } catch (err) {
        console.log(err)
    }
}


const applytoBatch = async (req, res) => {
    try {
        const { id } = req.params;
        const { batchId } = req.body;

        if (!batchId) return res.status(400).json({ message: "BatchId Required" });

        const student = await Student.findById(id);
        if (!student) return res.status(400).json({ message: "Student does not exist" });

        const batchExist = await Batch.findById(batchId);
        if (!batchExist) return res.status(400).json({ message: "Batch does not exist" });

        const alreadyAdded = student.selectedBatches.some(
            (b) => b.batch.toString() === batchId
        );

        if (alreadyAdded) {
            return res.status(400).json({ message: "Batch already applied" });
        }

        student.selectedBatches.push({ batch: batchId });

        await student.save();

        res.json({ message: "Applied to batch successfully", student });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteBatch = async (req, res) => {
    try {
        const { id } = req.params
        const { batchId } = req.body
        if (!batchId) return res.status(400).json({ message: "BatchId not exis" })

        const student = await Student.findById(id)
        if (!student) return res.status(400).json({ messgae: "Student not exist" })


        const initialLength = student.selectedBatches.length;
        student.selectedBatches = student.selectedBatches.filter(
            (b) => b.batch.toString() !== batchId
        );

        if (student.selectedBatches.length === initialLength) {
            return res.status(400).json({ message: "Batch not found in student's selection", student });
        }

        await student.save();

        res.json({ message: "Batch removed successfully", student });

    } catch (error) {
        console.log(error)
    }
}


const updateBatchStatus = async (req, res) => {
    try {
        const { id } = req.params; // studentId
        const { batchId, status } = req.body; // status = true/false
        console.log(req.body)

        if (!batchId || typeof status !== "boolean") {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find student
        const student = await Student.findById(id);
        if (!student) return res.status(400).json({ message: "Student not found" });

        // Find batch entry in student.selectedBatches
        const batchItem = student.selectedBatches.find(
            (b) => b.batch.toString() === batchId
        );

        if (!batchItem) {
            return res.status(400).json({ message: "Batch not found in student's selection" });
        }

        // Find batch document
        const batchDoc = await Batch.findById(batchId);
        if (!batchDoc) return res.status(400).json({ message: "Batch not found" });

        if (status) {
            // APPROVE: set student batch entry to approved
            batchItem.isApproved = true;

            // Add student to batch if not already there
            if (!batchDoc.students.includes(student._id)) {
                batchDoc.students.push(student._id);
            }
        } else {
            // REJECT: remove student from batch
            batchDoc.students = batchDoc.students.filter(
                (stuId) => stuId.toString() !== student._id.toString()
            );

            student.selectedBatches = student.selectedBatches.filter(
                (b) => b.batch.toString() !== batchId
            );



        }

        await student.save();
        await batchDoc.save();

        res.json({ message: "Batch status updated successfully", student });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { allStudent, pendingStudent, approvedStudent, updateStatus, applytoBatch, deleteBatch, updateBatchStatus }