const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    optionA: { type: String, required: true },
    optionB: { type: String, required: true },
    optionC: { type: String, required: true },
    optionD: { type: String, required: true },
    correctOption: { type: String, required: true, enum: ['A', 'B', 'C', 'D'] },
    difficulty: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
    tags: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'students', required: true },
    createdAt: { type: Date, default: Date.now }
}, { collection: "Questions" });

module.exports = mongoose.model("Question", questionSchema);
