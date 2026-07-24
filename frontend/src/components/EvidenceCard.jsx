/**
 * MedGuide AI — EvidenceCard Component
 * Displays a single retrieved evidence source with confidence scoring.
 */

import { motion } from 'framer-motion';
import { FileText, ExternalLink, Globe } from 'lucide-react';
import { formatConfidence, getConfidenceColor } from '@/utils/formatters';

export default function EvidenceCard({ source, index = 0 }) {
  const isWeb = source.source_type === 'web';
  const confidence = source.final_score || source.semantic_score;

  return (
    <motion.div
      className="
        group bg-white rounded-xl border border-slate-100 p-4
        hover:border-slate-200 hover:shadow-[var(--shadow-card-hover)]
        transition-all duration-250 ease-out cursor-default
      "
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      whileHover={{ y: -1 }}
    >
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex items-start gap-2.5 mb-2">
        <div
          className={`
            w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
            ${isWeb ? 'bg-secondary-50' : 'bg-primary-50'}
          `}
        >
          {isWeb ? (
            <Globe size={14} className="text-secondary-600" />
          ) : (
            <FileText size={14} className="text-primary-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {/* Organization */}
          {source.organization && (
            <p className="text-[10.5px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">
              {source.organization}
            </p>
          )}
          {/* Title */}
          <h4 className="text-[13px] font-semibold text-slate-800 leading-snug line-clamp-2">
            {source.title || 'Untitled Source'}
          </h4>
        </div>
      </div>

      {/* ── Meta Row ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          {/* Page number */}
          {source.page != null && (
            <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
              Page {source.page}
            </span>
          )}

          {/* Confidence score */}
          {confidence != null && (
            <span
              className={`text-[11px] font-semibold ${getConfidenceColor(confidence)}`}
            >
              {formatConfidence(confidence)}
            </span>
          )}

          {/* Source type badge */}
          <span
            className={`
              text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider
              ${
                isWeb
                  ? 'bg-secondary-50 text-secondary-700'
                  : 'bg-primary-50 text-primary-700'
              }
            `}
          >
            {isWeb ? 'Web' : 'Guideline'}
          </span>
        </div>

        {/* View source button */}
        {source.url && (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-1 text-[11px] font-medium text-primary-600
              hover:text-primary-700 transition-colors
            "
          >
            View Source
            <ExternalLink size={11} />
          </a>
        )}
      </div>

      {/* ── Confidence Bar ────────────────────────────────────── */}
      {confidence != null && (
        <div className="mt-3">
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                confidence >= 0.8
                  ? 'bg-emerald-400'
                  : confidence >= 0.6
                    ? 'bg-amber-400'
                    : 'bg-red-400'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(confidence * 100)}%` }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
