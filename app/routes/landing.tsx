import { Link } from "react-router";
import { motion } from "framer-motion";
import { useAuthStore } from "~/lib/store";
import { FileSearch, Brain, Target, Lightbulb, Upload, FileText, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

export const meta = () => [
  { title: "ResumePilot – AI Powered ATS Resume Analyzer" },
  { name: "description", content: "Analyze your resume using AI and improve your chances of landing your dream job." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const features = [
  {
    icon: FileSearch,
    title: "ATS Score Analysis",
    description: "Simulate real applicant tracking systems and see how your resume performs against real-world filters.",
  },
  {
    icon: Brain,
    title: "AI Resume Feedback",
    description: "Receive AI-powered feedback on content, structure, tone, and overall presentation quality.",
  },
  {
    icon: Target,
    title: "Skills Gap Detection",
    description: "Discover missing skills and keywords required for your target role and industry.",
  },
  {
    icon: Lightbulb,
    title: "Improvement Suggestions",
    description: "Get actionable, prioritized recommendations to strengthen every section of your resume.",
  },
];

const steps = [
  { icon: Upload, title: "Upload your resume", description: "Drag and drop your PDF resume to get started." },
  { icon: FileText, title: "Add job description", description: "Paste the job title and description you're targeting." },
  { icon: Sparkles, title: "AI analyzes resume", description: "Our Gemini AI engine scans and evaluates your resume." },
  { icon: TrendingUp, title: "Get your results", description: "Receive a detailed ATS score and improvement roadmap." },
];

export default function Landing() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />

      {/* Hero Section */}
      <section className="page-section relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute top-40 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10" />

        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light text-primary text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Powered by Google Gemini AI
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl mx-auto mb-6"
          >
            AI-Powered Resume Analyzer{" "}
            <span className="text-primary">for Your Dream Job</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Upload your resume, provide a job description, and get an instant ATS compatibility score with detailed, actionable feedback.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to={isAuthenticated ? "/upload" : "/auth"}
              className="btn-primary !px-8 !py-3.5 !text-base shadow-md hover:shadow-lg"
            >
              Analyze Resume
              <ArrowRight className="w-4 h-4" />
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="btn-outline !px-8 !py-3.5 !text-base">
                View Dashboard
              </Link>
            )}
          </motion.div>

          {/* Hero visual placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl border border-border shadow-lg p-8 relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-error/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
                <div className="flex-1 bg-bg rounded-lg h-6 ml-4" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-bg rounded-xl p-6 flex flex-col items-center gap-3">
                  <div className="text-4xl font-bold text-primary">87</div>
                  <div className="text-sm text-text-secondary">ATS Score</div>
                </div>
                <div className="bg-bg rounded-xl p-6 flex flex-col items-center gap-3">
                  <div className="text-4xl font-bold text-success">92</div>
                  <div className="text-sm text-text-secondary">Content</div>
                </div>
                <div className="bg-bg rounded-xl p-6 flex flex-col items-center gap-3">
                  <div className="text-4xl font-bold text-secondary">78</div>
                  <div className="text-sm text-text-secondary">Structure</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 bg-bg rounded-full w-full" />
                <div className="h-3 bg-bg rounded-full w-4/5" />
                <div className="h-3 bg-bg rounded-full w-3/5" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="page-section bg-white">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="mb-4">Everything You Need to Land the Job</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Our AI analyzes every aspect of your resume to maximize your chances with both ATS systems and human recruiters.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="card-hover group text-center"
              >
                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/15 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="page-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="mb-4">How It Works</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Get professional resume feedback in just four simple steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="relative"
              >
                <div className="card text-center">
                  <div className="text-xs font-bold text-primary bg-primary-light w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4">
                    {i + 1}
                  </div>
                  <div className="w-12 h-12 bg-bg rounded-xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-text-secondary" />
                  </div>
                  <h3 className="text-base mb-2">{step.title}</h3>
                  <p className="text-text-secondary text-sm">{step.description}</p>
                </div>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 border-t-2 border-dashed border-border" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="page-section bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="section-container text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-white mb-4 !text-3xl md:!text-4xl">Ready to Optimize Your Resume?</h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of job seekers who have improved their resumes with AI-powered insights.
            </p>
            <Link
              to={isAuthenticated ? "/upload" : "/auth"}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg"
            >
              Get Started — It's Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
