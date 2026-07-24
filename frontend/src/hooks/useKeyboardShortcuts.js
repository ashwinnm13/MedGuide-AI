/**
 * MedGuide AI — useKeyboardShortcuts Hook
 * Global keyboard shortcut handler for the application.
 */

import { useEffect, useCallback } from 'react';

/**
 * Register global keyboard shortcuts.
 * @param {object} handlers - Map of action names to callback functions
 * @param {object} [options] - Options
 * @param {boolean} [options.enabled=true] - Whether shortcuts are active
 */
export function useKeyboardShortcuts(handlers, options = {}) {
  const { enabled = true } = options;

  const handleKeyDown = useCallback(
    (event) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in inputs (except Escape)
      const isInput =
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable;

      // Ctrl/Cmd + K → Focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        handlers.onFocusSearch?.();
        return;
      }

      // Ctrl/Cmd + B → Toggle sidebar
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        handlers.onToggleSidebar?.();
        return;
      }

      // Ctrl/Cmd + E → Toggle evidence panel
      if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
        event.preventDefault();
        handlers.onToggleEvidence?.();
        return;
      }

      // Escape → Close modals, drawers, or blur search
      if (event.key === 'Escape') {
        handlers.onEscape?.();
        return;
      }

      // Enter (without Shift) in search → Submit
      if (
        event.key === 'Enter' &&
        !event.shiftKey &&
        isInput &&
        event.target.dataset.searchInput
      ) {
        event.preventDefault();
        handlers.onSubmit?.();
        return;
      }
    },
    [enabled, handlers]
  );

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, handleKeyDown]);
}
