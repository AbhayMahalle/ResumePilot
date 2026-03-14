import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "~/lib/store";
import { api } from "~/lib/api";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import { ArrowLeft, Loader2 } from "lucide-react";

export const meta = () => [
  { title: "ResumePilot – Resume Review" },
  { name: "description", content: "Detailed overview of your resume analysis" },
];

const Resume = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { id } = useParams();
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [fetchError, setFetchError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate(`/auth`);
  }, [isLoading, isAuthenticated, navigate, id]);

  useEffect(() => {
    if (!id || !isAuthenticated) return;

    let resumeObjUrl = "";

    const loadResume = async () => {
      try {
        const data = await api.resumes.getById(id);
        setFeedback(data.resume.feedback as Feedback);

        const pdfBlob = await api.resumes.download(id);
        resumeObjUrl = URL.createObjectURL(pdfBlob);
        setResumeUrl(resumeObjUrl);
      } catch (error: any) {
        console.error("Failed to load resume data", error);
        setFetchError(error.message || "Failed to load resume");
      }
    };

    loadResume();

    return () => {
      if (resumeObjUrl) URL.revokeObjectURL(resumeObjUrl);
    };
  }, [id, isAuthenticated]);

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <h2 className="!text-2xl text-error font-bold mb-4">{fetchError}</h2>
          <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Top nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <span className="text-sm font-semibold text-text-primary">Resume Review</span>
          <div className="w-24" /> {/* spacer */}
        </div>
      </nav>

      {/* Content */}
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        {/* PDF Viewer */}
        <section className="w-1/2 max-lg:w-full h-screen sticky top-[53px] flex items-center justify-center p-6 bg-bg border-r border-border">
          {resumeUrl ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full max-w-[800px] rounded-2xl overflow-hidden shadow-lg border border-border bg-white"
            >
              <embed
                src={resumeUrl + "#toolbar=0&navpanes=0&scrollbar=0"}
                type="application/pdf"
                className="w-full h-full"
              />
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-text-secondary">Loading PDF...</p>
            </div>
          )}
        </section>

        {/* Feedback */}
        <section className="w-1/2 max-lg:w-full overflow-y-auto h-screen p-6 lg:p-8">
          {feedback ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-6 pb-20"
            >
              <h2 className="!text-2xl font-bold">Resume Analysis</h2>
              <Summary feedback={feedback} />
              <ATS score={feedback.ATS?.score || 0} suggestions={feedback.ATS?.tips || []} />
              <div>
                <h3 className="text-lg font-semibold mb-3">Detailed Feedback</h3>
                <Details feedback={feedback} />
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-text-secondary font-medium animate-pulse">Analyzing feedback...</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Resume;
