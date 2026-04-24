import { useState, useEffect, useCallback } from 'react';

function storageKey(planningId) {
  return `btv-events-${planningId}`;
}

function loadEvents(planningId) {
  try {
    const key = storageKey(planningId);
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
    // Migrate legacy key for the default planning
    if (planningId === 'default') {
      const old = localStorage.getItem('btv-planning-events');
      if (old) {
        const events = JSON.parse(old);
        localStorage.setItem(key, JSON.stringify(events));
        localStorage.removeItem('btv-planning-events');
        return events;
      }
    }
  } catch {}
  return [];
}

function persist(planningId, events) {
  try { localStorage.setItem(storageKey(planningId), JSON.stringify(events)); } catch {}
}

export function useEvents(planningId = 'default') {
  const [events, setEvents] = useState(() => loadEvents(planningId));

  // Reload events when switching plannings (useState initializer only runs once)
  useEffect(() => {
    setEvents(loadEvents(planningId));
  }, [planningId]);

  const addEvent = useCallback((newEvent) => {
    setEvents(prev => {
      const next = [...prev, { ...newEvent, id: Date.now() }];
      persist(planningId, next);
      return next;
    });
  }, [planningId]);

  const updateEvent = useCallback((id, updates) => {
    setEvents(prev => {
      const next = prev.map(e => e.id === id ? { ...e, ...updates } : e);
      persist(planningId, next);
      return next;
    });
  }, [planningId]);

  const deleteEvent = useCallback((id) => {
    setEvents(prev => {
      const next = prev.filter(e => e.id !== id);
      persist(planningId, next);
      return next;
    });
  }, [planningId]);

  return { events, addEvent, updateEvent, deleteEvent };
}
