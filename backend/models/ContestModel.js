const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
    input: { type: String, required: true },
    output: { type: String, required: true }
}, { _id: false });

const problemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    inputFormat: { type: String },
    outputFormat: { type: String },
    constraints: { type: String },
    sampleInput: { type: String },
    sampleOutput: { type: String },
    testCases: [testCaseSchema]
}, { _id: false });

const contestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'students', required: true },
    problems: [problemSchema],
    createdAt: { type: Date, default: Date.now }
}, { collection: "Contests" });

module.exports = mongoose.model("Contest", contestSchema);
