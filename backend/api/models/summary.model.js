import mongoose from "mongoose"

const summarySchema = mongoose.Schema({
    article: {
        type: String,
        required: true,
    },
    summaryText: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    wordCount: Number,
}, { timestamps: true })

export const Summary = mongoose.model("Summary", summarySchema)