import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminSubNavbar from '../sunnavbar/AdminSubNavbar'
import Allteacher from '../component/Allteacher'
import Batch from '../component/Batch'
import PendingStudent from '../component/PendingStudentBatch'
import Students from '../component/Students'
import PendingStudents from '../component/PendingStudents'
import TeacherRegister from '../auth/TeacherRegister'

const Admin = () => {
     return (
          <div>
               <AdminSubNavbar />
               <div>
                    <Routes>

                         <Route path='/' element={<Allteacher />} />
                         <Route path='/batch' element={<Batch />} />
                         <Route path='/pending-student' element={<PendingStudents />} />
                         <Route path='/students' element={<Students />} />
                         <Route path='/teacher-register' element={<TeacherRegister />} />
                    </Routes>
               </div>
          </div>
     )
}

export default Admin