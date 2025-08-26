const express =require('express')
const cors = require("cors");
const dotenv=require('dotenv')
const connectDB=require('./config/db')
const authRoutes =require('./routes/adminauth')
const batchRoutes=require('./routes/batchRoutes')
const teacherRoutes=require('./routes/teacherRoutes')
const studentRoutes=require('./routes/studentRoutes')
const lectureRoute=require('./routes/lectureRoutes')
const attendenceRoute=require('./routes/attendanceRoutes')


const app=express()

app.use(cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true               // allow cookies (if needed)
}));
app.use(express.json());
dotenv.config()
connectDB()

app.get('/',async(req,res)=>{
   res.status(200).send('API is Running')
})

// huvhfeuvbrgubvevbre
app.use('/api/auth',authRoutes)
app.use('/api/batch',batchRoutes)
app.use('/api/teacher',teacherRoutes)
app.use('/api/student', studentRoutes)
app.use('/api/lecture', lectureRoute)
app.use('/api/attendence', attendenceRoute)





const PORT= process.env.PORT || 4000
app.listen(PORT,()=>{
    console.log(`server is listening at ${PORT}`)
})