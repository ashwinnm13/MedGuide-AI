/**
 * MedGuide AI — SearchBar Component
 * Auto-expanding clinical query input with file, voice, and submit controls.
 */

import { forwardRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { motion } from 'framer-motion';
import { Search, Paperclip, Mic, ArrowUp, Command } from 'lucide-react';

const SearchBar = forwardRef(function SearchBar(
  { value, onChange, onSubmit, loading = false, className = '' },
  ref
) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
  };

  const hasValue = value && value.trim().length > 0;

  return (
    <motion.div
      className={`relative w-full max-w-2xl mx-auto ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <div
        className={`
          relative flex items-end gap-2 bg-white rounded-2xl border
          transition-all duration-300 ease-out
          shadow-[var(--shadow-card)]
          hover:shadow-[var(--shadow-card-hover)]
          focus-within:shadow-[var(--shadow-card-hover)]
          focus-within:border-primary-300
          ${loading ? 'border-primary-200 bg-primary-50/30' : 'border-slate-200'}
          px-4 py-3
        `}
      >
        {/* Search icon */}
        <Search
          size={20}
          className="flex-shrink-0 text-slate-300 mb-0.5"
          aria-hidden="true"
        />

        {/* Textarea */}
        <TextareaAutosize
          ref={ref}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a clinical question..."
          minRows={1}
          maxRows={6}
          disabled={loading}
          data-search-input="true"
          className="
            flex-1 resize-none bg-transparent text-[15px] text-slate-800
            placeholder:text-slate-400 leading-relaxed
            focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed
          "
          aria-label="Clinical question input"
        />

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0 mb-0.5">
          {/* File attachment */}
          <button
            type="button"
            className="p-1.5 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-colors"
            aria-label="Attach file"
            title="Attach file"
          >
            <Paperclip size={16} />
          </button>

          {/* Voice input */}
          <button
            type="button"
            className="p-1.5 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-colors"
            aria-label="Voice input"
            title="Voice input"
          >
            <Mic size={16} />
          </button>

          {/* Submit */}
          <button
            type="button"
            onClick={onSubmit}
            disabled={!hasValue || loading}
            className={`
              p-2 rounded-xl transition-all duration-200
              ${
                hasValue && !loading
                  ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md active:scale-95'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }
            `}
            aria-label="Submit clinical question"
          >
            {loading ? (
              <motion.div
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            ) : (
              <ArrowUp size={16} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* Keyboard shortcut hint */}
      <div className="flex justify-center mt-2">
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-300">
          <kbd className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-medium text-slate-400">
            Ctrl
          </kbd>
          <span>+</span>
          <kbd className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-medium text-slate-400">
            K
          </kbd>
          <span className="ml-1">to focus</span>
        </span>
      </div>
    </motion.div>
  );
});

export default SearchBar;
