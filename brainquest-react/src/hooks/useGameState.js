import { useState, useCallback, useEffect } from 'react';
import { ALL_BADGES } from '../data/rewards';

const DEFAULT_STATE = {
  name: '',
  avatar: '🦁',
  xp: 0,
  streak: 1,
  totalLevels: 0,
  levels: { puzzle: 1, math: 1, draw: 1, science: 1 },
  stars: { puzzle: {}, math: {}, draw: {}, science: {} },
  questDone: { puzzle: false, math: false, draw: false, science: false },
  badges: [],
  lastPlayDate: null,
  timerLimit: 30,
  timeUsed: 0,
  timeUsedSeconds: 0,
  soundOn: true,
  performanceMode: false,
  lang: 'en',
};

function loadFromStorage() {
  try {
    const saved = localStorage.getItem('bq_state_v5');
    if (!saved) return DEFAULT_STATE;
    const parsed = JSON.parse(saved);
    const state = { ...DEFAULT_STATE, ...parsed };
    if (typeof parsed.timeUsedSeconds !== 'number') {
      state.timeUsedSeconds = Math.max(0, Math.round((parsed.timeUsed || 0) * 60));
    }
    // Daily quest reset
    const today = new Date().toDateString();
    if (state.lastPlayDate && state.lastPlayDate !== today) {
      state.questDone = { puzzle: false, math: false, draw: false, science: false };
      state.streak = (state.streak || 1) + 1;
      state.timeUsed = 0;
      state.timeUsedSeconds = 0;
    }
    state.lastPlayDate = today;
    return state;
  } catch {
    return DEFAULT_STATE;
  }
}

export function useGameState() {
  const [state, setState] = useState(() => loadFromStorage());

  // Auto-save on every change
  useEffect(() => {
    try {
      localStorage.setItem('bq_state_v5', JSON.stringify(state));
    } catch {}
  }, [state]);

  const checkBadges = useCallback((newState) => {
    const newBadges = [...newState.badges];
    ALL_BADGES.forEach(b => {
      if (!newBadges.includes(b.id) && b.check(newState)) {
        newBadges.push(b.id);
      }
    });
    return newBadges;
  }, []);

  const addXP = useCallback((amount) => {
    setState(prev => {
      const next = { ...prev, xp: prev.xp + amount };
      next.badges = checkBadges(next);
      return next;
    });
  }, [checkBadges]);

  const saveLevelComplete = useCallback((type, level, stars) => {
    setState(prev => {
      const wasCompleted = !!prev.stars[type]?.[level];
      const newStars = { ...prev.stars, [type]: { ...prev.stars[type], [level]: Math.max(prev.stars[type]?.[level] || 0, stars) } };
      const newLevels = { ...prev.levels, [type]: Math.min(Math.max(prev.levels[type], level + 1), 100) };
      const newQuestDone = { ...prev.questDone, [type]: true };
      const next = {
        ...prev,
        stars: newStars,
        levels: newLevels,
        questDone: newQuestDone,
        totalLevels: (prev.totalLevels || 0) + (wasCompleted ? 0 : 1),
      };
      next.badges = checkBadges(next);
      return next;
    });
  }, [checkBadges]);

  const setProfile = useCallback((name, avatar) => {
    setState(prev => ({ ...prev, name, avatar }));
  }, []);

  const setAvatar = useCallback((avatar) => {
    setState(prev => ({ ...prev, avatar }));
  }, []);

  const toggleSound = useCallback(() => {
    setState(prev => ({ ...prev, soundOn: !prev.soundOn }));
  }, []);

  const setLang = useCallback((lang) => {
    setState(prev => ({ ...prev, lang }));
  }, []);

  const togglePerformanceMode = useCallback(() => {
    setState(prev => ({ ...prev, performanceMode: !prev.performanceMode }));
  }, []);

  const setTimerLimit = useCallback((mins) => {
    setState(prev => ({ ...prev, timerLimit: mins }));
  }, []);

  const addTimeUsedSeconds = useCallback((secs = 1) => {
    setState(prev => {
      const nextSeconds = Math.max(0, (prev.timeUsedSeconds || 0) + secs);
      return {
        ...prev,
        timeUsedSeconds: nextSeconds,
        timeUsed: Math.floor(nextSeconds / 60),
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    localStorage.removeItem('bq_state_v5');
    setState(DEFAULT_STATE);
  }, []);

  return {
    state,
    addXP,
    saveLevelComplete,
    setProfile,
    setAvatar,
    toggleSound,
    togglePerformanceMode,
    setLang,
    setTimerLimit,
    addTimeUsedSeconds,
    resetProgress,
  };
}
