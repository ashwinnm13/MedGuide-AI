/**
 * MedGuide AI — StatusTracker Component
 * Animated step-by-step progress indicator for query processing stages.
 */

import { motion } from 'framer-motion';
import {
  Search,
  Database,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { LOADING_STAGES } from '@/utils/constants';

const iconMap = {
  Search,
  Database,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
};

const stageOrder = ['searching', 'retrieving', 'verifying', 'generating', 'completed'];

function getStageStatus(stageId, currentStage) {
  const currentIdx = stageOrder.indexOf(currentStage);
  const stageIdx = stageOrder.indexOf(stageId);

  if (stageIdx < currentIdx) return 'completed';
  if (stageIdx === currentIdx) return 'active';
  return 'pending';
}

export default function StatusTracker({ currentStage }) {
  if (!currentStage) return null;

  return (
    <motion.div
      className="w-full max-w-lg mx-auto my-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[var(--shadow-card)] p-5">
        <div className="space-y-1">
          {LOADING_STAGES.map((stage, index) => {
            const status = getStageStatus(stage.id, currentStage);
            const Icon = iconMap[stage.icon] || Search;

            return (
              <motion.div
                key={stage.id}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-xl transition-colors duration-300
                  ${status === 'active' ? 'bg-primary-50/60' : ''}
                `}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
              >
                {/* Icon */}
                <div
                  className={`
                    w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    transition-all duration-300
                    ${
                      status === 'completed'
                        ? 'bg-emerald-50 text-emerald-600'
                        : status === 'active'
                          ? 'bg-primary-100 text-primary-600'
                          : 'bg-slate-50 text-slate-300'
                    }
                  `}
                >
                  {status === 'completed' ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <Icon
                      size={16}
                      className={status === 'active' ? 'animate-pulse' : ''}
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`
                    text-[13px] font-medium transition-colors duration-300
                    ${
                      status === 'completed'
                        ? 'text-emerald-600'
                        : status === 'active'
                          ? 'text-primary-700'
                          : 'text-slate-300'
                    }
                  `}
                >
                  {stage.label}
                </span>

                {/* Active indicator */}
                {status === 'active' && (
                  <motion.div
                    className="ml-auto flex gap-1"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="w-1 h-1 rounded-full bg-primary-400" />
                    <span className="w-1 h-1 rounded-full bg-primary-400" />
                    <span className="w-1 h-1 rounded-full bg-primary-400" />
                  </motion.div>
                )}

                {/* Completed check */}
                {status === 'completed' && (
                  <motion.span
                    className="ml-auto text-[11px] text-emerald-500 font-medium"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    Done
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
