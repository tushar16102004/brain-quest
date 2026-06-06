const COLORS = ['#FF3B3B','#FF7A00','#FFD600','#00C853','#2979FF','#AA00FF','#FF4081','#00BCD4'];

export function spawnConfetti(count = 55) {
  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'cf';
    c.style.cssText = `
      left:${Math.random()*100}vw;
      top:0;
      background:${COLORS[Math.floor(Math.random()*COLORS.length)]};
      animation-delay:${Math.random()*0.8}s;
      animation-duration:${Math.random()*1+1.5}s;
      transform:rotate(${Math.random()*360}deg);
      border-radius:${Math.random()>0.5?'50%':'3px'};
    `;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3500);
  }
}
