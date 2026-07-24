/**
 * MedGuide AI — useChat Hook
 * Manages the full clinical query lifecycle with staged loading.
 */

import { useState, useCallback, useRef } from 'react';
import { submitQuery } from '../services/api';
import { useApp } from '../context/AppContext';

const STAGE_DELAYS = {
  searching: 600,
  retrieving: 800,
  verifying: 700,
  generating: 900,
};

/**
 * Custom hook that orchestrates submitting a clinical query,
 * tracking loading stages, and managing the response state.
 */
export function useChat() {
  const { addConversation, updateConversation, conversations } = useApp();
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState(null);
  const [error, setError] = useState(null);
  const startTimeRef = useRef(null);

  const simulateStages = useCallback(() => {
    return new Promise((resolve) => {
      const stages = ['searching', 'retrieving', 'verifying', 'generating'];
      let i = 0;

      function nextStage() {
        if (i < stages.length) {
          setCurrentStage(stages[i]);
          const delay = STAGE_DELAYS[stages[i]];
          i++;
          setTimeout(nextStage, delay);
        } else {
          resolve();
        }
      }

      nextStage();
    });
  }, []);

  const submit = useCallback(
    async (query) => {
      if (!query.trim() || loading) return;

      setLoading(true);
      setError(null);
      setCurrentStage('searching');
      startTimeRef.current = Date.now();

      // Add conversation to global state and get its ID
      const conversationId = addConversation(query);

      // Start stage simulation and API call in parallel
      const stagePromise = simulateStages();

      try {
        const [, response] = await Promise.all([
          stagePromise,
          submitQuery(query),
        ]);

        const elapsedTime = Date.now() - startTimeRef.current;

        setCurrentStage('completed');

        // Update the conversation state with the response
        updateConversation(conversationId, {
          answer: response.answer,
          sources: response.sources || [],
          verification: response.verification || null,
          status: 'completed',
          elapsedTime,
        });

        // Briefly show completed stage, then clear
        setTimeout(() => {
          setCurrentStage(null);
          setLoading(false);
        }, 800);

        return response;
      } catch (err) {
        const elapsedTime = Date.now() - startTimeRef.current;
        const errMsg = err.message || 'An error occurred while processing your query.';
        setError(errMsg);
        setCurrentStage(null);
        setLoading(false);

        updateConversation(conversationId, {
          status: 'error',
          error: errMsg,
          elapsedTime,
        });

        return null;
      }
    },
    [loading, addConversation, updateConversation, simulateStages]
  );

  /**
   * Helper to update the latest conversation in state.
   * This is a workaround since we can't get the ID synchronously.
   */
  const updateLatestConversation = useCallback(
    (data) => {
      // This will be handled by the parent component
    },
    []
  );

  const reset = useCallback(() => {
    setLoading(false);
    setCurrentStage(null);
    setError(null);
    startTimeRef.current = null;
  }, []);

  return {
    loading,
    currentStage,
    error,
    submit,
    reset,
  };
}
