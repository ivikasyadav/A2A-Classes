const express=require('express')
const router=express.Router()
const { allStudent, pendingStudent, approvedStudent, updateStatus, applytoBatch, deleteBatch, updateBatchStatus }=require('../controller/studentController')


router.get('/allstudent',allStudent)
router.get('/pendingstudent', pendingStudent)
router.get('/approved-student', approvedStudent)
router.put('/update-status/:id', updateStatus)
router.put('/apply-batch/:id', applytoBatch)
router.put('/remove-batch/:id', deleteBatch)
router.put('/update-batch/:id', updateBatchStatus)


module.exports=router