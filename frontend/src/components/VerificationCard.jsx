/**
 * MedGuide AI — VerificationCard Component
 * Evidence verification status with expandable supporting passage.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, AlertTriangle, ChevronDown, ChevronUp, Quote } from 'lucide-react';

export default function VerificationCard({ verification }) {
  const [expanded, setExpanded] = useState(false);

  if (!verification) return null;

  let state = 'amber';
  if (verification.supported === true) state = 'green';
  else if (verification.supported === false) state = 'red';

  const styles = {
    green: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      iconText: 'text-emerald-600',
      title: 'text-emerald-800',
      text: 'text-emerald-700/90',
      label: 'Evidence Supported',
      Icon: ShieldCheck,
      expandBg: 'bg-emerald-100/50',
      expandBorder: 'border-emerald-200/50',
      expandText: 'text-emerald-800',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      iconBg: 'bg-amber-100',
      iconText: 'text-amber-600',
      title: 'text-amber-800',
      text: 'text-amber-700/90',
      label: 'Review Recommended',
      Icon: AlertTriangle,
      expandBg: 'bg-amber-100/50',
      expandBorder: 'border-amber-200/50',
      expandText: 'text-amber-800',
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      iconBg: 'bg-red-100',
      iconText: 'text-red-600',
      title: 'text-red-800',
      text: 'text-red-700/90',
      label: 'Evidence Unsupported',
      Icon: ShieldAlert,
      expandBg: 'bg-red-100/50',
      expandBorder: 'border-red-200/50',
      expandText: 'text-red-800',
    },
  }[state];

  const { Icon } = styles;

  return (
    <motion.div
      className={`rounded-xl border p-5 transition-all shadow-sm ${styles.bg} ${styles.border}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      whileHover={{ y: -1 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${styles.iconBg}`}>
          <Icon size={18} className={styles.iconText} />
        </div>
        <div>
          <h4 className={`text-[14px] font-semibold tracking-tight ${styles.title}`}>
            {styles.label}
          </h4>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Automated Verification</p>
        </div>
      </div>

      {/* Reason */}
      {verification.reason && (
        <p className={`text-[13px] leading-relaxed mt-2 ${styles.text}`}>
          {verification.reason}
        </p>
      )}

      {/* Expandable Supporting Passage */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`mt-3 flex items-center gap-1.5 text-[12px] font-semibold ${styles.title} hover:opacity-80 transition-opacity`}
      >
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {expanded ? 'Hide Supporting Passage' : 'View Supporting Passage'}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={`mt-3 p-3.5 rounded-lg border ${styles.expandBg} ${styles.expandBorder}`}>
              <div className="flex items-start gap-2">
                <Quote size={14} className={`${styles.iconText} mt-0.5 flex-shrink-0 opacity-60`} />
                <p className={`text-[12.5px] leading-relaxed italic ${styles.expandText}`}>
                  {verification.supporting_passage || verification.reason || 'No specific passage extracted for this verification.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
