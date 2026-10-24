import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ConditionConfig,
  ConditionId,
  CONDITIONS,
  ACTIVE_CONDITIONS,
  getConditionById,
  isModelImplemented,
} from '../config/conditions';

interface ConditionContextType {
  selectedConditionId: ConditionId;
  selectedCondition: ConditionConfig;
  setSelectedConditionId: (id: ConditionId) => void;
  allConditions: ConditionConfig[];
  activeConditions: ConditionConfig[];
  isImplemented: boolean;
}

const ConditionContext = createContext<ConditionContextType | undefined>(undefined);

const STORAGE_KEY = 'axonova_selected_condition';

export const ConditionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedConditionId, setSelectedConditionIdState] = useState<ConditionId>(() => {
    // Try to restore from localStorage, or URL param if present
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const taskParam = urlParams.get('task') as ConditionId;
      if (taskParam && CONDITIONS.some((c) => c.id === taskParam)) {
        return taskParam;
      }
      const saved = localStorage.getItem(STORAGE_KEY) as ConditionId;
      if (saved && CONDITIONS.some((c) => c.id === saved)) {
        return saved;
      }
    }
    return 'brain-tumor';
  });

  const setSelectedConditionId = (id: ConditionId) => {
    setSelectedConditionIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore storage errors
    }
  };

  const selectedCondition = getConditionById(selectedConditionId);
  const isImplemented = isModelImplemented(selectedConditionId);

  return (
    <ConditionContext.Provider
      value={{
        selectedConditionId,
        selectedCondition,
        setSelectedConditionId,
        allConditions: CONDITIONS,
        activeConditions: ACTIVE_CONDITIONS,
        isImplemented,
      }}
    >
      {children}
    </ConditionContext.Provider>
  );
};

export const useCondition = (): ConditionContextType => {
  const context = useContext(ConditionContext);
  if (!context) {
    throw new Error('useCondition must be used within a ConditionProvider');
  }
  return context;
};
