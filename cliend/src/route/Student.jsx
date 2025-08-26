import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminSubNavbar from '../sunnavbar/AdminSubNavbar'
import Allteacher from '../component/Allteacher'
import Batch from '../component/Batch'
import PendingStudent from '../component/PendingStudentBatch.jsx'
import Students from '../component/Students'
import AllBatch from '../component/AllBatch.jsx'
import StudentSubNavBar from '../sunnavbar/StudentSubNavBar'
import MyBatch2 from '../component/MyBatch2'
import PendingBatch from '../component/PendingBatch.jsx'
import ApprovedBatch from '../component/ApprovedBatch.jsx'
import MyAttendence from '../component/MyAttendence.jsx'

const Student = () => {
  return (
    <div>
      <StudentSubNavBar />
      <div>
        <Routes>

          {/* <Route path='/' element={<Allteacher />} /> */}
          <Route path='/' element={<AllBatch />} />
          <Route path='/allbatch' element={<AllBatch />} />
          <Route path='/pending-student' element={<PendingStudent />} />
          <Route path='/students' element={<Students />} />
          <Route path='/mybatch' element={<ApprovedBatch />} />
          <Route path='/pending' element={<PendingBatch />} />
          <Route path='/attendence' element={<MyAttendence />} />
        </Routes>
      </div>
    </div>
  )
}

export default Student