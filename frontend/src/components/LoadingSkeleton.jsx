/**
 * MedGuide AI — LoadingSkeleton Component
 * Shimmer skeleton cards mimicking the clinical answer card shape.
 */

import { motion } from 'framer-motion';

function SkeletonBlock({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

export default function LoadingSkeleton({ message = 'Processing...' }) {
  return (
    <motion.div
      className="w-full max-w-2xl mx-auto space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main answer skeleton */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[var(--shadow-card)] p-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="w-8 h-8 rounded-lg" />
            <SkeletonBlock className="w-36 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <SkeletonBlock className="w-24 h-6 rounded-full" />
            <SkeletonBlock className="w-16 h-6 rounded-full" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="space-y-3 mb-5">
          <SkeletonBlock className="w-full h-4" />
          <SkeletonBlock className="w-11/12 h-4" />
          <SkeletonBlock className="w-4/5 h-4" />
          <SkeletonBlock className="w-full h-4" />
          <SkeletonBlock className="w-3/4 h-4" />
        </div>

        {/* Divider */}
        <div className="border-t border-slate-50 my-4" />

        {/* Section heading skeleton */}
        <div className="space-y-3 mb-4">
          <SkeletonBlock className="w-44 h-5" />
          <SkeletonBlock className="w-full h-4" />
          <SkeletonBlock className="w-10/12 h-4" />
          <SkeletonBlock className="w-3/5 h-4" />
        </div>

        {/* Another section */}
        <div className="space-y-3 mb-4">
          <SkeletonBlock className="w-52 h-5" />
          <SkeletonBlock className="w-full h-4" />
          <SkeletonBlock className="w-9/12 h-4" />
        </div>

        {/* Footer skeleton */}
        <div className="border-t border-slate-50 pt-4 mt-4 flex items-center gap-3">
          <SkeletonBlock className="w-20 h-8 rounded-lg" />
          <SkeletonBlock className="w-24 h-8 rounded-lg" />
          <SkeletonBlock className="w-18 h-8 rounded-lg" />
          <SkeletonBlock className="w-24 h-8 rounded-lg" />
        </div>
      </div>

      {/* Loading message */}
      <motion.p
        className="text-center text-[13px] text-slate-400 font-medium"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {message}
      </motion.p>
    </motion.div>
  );
}

/**
 * Skeleton for the evidence panel cards.
 */
export function EvidenceSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-slate-100 p-4 space-y-2.5"
        >
          <div className="flex items-center gap-2">
            <SkeletonBlock className="w-5 h-5 rounded" />
            <SkeletonBlock className="w-28 h-3.5" />
          </div>
          <SkeletonBlock className="w-full h-4" />
          <SkeletonBlock className="w-3/4 h-3.5" />
          <div className="flex items-center justify-between pt-1">
            <SkeletonBlock className="w-16 h-6 rounded-full" />
            <SkeletonBlock className="w-20 h-6 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
