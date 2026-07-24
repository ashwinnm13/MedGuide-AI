/**
 * MedGuide AI — EvidenceCard Component
 * Rich evidence source card with star ratings, confidence meter,
 * page numbers, and source badges.
 */

import { motion } from 'framer-motion';
import { FileText, ExternalLink, Globe, Star } from 'lucide-react';
import { formatConfidence, getConfidenceColor } from '@/utils/formatters';

function StarRating({ score }) {
  if (score == null) return null;
  const filled = Math.round(score * 10);
  const empty = 10 - filled;
  return (
    <div className="flex items-center gap-1">
      <span className="text-[11px] text-amber-500 tracking-tight font-mono">
        {'★'.repeat(filled)}{'☆'.repeat(empty)}
      </span>
    </div>
  );
}

export default function EvidenceCard({ source, index = 0 }) {
  const isWeb = source.source_type === 'web';
  const confidence = source.final_score || source.semantic_score;

  return (
    <motion.div
      className="
        group bg-white rounded-xl border border-slate-200 p-4
        hover:border-slate-300 hover:shadow-md
        transition-all duration-250 ease-out cursor-default
      "
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      whileHover={{ y: -2 }}
    >
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 mb-2">
        <div
          className={`
            w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
            ${isWeb ? 'bg-secondary-50 text-secondary-600' : 'bg-primary-50 text-primary-600'}
          `}
        >
          {isWeb ? <Globe size={15} /> : <FileText size={15} />}
        </div>
        <div className="flex-1 min-w-0">
          {/* Organization */}
          {source.organization && (
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">
              {source.organization}
            </p>
          )}
          {/* Title */}
          <h4 className="text-[13px] font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors">
            {source.title || 'Untitled Source'}
          </h4>
        </div>
      </div>

      {/* ── Star Rating ───────────────────────────────────────── */}
      {confidence != null && (
        <div className="mb-2 ml-11">
          <StarRating score={confidence} />
        </div>
      )}

      {/* ── Meta Row ──────────────────────────────────────────── */}
      <div className="flex items-center flex-wrap gap-1.5 ml-11">
        {/* Confidence match */}
        {confidence != null && (
          <span className={`text-[12px] font-bold ${getConfidenceColor(confidence)}`}>
            {formatConfidence(confidence)} Match
          </span>
        )}

        {/* Page number */}
        {source.page != null && (
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/50">
            Page {source.page}
          </span>
        )}

        {/* Source type badge */}
        <span
          className={`
            text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border
            ${
              isWeb
                ? 'bg-secondary-50 text-secondary-700 border-secondary-200'
                : 'bg-primary-50 text-primary-700 border-primary-200'
            }
          `}
        >
          {isWeb ? 'Web' : 'Guideline'}
        </span>
      </div>

      {/* ── Confidence Bar ────────────────────────────────────── */}
      {confidence != null && (
        <div className="mt-3 ml-11">
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

      {/* ── Open Source Button ─────────────────────────────────── */}
      {source.url && (
        <div className="mt-3 ml-11">
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-1.5 text-[11px] font-bold text-primary-600
              hover:text-primary-800 transition-colors bg-primary-50 hover:bg-primary-100
              px-3 py-1.5 rounded-md border border-primary-200/60
            "
          >
            Open Source
            <ExternalLink size={11} />
          </a>
        </div>
      )}
    </motion.div>
  );
}
