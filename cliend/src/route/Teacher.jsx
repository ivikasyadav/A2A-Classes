import React from 'react'
import TeacherSubNavbar from '../sunnavbar/TeacherSubNavBar'
import { Route, Routes } from 'react-router-dom'
import Batch from '../component/Batch'
import MyBatch from '../component/MyBatch'
import LectureManager from '../component/LectureManager'
import AllLecture from '../component/AllLecture'

const Teacher = () => {
  return (
    <div>
      <TeacherSubNavbar/>
      <Routes>
        <Route path='/' element={<Batch/>}/>
        <Route path='/my-batch' element={<MyBatch/>}/>
        <Route path='/my-lecture' element={<LectureManager/>}/>
        <Route path='/all-lecture' element={<AllLecture/>}/>
      </Routes>
    </div>
  )
}

export default Teacher