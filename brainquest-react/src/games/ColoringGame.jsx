import React, { useEffect, useRef, useState } from 'react';
import { BackBtn, WinOverlay } from '../components/UI';
import { getCBNPic, getCBNPalette } from '../data/coloring';
import { getXP } from '../data/progression';
import { useSFX } from '../utils/sound';
import { spawnConfetti } from '../utils/confetti';

export function ColoringGame({ level, worldIdx, state, addXP, saveLevelComplete, onBack, onNextLevel }) {
  const sfx = useSFX(state.soundOn);
  const pic = getCBNPic(level, worldIdx);
  const palette = getCBNPalette(level);
  const [colored, setColored] = useState({});
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [hint, setHint] = useState('Neeche se color chuno!');
  const [hintColor, setHintColor] = useState('var(--pink)');
  const [showWin, setShowWin] = useState(false);
  const coloredRef = useRef({});
  const completedRef = useRef(false);
  const winTimerRef = useRef(null);

  const nonBgRegions = pic.regions.filter((region) => !region.back);
  const coloredCount = Object.keys(colored).length;
  const total = nonBgRegions.length;
  const remaining = Math.max(0, total - coloredCount);
  const pct = total > 0 ? Math.round((coloredCount / total) * 100) : 0;
  const selectedColor = selectedIdx >= 0 ? palette[selectedIdx] : 'var(--pink)';

  useEffect(() => {
    coloredRef.current = colored;
  }, [colored]);

  useEffect(() => () => {
    if (winTimerRef.current) clearTimeout(winTimerRef.current);
  }, []);

  const getBBox = (pathData) => {
    const nums = pathData.match(/-?\d+\.?\d*/g) || [];
    const xs = [];
    const ys = [];

    for (let i = 0; i < nums.length - 1; i += 2) {
      xs.push(parseFloat(nums[i]));
      ys.push(parseFloat(nums[i + 1]));
    }

    const cx = xs.length ? Math.max(14, Math.min(186, xs.reduce((a, b) => a + b) / xs.length)) : 100;
    const cy = ys.length ? Math.max(14, Math.min(186, ys.reduce((a, b) => a + b) / ys.length)) : 100;
    return { cx, cy };
  };

  const tapRegion = (region) => {
    if (region.back || coloredRef.current[region.id] || completedRef.current) return;

    if (selectedIdx < 0) {
      setHint('Pehle color select karo.');
      setHintColor('var(--pink)');
      sfx.wrong();
      return;
    }

    const correctColor = palette[region.ci];
    if (palette[selectedIdx] === correctColor) {
      sfx.correct();
      const nextColored = { ...coloredRef.current, [region.id]: correctColor };
      const nextCount = Object.keys(nextColored).length;
      coloredRef.current = nextColored;
      setColored(nextColored);
      setHint(`Perfect! ${nextCount}/${total} sections done.`);
      setHintColor(correctColor);

      if (nextCount >= total && !completedRef.current) {
        completedRef.current = true;
        const xpAmt = getXP('draw', level);
        addXP(xpAmt);
        saveLevelComplete('draw', level, 3);
        spawnConfetti(state.performanceMode ? 18 : 55);
        winTimerRef.current = setTimeout(() => setShowWin(true), 500);
      }
      return;
    }

    sfx.wrong();
    setHint(`Hint: is section ko color ${region.ci + 1} chahiye.`);
    setHintColor(correctColor);
  };

  const selectColor = (color, index) => {
    setSelectedIdx(index);
    setHint(`Color ${index + 1} ready. Ab matching section tap karo.`);
    setHintColor(color);
    sfx.select();
  };

  const handleRegionPointerDown = (event, region) => {
    event.preventDefault();
    tapRegion(region);
  };

  const handleRegionKeyDown = (event, region) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    tapRegion(region);
  };

  const regions = [...pic.regions].sort((a, b) => (a.back ? -1 : 1) - (b.back ? -1 : 1));

  return (
    <div className="screen" style={{ background:'linear-gradient(180deg,#FFF6D8 0%, var(--bg) 45%, #EFFFF6 100%)', paddingBottom:20 }}>
      <div style={{ background:`linear-gradient(135deg,var(--pink),${selectedColor})`, borderRadius:'0 0 30px 30px', padding:'52px 18px 16px', boxShadow:'0 7px 0 #BB005A', position:'relative', zIndex:2, overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:0.14, background:'radial-gradient(circle at 18% 28%,#fff 0 8px,transparent 9px), radial-gradient(circle at 72% 18%,#fff 0 10px,transparent 11px), radial-gradient(circle at 88% 72%,#fff 0 7px,transparent 8px)' }} />
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, position:'relative', zIndex:1 }}>
          <BackBtn onClick={onBack} />
          <div style={{ textAlign:'center', minWidth:0, flex:1 }}>
            <div className="fredoka" style={{ fontSize:19, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              Coloring - {pic.name}
            </div>
            <div style={{ fontSize:11, fontWeight:900, color:'rgba(255,255,255,0.86)', marginTop:2 }}>
              Level {level} | {total} sections
            </div>
          </div>
          <div style={{ background:'rgba(255,255,255,0.22)', border:'2px solid rgba(255,255,255,0.4)', borderRadius:14, padding:'6px 10px', fontSize:12, fontWeight:900, color:'#fff', flexShrink:0 }}>
            XP {state.xp}
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:12, position:'relative', zIndex:1 }}>
          <div style={{ flex:1, background:'rgba(255,255,255,0.25)', borderRadius:20, height:11, overflow:'hidden', border:'1px solid rgba(255,255,255,0.22)' }}>
            <div style={{ height:'100%', width:`${pct}%`, background:'#fff', borderRadius:20, transition:'width 0.5s ease' }} />
          </div>
          <span style={{ fontSize:12, fontWeight:900, color:'rgba(255,255,255,0.92)', minWidth:36, textAlign:'right' }}>{pct}%</span>
        </div>
      </div>

      <div style={{ padding:'12px 14px 0', display:'flex', flexDirection:'column', gap:11, flex:1, position:'relative', zIndex:1 }}>
        <div style={{ background:'#fff', borderRadius:18, border:'3px solid var(--border)', padding:'10px 13px', boxShadow:'0 4px 0 var(--shadow)', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:'50%', background:selectedColor, border:'3px solid #fff', boxShadow:'0 0 0 2px rgba(26,26,46,0.15), 0 3px 7px rgba(0,0,0,0.16)', flexShrink:0 }} />
          <div className="fredoka" style={{ fontSize:14, color:hintColor, flex:1, minWidth:0 }}>{hint}</div>
          <div style={{ fontSize:12, fontWeight:900, color:'var(--muted)', whiteSpace:'nowrap' }}>{remaining} left</div>
        </div>

        <div style={{ background:'linear-gradient(180deg,#FFFFFF 0%,#FFFDF4 100%)', borderRadius:24, border:'3px solid var(--border)', boxShadow:'0 6px 0 var(--shadow)', overflow:'hidden', flex:1, minHeight:270, padding:12, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
          <div style={{ position:'absolute', inset:0, opacity:0.28, background:'repeating-linear-gradient(45deg,rgba(255,214,0,0.12) 0 9px,transparent 9px 18px)' }} />
          <svg
            viewBox="0 0 200 200"
            aria-label={`Coloring picture: ${pic.name}`}
            style={{ width:'100%', maxWidth:520, height:'auto', maxHeight:'100%', aspectRatio:'1 / 1', display:'block', touchAction:'none', userSelect:'none', position:'relative', zIndex:1 }}
          >
            {regions.map((region) => {
              const isColored = !!colored[region.id];
              const isTappable = !region.back && !isColored;
              const fill = colored[region.id] || (region.back ? '#E8F5E9' : '#FFF9E9');
              const stroke = region.back ? 'transparent' : isColored ? 'rgba(26,26,46,0.18)' : '#2A2A3E';
              const bbox = isTappable ? getBBox(region.d) : null;

              return (
                <g key={region.id}>
                  <path
                    d={region.d}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={region.back ? 0 : isColored ? 1.2 : 2.2}
                    vectorEffect="non-scaling-stroke"
                    role={isTappable ? 'button' : undefined}
                    tabIndex={isTappable ? 0 : undefined}
                    aria-label={isTappable ? `Color section ${region.ci + 1}` : undefined}
                    onPointerDown={(event) => handleRegionPointerDown(event, region)}
                    onKeyDown={(event) => handleRegionKeyDown(event, region)}
                    style={{
                      cursor: isTappable ? 'pointer' : 'default',
                      outline: 'none',
                      transition: 'fill 0.22s ease, stroke 0.22s ease, filter 0.22s ease',
                      filter: isColored ? 'drop-shadow(0 2px 1px rgba(0,0,0,0.08))' : 'none',
                    }}
                  />
                  {bbox && (
                    <g pointerEvents="none">
                      <circle cx={bbox.cx} cy={bbox.cy} r={10.5} fill="#fff" stroke="#2A2A3E" strokeWidth={1.4} opacity={0.96} />
                      <text x={bbox.cx} y={bbox.cy + 4} textAnchor="middle" fontSize={10.5} fontWeight={900} fill="#2A2A3E" fontFamily="Fredoka One,cursive">
                        {region.ci + 1}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div style={{ background:'#fff', borderRadius:20, border:'3px solid var(--border)', padding:'11px 12px', boxShadow:'0 5px 0 var(--shadow)', display:'grid', gridTemplateColumns:'repeat(4,minmax(0,1fr))', gap:9 }}>
          {palette.map((color, i) => {
            const isSelected = selectedIdx === i;
            return (
              <button
                type="button"
                key={color + i}
                aria-label={`Select color ${i + 1}`}
                aria-pressed={isSelected}
                onClick={() => selectColor(color, i)}
                style={{
                  height:46,
                  borderRadius:16,
                  background:color,
                  cursor:'pointer',
                  border: isSelected ? '3px solid #1A1A2E' : '3px solid rgba(255,255,255,0.95)',
                  boxShadow: isSelected ? '0 5px 0 rgba(26,26,46,0.35)' : '0 3px 0 rgba(26,26,46,0.16)',
                  transform: isSelected ? 'translateY(-3px)' : 'translateY(0)',
                  transition:'transform 0.15s ease, box-shadow 0.15s ease, border 0.15s ease',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  minWidth:0,
                }}
              >
                <span style={{ width:22, height:22, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.9)', color:'#1A1A2E', fontSize:12, fontWeight:900, boxShadow:'0 1px 4px rgba(0,0,0,0.16)' }}>
                  {i + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <WinOverlay
        show={showWin}
        emoji="ART"
        title="Masterpiece!"
        xpEarned={getXP('draw', level)}
        stars={3}
        nextLabel="Aage Level"
        onNext={() => { setShowWin(false); onNextLevel(); }}
        onMenu={onBack}
      />
    </div>
  );
}
