const express = require('express')
const jwt = require('jsonwebtoken');
const Admin = require('../../models/admin')
const Student = require('../../models/student')
const Teacher = require('../../models/teacher')
const { generateToken } = require('../../utils/jwt')


const adminRegister = async (req, res) => {
    const { name, email, password } = req.body
    if (!name) {
        return res.send("Name is Requird")
    }
    if (!email) {
        return res.send("email is required")
    }
    if (!password) {
        return res.send("password is required")
    }
    let user1 = await Student.findOne({ email })
    let user2 = await Admin.findOne({ email })
    let user3 = await Teacher.findOne({ email })
    if (user1 || user2 || user3) {
        return res.status(400).json({ message: 'User already exist' })
    }
    let admin = new Admin({
        name, email, password
    })
    await admin.save()
    const token = generateToken({ id: admin.id, role: "admin" });
    res.status(201).json({
        messgae: "Admin Created Successfully",
        token,
        admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: 'admin'
        }
    })
}

const adminLogin = async (req, res) => {
    const { email, password } = req.body
    // console.log(req.body)

    if (!email) return res.status(400).json({ messgae: "Email Require" })
    if (!password) return res.status(400).json({ messgae: "Password Require" })

    let admin = await Admin.findOne({ email })
    if (!admin) return res.status(400).json({ message: "email not found" })



    if (admin.password !== password) return res.status(400).json({ message: "Password incorrect" })

    const token = generateToken({ id: admin.id, role: admin })
    res.json({
        token,
        admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: "admin"
        }
    });
}

const teacherRegister=async(req,res)=>{
    try{
        const {name,email,password}=req.body
        // console.log(req.body)
        if(!name) return res.status(400).json({message:"name is required"})
        if(!email) return res.status(400).json({message:"email is required"})
        if(!password) return res.status(400).json({message:"password is required"})

        const teacher=await Teacher.findOne({email})
        const admin=await Admin.findOne({email})
        const student=await Student.findOne({email})
        if(teacher || admin || student) return res.status(400).json({message:"User already exist"})
        let newTeacher=new Teacher({
            name,email,password
        })
        await newTeacher.save()

        const token = generateToken({ id: newTeacher.id, role: "teacher" });

        res.status(201).json({
            messgae: "Teacher Created Successfully",
            token,
            teacher: {
                id: newTeacher.id,
                name: newTeacher.name,
                email: newTeacher.email,
                role: 'teacher'
            }
        })
        console.log("successful")
        
    }catch(e){
        console.log(e)
    }
}

const teacherLogin=async(req,res)=>{
    try{

        const {email,password}=req.body

        if(!email) return res.send(400).json({message:"Email is required"})
        if(!password) return res.send(400).json({message:"Password is required"})

        const teacher=await Teacher.findOne({email})

        if(!teacher) return res.json({message:"Email not found"})
        
        if(teacher.password !== password){
            return res.status(400).json({messgae:"Password is incorrect"})
        }

        const token = generateToken({ id: Teacher.id, role: "teacher" });
        res.status(201).json({
            messgae: "Teacher login Successfully",
            token,
            teacher: {
                id: teacher.id,
                name: teacher.name,
                email: teacher.email,
                role: 'teacher'
            }
        })

    }catch(e){
        console.log(e)
    }
}

const studentRegister=async(req,res)=>{
    try{
        const { name, email, phone, parentPhone, password }=req.body

        if(!name) return res.status(400).json({message:"name is required"})
        if(!email) return res.status(400).json({message:"email is required"})
        if(!phone) return res.status(400).json({message:"phone is required"})
        if(!parentPhone) return res.status(400).json({message:"parentPhone is required"})
        if(!password) return res.status(400).json({message:"password is required"})

        const teacher = await Teacher.findOne({ email })
        const admin = await Admin.findOne({ email })
        const student = await Student.findOne({ email })

        if(teacher || admin || student ){
            return res.status(400).json({message:"User alredy exist"})
        }

        let newStudent=new Student({
            name,email,phone,parentPhone,password
        })

        await newStudent.save()

        const token = generateToken({ id: Teacher.id, role: "student" });

        res.json({
            message:"Student create Successfully",
            token,
            student:{
                id:newStudent.id,
                name:newStudent.name,
                email:newStudent.email,
                role:'student'
            }
        })

    }catch(e){
        console.log(e)
    }
}


const StudentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) return res.status(400).json({ message: "Email is required" });
        if (!password) return res.status(400).json({ message: "Password is required" });

        const student = await Student.findOne({ email });

        if (!student) return res.status(400).json({ message: "Email not found" });

        if (student.password !== password) {
            return res.status(400).json({ message: "Password is incorrect" });
        }

        // ✅ Check if student is not approved
        if (!student.isApproved) {
            return res.status(403).json({ message: "Application pending. Please wait for approval." });
        }

        const token = generateToken({ id: student.id, role: "student" });
        res.status(200).json({
            message: "Student login successful",
            token,
            student: {
                id: student.id,
                name: student.name,
                email: student.email,
                role: 'student'
            }
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Server error during login" });
    }
};



module.exports = { adminRegister, adminLogin, teacherRegister, teacherLogin, studentRegister, StudentLogin }