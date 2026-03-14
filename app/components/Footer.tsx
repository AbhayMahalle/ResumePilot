import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-white">
      <div className="section-container py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <span className="font-semibold text-text-primary">ResumePilot</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/upload" className="hover:text-primary transition-colors">Upload</Link>
          </div>

          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} ResumePilot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
