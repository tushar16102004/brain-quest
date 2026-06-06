import React, { useEffect, useState } from 'react';
import { BackBtn, LoadingScreen, WinOverlay } from '../components/UI';
import { WORLDS } from '../data/worlds';
import { FUN_TIPS, getScienceQuestions } from '../data/science';
import { getXP } from '../data/progression';
import { useSFX } from '../utils/sound';
import { spawnConfetti } from '../utils/confetti';

const SCIENCE_LEVEL_TIP_KEY = 'bq_science_level_tip';
const SCIENCE_LEVEL_TIP_DELAY = 3000;

export function ScienceGame({ level, worldIdx, state, addXP, saveLevelComplete, onBack, onNextLevel }) {
  const sfx = useSFX(state.soundOn);
  const world = WORLDS.science[worldIdx];
  const learnerName = (state.name || 'Dost').trim();
  const [questions, setQuestions] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showWin, setShowWin] = useState(false);
  const [winData, setWinData] = useState({});
  const [showLevelTip, setShowLevelTip] = useState(() => sessionStorage.getItem(SCIENCE_LEVEL_TIP_KEY) === '1');
  const [levelTip] = useState(() => FUN_TIPS[Math.floor(Math.random() * FUN_TIPS.length)]);

  useEffect(() => {
    if (!showLevelTip) return undefined;

    sessionStorage.removeItem(SCIENCE_LEVEL_TIP_KEY);
    const timer = window.setTimeout(() => setShowLevelTip(false), SCIENCE_LEVEL_TIP_DELAY);
    return () => window.clearTimeout(timer);
  }, [showLevelTip]);

  useEffect(() => {
    if (showLevelTip) return;

    setQuestions(getScienceQuestions(level, worldIdx));
  }, [level, worldIdx, showLevelTip]);

  if (showLevelTip) {
    return (
      <LoadingScreen
        mascot="🔬"
        message={`Level ${level} shuru hone wala hai...`}
        tip={levelTip}
        tipTitle={`💡 ${learnerName}, kya aap jante ho?`}
      />
    );
  }

  if (!questions) {
    return (
      <div className="screen" style={{ background:'var(--bg)', alignItems:'center', justifyContent:'center' }}>
        <div style={{ textAlign:'center', padding:40, position:'relative', zIndex:1 }}>
          <div style={{ fontSize:76, animation:'bounce 1s ease-in-out infinite' }}>🔬</div>
          <div className="fredoka" style={{ fontSize:26, color:'var(--green)', marginTop:14 }}>Questions Load Ho Rahi Hain...</div>
          <div style={{ display:'flex', gap:8, justifyContent:'center', marginTop:10 }}>
            {['#00C853', '#76FF03', '#FFD600', '#2979FF'].map((color, idx) => (
              <div key={idx} style={{ width:12, height:12, borderRadius:'50%', background:color, animation:`dotBounce 1.2s ease-in-out ${idx * 0.15}s infinite` }} />
            ))}
          </div>
          <div style={{ fontSize:13, fontWeight:700, color:'var(--muted)', marginTop:8 }}>Science questions ready ho rahi hain...</div>
        </div>
      </div>
    );
  }

  const q = questions[qIdx];
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
    const xpAmt = Math.floor(getXP('science', level) * pct);

    addXP(xpAmt);
    saveLevelComplete('science', level, stars);
    if (pct >= 0.6) spawnConfetti(state.performanceMode ? 18 : 55);

    setWinData({
      stars,
      xpAmt,
      emo: pct === 1 ? '🏆' : pct >= 0.6 ? '🎉' : '😊',
      title: pct === 1 ? 'Scientist!' : pct >= 0.6 ? 'Shandaar!' : 'Try Karo!',
    });
    setShowWin(true);
  };

  const handleNextLevel = () => {
    sessionStorage.setItem(SCIENCE_LEVEL_TIP_KEY, '1');
    setShowWin(false);
    onNextLevel();
  };

  return (
    <div className="screen" style={{ background:'var(--bg)', paddingBottom:20 }}>
      <div style={{ background:'var(--green)', borderRadius:'0 0 40px 40px', padding:'52px 18px 20px', boxShadow:'0 6px 0 #009940', position:'relative', zIndex:1, overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-30, right:-20, width:130, height:130, background:'rgba(255,255,255,0.1)', borderRadius:'50%', pointerEvents:'none' }} />
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative', zIndex:1 }}>
          <BackBtn onClick={onBack} />
          <div className="fredoka" style={{ fontSize:20, color:'#fff' }}>🔬 {world.name}</div>
          <div style={{ background:'rgba(255,255,255,0.22)', border:'2px solid rgba(255,255,255,0.4)', borderRadius:14, padding:'5px 12px', fontSize:14, fontWeight:800, color:'#fff' }}>⭐ {score}</div>
        </div>
        <div style={{ color:'rgba(255,255,255,0.85)', fontSize:12, fontWeight:700, textAlign:'center', marginTop:5, position:'relative', zIndex:1 }}>Level {level}</div>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:10, position:'relative', zIndex:1 }}>
          <span style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,0.85)', whiteSpace:'nowrap' }}>{qIdx + 1}/{questions.length}</span>
          <div style={{ flex:1, background:'rgba(255,255,255,0.25)', borderRadius:20, height:10, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${(qIdx / questions.length) * 100}%`, background:'#fff', borderRadius:20, transition:'width 0.5s' }} />
          </div>
        </div>
      </div>

      <div style={{ padding:'14px 18px 0', flex:1, display:'flex', flexDirection:'column', gap:12 }}>
        <div className="bubble">
          <span className="bub-char">{q.char || '🔬'}</span>
          <div className="bub-text">{q.text}</div>
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
            {isCorrect ? (q.good || q.feedback?.good || 'Bilkul sahi! 🎉') : (q.bad || q.feedback?.bad || 'Sahi jawab dekho! 💡')}
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
