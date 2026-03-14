import { type FormEvent, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/lib/store";
import { api } from "~/lib/api";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import FileUploader from "~/components/FileUploader";
import { Sparkles, Building, Briefcase, FileText, Loader2 } from "lucide-react";

export const meta = () => [
  { title: "ResumePilot – Upload Resume" },
  { name: "description", content: "Upload your resume for AI-powered ATS analysis" },
];

const Upload = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate("/auth");
  }, [authLoading, isAuthenticated, navigate]);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleCancel = useCallback(() => {
    setIsProcessing(false);
    setErrorText("");
  }, []);

  const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string; jobTitle: string; jobDescription: string; file: File }) => {
    setIsProcessing(true);
    setErrorText("");

    try {
      const formData = new FormData();
      formData.append("companyName", companyName);
      formData.append("jobTitle", jobTitle);
      formData.append("jobDescription", jobDescription);
      formData.append("resume", file);

      const data = await api.resumes.uploadAndAnalyze(formData);
      navigate(`/resume/${data.resume.id}`);
    } catch (err: any) {
      console.error("AI analysis error:", err);
      setErrorText(`AI analysis failed: ${err.message || String(err)}`);
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!companyName.trim() || !jobTitle.trim() || !jobDescription.trim() || !file) {
      setErrorText("Please fill all fields and select a PDF file.");
      return;
    }

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />

      <main className="flex-1">
        <div className="section-container py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-light text-primary text-sm font-medium mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                AI Analysis
              </div>
              <h1 className="!text-3xl md:!text-4xl mb-3">Upload Your Resume</h1>
              <p className="text-text-secondary text-lg">
                Get an ATS score and detailed improvement feedback in seconds.
              </p>
            </div>

            {/* Processing state */}
            {isProcessing ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card text-center py-12"
              >
                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Analyzing Your Resume</h3>
                <p className="text-text-secondary mb-2">
                  Gemini AI is evaluating your resume against the job description...
                </p>
                <p className="text-sm text-text-muted mb-8">This usually takes 10–20 seconds</p>

                {/* Progress bar */}
                <div className="w-full max-w-xs mx-auto h-1.5 bg-bg rounded-full overflow-hidden mb-6">
                  <div className="h-full progress-bar-gradient rounded-full w-full" />
                </div>

                {errorText && (
                  <div className="flex items-center gap-2 text-sm text-error bg-error-light rounded-xl p-3 mt-4 max-w-md mx-auto">
                    <span>{errorText}</span>
                  </div>
                )}

                <button onClick={handleCancel} className="btn-outline mt-4 !text-sm">
                  Cancel Analysis
                </button>
              </motion.div>
            ) : (
              /* Form */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {errorText && (
                  <div className="flex items-center gap-2 text-sm text-error bg-error-light rounded-xl p-4 mb-6">
                    <span>{errorText}</span>
                  </div>
                )}

                <form id="upload-form" onSubmit={handleSubmit} className="card !gap-5">
                  <div className="form-group">
                    <label htmlFor="company-name" className="form-label flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company-name"
                      placeholder="E.g. Google, Microsoft"
                      id="company-name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="job-title" className="form-label flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="job-title"
                      placeholder="E.g. Senior Software Engineer"
                      id="job-title"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="job-description" className="form-label flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Job Description
                    </label>
                    <textarea
                      rows={5}
                      name="job-description"
                      placeholder="Paste the full job description here..."
                      id="job-description"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Resume (PDF)</label>
                    <FileUploader onFileSelect={handleFileSelect} />
                  </div>

                  <button
                    className="btn-primary w-full !py-3.5 mt-2"
                    type="submit"
                    disabled={!file}
                  >
                    <Sparkles className="w-4 h-4" />
                    Analyze Resume
                  </button>
                </form>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Upload;
