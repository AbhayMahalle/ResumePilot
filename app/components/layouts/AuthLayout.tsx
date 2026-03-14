import { Outlet } from "react-router";

const AuthLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex bg-bg">
      {/* Left — Branding / Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-secondary to-primary/80 relative overflow-hidden items-center justify-center p-12">
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10 text-center max-w-md">
          {/* Icon cluster */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">ResumePilot</h1>
          <p className="text-lg text-white/80 leading-relaxed">
            AI-powered resume analysis that helps you land your dream job. Get instant ATS scores and actionable feedback.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {["ATS Scoring", "AI Feedback", "Skills Gap", "Instant Results"].map((label) => (
              <span key={label} className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-sm text-white/90 font-medium">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form content */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
