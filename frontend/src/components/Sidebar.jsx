/**
 * MedGuide AI — Sidebar Component
 * Left navigation panel with logo, nav items, and user profile.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  FilePlus2,
  Clock,
  Bookmark,
  FileText,
  BookOpen,
  Settings,
  ChevronLeft,
  Activity,
  User,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { NAV_ITEMS, APP_VERSION } from '@/utils/constants';
import logoImg from '@/assets/medguide ai logo.jpg';

const iconMap = {
  Home,
  FilePlus2,
  Clock,
  Bookmark,
  FileText,
  BookOpen,
  Settings,
};

export default function Sidebar({ onNavigate, activePath = '/' }) {
  const { sidebarOpen, toggleSidebar, conversations } = useApp();

  const handleNavClick = (item) => {
    if (item.id === 'new-consultation' || item.id === 'home') {
      onNavigate?.('home');
    }
  };

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            aria-hidden="true"
          />

          <motion.aside
            className="fixed lg:relative z-50 top-0 left-0 h-full flex flex-col bg-white border-r border-slate-200/80 select-none"
            style={{ width: 'var(--width-sidebar)' }}
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            role="navigation"
            aria-label="Main navigation"
          >
            {/* ── Logo & Status ─────────────────────────────────── */}
            <div className="flex items-center gap-3 px-5 pt-6 pb-4">
              <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                <img
                  src={logoImg}
                  alt="MedGuide AI"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-[15px] font-semibold text-slate-900 leading-tight tracking-tight">
                  MedGuide AI
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] text-slate-400 font-medium">
                    Clinical AI Assistant
                  </span>
                </div>
              </div>
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            </div>

            {/* ── Divider ───────────────────────────────────────── */}
            <div className="mx-4 border-t border-slate-100" />

            {/* ── Navigation ────────────────────────────────────── */}
            <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
              {NAV_ITEMS.map((item) => {
                const Icon = iconMap[item.icon] || Home;
                const isActive = item.path === activePath;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`
                      group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                      transition-all duration-200 ease-out
                      ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 font-medium shadow-sm'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                      }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon
                      size={18}
                      className={`flex-shrink-0 transition-colors ${
                        isActive
                          ? 'text-primary-600'
                          : 'text-slate-400 group-hover:text-slate-500'
                      }`}
                    />
                    <span className="text-[13.5px] leading-tight">{item.label}</span>

                    {/* Badge for recent conversations */}
                    {item.id === 'recent' && conversations.length > 0 && (
                      <span className="ml-auto text-[11px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                        {conversations.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* ── Divider ───────────────────────────────────────── */}
            <div className="mx-4 border-t border-slate-100" />

            {/* ── User Profile & Version ────────────────────────── */}
            <div className="px-4 py-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm">
                  <User size={14} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-slate-700 truncate">
                    Clinician
                  </p>
                  <p className="text-[11px] text-slate-400">Healthcare Provider</p>
                </div>
              </div>
              <p className="text-[10.5px] text-slate-300 text-center tracking-wide">
                MedGuide AI v{APP_VERSION}
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
