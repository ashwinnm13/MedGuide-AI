/**
 * MedGuide AI — VerificationCard Component
 * Displays the evidence verification status in human-readable language.
 */

import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function VerificationCard({ verification }) {
  if (!verification) return null;

  const isSupported = verification.supported === true;

  return (
    <motion.div
      className={`
        rounded-xl border p-4 transition-all
        ${
          isSupported
            ? 'bg-emerald-50/50 border-emerald-200/60'
            : 'bg-amber-50/50 border-amber-200/60'
        }
      `}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-2.5">
        <div
          className={`
            w-8 h-8 rounded-lg flex items-center justify-center
            ${isSupported ? 'bg-emerald-100' : 'bg-amber-100'}
          `}
        >
          {isSupported ? (
            <ShieldCheck size={16} className="text-emerald-600" />
          ) : (
            <ShieldAlert size={16} className="text-amber-600" />
          )}
        </div>
        <div>
          <h4
            className={`text-[13px] font-semibold ${
              isSupported ? 'text-emerald-800' : 'text-amber-800'
            }`}
          >
            {isSupported ? 'Evidence Supported' : 'Review Recommended'}
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Verification Status</p>
        </div>
      </div>

      {/* Reason */}
      {verification.reason && (
        <p
          className={`text-[12.5px] leading-relaxed ${
            isSupported ? 'text-emerald-700/80' : 'text-amber-700/80'
          }`}
        >
          {verification.reason}
        </p>
      )}
    </motion.div>
  );
}
