/**
 * MedGuide AI — HomePage
 * The main clinical workspace integrating search, empty states, loading, and answers.
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { useChat } from '@/hooks/useChat';
import { SUGGESTION_CHIPS } from '@/utils/constants';

import SearchBar from '@/components/SearchBar';
import SuggestionChip from '@/components/SuggestionChip';
import EmptyState from '@/components/EmptyState';
import StatusTracker from '@/components/StatusTracker';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ClinicalAnswerCard from '@/components/ClinicalAnswerCard';

export default function HomePage() {
  const { activeConversation, updateConversation, addBookmark } = useApp();
  const { submit, loading, currentStage, error } = useChat();
  const [inputValue, setInputValue] = useState('');
  const searchInputRef = useRef(null);

  // If there's an active conversation, don't show the empty state
  const isQueryActive = activeConversation != null;

  // Sync input value with active conversation (if user selects history)
  useEffect(() => {
    if (activeConversation && activeConversation.status === 'completed') {
      setInputValue(''); // clear input if viewing past
    }
  }, [activeConversation]);

  const handleSubmit = (query = inputValue) => {
    if (!query.trim() || loading) return;
    submit(query);
  };

  const handleSuggestionClick = (chip) => {
    setInputValue(chip.query);
    handleSubmit(chip.query);
  };

  const handleBookmark = ({ query, answer, bookmarked }) => {
    if (bookmarked && activeConversation) {
      addBookmark(activeConversation);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col min-h-full">
      {/* ── Top Area: Greeting or Active Query ──────────────────── */}
      <AnimatePresence mode="wait">
        {!isQueryActive ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col items-center justify-center pb-8"
          >
            <EmptyState />
          </motion.div>
        ) : (
          <motion.div
            key="active-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 pb-24"
          >
            {/* Loading States */}
            {activeConversation.status === 'loading' && (
              <div className="mt-8 space-y-6">
                <StatusTracker currentStage={currentStage} />
                <LoadingSkeleton />
              </div>
            )}

            {/* Completed Answer */}
            {activeConversation.status === 'completed' && (
              <div className="mt-8">
                <ClinicalAnswerCard
                  answer={activeConversation.answer}
                  verification={activeConversation.verification}
                  elapsedTime={activeConversation.elapsedTime}
                  query={activeConversation.query}
                  onBookmark={handleBookmark}
                />
              </div>
            )}

            {/* Error State */}
            {activeConversation.status === 'error' && (
              <div className="mt-8 p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-center">
                <p className="font-semibold mb-2">Error Processing Query</p>
                <p className="text-sm">{error || activeConversation.error}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom Area: Search Bar & Suggestions ───────────────── */}
      <div
        className={`
          transition-all duration-500 ease-out z-20 w-full max-w-3xl mx-auto
          ${isQueryActive ? 'mt-12' : 'mt-auto'}
        `}
      >
        <div className="relative">
          <SearchBar
            ref={searchInputRef}
            value={inputValue}
            onChange={setInputValue}
            onSubmit={() => handleSubmit()}
            loading={loading}
          />
        </div>

        {/* Suggestion Chips (Only on empty state) */}
        {!isQueryActive && (
          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-2.5 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {SUGGESTION_CHIPS.map((chip, index) => (
              <SuggestionChip
                key={chip.id}
                chip={chip}
                index={index}
                onClick={handleSuggestionClick}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
