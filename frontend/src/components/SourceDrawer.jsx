/**
 * MedGuide AI — SourceDrawer Component
 * Mobile bottom drawer for evidence panel content.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen } from 'lucide-react';
import EvidenceCard from './EvidenceCard';
import VerificationCard from './VerificationCard';
import WebSourcesCard from './WebSourcesCard';
import { EvidenceSkeleton } from './LoadingSkeleton';

export default function SourceDrawer({
  open,
  onClose,
  sources = [],
  verification = null,
  loading = false,
}) {
  const hasSources = sources.length > 0;
  const localSources = sources.filter((s) => s.source_type !== 'web');
  const hasWebSources = sources.some((s) => s.source_type === 'web');

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/25 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-[var(--shadow-drawer)] max-h-[80vh] flex flex-col"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center">
                  <BookOpen size={14} className="text-primary-600" />
                </div>
                <h3 className="text-[14px] font-semibold text-slate-900">
                  Evidence Sources
                </h3>
                {hasSources && (
                  <span className="text-[11px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    {sources.length}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 transition-colors"
                aria-label="Close evidence panel"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {loading ? (
                <EvidenceSkeleton />
              ) : hasSources ? (
                <>
                  {verification && (
                    <VerificationCard verification={verification} />
                  )}
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
                  {hasWebSources && <WebSourcesCard sources={sources} />}
                </>
              ) : (
                <p className="text-center text-[13px] text-slate-400 py-8">
                  No evidence sources available.
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
