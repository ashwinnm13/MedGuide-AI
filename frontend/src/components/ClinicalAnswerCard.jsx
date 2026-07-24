/**
 * MedGuide AI — ClinicalAnswerCard Component
 * AI Clinical Decision Support Report with tabbed navigation,
 * medical icons, superscript citations, and clinical insights.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Activity,
  AlertCircle,
  Lightbulb,
  Library,
  Globe,
  Stethoscope,
  Pill,
  BookOpen,
  Hospital,
  ChevronRight,
} from 'lucide-react';
import { formatElapsedTime, parseMarkdownSections } from '@/utils/formatters';

// ── Tab definitions ──────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview', icon: Stethoscope, emoji: '🩺' },
  { id: 'actions', label: 'Clinical Actions', icon: Pill, emoji: '💊' },
  { id: 'alerts', label: 'Safety Alerts', icon: AlertTriangle, emoji: '⚠' },
  { id: 'evidence', label: 'Supporting Evidence', icon: BookOpen, emoji: '📖' },
  { id: 'references', label: 'References', icon: Library, emoji: '📚' },
];

// ── Section-to-tab mapping ────────────────────────────────────────────
function categorizeSections(sections) {
  const buckets = {
    overview: [],
    actions: [],
    alerts: [],
    evidence: [],
    references: [],
  };

  for (const section of sections) {
    const t = section.title.toLowerCase();
    if (t.includes('overview') || t.includes('summary') || t.includes('definition')) {
      buckets.overview.push(section);
    } else if (t.includes('action') || t.includes('recommendation') || t.includes('key') || t.includes('treatment') || t.includes('clinical action')) {
      buckets.actions.push(section);
    } else if (t.includes('alert') || t.includes('warning') || t.includes('safety') || t.includes('consideration') || t.includes('contraindication')) {
      buckets.alerts.push(section);
    } else if (t.includes('evidence') || t.includes('supporting')) {
      buckets.evidence.push(section);
    } else if (t.includes('reference') || t.includes('source') || t.includes('citation')) {
      buckets.references.push(section);
    } else if (!section.title) {
      buckets.overview.push(section);
    } else {
      // Default: put uncategorized content in overview
      buckets.overview.push(section);
    }
  }

  return buckets;
}

// ── Superscript citation preprocessor ─────────────────────────────────
function addSuperscriptCitations(text) {
  // Convert [1], [2] etc into superscript markers
  return text.replace(/\[(\d+)\]/g, '<sup class="citation-sup">[$1]</sup>');
}

// ── Confidence gauge component ────────────────────────────────────────
function ConfidenceGauge({ score = 97 }) {
  const filled = Math.round(score / 10);
  const empty = 10 - filled;
  const blocks = '█'.repeat(filled) + '░'.repeat(empty);
  
  let label = 'High Confidence';
  let color = 'text-emerald-400';
  if (score < 70) { label = 'Low Confidence'; color = 'text-red-400'; }
  else if (score < 85) { label = 'Moderate Confidence'; color = 'text-amber-400'; }

  return (
    <div className="mt-3">
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
        Clinical Confidence
      </p>
      <div className="flex items-center gap-2.5">
        <span className={`text-[14px] font-mono tracking-tight ${color}`}>{blocks}</span>
        <span className={`text-[13px] font-bold ${color}`}>{score}%</span>
      </div>
      <p className={`text-[11px] font-semibold mt-0.5 ${color}`}>{label}</p>
    </div>
  );
}

// ── Clinical Insights Box ─────────────────────────────────────────────
function ClinicalInsightsBox({ query, sources }) {
  // Extract guideline name from first source
  const guidelineName = sources?.[0]?.organization || sources?.[0]?.title?.split(' ').slice(0, 2).join(' ') || 'Clinical Guideline';
  const sourceCount = sources?.length || 0;
  const hasWebSources = sources?.some(s => s.source_type === 'web');
  
  const insights = [
    { label: 'Evidence Level', value: sourceCount >= 3 ? 'High' : sourceCount >= 1 ? 'Moderate' : 'Limited', color: sourceCount >= 3 ? 'text-emerald-600' : 'text-amber-600' },
    { label: 'Primary Guideline', value: guidelineName },
    { label: 'Sources', value: `${sourceCount} analyzed` },
    { label: 'Source Type', value: hasWebSources ? 'Web + Guideline' : 'Clinical Guideline' },
  ];

  return (
    <motion.div
      className="mt-4 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">
        Clinical Insights
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {insights.map((insight, i) => (
          <div key={i} className="space-y-0.5">
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{insight.label}</p>
            <p className={`text-[13px] font-semibold ${insight.color || 'text-slate-200'} truncate`}>{insight.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Section Icon Mapping ──────────────────────────────────────────────
function getSectionIcon(title, tabId) {
  const t = title.toLowerCase();
  if (t.includes('medication') || t.includes('drug') || t.includes('pharmacolog')) return { icon: Pill, emoji: '💊' };
  if (t.includes('follow-up') || t.includes('followup') || t.includes('monitor')) return { icon: Hospital, emoji: '🏥' };
  if (t.includes('contraindication') || t.includes('warning') || t.includes('alert')) return { icon: AlertCircle, emoji: '⚠' };
  if (t.includes('evidence') || t.includes('reference')) return { icon: BookOpen, emoji: '📖' };
  
  // Default per tab
  const defaults = {
    overview: { icon: Stethoscope, emoji: '🩺' },
    actions: { icon: Lightbulb, emoji: '💊' },
    alerts: { icon: AlertTriangle, emoji: '⚠' },
    evidence: { icon: BookOpen, emoji: '📖' },
    references: { icon: Library, emoji: '📚' },
  };
  return defaults[tabId] || { icon: Activity, emoji: '→' };
}

// ── Custom Markdown components ────────────────────────────────────────
function getMarkdownComponents(tabId, sources) {
  return {
    // Custom list items with medical markers
    li({ children, ...props }) {
      let marker, markerClass;
      switch (tabId) {
        case 'actions':
          marker = '✓';
          markerClass = 'text-primary-600 font-bold text-[15px]';
          break;
        case 'alerts':
          marker = '•';
          markerClass = 'text-amber-500 font-bold text-[18px] leading-none';
          break;
        case 'evidence':
          marker = '→';
          markerClass = 'text-secondary-600 font-medium';
          break;
        default:
          marker = '→';
          markerClass = 'text-slate-400';
      }

      return (
        <li className="relative pl-7 mb-3 text-[14px] leading-relaxed" {...props}>
          <span className={`absolute left-0 top-[2px] ${markerClass}`}>{marker}</span>
          {children}
        </li>
      );
    },

    // Paragraphs with proper spacing
    p({ children, ...props }) {
      return (
        <p className="text-[14px] leading-[1.8] text-slate-600 mb-3" {...props}>
          {children}
        </p>
      );
    },

    // Strong text
    strong({ children, ...props }) {
      return <strong className="font-semibold text-slate-800" {...props}>{children}</strong>;
    },

    // Links and citations
    a({ href, children, ...props }) {
      const text = String(children);
      const isNumericRef = /^\[?\d+\]?$/.test(text);
      
      if (isNumericRef) {
        // Floating superscript citation with tooltip
        const num = text.replace(/[\[\]]/g, '');
        const sourceInfo = sources?.[parseInt(num) - 1];
        const tooltip = sourceInfo ? `${sourceInfo.title || 'Source'} ${sourceInfo.page ? `• Page ${sourceInfo.page}` : ''}` : `Source ${num}`;
        
        return (
          <span className="relative inline-block group">
            <sup
              className="text-[10px] font-bold text-primary-600 cursor-pointer hover:text-primary-800 transition-colors ml-0.5"
              title={tooltip}
            >
              {num}
            </sup>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-50 font-medium">
              {tooltip}
            </span>
          </span>
        );
      }

      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700 underline underline-offset-2 font-medium"
          {...props}
        >
          {children}
        </a>
      );
    },
  };
}

// ══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════
export default function ClinicalAnswerCard({
  answer,
  verification,
  elapsedTime,
  query,
  onBookmark,
  sources = [],
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const isVerified = verification?.supported === true;
  const sections = parseMarkdownSections(answer);
  const categorized = categorizeSections(sections);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
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

  const activeContent = categorized[activeTab] || [];
  const markdownComponents = getMarkdownComponents(activeTab, sources);

  // Count non-empty tabs for badge
  const tabCounts = {};
  for (const tab of TABS) {
    tabCounts[tab.id] = categorized[tab.id]?.length || 0;
  }

  return (
    <motion.article
      className="w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-[var(--shadow-card)] overflow-hidden">

        {/* ════════════════════════════════════════════════════════════
            HEADER — AI Clinical Decision Support Report
            ════════════════════════════════════════════════════════════ */}
        <div className="px-7 pt-7 pb-5 bg-slate-900 text-white relative overflow-hidden">
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
            {/* Left */}
            <div className="flex-1">
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-1">
                AI Clinical Decision Support Report
              </p>
              <p className="text-[10px] text-slate-500 font-medium mb-3">
                Generated by MedGuide AI
              </p>
              <h1 className="text-[20px] font-semibold text-white leading-snug">
                {query}
              </h1>

              {/* Meta chips */}
              <div className="flex flex-wrap items-center gap-3 mt-5">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <Clock size={12} /> {formatElapsedTime(elapsedTime)}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <Library size={12} /> {sources.length} Sources
                </span>
                {verification && (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${isVerified ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'}`}>
                    {isVerified ? <ShieldCheck size={12} /> : <AlertTriangle size={12} />}
                    {isVerified ? 'Evidence Verified' : 'Review Recommended'}
                  </span>
                )}
              </div>
            </div>

            {/* Right — Confidence Gauge */}
            <div className="shrink-0">
              <ConfidenceGauge score={isVerified ? 97 : 72} />
            </div>
          </div>

          {/* Clinical Insights Box */}
          <ClinicalInsightsBox query={query} sources={sources} />
        </div>

        {/* ════════════════════════════════════════════════════════════
            TAB NAVIGATION
            ════════════════════════════════════════════════════════════ */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50/50 px-1 scrollbar-hide">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const count = tabCounts[tab.id];
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3.5 text-[12.5px] font-semibold whitespace-nowrap
                  transition-all relative outline-none
                  ${isActive ? 'text-primary-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'}
                `}
              >
                <span className="text-[14px]">{tab.emoji}</span>
                {tab.label}
                {count > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-primary-100 text-primary-700' : 'bg-slate-200 text-slate-500'}`}>
                    {count}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeTabBar"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-600 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ════════════════════════════════════════════════════════════
            TAB CONTENT
            ════════════════════════════════════════════════════════════ */}
        <div className="p-7 min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeContent.length > 0 ? (
                <div className="space-y-8">
                  {activeContent.map((section, index) => {
                    const sectionMeta = getSectionIcon(section.title, activeTab);
                    const SectionIcon = sectionMeta.icon;

                    // Alerts tab gets special amber treatment
                    const isAlertSection = activeTab === 'alerts';

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className={isAlertSection ? 'bg-amber-50/60 rounded-xl border border-amber-200/50 p-5' : ''}
                      >
                        {/* Section header */}
                        {section.title && (
                          <div className="flex items-center gap-2.5 mb-4">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isAlertSection ? 'bg-amber-100' : 'bg-slate-100'}`}>
                              <SectionIcon size={16} className={isAlertSection ? 'text-amber-600' : 'text-slate-600'} />
                            </div>
                            <h3 className={`text-[15px] font-bold ${isAlertSection ? 'text-amber-900' : 'text-slate-900'}`}>
                              {section.title}
                            </h3>
                          </div>
                        )}

                        {/* Section content */}
                        <div className={`markdown-list-styled ${section.title ? 'pl-[42px]' : ''} ${isAlertSection ? 'text-amber-800/90' : 'text-slate-700'}`}>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                          >
                            {section.content}
                          </ReactMarkdown>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-slate-300">
                  <Activity size={36} className="mb-3 opacity-30" />
                  <p className="text-[14px] font-medium">No {TABS.find(t => t.id === activeTab)?.label.toLowerCase()} content for this query.</p>
                  <p className="text-[12px] text-slate-400 mt-1">Try switching to another tab.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ════════════════════════════════════════════════════════════
            FOOTER ACTIONS
            ════════════════════════════════════════════════════════════ */}
        <div className="flex items-center gap-2 px-7 py-4 border-t border-slate-100 bg-slate-50/50">
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

// ── Action Button ─────────────────────────────────────────────────────
function ActionButton({ icon: Icon, label, onClick, active = false }) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold
        transition-all duration-200 border
        ${
          active
            ? 'bg-primary-50 text-primary-700 border-primary-200'
            : 'bg-white text-slate-500 border-slate-200 hover:text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
        }
      `}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}
