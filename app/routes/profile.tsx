import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuthStore } from "~/lib/store";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import {
  User, Mail, Linkedin, Github, Globe, Briefcase, GraduationCap,
  Wrench, Save, Pen, X, Plus
} from "lucide-react";

export const meta = () => [
  { title: "ResumePilot – Profile" },
  { name: "description", content: "Manage your ResumePilot profile" },
];

const experienceLevels = ["Entry Level", "Mid Level", "Senior", "Lead", "Manager", "Director", "VP", "C-Level"];

export default function Profile() {
  const { user, isAuthenticated, isLoading: authLoading, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  // Editable form state
  const [form, setForm] = useState({
    name: "",
    linkedin: "",
    github: "",
    portfolio: "",
    jobRole: "",
    experienceLevel: "",
    skills: [] as string[],
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate("/auth");
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        portfolio: user.portfolio || "",
        jobRole: user.jobRole || "",
        experienceLevel: user.experienceLevel || "",
        skills: user.skills || [],
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(form);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !form.skills.includes(skill)) {
      setForm({ ...form, skills: [...form.skills, skill] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  type FormField = {
    icon: any;
    label: string;
    key: keyof typeof form;
    type?: string;
    placeholder: string;
  };

  const fields: FormField[] = [
    { icon: User, label: "Full Name", key: "name", placeholder: "John Doe" },
    { icon: Linkedin, label: "LinkedIn URL", key: "linkedin", type: "url", placeholder: "https://linkedin.com/in/..." },
    { icon: Github, label: "GitHub URL", key: "github", type: "url", placeholder: "https://github.com/..." },
    { icon: Globe, label: "Portfolio URL", key: "portfolio", type: "url", placeholder: "https://yoursite.com" },
    { icon: Briefcase, label: "Job Role Preference", key: "jobRole", placeholder: "E.g. Full Stack Developer" },
  ];

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
            {/* Profile header */}
            <div className="card mb-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0">
                  {getInitials(user?.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="!text-xl font-bold truncate">{user?.name || "User"}</h2>
                  <p className="text-text-secondary text-sm flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    {user?.email}
                  </p>
                  {user?.createdAt && (
                    <p className="text-xs text-text-muted mt-1">
                      Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={isEditing ? "btn-outline !text-sm" : "btn-secondary !text-sm"}
                >
                  {isEditing ? (
                    <><X className="w-4 h-4" /> Cancel</>
                  ) : (
                    <><Pen className="w-4 h-4" /> Edit Profile</>
                  )}
                </button>
              </div>
            </div>

            {/* Profile fields */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-5">Profile Information</h3>

              <div className="space-y-5">
                {fields.map(({ icon: Icon, label, key, type, placeholder }) => (
                  <div key={key} className="form-group">
                    <label className="form-label flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {label}
                    </label>
                    {isEditing ? (
                      <input
                        type={type || "text"}
                        value={form[key] as string}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        placeholder={placeholder}
                      />
                    ) : (
                      <p className="text-text-primary py-2 text-sm">
                        {(form[key] as string) || <span className="text-text-muted italic">Not set</span>}
                      </p>
                    )}
                  </div>
                ))}

                {/* Experience Level */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Experience Level
                  </label>
                  {isEditing ? (
                    <select
                      value={form.experienceLevel}
                      onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                      <option value="">Select level</option>
                      {experienceLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-text-primary py-2 text-sm">
                      {form.experienceLevel || <span className="text-text-muted italic">Not set</span>}
                    </p>
                  )}
                </div>

                {/* Skills */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <Wrench className="w-4 h-4" />
                    Skills
                  </label>
                  {isEditing && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                        placeholder="Add a skill and press Enter"
                        className="flex-1"
                      />
                      <button type="button" onClick={addSkill} className="btn-secondary !px-3 !py-2 shrink-0">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.skills.length > 0 ? form.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-light text-primary rounded-lg text-sm font-medium"
                      >
                        {skill}
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="hover:text-error transition-colors cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    )) : (
                      <span className="text-sm text-text-muted italic">No skills added</span>
                    )}
                  </div>
                </div>

                {/* Save button */}
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-3"
                  >
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="btn-primary w-full !py-3"
                    >
                      {isSaving ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      ) : (
                        <><Save className="w-4 h-4" /> Save Changes</>
                      )}
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
