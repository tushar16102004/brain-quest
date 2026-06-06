import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BackBtn, WinOverlay } from '../components/UI';
import { WORLDS } from '../data/worlds';
import { generateMathQuestions } from '../data/math';
import { getXP } from '../data/progression';
import { useSFX } from '../utils/sound';
import { spawnConfetti } from '../utils/confetti';

export function MathGame({ level, worldIdx, state, addXP, saveLevelComplete, onBack, onNextLevel }) {
  const sfx = useSFX(state.soundOn);
  const world = WORLDS.math[worldIdx] || WORLDS.math[0];
  const questions = useMemo(() => {
    try {
      const generated = generateMathQuestions(level, worldIdx);
      if (!Array.isArray(generated) || generated.length === 0) {
        return generateMathQuestions(level, 0);
      }
      return generated;
    } catch {
      return generateMathQuestions(level, 0);
    }
  }, [level, worldIdx]);
  const [qIdx, setQIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showWin, setShowWin] = useState(false);
  const [winData, setWinData] = useState({});
  const [isAdvancing, setIsAdvancing] = useState(false);
  const advanceTimerRef = useRef(null);

  useEffect(() => {
    setQIdx(0);
    setCorrect(0);
    setAnswered(false);
    setSelected(null);
    setScore(0);
    setShowWin(false);
    setWinData({});
    setIsAdvancing(false);
  }, [level, worldIdx, questions]);

  useEffect(() => () => {
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
    }
  }, []);

  const q = questions[qIdx];

  if (!q || !Array.isArray(q.opts) || typeof q.ans !== 'number' || !q.feedback) {
    return (
      <div className="screen" style={{ background:'var(--bg)', padding:'52px 18px 20px', justifyContent:'center' }}>
        <div style={{ background:'#fff', borderRadius:22, border:'3px solid var(--border)', boxShadow:'0 5px 0 var(--shadow)', padding:'22px 18px', textAlign:'center' }}>
          <div className="fredoka" style={{ fontSize:24, color:'var(--orange)', marginBottom:8 }}>Math round reload karo</div>
          <div style={{ fontSize:14, fontWeight:700, color:'var(--muted)', marginBottom:16 }}>
            Is level ka question set sahi load nahi hua. Back jaake dubara kholo.
          </div>
          <button className="btn btn-orange fredoka" onClick={onBack}>
            Level Menu
          </button>
        </div>
      </div>
    );
  }
  const isCorrect = selected === q.ans;

  const checkAnswer = (idx) => {
    if (answered) return;

    sfx.tap();
    setAnswered(true);
    setSelected(idx);

    if (idx === q.ans) {
      sfx.correct();
      setCorrect((current) => current + 1);
      setScore((current) => current + 10);
      return;
    }

    sfx.wrong();
  };

  const next = () => {
    if (qIdx + 1 < questions.length) {
      setQIdx((current) => current + 1);
      setAnswered(false);
      setSelected(null);
      return;
    }

    const finalCorrect = correct;
    const pct = finalCorrect / questions.length;
    const stars = pct === 1 ? 3 : pct >= 0.6 ? 2 : 1;
    const xpAmt = Math.floor(getXP('math', level) * pct);

    addXP(xpAmt);
    saveLevelComplete('math', level, stars);
    if (pct >= 0.6) spawnConfetti(state.performanceMode ? 18 : 55);

    setWinData({
      stars,
      xpAmt,
      emo: pct === 1 ? '🏆' : pct >= 0.6 ? '🎉' : '😊',
      title: pct === 1 ? 'Perfect!' : pct >= 0.6 ? 'Shandaar!' : 'Try Karo!',
    });
    setShowWin(true);
  };

  const handleNextLevel = () => {
    if (isAdvancing) return;

    setIsAdvancing(true);
    setShowWin(false);
    advanceTimerRef.current = window.setTimeout(() => {
      onNextLevel();
    }, 40);
  };

  return (
    <div className="screen" style={{ background:'var(--bg)', paddingBottom:20 }}>
      <div style={{ padding:'52px 18px 14px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <BackBtn onClick={onBack} dark />
        <div style={{ display:'flex', alignItems:'center', gap:10, flex:1, margin:'0 10px' }}>
          <span style={{ fontSize:12, fontWeight:800, color:'var(--muted)', whiteSpace:'nowrap' }}>{qIdx + 1}/{questions.length}</span>
          <div style={{ flex:1, background:'#F0E8D0', borderRadius:20, height:10, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${(qIdx / questions.length) * 100}%`, background:`linear-gradient(90deg,${world.color},${world.color}88)`, borderRadius:20, transition:'width 0.5s' }} />
          </div>
        </div>
        <div style={{ background:'#fff', border:'2.5px solid var(--border)', borderRadius:14, padding:'5px 12px', fontSize:13, fontWeight:800, color:'var(--text)', boxShadow:'0 3px 0 var(--shadow)' }}>⭐ {score}</div>
      </div>

      <div style={{ padding:'0 18px', flex:1, display:'flex', flexDirection:'column', gap:12 }}>
        <div className="bubble">
          <span className="bub-char">{q.char}</span>
          <div className="bub-text" dangerouslySetInnerHTML={{ __html: q.text }} />
        </div>

        <div className="opts-grid">
          {q.opts.map((opt, i) => (
            <button
              key={i}
              className={`opt${answered ? (i === q.ans ? ' correct' : i === selected ? ' wrong' : '') : ''}`}
              onClick={() => checkAnswer(i)}
              disabled={answered}
            >
              {opt}
            </button>
          ))}
        </div>

        {answered && (
          <div className={`fb-bar show ${isCorrect ? 'good' : 'bad'}`}>
            {isCorrect ? q.feedback.good : q.feedback.bad}
          </div>
        )}

        {answered && (
          <button className="nxt-btn show" onClick={next}>
            {qIdx < questions.length - 1 ? 'Aage Chalo! ▶' : 'Result! 🏆'}
          </button>
        )}
      </div>

      <WinOverlay
        show={showWin}
        emoji={winData.emo}
        title={winData.title}
        xpEarned={winData.xpAmt}
        stars={winData.stars}
        onNext={handleNextLevel}
        onMenu={onBack}
      />
    </div>
  );
}
