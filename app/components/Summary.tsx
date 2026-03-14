import ScoreGauge from "~/components/ScoreGauge";

const Category = ({ title, score }: { title: string; score: number }) => {
  const color = score >= 70 ? "text-green-700" : score >= 50 ? "text-amber-700" : "text-red-700";
  const bg = score >= 70 ? "bg-success-light" : score >= 50 ? "bg-warning-light" : "bg-error-light";

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-bg">
      <span className="text-sm font-medium text-text-primary">{title}</span>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-semibold ${color}`}>{score}/100</span>
        <div className={`w-2 h-2 rounded-full ${bg}`} style={{ backgroundColor: score >= 70 ? '#22C55E' : score >= 50 ? '#F59E0B' : '#EF4444' }} />
      </div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="card">
      <div className="flex items-center gap-6 mb-6">
        <ScoreGauge score={feedback.overallScore} />
        <div>
          <h3 className="text-lg font-semibold mb-1">Overall Score</h3>
          <p className="text-sm text-text-secondary">
            Based on ATS compatibility, content, structure, tone, and skills analysis.
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <Category title="Tone & Style" score={feedback.toneAndStyle?.score || 0} />
        <Category title="Content" score={feedback.content?.score || 0} />
        <Category title="Structure" score={feedback.structure?.score || 0} />
        <Category title="Skills" score={feedback.skills?.score || 0} />
      </div>
    </div>
  );
};

export default Summary;
