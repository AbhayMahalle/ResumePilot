const express = require("express");
const multer = require("multer");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  uploadAndAnalyze,
  getUserResumes,
  getResumeById,
  downloadResume,
  deleteResume,
} = require("../controllers/resumeController");

// Configure multer for memory storage (keeps PDF in buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

// All routes require JWT authentication
router.post("/analyze", authMiddleware, upload.single("resume"), uploadAndAnalyze);
router.get("/", authMiddleware, getUserResumes);
router.get("/:id", authMiddleware, getResumeById);
router.get("/:id/download", authMiddleware, downloadResume);
router.delete("/:id", authMiddleware, deleteResume);

module.exports = router;
