import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackBtn, WinOverlay } from '../components/UI';
import { WORLDS } from '../data/worlds';
import { PUZZLE_TILES } from '../data/puzzle';
import { getXP } from '../data/progression';
import { useSFX } from '../utils/sound';
import { spawnConfetti } from '../utils/confetti';

export function PuzzleGame({ level, worldIdx, state, addXP, saveLevelComplete, onBack, onNextLevel }) {
  const sfx = useSFX(state.soundOn);
  const world = WORLDS.puzzle[worldIdx];
  const pairsCount = Math.min(4 + Math.floor(level / 10), 8);
  const timeLimit = Math.max(30, 90 - level);

  const buildTiles = useCallback(() => {
    const allTiles = PUZZLE_TILES[worldIdx] || PUZZLE_TILES[0];
    const used = allTiles.slice(0, pairsCount);
    return [...used, ...used].sort(() => Math.random() - 0.5);
  }, [worldIdx, pairsCount]);

  const [tiles, setTiles] = useState(() => buildTiles());
  const [revealed, setRevealed] = useState({});
  const [matched, setMatched] = useState({});
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [checking, setChecking] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const timerRef = useRef(null);
  const resolveTimerRef = useRef(null);
  const winTimerRef = useRef(null);
  const matchedCount = Object.keys(matched).length / 2;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => () => {
    if (resolveTimerRef.current) clearTimeout(resolveTimerRef.current);
    if (winTimerRef.current) clearTimeout(winTimerRef.current);
  }, []);

  useEffect(() => {
    if (timeLeft !== 0 || matchedCount >= pairsCount) return;

    const resetTimer = setTimeout(() => {
      setTiles(buildTiles());
      setRevealed({});
      setMatched({});
      setSelected([]);
      setScore(0);
      setTimeLeft(timeLimit);
    }, 1800);

    return () => clearTimeout(resetTimer);
  }, [timeLeft, matchedCount, pairsCount, buildTiles, timeLimit]);

  const flip = useCallback((idx) => {
    if (checking || revealed[idx] || matched[idx] || selected.length >= 2) return;

    sfx.tap();
    setRevealed((current) => ({ ...current, [idx]: true }));
    const nextSelected = [...selected, idx];
    setSelected(nextSelected);

    if (nextSelected.length !== 2) return;

    setChecking(true);
    const [a, b] = nextSelected;

    resolveTimerRef.current = setTimeout(() => {
      if (tiles[a] === tiles[b]) {
        sfx.correct();
        const nextMatched = { ...matched, [a]: true, [b]: true };
        setMatched(nextMatched);
        setScore((current) => current + 10);

        if (Object.keys(nextMatched).length / 2 >= pairsCount) {
          clearInterval(timerRef.current);
          const stars = timeLeft > 40 ? 3 : timeLeft > 20 ? 2 : 1;
          const xpAmt = getXP('puzzle', level);
          addXP(xpAmt);
          saveLevelComplete('puzzle', level, stars);
          spawnConfetti(state.performanceMode ? 18 : 55);
          winTimerRef.current = setTimeout(() => setShowWin(true), 500);
        }
      } else {
        sfx.wrong();
        setRevealed((current) => {
          const next = { ...current };
          delete next[a];
          delete next[b];
          return next;
        });
      }

      setSelected([]);
      setChecking(false);
    }, 600);
  }, [checking, revealed, matched, selected, sfx, tiles, pairsCount, timeLeft, level, addXP, saveLevelComplete]);

  const timePct = (timeLeft / timeLimit) * 100;
  const timerColor = timeLeft <= 10
    ? 'linear-gradient(90deg,var(--red),var(--yellow))'
    : 'linear-gradient(90deg,var(--green),var(--yellow))';

  return (
    <div className="screen" style={{ background:'#1A0533', paddingBottom:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'52px 20px 16px' }}>
        <BackBtn onClick={onBack} />
        <div className="fredoka" style={{ fontSize:22, color:'#fff' }}>🧩 {world.name} — L{level}</div>
        <div style={{ background:'rgba(255,230,0,0.18)', border:'2px solid rgba(255,230,0,0.4)', borderRadius:14, padding:'5px 13px', fontSize:14, fontWeight:800, color:'var(--yellow)', display:'flex', alignItems:'center', gap:5 }}>
          ⭐ {score}
        </div>
      </div>

      <div style={{ padding:'0 18px', flex:1, display:'flex', flexDirection:'column', gap:12 }}>
        <div style={{ background:'rgba(255,255,255,0.08)', border:'2px solid rgba(255,255,255,0.12)', borderRadius:16, padding:'12px 16px', fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.8)', textAlign:'center' }}>
          {matchedCount >= pairsCount ? 'Sab match! 🎉' : `${matchedCount}/${pairsCount} pairs — Same tiles dhundo! 🔍`}
        </div>

        <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:20, height:10, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${timePct}%`, background:timerColor, borderRadius:20, transition:'width 1s linear' }} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:9 }}>
          {tiles.map((emoji, idx) => {
            const isRevealed = revealed[idx] || matched[idx];
            const isSelected = selected.includes(idx);
            const isMatched = matched[idx];

            return (
              <div
                key={idx}
                onClick={() => flip(idx)}
                style={{
                  aspectRatio:1,
                  borderRadius:16,
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  fontSize: isRevealed ? 28 : 22,
                  cursor: isMatched ? 'default' : 'pointer',
                  background: `${world.color}33`,
                  border: isSelected ? '2px solid #fff' : '2px solid rgba(255,255,255,0.08)',
                  boxShadow: isSelected ? '0 0 18px rgba(255,255,255,0.3), 0 4px 0 rgba(0,0,0,0.3)' : '0 4px 0 rgba(0,0,0,0.35)',
                  color: isRevealed ? '#fff' : 'rgba(255,255,255,0.2)',
                  opacity: isMatched ? 0.25 : 1,
                  transform: isSelected ? 'scale(1.1)' : isMatched ? 'scale(0.88)' : 'scale(1)',
                  transition:'all 0.18s',
                  pointerEvents: isMatched ? 'none' : 'auto',
                }}
              >
                {isRevealed ? emoji : '?'}
              </div>
            );
          })}
        </div>
      </div>

      <WinOverlay
        show={showWin}
        emoji="🎉"
        title="Shandaar!"
        xpEarned={getXP('puzzle', level)}
        stars={timeLeft > 40 ? 3 : timeLeft > 20 ? 2 : 1}
        onNext={() => { setShowWin(false); onNextLevel(); }}
        onMenu={onBack}
      />
    </div>
  );
}
