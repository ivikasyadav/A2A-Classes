import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import AdminLogin from './auth/AdminLogin'
import StudentLogin from './auth/StudentLogin'
import TeacherLogin from './auth/TeacherLogin'
import Navbar from './component/Navbar'
import Admin from './route/Admin'
import Teacher from './route/Teacher'
import Student from './route/Student'
import StudentRegister from './auth/StudentRegister '

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   
      <Routes>
        <Route path='/admin-login' element={<AdminLogin/>}/>
        <Route path='/' element={<StudentLogin/>}/>
        <Route path='/register' element={<StudentRegister/>}/>
        <Route path='/teacher-login' element={<TeacherLogin/>}/>
        {/* <Route path='/p' element={<Page2/>}/> */}

        <Route path='/admin/*' element={<Admin/>}/>

        <Route path='/teacher/*' element={<Teacher/>}/>

        <Route path='/student/*' element={<Student/>}/>

      </Routes>
    </>
  )
}

export default App
