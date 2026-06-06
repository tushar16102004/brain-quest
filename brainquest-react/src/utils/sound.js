let audioCtx = null;

function getAudio() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch {}
  }
  return audioCtx;
}

function playTone(freq, type = 'sine', duration = 0.12, vol = 0.18, delay = 0) {
  const ctx = getAudio();
  if (!ctx) return;
  try {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = type; o.frequency.value = freq;
    const t = ctx.currentTime + delay;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    o.start(t); o.stop(t + duration);
  } catch {}
}

export const SFX = {
  tap:     () => playTone(600, 'sine', 0.06, 0.12),
  correct: () => { playTone(523,'sine',0.1,0.2); playTone(659,'sine',0.1,0.2,0.1); playTone(784,'sine',0.15,0.2,0.2); },
  wrong:   () => playTone(200, 'sawtooth', 0.15, 0.15),
  levelUp: () => [523,587,659,784,1047].forEach((f,i) => playTone(f,'sine',0.12,0.22,i*0.1)),
  select:  () => playTone(440, 'sine', 0.08, 0.1),
  pop:     () => playTone(800, 'sine', 0.05, 0.15),
};

export function useSFX(soundOn) {
  return {
    tap:     () => soundOn && SFX.tap(),
    correct: () => soundOn && SFX.correct(),
    wrong:   () => soundOn && SFX.wrong(),
    levelUp: () => soundOn && SFX.levelUp(),
    select:  () => soundOn && SFX.select(),
    pop:     () => soundOn && SFX.pop(),
  };
}
