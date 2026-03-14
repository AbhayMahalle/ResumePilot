import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ScoreGaugeProps {
  score: number;
  size?: number;
}

const ScoreGauge = ({ score, size = 120 }: ScoreGaugeProps) => {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));

  useEffect(() => {
    const timer = setTimeout(() => setDisplayScore(clampedScore), 100);
    return () => clearTimeout(timer);
  }, [clampedScore]);

  const color = clampedScore >= 70
    ? "#22C55E"
    : clampedScore >= 50
    ? "#F59E0B"
    : "#EF4444";

  const bgColor = clampedScore >= 70
    ? "#DCFCE7"
    : clampedScore >= 50
    ? "#FEF3C7"
    : "#FEE2E2";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F1F5F9"
          strokeWidth={8}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (displayScore / 100) * circumference }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-2xl font-bold"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {displayScore}
        </motion.span>
        <span className="text-xs text-text-muted">/100</span>
      </div>
    </div>
  );
};

export default ScoreGauge;
