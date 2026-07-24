/**
 * MedGuide AI — WebSourcesCard Component
 * Displays external clinical web sources when Tavily fallback is used.
 */

import { motion } from 'framer-motion';
import { Globe, ExternalLink, Shield } from 'lucide-react';

// Known medical organization branding
const ORG_STYLES = {
  who: { label: 'WHO', color: 'bg-blue-50 text-blue-700 ring-blue-200/50' },
  cdc: { label: 'CDC', color: 'bg-indigo-50 text-indigo-700 ring-indigo-200/50' },
  nice: { label: 'NICE', color: 'bg-purple-50 text-purple-700 ring-purple-200/50' },
  pubmed: { label: 'PubMed', color: 'bg-teal-50 text-teal-700 ring-teal-200/50' },
  nih: { label: 'NIH', color: 'bg-green-50 text-green-700 ring-green-200/50' },
  mayo: { label: 'Mayo Clinic', color: 'bg-red-50 text-red-700 ring-red-200/50' },
};

function getOrgStyle(url) {
  if (!url) return null;
  const lower = url.toLowerCase();
  for (const [key, style] of Object.entries(ORG_STYLES)) {
    if (lower.includes(key)) return style;
  }
  return null;
}

export default function WebSourcesCard({ sources }) {
  if (!sources || sources.length === 0) return null;

  const webSources = sources.filter((s) => s.source_type === 'web');
  if (webSources.length === 0) return null;

  return (
    <motion.div
      className="bg-white rounded-xl border border-slate-100 p-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-secondary-50 flex items-center justify-center">
          <Globe size={14} className="text-secondary-600" />
        </div>
        <h4 className="text-[13px] font-semibold text-slate-800">
          External Clinical Sources
        </h4>
      </div>

      {/* Source list */}
      <div className="space-y-2">
        {webSources.map((source, index) => {
          const orgStyle = getOrgStyle(source.url);

          return (
            <motion.a
              key={index}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center gap-3 px-3 py-2.5 rounded-lg
                hover:bg-slate-50 transition-colors group
              "
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + index * 0.06 }}
            >
              {/* Org badge */}
              {orgStyle ? (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ring-1 ${orgStyle.color}`}
                >
                  {orgStyle.label}
                </span>
              ) : (
                <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center">
                  <Globe size={11} className="text-slate-400" />
                </div>
              )}

              {/* Title */}
              <span className="flex-1 text-[12.5px] text-slate-600 font-medium truncate group-hover:text-slate-800">
                {source.title || 'External Source'}
              </span>

              {/* External link icon */}
              <ExternalLink
                size={13}
                className="text-slate-300 group-hover:text-primary-500 transition-colors flex-shrink-0"
              />
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
}
