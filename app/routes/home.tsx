import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { useAuthStore } from "~/lib/store";
import { api } from "~/lib/api";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import ResumeCard from "~/components/ResumeCard";
import StatsCard from "~/components/StatsCard";
import { FileText, TrendingUp, Award, Clock, Upload, FolderOpen } from "lucide-react";

export const meta = () => [
  { title: "ResumePilot – Dashboard" },
  { name: "description", content: "View your resume analyses and ATS scores" },
];

export default function Home() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuthStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate("/auth");
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const loadResumes = async () => {
      setLoadingResumes(true);
      try {
        const data = await api.resumes.getAll();
        setResumes(data.resumes || []);
      } catch (error) {
        console.error("Failed to load resumes", error);
        setResumes([]);
      }
      setLoadingResumes(false);
    };
    loadResumes();
  }, [isAuthenticated]);

  // Compute stats
  const totalResumes = resumes.length;
  const avgScore = totalResumes > 0
    ? Math.round(resumes.reduce((sum, r) => sum + (r.overallScore || 0), 0) / totalResumes)
    : 0;
  const bestScore = totalResumes > 0
    ? Math.max(...resumes.map((r) => r.overallScore || 0))
    : 0;
  const latestResume = resumes.length > 0 ? resumes[0] : null;

  // Skeleton component
  const Skeleton = ({ className = "" }: { className?: string }) => (
    <div className={`skeleton ${className}`} />
  );

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />

      <main className="flex-1">
        <div className="section-container py-8">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="!text-3xl md:!text-4xl mb-2">
              Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
            </h1>
            <p className="text-text-secondary text-lg">
              Here's an overview of your resume analyses.
            </p>
          </motion.div>

          {/* Stats cards */}
          {loadingResumes ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card flex items-center gap-4">
                  <Skeleton className="w-12 h-12 !rounded-xl" />
                  <div className="flex-1">
                    <Skeleton className="h-3 w-20 mb-2" />
                    <Skeleton className="h-7 w-14" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
            >
              <StatsCard icon={FileText} label="Total Resumes" value={totalResumes} color="primary" />
              <StatsCard icon={TrendingUp} label="Average Score" value={avgScore > 0 ? `${avgScore}/100` : "—"} color="secondary" />
              <StatsCard icon={Award} label="Best Score" value={bestScore > 0 ? `${bestScore}/100` : "—"} color="success" />
              <StatsCard icon={Clock} label="Recent" value={latestResume?.jobTitle || "—"} subtitle={latestResume?.companyName} color="warning" />
            </motion.div>
          )}

          {/* Resume list section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="!text-xl font-semibold">Resume Analyses</h2>
              <Link to="/upload" className="btn-primary !text-sm">
                <Upload className="w-4 h-4" />
                New Analysis
              </Link>
            </div>

            {loadingResumes ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card flex items-center gap-4">
                    <div className="flex-1">
                      <Skeleton className="h-3 w-24 mb-2" />
                      <Skeleton className="h-5 w-48 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="w-14 h-14 !rounded-full" />
                  </div>
                ))}
              </div>
            ) : resumes.length > 0 ? (
              <div className="space-y-3">
                {resumes.map((resume, i) => (
                  <ResumeCard key={resume.id} resume={resume} index={i} />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="card text-center py-16">
                <div className="w-16 h-16 bg-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FolderOpen className="w-8 h-8 text-text-muted" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No resumes yet</h3>
                <p className="text-text-secondary mb-6 max-w-sm mx-auto">
                  Upload your first resume to get AI-powered ATS analysis and feedback.
                </p>
                <Link to="/upload" className="btn-primary">
                  <Upload className="w-4 h-4" />
                  Upload Your First Resume
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
