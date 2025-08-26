const express=require('express')
const router=express.Router()
const { allTeacher, deleteTeacher }=require('../controller/teacherController')



router.get('/allteacher',allTeacher)
router.delete('/deleteTeacher/:id', deleteTeacher)
// router.post('/login',login)

module.exports=router