interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  const config = score >= 70
    ? { bg: "bg-success-light", text: "text-green-700", label: "Strong" }
    : score >= 50
    ? { bg: "bg-warning-light", text: "text-amber-700", label: "Good Start" }
    : { bg: "bg-error-light", text: "text-red-700", label: "Needs Work" };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default ScoreBadge;
