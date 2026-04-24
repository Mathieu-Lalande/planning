import { createContext, useContext, useState, useCallback } from 'react';

const DEFAULT_PLANNING = {
  id: 'default',
  name: 'Planning BTV 2026',
  startYear: 2026,
  startMonth: 3,
  monthCount: 8,
};

const STORAGE_KEY = 'btv-planning-state';

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { plannings: [DEFAULT_PLANNING], activePlanningId: 'default' };
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

const PlanningContext = createContext(null);

export function PlanningProvider({ children }) {
  const [state, setState] = useState(loadState);

  const config = state.plannings.find(p => p.id === state.activePlanningId) ?? state.plannings[0];

  // All mutations use functional setState to avoid stale closure bugs
  const updateActivePlanning = useCallback((updates) => {
    setState(prev => {
      const next = {
        ...prev,
        plannings: prev.plannings.map(p =>
          p.id === prev.activePlanningId ? { ...p, ...updates } : p
        ),
      };
      saveState(next);
      return next;
    });
  }, []);

  const setActivePlanning = useCallback((id) => {
    setState(prev => {
      const next = { ...prev, activePlanningId: id };
      saveState(next);
      return next;
    });
  }, []);

  const createPlanning = useCallback((data) => {
    const id = `p-${Date.now()}`;
    setState(prev => {
      const planning = { ...DEFAULT_PLANNING, ...data, id };
      const next = { plannings: [...prev.plannings, planning], activePlanningId: id };
      saveState(next);
      return next;
    });
    return id;
  }, []);

  const deletePlanning = useCallback((id) => {
    setState(prev => {
      if (prev.plannings.length <= 1) return prev;
      const plannings = prev.plannings.filter(p => p.id !== id);
      const activePlanningId = id === prev.activePlanningId ? plannings[0].id : prev.activePlanningId;
      const next = { plannings, activePlanningId };
      saveState(next);
      return next;
    });
  }, []);

  return (
    <PlanningContext.Provider value={{
      config,
      plannings: state.plannings,
      activePlanningId: state.activePlanningId,
      updateActivePlanning,
      setActivePlanning,
      createPlanning,
      deletePlanning,
    }}>
      {children}
    </PlanningContext.Provider>
  );
}

export function usePlanning() {
  return useContext(PlanningContext);
}
