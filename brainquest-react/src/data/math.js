import { WORLDS } from './worlds';

function createSeededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function rnd(rand, min, max) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function shuffle(list, rand) {
  const next = [...list];

  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }

  return next;
}

export function generateOpts(ans, difficulty, rand) {
  const spread = [1, 2, 3, 4, 5, 8, 10, 15, 20, 30][difficulty] || 5;
  const options = new Set([String(ans)]);
  let tries = 0;

  while (options.size < 4 && tries < 100) {
    const delta = rnd(rand, 1, spread) * (rand() > 0.5 ? 1 : -1);
    const value = ans + delta;
    if (value > 0) options.add(String(value));
    tries += 1;
  }

  while (options.size < 4) {
    options.add(String(rnd(rand, 1, spread * 2)));
  }

  return shuffle([...options], rand);
}

export function generateMathQuestions(level, worldIdx) {
  const safeWorldIdx = Number.isInteger(worldIdx) ? worldIdx : 0;
  const seed = level * 1000 + (safeWorldIdx + 1) * 97;
  const rand = createSeededRandom(seed);
  const world = WORLDS.math[safeWorldIdx] || WORLDS.math[0];
  const difficulty = Math.floor((level - 1) / 10);
  const maxA = [10, 20, 30, 50, 50, 100, 100, 100, 200, 200][difficulty] || 20;
  const maxB = [5, 10, 15, 20, 30, 50, 50, 100, 100, 200][difficulty] || 10;
  const ops = difficulty < 2 ? ['+', '-'] : difficulty < 4 ? ['+', '-', 'x'] : ['+', '-', 'x', '/'];
  const questions = [];

  for (let i = 0; i < 5; i += 1) {
    const op = ops[Math.floor(rand() * ops.length)];
    let a;
    let b;
    let ans;
    let text;

    if (op === '+') {
      a = rnd(rand, 2, maxA);
      b = rnd(rand, 2, maxB);
      ans = a + b;
      text = `${world.emoji} <span class="num">${a}</span> items hain. <span class="num">${b}</span> aur aaye. Kul kitne?`;
    } else if (op === '-') {
      a = rnd(rand, maxB, maxA);
      b = rnd(rand, 2, Math.min(a - 1, maxB));
      ans = a - b;
      text = `${world.emoji} <span class="num">${a}</span> items the. <span class="num">${b}</span> chale gaye. Kitne bache?`;
    } else if (op === 'x') {
      a = rnd(rand, 2, Math.min(12, Math.max(2, Math.floor(maxA / 4))));
      b = rnd(rand, 2, Math.min(10, maxB));
      ans = a * b;
      text = `${world.emoji} <span class="num">${a}</span> boxes hain, har ek mein <span class="num">${b}</span> items. Kul kitne?`;
    } else {
      b = rnd(rand, 2, 10);
      a = b * rnd(rand, 2, 10);
      ans = a / b;
      text = `${world.emoji} <span class="num">${a}</span> items ko <span class="num">${b}</span> logo mein barabar baanto. Har ek ko kitne?`;
    }

    const opts = generateOpts(ans, difficulty, rand);
    let ansIdx = opts.indexOf(String(ans));
    if (ansIdx === -1) {
      opts[0] = String(ans);
      ansIdx = 0;
    }

    questions.push({
      text,
      char: world.emoji,
      opts,
      ans: ansIdx,
      feedback: {
        good: `Waah! ${a} ${op} ${b} = ${ans}! Shandaar!`,
        bad: `${a} ${op} ${b} = ${ans}`,
      },
    });
  }

  return questions;
}
