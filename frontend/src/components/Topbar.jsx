/**
 * MedGuide AI — Topbar Component
 * Mobile/tablet top navigation bar with sidebar and evidence panel toggles.
 */

import { Menu, PanelRight, Activity } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Topbar() {
  const { toggleSidebar, toggleEvidencePanel, activeConversation } = useApp();

  return (
    <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-slate-100">
      {/* Left — Sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="p-2 -ml-1 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors"
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Center — Logo & Title */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <Activity size={18} className="text-primary-600" />
          <span className="text-[15px] font-semibold text-slate-900 tracking-tight">
            MedGuide AI
          </span>
        </div>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      </div>

      {/* Right — Evidence panel toggle */}
      <button
        onClick={toggleEvidencePanel}
        className={`p-2 -mr-1 rounded-xl transition-colors ${
          activeConversation
            ? 'hover:bg-primary-50 text-primary-600'
            : 'text-slate-300 cursor-default'
        }`}
        aria-label="Toggle evidence panel"
        disabled={!activeConversation}
      >
        <PanelRight size={20} />
      </button>
    </header>
  );
}
