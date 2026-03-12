const Resume = require("../models/Resume");
const { analyzeResume } = require("../services/geminiService");

// @desc    Upload a resume PDF, analyze with Gemini AI, store in MongoDB
// @route   POST /api/resumes/analyze
// @access  Private (requires JWT)
const uploadAndAnalyze = async (req, res) => {
  try {
    const { companyName, jobTitle, jobDescription } = req.body;

    // Validate required fields
    if (!companyName || !jobTitle) {
      return res.status(400).json({ message: "Please provide companyName and jobTitle" });
    }

    // Validate file upload
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF resume file" });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files are allowed" });
    }

    console.log(`Analyzing resume for ${jobTitle} at ${companyName}...`);

    // Call Gemini AI to analyze the resume
    const feedback = await analyzeResume(
      req.file.buffer,
      jobTitle,
      jobDescription || ""
    );

    // Store the resume and analysis in MongoDB
    const resume = await Resume.create({
      userId: req.user.userId,
      companyName,
      jobTitle,
      jobDescription: jobDescription || "",
      resumeFileName: req.file.originalname,
      resumeData: req.file.buffer,
      resumeMimeType: req.file.mimetype,
      feedback,
      overallScore: feedback.overallScore || 0,
    });

    console.log(`Resume analyzed and stored: ${resume._id}`);

    res.status(201).json({
      message: "Resume analyzed and stored successfully",
      resume: {
        id: resume._id,
        companyName: resume.companyName,
        jobTitle: resume.jobTitle,
        resumeFileName: resume.resumeFileName,
        overallScore: resume.overallScore,
        feedback: resume.feedback,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    console.error("Upload & Analyze error:", error.message);

    if (error.message.includes("JSON")) {
      return res.status(502).json({
        message: "AI returned an invalid response. Please try again.",
        error: error.message,
      });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all resumes for the logged-in user
// @route   GET /api/resumes
// @access  Private (requires JWT)
const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.userId })
      .select("-resumeData") // Exclude the heavy PDF binary
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: resumes.length,
      resumes: resumes.map((r) => ({
        id: r._id,
        companyName: r.companyName,
        jobTitle: r.jobTitle,
        resumeFileName: r.resumeFileName,
        overallScore: r.overallScore,
        feedback: r.feedback,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get resumes error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get a single resume by ID
// @route   GET /api/resumes/:id
// @access  Private (requires JWT)
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    }).select("-resumeData");

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({
      resume: {
        id: resume._id,
        companyName: resume.companyName,
        jobTitle: resume.jobTitle,
        jobDescription: resume.jobDescription,
        resumeFileName: resume.resumeFileName,
        overallScore: resume.overallScore,
        feedback: resume.feedback,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    console.error("Get resume error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Download the resume PDF
// @route   GET /api/resumes/:id/download
// @access  Private (requires JWT)
const downloadResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.set({
      "Content-Type": resume.resumeMimeType,
      "Content-Disposition": `attachment; filename="${resume.resumeFileName}"`,
    });

    res.send(resume.resumeData);
  } catch (error) {
    console.error("Download resume error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private (requires JWT)
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Delete resume error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  uploadAndAnalyze,
  getUserResumes,
  getResumeById,
  downloadResume,
  deleteResume,
};
