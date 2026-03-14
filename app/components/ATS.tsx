import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

interface ATSProps {
  score: number;
  suggestions: { type: "good" | "improve"; tip: string }[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  const config = score >= 70
    ? { gradient: "from-success-light", label: "Great Job!", color: "text-green-700" }
    : score >= 50
    ? { gradient: "from-warning-light", label: "Good Start", color: "text-amber-700" }
    : { gradient: "from-error-light", label: "Needs Improvement", color: "text-red-700" };

  return (
    <div className={`card bg-gradient-to-b ${config.gradient} to-white`}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`text-2xl font-bold ${config.color}`}>{score}/100</div>
        <div>
          <h3 className="text-lg font-semibold">ATS Compatibility</h3>
          <p className={`text-sm font-medium ${config.color}`}>{config.label}</p>
        </div>
      </div>

      <p className="text-sm text-text-secondary mb-5">
        How well your resume performs in Applicant Tracking Systems used by employers.
      </p>

      <div className="space-y-2.5">
        {suggestions.map((s, i) => (
          <div key={i} className="flex items-start gap-2.5">
            {s.type === "good" ? (
              <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            )}
            <p className={`text-sm ${s.type === "good" ? "text-green-700" : "text-amber-700"}`}>
              {s.tip}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ATS;
