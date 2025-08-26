const express=require('express')
const mongoose = require('mongoose');
const batch=require('../models/batch')
const Teacher =require('../models/teacher')
const Student =require('../models/student')

const createBatch=async(req,res)=>{
    try{
        const {name,price}=req.body

        if(!name) return res.status(400).json({message:"Name reuired"})
        if(!price) return res.status(400).json({message:"price reuired"})
        
        const isExist=await batch.findOne({name})

        if(isExist) return res.status(400).json({message:"Batch already exist"})

        const newBatch=new batch({
            name,price
        })

        await newBatch.save()

        res.status(201).json({message:"Batch create successfully",newBatch})


    }catch(e){
        console.lor(e)
    }
}

const updateBatch=async(req,res)=>{
    try{
        const {id}=req.params
        const {name,price}=req.body

        const toupdate=await batch.findOne({_id:id})
        if(!toupdate) return res.status(400).json({message:"Btach not exist"})
        
        const isExist = await batch.findOne({ name, _id: { $ne: new mongoose.Types.ObjectId(id) } });

        if(isExist) return res.status(400).json({message:"Batch with same name exist"})

        toupdate.name=name
        toupdate.price=price

        await toupdate.save();
        res.status(200).json({ message: "Batch updated successfully", batch: toupdate });


    }catch(e){
        console.log(e)
    }
}


const deleteBatch=async(req,res)=>{
    try{
        const {id}=req.params

        const isExist=await batch.findById(id)
        if(!isExist) return res.status(400).json({message:"batch not exist"})
        
        await isExist.deleteOne()

        res.json({message:"batch delete successfully"})
    }catch(e){
        console.log(e)
    }
}

const allBatch=async(req,res)=>{
    try{
        const allBatch=await batch.find()
        res.status(200).json({message:"All batch",allBatch})
    }catch(e){
        console.log(e)
    }
}

const assignTeacher=async(req,res)=>{
    try {
        
        const { batchId, teacherId }=req.body

        if(!batchId) return res.status(400).json({message:"batchId required"})
        if (!teacherId) return res.status(400).json({ message:"teacherId required"})

        const batch1 = await batch.findById(batchId);
        if (!batch1) return res.status(404).json({ message: "Batch not found" });

        const teacher = await Teacher.findById(teacherId);
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });

        if (!batch1.teachers.includes(teacherId)) {
            batch1.teachers.push(teacherId);
            await batch1.save();
        }

        res.status(200).json({ message: "Teacher assigned successfully", batch1 });
        
    } catch (error) {
        console.log(error)
    }
}

const myBatch = async (req, res) => {
    try {
        const { id } = req.params;

        const teacher = await Teacher.findById(id);
        const student = await Student.findById(id);

        if (!teacher && !student) {
            return res.status(400).json({ message: "Data not available" });
        }

        if (teacher) {
            // Find all batches where this teacher is assigned
            const allBatchTeacher = await batch.find({ teachers: teacher._id })
            return res.status(200).json({ batches: allBatchTeacher });
        }

        if (student) {
            // Find all batches where this student is enrolled
            const allBatchStudent = await batch.find({ students: student._id })
            return res.status(200).json({ batches: allBatchStudent });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};
const getBatchesWithoutStudentApplication = async (req, res) => {
    try {
        const { id } = req.params;

        // Find student
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Extract all batch IDs from selectedBatches array
        const appliedBatchIds = student.selectedBatches.map(b => b.batch.toString());

        // Find all batches where _id is NOT in appliedBatchIds
        const batches = await batch.find({
            _id: { $nin: appliedBatchIds }
        });

        return res.status(200).json({ message: "Batches student has not applied to", batches });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

const getPendingBatchesForStudent = async (req, res) => {
    try {
        const { id } = req.params;

        // Find student
        const student = await Student.findById(id).populate('selectedBatches.batch');
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Filter pending batch applications (isApproved === false)
        const pendingBatches = student.selectedBatches
            .filter(b => b.isApproved === false)
            .map(b => b.batch); // `batch` will already be populated

        return res.status(200).json({ message: "Pending batches", batches: pendingBatches });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

const getApprovedBatchesForStudent = async (req, res) => {
    try {
        const { id } = req.params;

        // Find student and populate batch references
        const student = await Student.findById(id).populate('selectedBatches.batch');
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Filter approved batches
        const approvedBatches = student.selectedBatches
            .filter(b => b.isApproved === true)
            .map(b => b.batch); // populated batch objects

        return res.status(200).json({ message: "Approved batches", batches: approvedBatches });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

const getApprovedStudentsByBatch = async (req, res) => {
    const { batchId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(batchId)) {
        return res.status(400).json({ error: "Invalid batch ID" });
    }

    try {
        const students = await Student.find({
            selectedBatches: {
                $elemMatch: {
                    batch: batchId,
                    isApproved: true
                }
            }
        }).select("name email phone");

        res.status(200).json({ students });
    } catch (err) {
        console.error("Error fetching students by batch:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getPendingStudentsByBatch = async (req, res) => {
    const { batchId } = req.params;

    if (!batchId) return res.status(400).json({ message: "Batch ID required" });

    try {
        const students = await Student.find({
            selectedBatches: {
                $elemMatch: {
                    batch: batchId,
                    isApproved: false
                }
            }
        }).select("name email phone"); // select fields you need

        res.status(200).json({ students });
    } catch (err) {
        console.error("Error fetching pending students:", err);
        res.status(500).json({ message: "Server error" });
    }
};



module.exports = { createBatch, updateBatch, deleteBatch, allBatch, assignTeacher, myBatch, getBatchesWithoutStudentApplication, getPendingBatchesForStudent, getApprovedBatchesForStudent, getApprovedStudentsByBatch, getPendingStudentsByBatch }