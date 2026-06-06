import React, { useState } from 'react';
import { BlobBg, BackBtn, BottomNav, XpChip, LevelGrid, ProgressBar, MascotSVG } from '../components/UI';
import { WORLDS } from '../data/worlds';
import { ALL_BADGES } from '../data/rewards';

// ═══════════════════════════════════════════════════════════════
// SPLASH SCREEN
// ═══════════════════════════════════════════════════════════════
export function SplashScreen({ onStart }) {
  const letters = 'BrainQuest'.split('');
  const colors = ['#FF3B3B','#FF7A00','#FFD600','#00C853','#2979FF','#AA00FF','#FF4081','#00BCD4','#FF3B3B','#FF7A00'];

  return (
    <div className="screen" style={{ background:'var(--bg)', alignItems:'center', justifyContent:'center' }}>
      <BlobBg />
      <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center' }}>
        <MascotSVG style={{ width:190, height:190, animation:'wob 2.8s ease-in-out infinite' }} />
        <div className="fredoka" style={{ fontSize:60, letterSpacing:2, marginTop:-10, lineHeight:1 }}>
          {letters.map((l,i) => <span key={i} style={{ color:colors[i], WebkitTextStroke:l==='Q'?'1.5px #C8A600':undefined }}>{l}</span>)}
        </div>
        <div style={{ fontSize:16, fontWeight:800, color:'var(--orange)', margin:'8px 0 28px', letterSpacing:0.3 }}>
          Seekho! Khelo! Masti Karo! 🎉
        </div>
        <button
          className="btn btn-orange fredoka"
          style={{ padding:'18px 60px', fontSize:24, borderRadius:60 }}
          onClick={onStart}
        >
          Shuru Karo! ▶
        </button>
        <div style={{ display:'flex', gap:9, marginTop:24 }}>
          {['#FF3B3B','#FF7A00','#00C853','#2979FF'].map((c,i) => (
            <div key={i} style={{ width:13, height:13, borderRadius:'50%', background:c, animation:`dotBounce 1.2s ease-in-out ${i*0.15}s infinite` }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// AVATAR SELECT SCREEN
// ═══════════════════════════════════════════════════════════════
export function AvatarScreen({ onComplete }) {
  const [selectedAvatar, setSelectedAvatar] = useState('🦁');
  const [name, setName] = useState('');

  const avatars = [
    { emoji:'🦁', name:'Sher' }, { emoji:'🐬', name:'Dolphin' }, { emoji:'🦊', name:'Lomdi' },
    { emoji:'🐉', name:'Dragon' }, { emoji:'🦅', name:'Baaz' }, { emoji:'🐼', name:'Panda' },
    { emoji:'🐯', name:'Sher Jr' }, { emoji:'🦄', name:'Unicorn' }, { emoji:'🐸', name:'Frog' },
  ];

  return (
    <div className="screen" style={{ background:'var(--bg)' }}>
      <BlobBg />
      {/* Header */}
      <div style={{ background:'var(--blue)', borderRadius:'0 0 44px 44px', padding:'54px 22px 36px', textAlign:'center', boxShadow:'0 8px 0 #1A4FBB', position:'relative', zIndex:1, overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-30, right:-20, width:130, height:130, background:'rgba(255,255,255,0.12)', borderRadius:'50%', pointerEvents:'none' }}/>
        <h2 className="fredoka" style={{ fontSize:28, color:'#fff' }}>Apna Hero Chuno! 🦸</h2>
        <p style={{ color:'rgba(255,255,255,0.85)', fontSize:14, fontWeight:700, marginTop:5 }}>Ek avatar aur naam do apne aap ko</p>
      </div>

      {/* Avatar Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, padding:'20px 20px 0', position:'relative', zIndex:1 }}>
        {avatars.map(av => (
          <div
            key={av.emoji}
            onClick={() => setSelectedAvatar(av.emoji)}
            style={{
              background:'#fff', borderRadius:20, padding:'18px 8px', textAlign:'center', cursor:'pointer',
              border:`3px solid ${selectedAvatar===av.emoji?'var(--blue)':'var(--border)'}`,
              boxShadow:`0 4px 0 ${selectedAvatar===av.emoji?'#1A4FBB':'var(--shadow)'}`,
              transition:'all 0.18s', position:'relative',
            }}
          >
            {selectedAvatar === av.emoji && (
              <div style={{ position:'absolute', top:-10, right:-10, width:26, height:26, background:'var(--blue)', color:'#fff', borderRadius:'50%', fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900 }}>✓</div>
            )}
            <div style={{ fontSize:48, display:'block', marginBottom:5 }}>{av.emoji}</div>
            <div style={{ fontSize:12, fontWeight:800, color:'var(--muted)' }}>{av.name}</div>
          </div>
        ))}
      </div>

      {/* Name Input */}
      <div style={{ padding:'16px 20px 0', position:'relative', zIndex:1 }}>
        <label style={{ fontSize:12, fontWeight:800, color:'var(--muted)', display:'block', marginBottom:7, textTransform:'uppercase', letterSpacing:'0.07em' }}>Tera Naam</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Jaise: Aarav, Diya..."
          maxLength={14}
          style={{ width:'100%', padding:'14px 18px', borderRadius:16, border:'3px solid var(--border)', fontFamily:'Nunito', fontSize:17, fontWeight:700, color:'var(--text)', outline:'none', background:'#fff', boxShadow:'0 3px 0 var(--shadow)' }}
        />
      </div>

      {/* Start Button */}
      <div style={{ padding:'16px 20px 40px', position:'relative', zIndex:1 }}>
        <button
          className="btn btn-green btn-full fredoka"
          onClick={() => onComplete(name.trim() || 'Hero', selectedAvatar)}
        >
          Chalte Hain! 🎉
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HOME SCREEN
// ═══════════════════════════════════════════════════════════════
export function HomeScreen({ state, onOpenGame, onNavigate, onOpenSettings }) {
  const { name, avatar, xp, streak, badges, levels, questDone } = state;
  const questCount = Object.values(questDone).filter(Boolean).length;
  const questPct = (questCount / 4) * 100;

  const games = [
    { key:'puzzle',  icon:'🧩', name:'Puzzles',  color:'var(--purple)', shadow:'#7700CC' },
    { key:'math',    icon:'🔢', name:'Math',     color:'var(--teal)',   shadow:'#007A8A' },
    { key:'draw',    icon:'🎨', name:'Coloring', color:'var(--pink)',   shadow:'#BB005A' },
    { key:'science', icon:'🔬', name:'Science',  color:'var(--green)',  shadow:'#009940' },
  ];

  return (
    <div className="screen" style={{ background:'var(--bg)', paddingBottom:100 }}>
      <BlobBg />

      {/* Header */}
      <div style={{ background:'var(--orange)', borderRadius:'0 0 40px 40px', padding:'56px 22px 80px', boxShadow:'0 8px 0 #C05500', position:'relative', zIndex:1 }}>
        <div style={{ position:'absolute', top:-30, right:-20, width:150, height:150, background:'rgba(255,255,255,0.12)', borderRadius:'50%', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:-20, left:10, width:90, height:90, background:'rgba(255,255,255,0.08)', borderRadius:'50%', pointerEvents:'none' }}/>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative', zIndex:1, flexWrap:'nowrap', gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0, flex:1 }}>
            <div style={{ width:50, height:50, background:'rgba(255,255,255,0.28)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, border:'2.5px solid rgba(255,255,255,0.5)', flexShrink:0 }}>{avatar}</div>
            <div style={{ minWidth:0 }}>
              <div style={{ color:'rgba(255,255,255,0.85)', fontSize:12, fontWeight:700 }}>Namaste,</div>
              <div className="fredoka" style={{ color:'#fff', fontSize:19, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:140 }}>{name}!</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
            <XpChip xp={xp} />
            <button onClick={onOpenSettings} style={{ background:'rgba(255,255,255,0.22)', border:'2px solid rgba(255,255,255,0.4)', borderRadius:12, width:38, height:38, fontSize:17, cursor:'pointer', flexShrink:0 }}>⚙️</button>
          </div>
        </div>
      </div>

      {/* Quest Card */}
      <div style={{ margin:'-52px 18px 0', position:'relative', zIndex:3, animation:'slideUp 0.4s ease' }}>
        <div className="card" style={{ padding:'18px 20px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
            <div style={{ fontSize:11, fontWeight:800, color:'var(--orange)', textTransform:'uppercase', letterSpacing:'0.08em' }}>🔥 Aaj Ka Mission</div>
            <div style={{ fontSize:12, fontWeight:700, color:'var(--muted)' }}>{questCount}/4 done</div>
          </div>
          <ProgressBar pct={questPct} />
          <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginTop:10 }}>
            {['puzzle','math','draw','science'].map(g => (
              <div key={g} style={{
                background: questDone[g]?'#E8FFF0':'#F8F5EC',
                border: `2px solid ${questDone[g]?'var(--green)':'var(--border)'}`,
                color: questDone[g]?'#007A30':'var(--text)',
                borderRadius:10, padding:'5px 11px', fontSize:11, fontWeight:700,
              }}>
                {questDone[g]?'✓ ':''}{g==='puzzle'?'🧩 Puzzle':g==='math'?'🔢 Math':g==='draw'?'🎨 Color':'🔬 Science'}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="fredoka" style={{ fontSize:22, color:'var(--text)', padding:'18px 20px 10px', position:'relative', zIndex:1 }}>🎮 Games Zone</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:13, padding:'0 18px', position:'relative', zIndex:3 }}>
        {games.map(g => (
          <div
            key={g.key}
            onClick={() => onOpenGame(g.key)}
            className="card-lift"
            style={{ borderRadius:24, padding:'20px 16px', cursor:'pointer', position:'relative', overflow:'hidden', background:g.color, boxShadow:`0 7px 0 ${g.shadow}`, border:'none' }}
          >
            <div style={{ position:'absolute', top:-24, right:-24, width:80, height:80, background:'rgba(255,255,255,0.13)', borderRadius:'50%' }}/>
            <span style={{ fontSize:44, display:'block', marginBottom:10, filter:'drop-shadow(0 3px 0 rgba(0,0,0,0.18))' }}>{g.icon}</span>
            <div className="fredoka" style={{ fontSize:20, color:'#fff' }}>{g.name}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.78)', fontWeight:700, marginTop:3 }}>Level {levels[g.key]} · 100 Levels</div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="fredoka" style={{ fontSize:22, color:'var(--text)', padding:'18px 20px 10px', position:'relative', zIndex:1, marginTop:6 }}>📊 Progress</div>
      <div style={{ display:'flex', gap:10, padding:'4px 18px 16px', position:'relative', zIndex:1 }}>
        {[
          { num:`${streak}🔥`, lbl:'Streak', color:'var(--orange)' },
          { num:`${badges.length}🏆`, lbl:'Badges', color:'var(--purple)' },
          { num:`${xp}⭐`, lbl:'XP', color:'var(--green)' },
        ].map(s => (
          <div key={s.lbl} style={{ flex:1, background:'#fff', borderRadius:18, padding:'13px 8px', textAlign:'center', border:'3px solid var(--border)', boxShadow:'0 4px 0 var(--shadow)' }}>
            <div className="fredoka" style={{ fontSize:24, color:s.color }}>{s.num}</div>
            <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.05em', marginTop:2 }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LEVEL SELECT SCREEN
// ═══════════════════════════════════════════════════════════════
export function GamesScreen({ state, onOpenGame, onNavigate, onBack }) {
  const { levels } = state;
  const games = [
    { key:'puzzle',  icon:'🧩', name:'Puzzles',  color:'var(--purple)', shadow:'#7700CC' },
    { key:'math',    icon:'🔢', name:'Math',     color:'var(--teal)',   shadow:'#007A8A' },
    { key:'draw',    icon:'🎨', name:'Coloring', color:'var(--pink)',   shadow:'#BB005A' },
    { key:'science', icon:'🔬', name:'Science',  color:'var(--green)',  shadow:'#009940' },
  ];

  return (
    <div className="screen" style={{ background:'var(--bg)', paddingBottom:100 }}>
      <BlobBg />
      <div style={{ background:'var(--blue)', borderRadius:'0 0 40px 40px', padding:'52px 22px 34px', boxShadow:'0 8px 0 #1A4FBB', position:'relative', zIndex:1, overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-30, right:-20, width:150, height:150, background:'rgba(255,255,255,0.12)', borderRadius:'50%', pointerEvents:'none' }}/>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative', zIndex:1 }}>
          <BackBtn onClick={onBack} />
          <div className="fredoka" style={{ fontSize:26, color:'#fff', textAlign:'center' }}>🎮 Games</div>
          <XpChip xp={state.xp} />
        </div>
        <div style={{ color:'rgba(255,255,255,0.82)', fontSize:13, fontWeight:700, textAlign:'center', marginTop:8, position:'relative', zIndex:1 }}>
          Apna game chuno aur khelna shuru karo!
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:13, padding:'20px 18px 0', position:'relative', zIndex:3 }}>
        {games.map(g => (
          <div
            key={g.key}
            onClick={() => onOpenGame(g.key)}
            className="card-lift"
            style={{ borderRadius:24, padding:'20px 16px', cursor:'pointer', position:'relative', overflow:'hidden', background:g.color, boxShadow:`0 7px 0 ${g.shadow}`, border:'none' }}
          >
            <div style={{ position:'absolute', top:-24, right:-24, width:80, height:80, background:'rgba(255,255,255,0.13)', borderRadius:'50%' }}/>
            <span style={{ fontSize:44, display:'block', marginBottom:10, filter:'drop-shadow(0 3px 0 rgba(0,0,0,0.18))' }}>{g.icon}</span>
            <div className="fredoka" style={{ fontSize:20, color:'#fff' }}>{g.name}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.78)', fontWeight:700, marginTop:3 }}>Level {levels[g.key]} · 100 Levels</div>
          </div>
        ))}
      </div>

      <BottomNav active="games" onNavigate={onNavigate} />
    </div>
  );
}

export function LevelSelectScreen({ gameType, state, onSelectLevel, onBack }) {
  const worlds = WORLDS[gameType];
  const titles = { puzzle:'🧩 Puzzles', math:'🔢 Math', draw:'🎨 Coloring', science:'🔬 Science' };
  const w0 = worlds[0];
  return (
    <div className="screen" style={{ background:'var(--bg)', paddingBottom:40 }}>
      <BlobBg />
      {/* Header */}
      <div style={{ background:w0.color, borderRadius:'0 0 40px 40px', padding:'52px 22px 36px', boxShadow:`0 8px 0 ${w0.shadow}`, position:'relative', zIndex:1, overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-30, right:-20, width:140, height:140, background:'rgba(255,255,255,0.12)', borderRadius:'50%', pointerEvents:'none' }}/>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative', zIndex:1 }}>
          <BackBtn onClick={onBack} />
          <div className="fredoka" style={{ fontSize:26, color:'#fff', textAlign:'center' }}>{titles[gameType]}</div>
          <XpChip xp={state.xp} />
        </div>
        <div style={{ color:'rgba(255,255,255,0.85)', fontSize:13, fontWeight:700, textAlign:'center', marginTop:5, position:'relative', zIndex:1 }}>Apna level chuno!</div>
        <div style={{ color:'rgba(255,255,255,0.72)', fontSize:11, fontWeight:700, textAlign:'center', marginTop:6, position:'relative', zIndex:1 }}>Har level ab same questions ke saath stable rehega.</div>
      </div>

      <LevelGrid
        type={gameType}
        worlds={worlds}
        currentLevel={state.levels[gameType]}
        stars={state.stars[gameType]}
        onSelect={onSelectLevel}
      />
      <div style={{ height:20 }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// REWARDS SCREEN
// ═══════════════════════════════════════════════════════════════
export function RewardsScreen({ state, onNavigate }) {
  const { xp, badges } = state;
  const lvl = Math.floor(xp / 200) + 1;
  const xpInLvl = xp % 200;

  const trophies = [
    { icon:'🥉', name:'Bronze',  unlock: xp >= 50 },
    { icon:'🥈', name:'Silver',  unlock: xp >= 200 },
    { icon:'🥇', name:'Gold',    unlock: xp >= 500 },
    { icon:'👑', name:'Legend',  unlock: Math.max(...Object.values(state.levels)) >= 100 },
    { icon:'🔥', name:'Streak',  unlock: state.streak >= 7 },
    { icon:'🌈', name:'Rainbow', unlock: badges.length >= 8 },
  ];

  return (
    <div className="screen" style={{ background:'var(--bg)', paddingBottom:100 }}>
      <BlobBg />
      {/* Header */}
      <div style={{ background:'var(--purple)', borderRadius:'0 0 40px 40px', padding:'52px 22px 72px', boxShadow:'0 8px 0 #7700CC', position:'relative', overflow:'hidden', zIndex:1, textAlign:'center' }}>
        <div style={{ position:'absolute', top:-30, right:-20, width:130, height:130, background:'rgba(255,255,255,0.12)', borderRadius:'50%', pointerEvents:'none' }}/>
        <h2 className="fredoka" style={{ fontSize:28, color:'#fff' }}>🏆 Tere Rewards</h2>
      </div>

      {/* XP Card */}
      <div style={{ margin:'-50px 18px 0', position:'relative', zIndex:3 }}>
        <div className="card" style={{ padding:20, textAlign:'center' }}>
          <div className="fredoka" style={{ fontSize:52, color:'var(--orange)' }}>{xp} ⭐</div>
          <div style={{ fontSize:12, fontWeight:800, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>Total XP</div>
          <ProgressBar pct={(xpInLvl/200)*100} color="linear-gradient(90deg,var(--orange),var(--yellow))" height={14} />
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:5, fontSize:11, fontWeight:700, color:'var(--muted)' }}>
            <span>Level {lvl}</span>
            <span>{xpInLvl}/200 XP → Level {lvl+1}</span>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div style={{ padding:'18px 18px 10px', position:'relative', zIndex:1 }}>
        <div className="fredoka" style={{ fontSize:20, marginBottom:12 }}>🎖️ Badges</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
          {ALL_BADGES.slice(0,12).map(b => {
            const earned = badges.includes(b.id);
            return (
              <div key={b.id} style={{ background:'#fff', borderRadius:18, padding:'14px 8px', textAlign:'center', border:`3px solid ${earned?'var(--green)':'var(--border)'}`, boxShadow:`0 4px 0 ${earned?'#009940':'var(--shadow)'}`, opacity:earned?1:0.38, position:'relative' }}>
                {earned && <div style={{ position:'absolute', top:-8, right:-8, width:22, height:22, background:'var(--green)', color:'#fff', borderRadius:'50%', fontSize:12, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900 }}>✓</div>}
                <span style={{ fontSize:36, display:'block', marginBottom:5 }}>{b.icon}</span>
                <div style={{ fontSize:10, fontWeight:800, color:'var(--text)' }}>{b.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trophies */}
      <div style={{ padding:'0 18px 10px', position:'relative', zIndex:1 }}>
        <div className="fredoka" style={{ fontSize:20, marginBottom:12 }}>🏅 Trophies</div>
        <div style={{ display:'flex', gap:12, overflowX:'auto', paddingBottom:6, scrollbarWidth:'none' }}>
          {trophies.map(t => (
            <div key={t.name} style={{ flexShrink:0, background:'#fff', borderRadius:18, padding:'14px 12px', textAlign:'center', border:'3px solid var(--border)', boxShadow:'0 4px 0 var(--shadow)', minWidth:80, opacity:t.unlock?1:0.35 }}>
              <span style={{ fontSize:34, display:'block' }}>{t.icon}</span>
              <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', marginTop:4 }}>{t.name}</div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="rewards" onNavigate={onNavigate} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PARENTS SCREEN
// ═══════════════════════════════════════════════════════════════
export function ParentsScreen({ state, onNavigate, onSetTimer, onReset }) {
  const { xp, streak, totalLevels, badges, levels, timerLimit, timeUsedSeconds } = state;
  const usedSeconds = timeUsedSeconds || 0;
  const remainingSeconds = timerLimit === 0 ? null : Math.max(0, timerLimit * 60 - usedSeconds);
  const formatDuration = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const games = [
    { key:'puzzle',  icon:'🧩', name:'Puzzles',  color:'var(--purple)' },
    { key:'math',    icon:'🔢', name:'Math',     color:'var(--teal)' },
    { key:'draw',    icon:'🎨', name:'Coloring', color:'var(--pink)' },
    { key:'science', icon:'🔬', name:'Science',  color:'var(--green)' },
  ];

  const timerOptions = [15, 30, 45, 60, 0];

  return (
    <div className="screen" style={{ background:'var(--bg)', paddingBottom:100 }}>
      <BlobBg />
      {/* Header */}
      <div style={{ background:'#1A1A2E', borderRadius:'0 0 40px 40px', padding:'52px 22px 36px', position:'relative', zIndex:1, overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-20, right:-20, width:120, height:120, background:'rgba(255,255,255,0.05)', borderRadius:'50%', pointerEvents:'none' }}/>
        <div className="fredoka" style={{ fontSize:24, color:'#fff' }}>👨‍👩‍👧 Parents</div>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:13, fontWeight:700, marginTop:5 }}>Apne bache ki progress dekho</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, padding:'18px 18px 0', position:'relative', zIndex:1 }}>
        {[
          { val:`${xp} ⭐`, lbl:'Total XP', color:'var(--orange)' },
          { val:`${streak} 🔥`, lbl:'Day Streak', color:'var(--red)' },
          { val:`${totalLevels||0} 🎯`, lbl:'Levels Done', color:'var(--blue)' },
          { val:`${badges.length} 🏆`, lbl:'Badges', color:'var(--purple)' },
        ].map(s => (
          <div key={s.lbl} style={{ background:'#fff', borderRadius:18, padding:16, border:'3px solid var(--border)', boxShadow:'0 4px 0 var(--shadow)' }}>
            <div className="fredoka" style={{ fontSize:30, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:11, fontWeight:800, color:'var(--muted)', marginTop:3 }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Screen Time */}
      <div style={{ background:'#fff', borderRadius:20, border:'3px solid var(--border)', boxShadow:'0 5px 0 var(--shadow)', padding:18, margin:'14px 18px 0', position:'relative', zIndex:1 }}>
        <div style={{ fontSize:14, fontWeight:800, color:'var(--text)', marginBottom:12 }}>⏱️ Daily Screen Time Limit</div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {timerOptions.map(t => (
            <button key={t} onClick={() => onSetTimer(t)} style={{
              padding:'8px 14px', borderRadius:12, fontSize:13, fontWeight:800, cursor:'pointer',
              background: timerLimit===t ? 'var(--red)' : 'var(--bg)',
              border: `2.5px solid ${timerLimit===t ? 'var(--red)' : 'var(--border)'}`,
              color: timerLimit===t ? '#fff' : 'var(--muted)',
            }}>
              {t === 0 ? 'No limit' : `${t} min`}
            </button>
          ))}
        </div>
        <div style={{ marginTop:10, fontSize:12, fontWeight:700, color:'var(--muted)' }}>
          Today: <strong>{formatDuration(usedSeconds)}</strong> used of <strong>{timerLimit===0 ? 'No limit' : `${timerLimit}:00`}</strong>
        </div>
        <div style={{ marginTop:6, fontSize:12, fontWeight:700, color:'var(--muted)' }}>
          {timerLimit === 0 ? 'Games are available all day.' : `${formatDuration(remainingSeconds)} remaining for today`}
        </div>
      </div>

      {/* Game Breakdown */}
      <div style={{ background:'#fff', borderRadius:20, border:'3px solid var(--border)', boxShadow:'0 5px 0 var(--shadow)', padding:18, margin:'14px 18px 0', position:'relative', zIndex:1 }}>
        <div className="fredoka" style={{ fontSize:18, marginBottom:14 }}>📈 Game Progress</div>
        {games.map(g => (
          <div key={g.key} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
            <span style={{ fontSize:26, width:44, textAlign:'center' }}>{g.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:800, color:'var(--text)', marginBottom:5 }}>{g.name} — Level {levels[g.key]}/100</div>
              <ProgressBar pct={((levels[g.key]-1)/99)*100} color={g.color} height={8} />
            </div>
          </div>
        ))}
      </div>

      {/* Reset */}
      <div style={{ padding:'14px 18px', position:'relative', zIndex:1 }}>
        <button onClick={() => { if(window.confirm('Sach mein reset karna hai? Sab kuch chala jayega!')) onReset(); }}
          style={{ width:'100%', padding:12, background:'#FFEBEE', color:'var(--red)', border:'2px solid #FFCDD2', borderRadius:14, fontWeight:800, fontSize:14, cursor:'pointer' }}>
          🗑️ Progress Reset Karo
        </button>
      </div>

      <BottomNav active="parents" onNavigate={onNavigate} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SETTINGS PANEL (Modal)
// ═══════════════════════════════════════════════════════════════
export function SettingsPanel({ state, onClose, onToggleSound, onTogglePerformanceMode }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#fff', borderRadius:28, padding:'28px 24px', width:300, border:'3px solid var(--border)', boxShadow:'0 10px 0 var(--shadow)' }}>
        {/* Title */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <div className="fredoka" style={{ fontSize:24 }}>⚙️ Settings</div>
          <button onClick={onClose} style={{ background:'#F5F5F5', border:'none', borderRadius:12, width:36, height:36, fontSize:18, cursor:'pointer' }}>✕</button>
        </div>

        {/* Sound Toggle */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12, padding:14, background:'#F8F5EC', borderRadius:16, border:'2.5px solid var(--border)' }}>
          <div>
            <div style={{ fontWeight:800, fontSize:14 }}>🔊 Awaaz</div>
            <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>Sound effects</div>
          </div>
          <div onClick={onToggleSound} style={{ width:52, height:28, borderRadius:20, background:state.soundOn?'var(--green)':'#ccc', cursor:'pointer', position:'relative', transition:'background 0.2s' }}>
            <div style={{ position:'absolute', top:3, [state.soundOn?'right':'left']:3, width:22, height:22, background:'#fff', borderRadius:'50%', transition:'all 0.2s', boxShadow:'0 2px 4px rgba(0,0,0,0.2)' }}/>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12, padding:14, background:'#F8F5EC', borderRadius:16, border:'2.5px solid var(--border)' }}>
          <div>
            <div style={{ fontWeight:800, fontSize:14 }}>⚡ Performance</div>
            <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>Low motion, smoother on mobile</div>
          </div>
          <div onClick={onTogglePerformanceMode} style={{ width:52, height:28, borderRadius:20, background:state.performanceMode?'var(--green)':'#ccc', cursor:'pointer', position:'relative', transition:'background 0.2s' }}>
            <div style={{ position:'absolute', top:3, [state.performanceMode?'right':'left']:3, width:22, height:22, background:'#fff', borderRadius:'50%', transition:'all 0.2s', boxShadow:'0 2px 4px rgba(0,0,0,0.2)' }}/>
          </div>
        </div>

        {/* Stats */}
        <div style={{ padding:14, background:'#F8F5EC', borderRadius:16, border:'2.5px solid var(--border)' }}>
          <div style={{ fontWeight:800, fontSize:14, marginBottom:8 }}>📊 Stats</div>
          <div style={{ display:'flex', gap:8 }}>
            {[{ v:state.xp, l:'XP', c:'var(--orange)' }, { v:state.streak, l:'Streak', c:'var(--red)' }, { v:state.badges.length, l:'Badges', c:'var(--purple)' }].map(s => (
              <div key={s.l} style={{ flex:1, textAlign:'center' }}>
                <div className="fredoka" style={{ fontSize:20, color:s.c }}>{s.v}</div>
                <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
