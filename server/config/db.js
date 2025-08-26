const mongoose=require('mongoose')

const connectDB=async()=>{
    try{

        const conn = mongoose.connect(process.env.MONGO_URI)

        console.log("DB is connected")

    }catch(e){
        console.log('Error in /config/db',e)
    }
}

module.exports= connectDB
