import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { LogIn, UserPlus, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useAuthStore } from "~/lib/store";
import { api } from "~/lib/api";
import AuthLayout from "~/components/layouts/AuthLayout";

export const meta = () => [
  { title: "ResumePilot – Sign In" },
  { name: "description", content: "Sign in to your ResumePilot account" },
];

export default function AuthPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login: setAuth, isLoading } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!isLogin && password !== confirmPassword) {
        toast.error("Passwords do not match");
        setIsSubmitting(false);
        return;
      }

      if (isLogin) {
        const res = await api.auth.login({ email, password });
        setAuth(res.token, res.user || { id: res.userId, name: res.name || email, email });
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        const res = await api.auth.register({ name, email, password });
        setAuth(res.token, res.user || { id: res.userId, name, email });
        toast.success("Account created successfully!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const formContent = (
    <motion.div
      key={isLogin ? "login" : "register"}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="mb-8">
        {/* Mobile logo */}
        <div className="flex items-center gap-2.5 mb-6 lg:hidden">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-text-primary">ResumePilot</span>
        </div>

        <h2 className="!text-2xl md:!text-3xl font-bold mb-2">
          {isLogin ? "Welcome back" : "Create your account"}
        </h2>
        <p className="text-text-secondary">
          {isLogin
            ? "Sign in to access your resume analyses"
            : "Get started with AI-powered resume feedback"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="!gap-4">
        {!isLogin && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="!pl-10"
                placeholder="John Doe"
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="!pl-10"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="!pl-10 !pr-10"
              placeholder="••••••••"
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {!isLogin && (
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="!pl-10"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full !py-3 mt-2"
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          ) : isLogin ? (
            <>
              <LogIn className="w-4 h-4" /> Sign In
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" /> Create Account
            </>
          )}
        </button>
      </form>

      {/* Toggle */}
      <div className="mt-8 text-center text-sm">
        <span className="text-text-secondary">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
        </span>
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
          }}
          className="font-semibold text-primary hover:text-primary-hover transition-colors bg-transparent border-none cursor-pointer"
        >
          {isLogin ? "Sign up" : "Sign in"}
        </button>
      </div>
    </motion.div>
  );

  return (
    <AuthLayout>
      <AnimatePresence mode="wait">
        {formContent}
      </AnimatePresence>
    </AuthLayout>
  );
}
