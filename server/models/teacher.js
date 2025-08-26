const mongoose=require('mongoose')

const teacherSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    batches:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Batch'
        }
    ]
},{timestamps:true})

module.exports=mongoose.model('tacher',teacherSchema)