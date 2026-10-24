import React, { createContext, useContext, useState, useEffect } from 'react';
import { SessionHistoryItem } from '../types';

interface HistoryContextType {
  history: SessionHistoryItem[];
  addHistoryItem: (item: SessionHistoryItem) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType>({
  history: [],
  addHistoryItem: () => {},
  clearHistory: () => {},
});

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<SessionHistoryItem[]>(() => {
    try {
      const saved = sessionStorage.getItem('axonova_session_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('axonova_session_history', JSON.stringify(history));
    } catch (e) {
      console.warn('Unable to persist session history to sessionStorage:', e);
    }
  }, [history]);

  const addHistoryItem = (item: SessionHistoryItem) => {
    setHistory((prev) => [item, ...prev.slice(0, 19)]); // Keep last 20 in session
  };

  const clearHistory = () => {
    setHistory([]);
    sessionStorage.removeItem('axonova_session_history');
  };

  return (
    <HistoryContext.Provider value={{ history, addHistoryItem, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);
