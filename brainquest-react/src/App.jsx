import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './index.css';

import { ROUTES, GAME_ROUTES, DEFAULT_GAME_TYPE } from './app/constants';
import { useScreenTimeLimit } from './app/useScreenTimeLimit';
import { useGameState } from './hooks/useGameState';
import { WORLDS } from './data/worlds';
import { LoadingScreen } from './components/UI';
import {
  SplashScreen,
  AvatarScreen,
  HomeScreen,
  GamesScreen,
  LevelSelectScreen,
  RewardsScreen,
  ParentsScreen,
  SettingsPanel,
} from './screens';
import {
  PuzzleGame,
  MathGame,
  ScienceGame,
  ColoringGame,
} from './games';

function getInitialRoute() {
  const saved = localStorage.getItem('bq_state_v5');
  if (!saved) return ROUTES.splash;

  try {
    const parsed = JSON.parse(saved);
    if (parsed.name && parsed.name !== 'Hero' && parsed.name !== '') {
      return ROUTES.home;
    }
  } catch {
    return ROUTES.splash;
  }

  return ROUTES.splash;
}

export default function App() {
  const {
    state,
    addXP,
    saveLevelComplete,
    setProfile,
    toggleSound,
    togglePerformanceMode,
    setLang,
    setTimerLimit,
    addTimeUsedSeconds,
    resetProgress,
  } = useGameState();

  const [route, setRoute] = useState(() => getInitialRoute());
  const [gameType, setGameType] = useState(DEFAULT_GAME_TYPE);
  const [gameLevel, setGameLevel] = useState(1);
  const [gameWorld, setGameWorld] = useState(0);
  const [gameSession, setGameSession] = useState(0);
  const [levelSelectSession, setLevelSelectSession] = useState(0);
  const [pendingLaunch, setPendingLaunch] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const gameRoutes = useMemo(() => new Set(GAME_ROUTES), []);
  const isGameRoute = gameRoutes.has(route);

  useEffect(() => {
    document.body.classList.toggle('performance-mode', !!state.performanceMode);
    return () => document.body.classList.remove('performance-mode');
  }, [state.performanceMode]);

  useEffect(() => {
    if (route !== ROUTES.launching || !pendingLaunch) return undefined;

    const launchTimer = window.setTimeout(() => {
      setGameType(pendingLaunch.type);
      setGameLevel(pendingLaunch.level);
      setGameWorld(pendingLaunch.worldIdx);
      setGameSession((current) => current + 1);
      setRoute(pendingLaunch.type);
      setPendingLaunch(null);
    }, 0);

    return () => window.clearTimeout(launchTimer);
  }, [route, pendingLaunch]);

  const handleLimitWhilePlaying = useCallback(() => {
    window.alert('Daily screen time limit khatam ho gaya. Ab game band karke Parents section khol rahe hain.');
    setShowSettings(false);
    setRoute(ROUTES.parents);
  }, []);

  const { limitReached } = useScreenTimeLimit({
    route,
    isGameRoute,
    timerLimit: state.timerLimit,
    timeUsedSeconds: state.timeUsedSeconds || 0,
    addTimeUsedSeconds,
    onLimitWhilePlaying: handleLimitWhilePlaying,
  });

  const guardGames = useCallback((message) => {
    if (!limitReached) return false;

    window.alert(message);
    setRoute(ROUTES.parents);
    return true;
  }, [limitReached]);

  const goTo = useCallback((nextRoute) => {
    setRoute(nextRoute);
  }, []);

  const handleNavBar = useCallback((key) => {
    if (key === ROUTES.home) {
      goTo(ROUTES.home);
      return;
    }

    if (key === 'games') {
      const blocked = guardGames('Aaj ka screen time limit poora ho gaya. Games ab lock hain. Parents section se limit badhao ya kal phir se khelo.');
      if (blocked) return;

      goTo(ROUTES.games);
      return;
    }

    if (key === ROUTES.rewards) {
      goTo(ROUTES.rewards);
      return;
    }

    if (key === ROUTES.parents) {
      goTo(ROUTES.parents);
    }
  }, [goTo, guardGames]);

  const openGame = useCallback((type) => {
    const blocked = guardGames('Aaj ka screen time limit poora ho gaya. Kal phir se khelo ya Parents section se limit badhao.');
    if (blocked) return;

    setGameType(type);
    goTo(ROUTES.levelSelect);
  }, [goTo, guardGames]);

  const launchGame = useCallback((type, level, worldIdx) => {
    setPendingLaunch({ type, level, worldIdx });
    setRoute(ROUTES.launching);
  }, []);

  const returnToLevelSelect = useCallback(() => {
    setLevelSelectSession((current) => current + 1);
    setPendingLaunch(null);
    goTo(ROUTES.levelSelect);
  }, [goTo]);

  const selectLevel = useCallback((level, worldIdx) => {
    const blocked = guardGames('Aaj ka screen time limit poora ho gaya. Kal phir se khelo ya Parents section se limit badhao.');
    if (blocked) return;

    launchGame(gameType, level, worldIdx);
  }, [gameType, guardGames, launchGame]);

  const nextLevel = useCallback(() => {
    const next = Math.min(gameLevel + 1, 100);
    const maxWorldIdx = Math.max(0, (WORLDS[gameType]?.length || 1) - 1);
    launchGame(gameType, next, Math.min(Math.floor((next - 1) / 10), maxWorldIdx));
  }, [gameLevel, gameType, launchGame]);

  const gameProps = {
    level: gameLevel,
    worldIdx: gameWorld,
    state,
    addXP,
    saveLevelComplete,
    onBack: returnToLevelSelect,
    onNextLevel: nextLevel,
  };

  return (
    <div style={{ position:'relative', width:'100%', height:'100%', overflow:'hidden' }}>
      {route === ROUTES.splash && (
        <SplashScreen onStart={() => goTo(ROUTES.avatar)} />
      )}

      {route === ROUTES.avatar && (
        <AvatarScreen
          onComplete={(name, avatar) => {
            setProfile(name, avatar);
            goTo(ROUTES.home);
          }}
        />
      )}

      {route === ROUTES.home && (
        <HomeScreen
          state={state}
          onOpenGame={openGame}
          onNavigate={handleNavBar}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {route === ROUTES.games && (
        <GamesScreen
          state={state}
          onOpenGame={openGame}
          onNavigate={handleNavBar}
          onBack={() => goTo(ROUTES.home)}
        />
      )}

      {route === ROUTES.levelSelect && (
        <LevelSelectScreen
          key={`level-select-${gameType}-${gameLevel}-${gameWorld}-${levelSelectSession}`}
          gameType={gameType}
          state={state}
          onSelectLevel={selectLevel}
          onBack={() => goTo(ROUTES.home)}
        />
      )}

      {route === ROUTES.launching && (
        <LoadingScreen
          mascot={pendingLaunch?.type === ROUTES.puzzle ? '🧩' : pendingLaunch?.type === ROUTES.science ? '🔬' : pendingLaunch?.type === ROUTES.draw ? '🎨' : '🔢'}
          message={`Level ${pendingLaunch?.level || gameLevel} load ho raha hai...`}
          tip="Naya round fresh start ke saath khul raha hai."
          tipTitle="Please wait"
        />
      )}

      {route === ROUTES.puzzle && <PuzzleGame key={`puzzle-${gameLevel}-${gameWorld}-${gameSession}`} {...gameProps} />}
      {route === ROUTES.math && <MathGame key={`math-${gameLevel}-${gameWorld}-${gameSession}`} {...gameProps} />}
      {route === ROUTES.science && <ScienceGame key={`science-${gameLevel}-${gameWorld}-${gameSession}`} {...gameProps} />}
      {route === ROUTES.draw && <ColoringGame key={`draw-${gameLevel}-${gameWorld}-${gameSession}`} {...gameProps} />}

      {route === ROUTES.rewards && (
        <RewardsScreen
          state={state}
          onNavigate={handleNavBar}
        />
      )}

      {route === ROUTES.parents && (
        <ParentsScreen
          state={state}
          onNavigate={handleNavBar}
          onSetTimer={setTimerLimit}
          onReset={() => {
            resetProgress();
            goTo(ROUTES.splash);
          }}
        />
      )}

      {showSettings && (
        <SettingsPanel
          state={state}
          onClose={() => setShowSettings(false)}
          onToggleSound={toggleSound}
          onTogglePerformanceMode={togglePerformanceMode}
        />
      )}
    </div>
  );
}
