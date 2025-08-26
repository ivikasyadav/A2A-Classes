const express=require('express')
const router=express.Router()
const { createBatch, updateBatch, deleteBatch, allBatch, assignTeacher, myBatch, getBatchesWithoutStudentApplication, getPendingBatchesForStudent, getApprovedBatchesForStudent, getApprovedStudentsByBatch, getPendingStudentsByBatch }=require('../controller/batchController')

router.get('/allbatch', allBatch)
router.post('/createbatch', createBatch)
router.post('/assign-teacher', assignTeacher)
router.put('/updatebatch/:id', updateBatch)
router.delete('/deletebatch/:id', deleteBatch)
router.get('/mybatch/:id', myBatch)
router.get('/notbtach/:id', getBatchesWithoutStudentApplication)
router.get('/pendingbatch/:id', getPendingBatchesForStudent)
router.get('/approved/:id', getApprovedBatchesForStudent)
router.get("/batch/:batchId/approved", getApprovedStudentsByBatch);
router.get("/pending-students/:batchId", getPendingStudentsByBatch);



module.exports=router