const express = require('express')
const { generateToken } = require('../utils/jwt')
const Teacher = require('../models/teacher')
const Student = require('../models/student')
const Admin = require('../models/admin')


const allTeacher = async (req, res) => {
    try {
        const allTeacher = await Teacher.find()

        res.status(200).json({ message: "Teacher fetched successfully", data: allTeacher })

    } catch (e) {
        console.log(e)
    }
}

const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params
        if (!id || id.length !== 24) {
            return res.status(400).json({ message: "Invalid teacher ID" });
        }


        const isExist = await Teacher.findById(id)
        if (!isExist) return res.status(400).json({ message: "Teacher not found" })

        await isExist.deleteOne()

        res.json({ message: "Teacher deleted Successfully" })
    } catch (error) {
        console.log(error)
    }
}

module.exports = { allTeacher, deleteTeacher }


