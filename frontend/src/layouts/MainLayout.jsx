/**
 * MedGuide AI — MainLayout Component
 * Three-column responsive layout orchestrating Sidebar, Workspace, and Evidence Panel.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import EvidencePanel from '@/components/EvidencePanel';
import SourceDrawer from '@/components/SourceDrawer';

export default function MainLayout({ children }) {
  const {
    sidebarOpen,
    setSidebar,
    evidencePanelOpen,
    setEvidencePanel,
    toggleSidebar,
    toggleEvidencePanel,
    activeConversation,
  } = useApp();
  const isDesktop = useIsDesktop();
  const location = useLocation();

  // Reset sidebar on route change (mobile)
  useEffect(() => {
    if (!isDesktop) setSidebar(false);
  }, [location.pathname, isDesktop, setSidebar]);

  // Ensure sidebar is open by default on desktop
  useEffect(() => {
    if (isDesktop) setSidebar(true);
  }, [isDesktop, setSidebar]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onToggleSidebar: toggleSidebar,
    onToggleEvidence: () => {
      if (activeConversation) toggleEvidencePanel();
    },
    onEscape: () => {
      if (!isDesktop && sidebarOpen) setSidebar(false);
      if (!isDesktop && evidencePanelOpen) setEvidencePanel(false);
    },
  });

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* ── Left Sidebar ────────────────────────────────────────── */}
      <Sidebar />

      {/* ── Main Content Area ───────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 relative h-full">
        <Topbar />

        <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth pb-[100px]">
          {children}
        </main>
      </div>

      {/* ── Right Evidence Panel (Desktop) ──────────────────────── */}
      {isDesktop && activeConversation && evidencePanelOpen && (
        <EvidencePanel
          sources={activeConversation.sources}
          verification={activeConversation.verification}
          loading={activeConversation.status === 'loading'}
        />
      )}

      {/* ── Bottom Source Drawer (Mobile/Tablet) ────────────────── */}
      {!isDesktop && activeConversation && (
        <SourceDrawer
          open={evidencePanelOpen}
          onClose={() => setEvidencePanel(false)}
          sources={activeConversation.sources}
          verification={activeConversation.verification}
          loading={activeConversation.status === 'loading'}
        />
      )}
    </div>
  );
}
