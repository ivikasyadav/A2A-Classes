const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    price: {
        type: Number,
        required: true
    },
    teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "tacher"
    }],
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }],
}, { timestamps: true });

module.exports = mongoose.model("Batch", batchSchema);
