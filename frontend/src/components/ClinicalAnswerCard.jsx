/**
 * MedGuide AI — ClinicalAnswerCard Component
 * The centerpiece clinical report card displaying the AI-generated answer.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FileText,
  ShieldCheck,
  Clock,
  Copy,
  Bookmark,
  Share2,
  FileDown,
  Check,
  AlertTriangle,
  Star,
} from 'lucide-react';
import { formatElapsedTime } from '@/utils/formatters';

export default function ClinicalAnswerCard({
  answer,
  verification,
  elapsedTime,
  query,
  onBookmark,
}) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const isVerified = verification?.supported === true;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = answer;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    onBookmark?.({ query, answer, bookmarked: !bookmarked });
  };

  return (
    <motion.article
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[var(--shadow-card)] overflow-hidden">
        {/* ── Header ────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
              <FileText size={16} className="text-primary-600" />
            </div>
            <h2 className="text-[16px] font-semibold text-slate-900 tracking-tight">
              Clinical Answer
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Evidence Verified Badge */}
            {verification && (
              <span
                className={`
                  inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold
                  ${
                    isVerified
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/50'
                      : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/50'
                  }
                `}
              >
                {isVerified ? (
                  <ShieldCheck size={13} />
                ) : (
                  <AlertTriangle size={13} />
                )}
                {isVerified ? 'Evidence Verified' : 'Review Recommended'}
              </span>
            )}

            {/* Generation time */}
            {elapsedTime && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 text-[11.5px] text-slate-500 font-medium">
                <Clock size={12} />
                {formatElapsedTime(elapsedTime)}
              </span>
            )}
          </div>
        </div>

        {/* ── Query Context ─────────────────────────────────────── */}
        {query && (
          <div className="mx-6 mb-4 px-4 py-3 bg-slate-50/80 rounded-xl border border-slate-100/50">
            <p className="text-[12px] text-slate-400 font-medium mb-0.5">
              Clinical Query
            </p>
            <p className="text-[14px] text-slate-700 leading-relaxed">{query}</p>
          </div>
        )}

        {/* ── Answer Body ───────────────────────────────────────── */}
        <div className="px-6 pb-5">
          <div className="markdown-content text-[14.5px] leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
          </div>
        </div>

        {/* ── Footer Actions ────────────────────────────────────── */}
        <div className="flex items-center gap-1 px-6 py-3.5 border-t border-slate-50 bg-slate-50/30">
          <ActionButton
            icon={copied ? Check : Copy}
            label={copied ? 'Copied' : 'Copy'}
            onClick={handleCopy}
            active={copied}
          />
          <ActionButton
            icon={bookmarked ? Star : Bookmark}
            label={bookmarked ? 'Saved' : 'Bookmark'}
            onClick={handleBookmark}
            active={bookmarked}
          />
          <ActionButton icon={Share2} label="Share" onClick={() => {}} />
          <ActionButton icon={FileDown} label="Export PDF" onClick={() => {}} />
        </div>
      </div>
    </motion.article>
  );
}

function ActionButton({ icon: Icon, label, onClick, active = false }) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium
        transition-all duration-200
        ${
          active
            ? 'bg-primary-50 text-primary-700'
            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
        }
      `}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}
