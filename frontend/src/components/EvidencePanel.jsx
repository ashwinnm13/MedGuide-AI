/**
 * MedGuide AI — EvidencePanel Component
 * Right sidebar showing evidence sources, verification status, and web sources.
 */

import { motion } from 'framer-motion';
import { BookOpen, FileSearch } from 'lucide-react';
import EvidenceCard from './EvidenceCard';
import VerificationCard from './VerificationCard';
import WebSourcesCard from './WebSourcesCard';
import { EvidenceSkeleton } from './LoadingSkeleton';

export default function EvidencePanel({
  sources = [],
  verification = null,
  loading = false,
}) {
  const localSources = sources.filter((s) => s.source_type !== 'web');
  const hasWebSources = sources.some((s) => s.source_type === 'web');
  const hasSources = sources.length > 0;

  return (
    <aside
      className="h-full flex flex-col bg-slate-50/50 border-l border-slate-100"
      style={{ width: 'var(--width-evidence)' }}
      aria-label="Evidence panel"
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-5 pt-5 pb-4 border-b border-slate-100 bg-white/50">
        <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
          <BookOpen size={16} className="text-primary-600" />
        </div>
        <div>
          <h3 className="text-[14px] font-semibold text-slate-900 tracking-tight">
            Evidence Sources
          </h3>
          <p className="text-[11px] text-slate-400">
            {hasSources
              ? `${sources.length} source${sources.length > 1 ? 's' : ''} found`
              : 'No sources yet'}
          </p>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {loading ? (
          <EvidenceSkeleton />
        ) : hasSources ? (
          <>
            {/* Verification Card */}
            {verification && (
              <VerificationCard verification={verification} />
            )}

            {/* Local evidence sources */}
            {localSources.length > 0 && (
              <div className="space-y-2.5">
                {localSources.map((source, index) => (
                  <EvidenceCard
                    key={`${source.title}-${index}`}
                    source={source}
                    index={index}
                  />
                ))}
              </div>
            )}

            {/* Web sources */}
            {hasWebSources && <WebSourcesCard sources={sources} />}
          </>
        ) : (
          <EmptyEvidence />
        )}
      </div>
    </aside>
  );
}

function EmptyEvidence() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
        <FileSearch size={20} className="text-slate-300" />
      </div>
      <p className="text-[13px] font-medium text-slate-400">
        No evidence loaded
      </p>
      <p className="text-[11.5px] text-slate-300 mt-1 max-w-[200px]">
        Submit a clinical query to retrieve evidence sources.
      </p>
    </motion.div>
  );
}
