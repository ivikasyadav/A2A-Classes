const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
        required: true
    },
    startTime: {
        type: Date,   
        required: true
    },
    endTime: {
        type: Date,   
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tacher",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Lecture", lectureSchema);
