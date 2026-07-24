/**
 * MedGuide AI — Application Constants
 * Central source of truth for colors, navigation, suggestions, and configuration.
 */

// ─── API Configuration ──────────────────────────────────────────────
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// ─── Color Tokens ───────────────────────────────────────────────────
export const COLORS = {
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryDark: '#1D4ED8',
  secondary: '#14B8A6',
  secondaryLight: '#2DD4BF',
  background: '#F8FAFC',
  card: '#FFFFFF',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
};

// ─── Navigation Items ───────────────────────────────────────────────
export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'Home', path: '/' },
  {
    id: 'new-consultation',
    label: 'New Consultation',
    icon: 'FilePlus2',
    path: '/new',
  },
  {
    id: 'recent',
    label: 'Recent Conversations',
    icon: 'Clock',
    path: '/recent',
  },
  { id: 'bookmarks', label: 'Bookmarks', icon: 'Bookmark', path: '/bookmarks' },
  {
    id: 'saved-reports',
    label: 'Saved Reports',
    icon: 'FileText',
    path: '/reports',
  },
  {
    id: 'guidelines',
    label: 'Medical Guidelines',
    icon: 'BookOpen',
    path: '/guidelines',
  },
  { id: 'settings', label: 'Settings', icon: 'Settings', path: '/settings' },
];

// ─── Suggestion Chips ───────────────────────────────────────────────
export const SUGGESTION_CHIPS = [
  {
    id: 'acute-pain',
    label: 'Acute Pain',
    query: 'What are the current guidelines for managing acute pain in adults?',
    icon: 'Zap',
  },
  {
    id: 'hypertension',
    label: 'Hypertension',
    query:
      'What are the latest evidence-based guidelines for hypertension management?',
    icon: 'Heart',
  },
  {
    id: 'diabetes',
    label: 'Diabetes',
    query: 'What are the current clinical guidelines for Type 2 diabetes management?',
    icon: 'Activity',
  },
  {
    id: 'stroke',
    label: 'Stroke',
    query: 'What are the evidence-based guidelines for acute stroke management?',
    icon: 'Brain',
  },
  {
    id: 'heart-failure',
    label: 'Heart Failure',
    query: 'What are the current guidelines for heart failure treatment?',
    icon: 'HeartPulse',
  },
  {
    id: 'covid-19',
    label: 'COVID-19',
    query: 'What are the latest clinical guidelines for COVID-19 treatment?',
    icon: 'Shield',
  },
  {
    id: 'opioid-tapering',
    label: 'Opioid Tapering',
    query: 'What are the CDC guidelines for opioid tapering in chronic pain?',
    icon: 'TrendingDown',
  },
];

// ─── Loading Stages ─────────────────────────────────────────────────
export const LOADING_STAGES = [
  {
    id: 'searching',
    label: 'Searching Guidelines',
    message: 'Searching medical guidelines...',
    icon: 'Search',
  },
  {
    id: 'retrieving',
    label: 'Retrieving Evidence',
    message: 'Retrieving evidence...',
    icon: 'Database',
  },
  {
    id: 'verifying',
    label: 'Verifying Evidence',
    message: 'Validating citations...',
    icon: 'ShieldCheck',
  },
  {
    id: 'generating',
    label: 'Generating Clinical Answer',
    message: 'Generating evidence-based answer...',
    icon: 'Sparkles',
  },
  {
    id: 'completed',
    label: 'Completed',
    message: 'Analysis complete',
    icon: 'CheckCircle2',
  },
];

// ─── Keyboard Shortcuts ─────────────────────────────────────────────
export const SHORTCUTS = {
  focusSearch: { key: 'k', modifier: 'ctrlKey', label: '⌘K' },
  toggleSidebar: { key: 'b', modifier: 'ctrlKey', label: '⌘B' },
  toggleEvidence: { key: 'e', modifier: 'ctrlKey', label: '⌘E' },
  escape: { key: 'Escape', modifier: null, label: 'Esc' },
};

// ─── Application Meta ───────────────────────────────────────────────
export const APP_VERSION = '1.0.0';
export const APP_NAME = 'MedGuide AI';
export const APP_TAGLINE = 'Evidence-Based Clinical Assistant';
