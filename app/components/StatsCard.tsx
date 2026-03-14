import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

const StatsCard = ({ icon: Icon, label, value, subtitle, color = "primary" }: StatsCardProps) => {
  const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
    primary: { bg: "bg-primary-light", text: "text-primary", iconBg: "bg-primary/10" },
    success: { bg: "bg-success-light", text: "text-green-700", iconBg: "bg-success/10" },
    warning: { bg: "bg-warning-light", text: "text-amber-700", iconBg: "bg-warning/10" },
    secondary: { bg: "bg-secondary-light", text: "text-secondary", iconBg: "bg-secondary/10" },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 8px 25px -5px rgba(0,0,0,0.08)" }}
      className="card flex items-center gap-4"
    >
      <div className={`w-12 h-12 ${c.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
        <Icon className={`w-6 h-6 ${c.text}`} />
      </div>
      <div>
        <p className="text-sm text-text-secondary font-medium">{label}</p>
        <p className={`text-2xl font-bold ${c.text}`}>{value}</p>
        {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
      </div>
    </motion.div>
  );
};

export default StatsCard;
