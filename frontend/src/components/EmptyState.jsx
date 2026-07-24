/**
 * MedGuide AI — EmptyState Component
 * Welcoming empty state with logo and call-to-action for new queries.
 */

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import logoImg from '@/assets/medguide ai logo.jpg';

export default function EmptyState() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Logo */}
      <motion.div
        className="relative mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg ring-4 ring-primary-50">
          <img
            src={logoImg}
            alt="MedGuide AI"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Sparkle badge */}
        <motion.div
          className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles size={13} className="text-white" />
        </motion.div>
      </motion.div>

      {/* Heading */}
      <motion.h2
        className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        How can I help today?
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        className="mt-3 text-[15px] text-slate-400 text-center max-w-md leading-relaxed"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        Ask evidence-based medical questions using trusted clinical guidelines.
      </motion.p>

      {/* Trust indicators */}
      <motion.div
        className="flex items-center gap-4 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.4 }}
      >
        {[
          { label: 'Evidence Verified', color: 'text-emerald-500' },
          { label: 'Citation Backed', color: 'text-primary-500' },
          { label: 'Guideline Based', color: 'text-secondary-500' },
        ].map((badge) => (
          <div
            key={badge.label}
            className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-400"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badge.color} bg-current`} />
            {badge.label}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
