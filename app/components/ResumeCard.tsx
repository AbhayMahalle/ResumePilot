import { Link } from "react-router";
import { motion } from "framer-motion";
import ScoreCircle from "~/components/ScoreCircle";
import { Calendar, ArrowRight, Building, Briefcase } from "lucide-react";

const ResumeCard = ({ resume, index = 0 }: { resume: any; index?: number }) => {
  const { id, companyName, jobTitle, overallScore, createdAt } = resume;
  const score = overallScore || 0;

  const badgeClass = score >= 70 ? "badge-success" : score >= 50 ? "badge-warning" : "badge-error";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link
        to={`/resume/${id}`}
        className="card-hover flex items-center justify-between gap-4 group block"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {companyName && (
              <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                <Building className="w-3.5 h-3.5" />
                {companyName}
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-text-primary truncate">
            {jobTitle || "Resume Analysis"}
          </h3>
          <div className="flex items-center gap-3 mt-2">
            <span className={badgeClass}>{score}/100</span>
            {createdAt && (
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <Calendar className="w-3 h-3" />
                {formatDate(createdAt)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <ScoreCircle score={score} />
          <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
};

export default ResumeCard;
