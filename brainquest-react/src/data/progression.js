export function getXP(gameType, level) {
  const base = { puzzle: 15, math: 20, draw: 25, science: 20 }[gameType] || 20;
  const bonus = Math.floor((level - 1) / 10) * 5;
  return base + bonus;
}
