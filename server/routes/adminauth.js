const express = require('express')
const router = express.Router()
const { adminRegister, adminLogin, teacherLogin, teacherRegister, studentRegister, StudentLogin } = require('../controller/auth/authController')




router.post('/admin/register', adminRegister)
router.post('/admin/login', adminLogin)

router.post('/teacher/register',teacherRegister)
router.post('/teacher/login',teacherLogin)

router.post('/student/register', studentRegister)
router.post('/student/login', StudentLogin)




module.exports = router