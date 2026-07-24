/**
 * MedGuide AI — SuggestionChip Component
 * Clickable clinical topic pills for quick query submission.
 */

import { motion } from 'framer-motion';
import {
  Zap,
  Heart,
  Activity,
  Brain,
  HeartPulse,
  Shield,
  TrendingDown,
} from 'lucide-react';

const iconMap = {
  Zap,
  Heart,
  Activity,
  Brain,
  HeartPulse,
  Shield,
  TrendingDown,
};

export default function SuggestionChip({ chip, onClick, index = 0 }) {
  const Icon = iconMap[chip.icon] || Activity;

  return (
    <motion.button
      onClick={() => onClick?.(chip)}
      className="
        group inline-flex items-center gap-2 px-4 py-2.5 rounded-full
        bg-white border border-slate-200/80 text-slate-600
        hover:border-primary-200 hover:bg-primary-50/50 hover:text-primary-700
        hover:shadow-sm active:scale-[0.97]
        transition-all duration-200 ease-out
        text-[13px] font-medium whitespace-nowrap
      "
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.06,
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{ y: -2 }}
      aria-label={`Search for ${chip.label}`}
    >
      <Icon
        size={14}
        className="text-slate-400 group-hover:text-primary-500 transition-colors"
      />
      {chip.label}
    </motion.button>
  );
}
