const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  companyName: {
    type: String,
    required: [true, "Company name is required"],
    trim: true,
  },
  jobTitle: {
    type: String,
    required: [true, "Job title is required"],
    trim: true,
  },
  jobDescription: {
    type: String,
    default: "",
  },
  resumeFileName: {
    type: String,
    required: true,
  },
  resumeData: {
    type: Buffer,
    required: true,
  },
  resumeMimeType: {
    type: String,
    default: "application/pdf",
  },
  feedback: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  overallScore: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Resume", resumeSchema);
