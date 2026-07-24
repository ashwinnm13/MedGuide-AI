/**
 * MedGuide AI — EvidenceChain Component
 * Visual vertical timeline showing the flow of evidence sources
 * leading to verification status.
 */

import { motion } from 'framer-motion';
import { FileText, Globe, ShieldCheck, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function EvidenceChain({ sources = [], verified = false }) {
  if (!sources.length) return null;

  // Only show first 4 sources in the chain
  const chainSources = sources.slice(0, 4);

  return (
    <motion.div
      className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    >
      <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider mb-4">
        Evidence Chain
      </h4>

      <div className="relative pl-4">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-slate-200" />

        {chainSources.map((source, index) => {
          const isWeb = source.source_type === 'web';
          return (
            <motion.div
              key={index}
              className="relative flex items-start gap-3 mb-5 last:mb-0"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              {/* Node dot */}
              <div className={`
                w-4 h-4 rounded-full border-2 flex-shrink-0 z-10 mt-0.5
                ${isWeb ? 'border-secondary-400 bg-secondary-50' : 'border-primary-400 bg-primary-50'}
              `} />

              {/* Content */}
              <div className="flex-1 -mt-0.5">
                <p className="text-[12.5px] font-semibold text-slate-800 leading-snug">
                  {source.title || 'Source'}
                </p>
                {source.page != null && (
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Page {source.page}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Verification node */}
        <motion.div
          className="relative flex items-start gap-3"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + chainSources.length * 0.1 }}
        >
          <div className={`
            w-4 h-4 rounded-full border-2 flex-shrink-0 z-10 mt-0.5
            ${verified ? 'border-emerald-500 bg-emerald-100' : 'border-amber-500 bg-amber-100'}
          `} />
          <div className="flex-1 -mt-0.5">
            <p className={`text-[12.5px] font-bold ${verified ? 'text-emerald-700' : 'text-amber-700'}`}>
              {verified ? 'Verification Passed' : 'Review Recommended'}
            </p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Automated verification complete
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
