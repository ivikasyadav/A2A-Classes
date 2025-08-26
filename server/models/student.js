const { timeStamp } = require('console')
const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
    },
    parentPhone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    selectedBatches: [
        {
            batch: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Batch"
            },
            isApproved: {
                type: Boolean,
                default: false
            }
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model("Student", studentSchema)