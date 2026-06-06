import { useEffect } from 'react';

export function useScreenTimeLimit({
  route,
  isGameRoute,
  timerLimit,
  timeUsedSeconds,
  addTimeUsedSeconds,
  onLimitWhilePlaying,
}) {
  const limitReached = timerLimit > 0 && timeUsedSeconds >= timerLimit * 60;

  useEffect(() => {
    if (!isGameRoute || timerLimit === 0 || limitReached) return undefined;

    const interval = setInterval(() => {
      addTimeUsedSeconds(1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameRoute, timerLimit, limitReached, addTimeUsedSeconds]);

  useEffect(() => {
    if (!(isGameRoute || route === 'level-select') || !limitReached) return;
    onLimitWhilePlaying();
  }, [isGameRoute, route, limitReached, onLimitWhilePlaying]);

  return { limitReached };
}
