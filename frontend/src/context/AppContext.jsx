/**
 * MedGuide AI — Global Application Context
 * Manages conversations, sidebar state, evidence panel state, and bookmarks.
 */

import { createContext, useContext, useReducer, useCallback } from 'react';
import { generateId } from '../utils/formatters';

const AppContext = createContext(null);

// ─── Action Types ───────────────────────────────────────────────────
const actions = {
  ADD_CONVERSATION: 'ADD_CONVERSATION',
  SET_ACTIVE_CONVERSATION: 'SET_ACTIVE_CONVERSATION',
  UPDATE_CONVERSATION: 'UPDATE_CONVERSATION',
  CLEAR_ACTIVE: 'CLEAR_ACTIVE',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_SIDEBAR: 'SET_SIDEBAR',
  TOGGLE_EVIDENCE_PANEL: 'TOGGLE_EVIDENCE_PANEL',
  SET_EVIDENCE_PANEL: 'SET_EVIDENCE_PANEL',
  ADD_BOOKMARK: 'ADD_BOOKMARK',
  REMOVE_BOOKMARK: 'REMOVE_BOOKMARK',
};

// ─── Initial State ──────────────────────────────────────────────────
const initialState = {
  conversations: [],
  activeConversationId: null,
  sidebarOpen: true,
  evidencePanelOpen: true,
  bookmarks: [],
};

// ─── Reducer ────────────────────────────────────────────────────────
function appReducer(state, action) {
  switch (action.type) {
    case actions.ADD_CONVERSATION: {
      const conversation = {
        id: action.payload.id,
        query: action.payload.query,
        answer: null,
        sources: [],
        verification: null,
        createdAt: new Date().toISOString(),
        status: 'loading',
        elapsedTime: null,
      };
      return {
        ...state,
        conversations: [conversation, ...state.conversations],
        activeConversationId: conversation.id,
      };
    }

    case actions.SET_ACTIVE_CONVERSATION:
      return {
        ...state,
        activeConversationId: action.payload,
      };

    case actions.UPDATE_CONVERSATION:
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload.data } : c
        ),
      };

    case actions.CLEAR_ACTIVE:
      return {
        ...state,
        activeConversationId: null,
      };

    case actions.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case actions.SET_SIDEBAR:
      return { ...state, sidebarOpen: action.payload };

    case actions.TOGGLE_EVIDENCE_PANEL:
      return { ...state, evidencePanelOpen: !state.evidencePanelOpen };

    case actions.SET_EVIDENCE_PANEL:
      return { ...state, evidencePanelOpen: action.payload };

    case actions.ADD_BOOKMARK:
      if (state.bookmarks.find((b) => b.id === action.payload.id)) return state;
      return {
        ...state,
        bookmarks: [action.payload, ...state.bookmarks],
      };

    case actions.REMOVE_BOOKMARK:
      return {
        ...state,
        bookmarks: state.bookmarks.filter((b) => b.id !== action.payload),
      };

    default:
      return state;
  }
}

// ─── Provider ───────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addConversation = useCallback((query) => {
    const id = generateId();
    dispatch({ type: actions.ADD_CONVERSATION, payload: { id, query } });
    return id;
  }, []);

  const setActiveConversation = useCallback((id) => {
    dispatch({ type: actions.SET_ACTIVE_CONVERSATION, payload: id });
  }, []);

  const updateConversation = useCallback((id, data) => {
    dispatch({ type: actions.UPDATE_CONVERSATION, payload: { id, data } });
  }, []);

  const clearActive = useCallback(() => {
    dispatch({ type: actions.CLEAR_ACTIVE });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: actions.TOGGLE_SIDEBAR });
  }, []);

  const setSidebar = useCallback((open) => {
    dispatch({ type: actions.SET_SIDEBAR, payload: open });
  }, []);

  const toggleEvidencePanel = useCallback(() => {
    dispatch({ type: actions.TOGGLE_EVIDENCE_PANEL });
  }, []);

  const setEvidencePanel = useCallback((open) => {
    dispatch({ type: actions.SET_EVIDENCE_PANEL, payload: open });
  }, []);

  const addBookmark = useCallback((bookmark) => {
    dispatch({ type: actions.ADD_BOOKMARK, payload: bookmark });
  }, []);

  const removeBookmark = useCallback((id) => {
    dispatch({ type: actions.REMOVE_BOOKMARK, payload: id });
  }, []);

  const activeConversation = state.conversations.find(
    (c) => c.id === state.activeConversationId
  );

  const value = {
    ...state,
    activeConversation,
    addConversation,
    setActiveConversation,
    updateConversation,
    clearActive,
    toggleSidebar,
    setSidebar,
    toggleEvidencePanel,
    setEvidencePanel,
    addBookmark,
    removeBookmark,
    dispatch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ─── Hook ───────────────────────────────────────────────────────────
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
