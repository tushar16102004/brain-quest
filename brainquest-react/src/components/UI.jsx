import React from 'react';

// ── Blob Background ──────────────────────────────────────────
export function BlobBg() {
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
      {[
        { w:320, h:320, top:'-80px', left:'-80px', bg:'#FF3B3B', delay:'0s' },
        { w:260, h:260, top:'35%',   right:'-60px', bg:'#2979FF', delay:'2s' },
        { w:200, h:200, bottom:'10%',left:'10%',   bg:'#00C853', delay:'4s' },
        { w:180, h:180, bottom:'20%',right:'5%',   bg:'#FFD600', delay:'1s' },
      ].map((b,i) => (
        <div key={i} style={{
          position:'absolute', borderRadius:'50%', opacity:0.09,
          width:b.w, height:b.h, top:b.top, left:b.left, right:b.right, bottom:b.bottom,
          background:b.bg,
          animation:`blobMove 10s ease-in-out ${b.delay} infinite`,
        }}/>
      ))}
    </div>
  );
}

// ── Back Button ──────────────────────────────────────────────
export function BackBtn({ onClick, dark = false }) {
  return (
    <button className="back-btn" onClick={onClick} style={dark ? { background:'rgba(0,0,0,0.06)', borderColor:'rgba(0,0,0,0.1)', color:'var(--text)' } : {}}>
      ←
    </button>
  );
}

// ── Bottom Navigation ─────────────────────────────────────────
export function BottomNav({ active, onNavigate }) {
  const items = [
    { key:'home',    icon:'🏠', label:'Home' },
    { key:'games',   icon:'🎮', label:'Games' },
    { key:'rewards', icon:'🏆', label:'Rewards' },
    { key:'parents', icon:'👨‍👩‍👧', label:'Parents' },
  ];
  return (
    <nav className="bnav">
      {items.map(item => (
        <button key={item.key} className={`bn${active === item.key ? ' on' : ''}`} onClick={() => onNavigate(item.key)}>
          <span className="bn-icon">{item.icon}</span>
          <span className="bn-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ── Win Overlay ───────────────────────────────────────────────
export function WinOverlay({ show, emoji, title, xpEarned, stars = 3, onNext, onMenu, nextLabel = 'Aage Level ▶' }) {
  return (
    <div className={`win-ov${show ? ' show' : ''}`}>
      <div className="win-emo">{emoji}</div>
      <div className="win-ttl fredoka">{title}</div>
      <div style={{ display:'flex', gap:8, margin:'4px 0' }}>
        {[0,1,2].map(i => (
          <span key={i} style={{ fontSize:44, opacity:i<stars?1:0.3, animation:`starSpin 0.5s ease ${i*0.15}s backwards` }}>⭐</span>
        ))}
      </div>
      <div className="win-xp">+{xpEarned} XP! ⭐</div>
      <div className="win-btns">
        <button className="wbtn wbtn-next" onClick={onNext}>{nextLabel}</button>
        {onMenu && <button className="wbtn wbtn-menu" onClick={onMenu}>Level Menu</button>}
      </div>
    </div>
  );
}

// ── XP Chip ───────────────────────────────────────────────────
export function XpChip({ xp }) {
  return (
    <div style={{ background:'rgba(255,255,255,0.25)', border:'2px solid rgba(255,255,255,0.45)', borderRadius:20, padding:'6px 14px', fontSize:14, fontWeight:800, color:'#fff', display:'flex', alignItems:'center', gap:5 }}>
      ⭐ {xp}
    </div>
  );
}

// ── Level Select World Grid ──────────────────────────────────
export function LevelGrid({ type, worlds, currentLevel, stars, onSelect }) {
  return (
    <div>
      {worlds.map((world, wi) => {
        const worldStart = wi * 10 + 1;
        return (
          <div key={wi}>
            <div style={{ margin:'16px 18px 8px', background:'#fff', borderRadius:14, border:'3px solid var(--border)', padding:'10px 16px', display:'flex', alignItems:'center', gap:10, fontFamily:'Fredoka One, cursive', fontSize:15, color:'var(--text)', boxShadow:'0 3px 0 var(--shadow)', position:'relative', zIndex:1, borderColor: world.color+'44' }}>
              <span style={{ fontSize:22 }}>{world.emoji}</span> World {wi+1}: {world.name}
            </div>
            <div className="lv-grid">
              {Array.from({ length: 10 }, (_, j) => {
                const l = worldStart + j;
                const s = (stars?.[l]) || 0;
                const isDone    = l < currentLevel;
                const isCurrent = l === currentLevel;
                const isLocked  = l > currentLevel;
                return (
                  <button
                    key={l}
                    type="button"
                    className={`lv-btn${isDone?' done':isCurrent?' current':isLocked?' locked':''}`}
                    onClick={() => onSelect(l, wi)}
                    disabled={isLocked}
                  >
                    {l}
                    <span className="lv-star">
                      {isDone ? '★'.repeat(s) : isCurrent ? '▶' : isLocked ? '🔒' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Loading Screen ────────────────────────────────────────────
export function LoadingScreen({ mascot = '🤖', message = 'Load ho raha hai...', tip = '', tipTitle = '' }) {
  return (
    <div className="screen" style={{ alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center', padding:'40px 24px', position:'relative', zIndex:1 }}>
        <div style={{ fontSize:76, animation:'bounce 1s ease-in-out infinite' }}>{mascot}</div>
        <div className="fredoka" style={{ fontSize:26, color:'var(--purple)', marginTop:14 }}>Ban rahi hai...</div>
        <div style={{ display:'flex', gap:8, justifyContent:'center', marginTop:10 }}>
          {['#FF3B3B','#FF7A00','#00C853','#2979FF'].map((c,i) => (
            <div key={i} style={{ width:12, height:12, borderRadius:'50%', background:c, animation:`dotBounce 1.2s ease-in-out ${i*0.15}s infinite` }}/>
          ))}
        </div>
        <div style={{ fontSize:13, fontWeight:700, color:'var(--muted)', marginTop:8 }}>{message}</div>
        {tip && (
          <div style={{ marginTop:16, background:'#fff', borderRadius:16, border:'2.5px solid var(--border)', padding:'13px 16px', maxWidth:300, margin:'16px auto 0' }}>
            <div style={{ fontSize:11, fontWeight:800, color:'var(--teal)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:5 }}>{tipTitle}</div>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--text)', lineHeight:1.5 }}>{tip}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Progress Bar ─────────────────────────────────────────────
export function ProgressBar({ pct, color = 'linear-gradient(90deg,var(--orange),var(--yellow))', height = 10 }) {
  return (
    <div className="prog-track" style={{ height }}>
      <div className="prog-fill" style={{ width:`${pct}%`, background:color }} />
    </div>
  );
}

// ── Mascot SVG ────────────────────────────────────────────────
export function MascotSVG({ style }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M30 80 Q100 10 170 80" stroke="#FF3B3B" strokeWidth="7" fill="none" strokeLinecap="round"/>
      <path d="M38 87 Q100 20 162 87" stroke="#FF7A00" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <path d="M46 94 Q100 32 154 94" stroke="#FFD600" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <path d="M54 100 Q100 44 146 100" stroke="#00C853" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M62 106 Q100 56 138 106" stroke="#2979FF" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <circle cx="100" cy="145" r="50" fill="#FFD600"/>
      <circle cx="100" cy="138" r="44" fill="#FFF9C4"/>
      <ellipse cx="70" cy="152" rx="12" ry="9" fill="#FFAB91" opacity="0.7"/>
      <ellipse cx="130" cy="152" rx="12" ry="9" fill="#FFAB91" opacity="0.7"/>
      <circle cx="84" cy="132" r="13" fill="white"/><circle cx="116" cy="132" r="13" fill="white"/>
      <circle cx="87" cy="132" r="8" fill="#1A1A2E"/><circle cx="119" cy="132" r="8" fill="#1A1A2E"/>
      <circle cx="90" cy="129" r="3" fill="white"/><circle cx="122" cy="129" r="3" fill="white"/>
      <path d="M76 152 Q100 170 124 152" stroke="#FF3B3B" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M84 157 Q100 168 116 157" fill="white"/>
      <circle cx="42" cy="128" r="16" fill="#FFD600"/><circle cx="42" cy="128" r="10" fill="#FFAB91"/>
      <circle cx="158" cy="128" r="16" fill="#FFD600"/><circle cx="158" cy="128" r="10" fill="#FFAB91"/>
    </svg>
  );
}
