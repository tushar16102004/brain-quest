export const CBN_PALETTES = [
  ['#FF3B3B', '#FF7A00', '#FFD600', '#00C853', '#2979FF', '#AA00FF', '#F5DEB3', '#8B4513'],
  ['#00C853', '#76FF03', '#FFD600', '#2979FF', '#FF7A00', '#8B4513', '#87CEEB', '#FF3B3B'],
  ['#AA00FF', '#00E5FF', '#FFD600', '#FF3B3B', '#2979FF', '#C0C0C0', '#FF7A00', '#1A1A2E'],
  ['#006994', '#00BCD4', '#00E5FF', '#FF7A00', '#FF3B3B', '#FFD600', '#2979FF', '#00C853'],
  ['#FF3B3B', '#FF7A00', '#00C853', '#FFD600', '#8B4513', '#FF4081', '#87CEEB', '#2979FF'],
  ['#FF3B3B', '#FF7A00', '#FFD600', '#00C853', '#AA00FF', '#FF4081', '#2979FF', '#8B4513'],
  ['#FF3B3B', '#2979FF', '#FFD600', '#00C853', '#FF7A00', '#C0C0C0', '#1A1A2E', '#AA00FF'],
  ['#FF3B3B', '#FF7A00', '#FFD600', '#00C853', '#2979FF', '#AA00FF', '#FF4081', '#00BCD4'],
  ['#AA00FF', '#FF4081', '#00E5FF', '#FFD600', '#FF7A00', '#00C853', '#2979FF', '#FF3B3B'],
  ['#FF7A00', '#FFD600', '#FF3B3B', '#8B4513', '#00C853', '#FF4081', '#2979FF', '#AA00FF'],
];

const WORLD_COUNT = 10;
const LEVELS_PER_WORLD = 10;

function clampLevel(level) {
  return Math.max(1, Math.min(100, Number(level) || 1));
}

function ovalPath(cx, cy, rx, ry) {
  return `M${cx - rx},${cy} C${cx - rx},${cy - ry} ${cx + rx},${cy - ry} ${cx + rx},${cy} C${cx + rx},${cy + ry} ${cx - rx},${cy + ry} ${cx - rx},${cy}Z`;
}

function rectPath(x, y, w, h) {
  return `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h}Z`;
}

function triPath(x1, y1, x2, y2, x3, y3) {
  return `M${x1},${y1} L${x2},${y2} L${x3},${y3}Z`;
}

function cloudPath(x, y, scale = 1) {
  const p = (n) => Math.round(n * scale);
  return `M${x},${y} C${x},${y - p(12)} ${x + p(12)},${y - p(17)} ${x + p(23)},${y - p(11)} C${x + p(27)},${y - p(24)} ${x + p(47)},${y - p(24)} ${x + p(51)},${y - p(9)} C${x + p(64)},${y - p(11)} ${x + p(73)},${y} ${x + p(68)},${y + p(12)} C${x + p(70)},${y + p(22)} ${x + p(52)},${y + p(25)} ${x + p(45)},${y + p(18)} C${x + p(34)},${y + p(25)} ${x + p(12)},${y + p(23)} ${x + p(14)},${y + p(13)} C${x + p(4)},${y + p(16)} ${x - p(4)},${y + p(8)} ${x},${y}Z`;
}

function starPath(cx, cy, r1, r2, points = 5) {
  const coords = [];
  for (let i = 0; i < points * 2; i += 1) {
    const radius = i % 2 === 0 ? r1 : r2;
    const angle = -Math.PI / 2 + (i * Math.PI) / points;
    coords.push(`${Math.round(cx + Math.cos(angle) * radius)},${Math.round(cy + Math.sin(angle) * radius)}`);
  }
  return `M${coords.join(' L')}Z`;
}

function bg(ci = 6) {
  return { id: 'bg', d: rectPath(0, 0, 200, 200), ci, back: true };
}

function buildAnimals(v) {
  const names = ['Lion Cub', 'Puppy Pal', 'Sleepy Cat', 'Happy Bunny', 'Little Fox', 'Bear Buddy', 'Panda Pop', 'Tiger Tot', 'Koala Hug', 'Monkey Smile'];
  const earTall = v === 3 || v === 8;
  const hasTail = v !== 6 && v !== 8;
  const stripe = v === 0 || v === 4 || v === 7;
  const spots = v === 1 || v === 5 || v === 6;
  const bodyCi = [0, 4, 7, 6, 1, 5, 6, 0, 5, 7][v];

  return {
    name: names[v],
    regions: [
      bg(6),
      { id: 'ground', d: rectPath(0, 158, 200, 42), ci: 3, back: true },
      { id: 'tail', d: hasTail ? `M140,122 C164,100 178,124 156,139 C148,145 141,137 145,130 C154,126 155,119 146,116Z` : ovalPath(151, 124, 14, 18), ci: bodyCi },
      { id: 'body', d: ovalPath(100, 126, 50, 42), ci: bodyCi },
      { id: 'belly', d: ovalPath(100, 134, 26, 25), ci: 2 },
      { id: 'ear_l', d: earTall ? triPath(63, 65, 71, 26, 86, 72) : ovalPath(69, 70, 18, 19), ci: bodyCi },
      { id: 'ear_r', d: earTall ? triPath(137, 65, 129, 26, 114, 72) : ovalPath(131, 70, 18, 19), ci: bodyCi },
      { id: 'head', d: ovalPath(100, 83, 42, 37), ci: bodyCi },
      { id: 'snout', d: ovalPath(100, 96, 23, 15), ci: 2 },
      { id: 'nose', d: ovalPath(100, 90, 8, 6), ci: 7 },
      { id: 'eye_l', d: ovalPath(84, 78, 5, 6), ci: 7 },
      { id: 'eye_r', d: ovalPath(116, 78, 5, 6), ci: 7 },
      ...(stripe ? [
        { id: 'mark_l', d: triPath(81, 53, 88, 72, 75, 69), ci: 1 },
        { id: 'mark_r', d: triPath(119, 53, 112, 72, 125, 69), ci: 1 },
      ] : []),
      ...(spots ? [
        { id: 'spot_l', d: ovalPath(78, 119, 8, 7), ci: 7 },
        { id: 'spot_r', d: ovalPath(123, 132, 7, 8), ci: 7 },
      ] : []),
    ],
  };
}

function buildNature(v) {
  const names = ['Sunny Flower', 'Apple Tree', 'Leaf Garden', 'Tulip Path', 'Mushroom Hill', 'Lotus Pond', 'Cactus Day', 'Berry Bush', 'Rain Cloud', 'Rainbow Park'];
  const isTree = v === 1 || v === 7;
  const isCactus = v === 6;
  const isRainbow = v === 9;

  if (isTree) {
    return {
      name: names[v],
      regions: [
        bg(6),
        { id: 'grass', d: rectPath(0, 154, 200, 46), ci: 1, back: true },
        { id: 'trunk', d: rectPath(88, 98, 25, 62), ci: 5 },
        { id: 'leaf_1', d: ovalPath(76, 88, 33, 28), ci: 0 },
        { id: 'leaf_2', d: ovalPath(111, 79, 37, 31), ci: 0 },
        { id: 'leaf_3', d: ovalPath(122, 107, 30, 27), ci: 1 },
        { id: 'fruit_1', d: ovalPath(82, 92, 7, 7), ci: 7 },
        { id: 'fruit_2', d: ovalPath(119, 79, 7, 7), ci: 7 },
        { id: 'fruit_3', d: ovalPath(128, 111, 7, 7), ci: 7 },
        { id: 'sun', d: ovalPath(32, 34, 16, 16), ci: 2 },
      ],
    };
  }

  if (isCactus) {
    return {
      name: names[v],
      regions: [
        bg(2),
        { id: 'sand', d: rectPath(0, 150, 200, 50), ci: 1, back: true },
        { id: 'cactus_main', d: `M88,154 L88,72 C88,53 112,53 112,72 L112,154Z`, ci: 3 },
        { id: 'arm_l', d: `M88,103 C68,101 65,82 75,76 C85,80 78,94 88,95Z`, ci: 3 },
        { id: 'arm_r', d: `M112,116 C137,112 138,89 128,85 C117,90 123,106 112,108Z`, ci: 3 },
        { id: 'flower', d: starPath(100, 61, 15, 7), ci: 5 },
        { id: 'pot', d: `M70,154 L130,154 L122,184 L78,184Z`, ci: 4 },
        { id: 'sun', d: ovalPath(35, 35, 15, 15), ci: 2 },
      ],
    };
  }

  if (isRainbow) {
    return {
      name: names[v],
      regions: [
        bg(6),
        { id: 'ground', d: rectPath(0, 145, 200, 55), ci: 1, back: true },
        { id: 'arc_1', d: `M18,140 C20,50 180,50 182,140 L164,140 C162,67 38,67 36,140Z`, ci: 7 },
        { id: 'arc_2', d: `M39,140 C42,76 158,76 161,140 L143,140 C140,92 60,92 57,140Z`, ci: 2 },
        { id: 'arc_3', d: `M61,140 C64,101 136,101 139,140 L120,140 C118,118 82,118 80,140Z`, ci: 3 },
        { id: 'cloud_l', d: cloudPath(12, 117, 0.75), ci: 6 },
        { id: 'cloud_r', d: cloudPath(128, 117, 0.75), ci: 6 },
      ],
    };
  }

  return {
    name: names[v],
    regions: [
      bg(6),
      { id: 'grass', d: rectPath(0, 156, 200, 44), ci: 1, back: true },
      { id: 'stem', d: rectPath(96, 96, 8, 66), ci: 3 },
      { id: 'leaf_l', d: ovalPath(82, 126, 20, 9), ci: 0 },
      { id: 'leaf_r', d: ovalPath(119, 115, 20, 9), ci: 0 },
      { id: 'petal_1', d: ovalPath(100, 70, 14, 28), ci: 5 },
      { id: 'petal_2', d: ovalPath(78, 91, 25, 14), ci: 7 },
      { id: 'petal_3', d: ovalPath(122, 91, 25, 14), ci: 7 },
      { id: 'petal_4', d: ovalPath(100, 112, 14, 25), ci: 5 },
      { id: 'center', d: ovalPath(100, 92, 16, 15), ci: 2 },
      { id: 'sky_bit', d: v === 8 ? cloudPath(35, 39, 0.8) : ovalPath(34, 35, 15, 15), ci: v === 8 ? 4 : 2 },
    ],
  };
}

function buildSpace(v) {
  const names = ['Rocket Run', 'Moon Rover', 'Ring Planet', 'Star Ship', 'Alien Saucer', 'Comet Trail', 'Space Bot', 'Moon Base', 'Orbit Lab', 'Galaxy Gate'];
  const mode = v % 3;

  if (mode === 1) {
    return {
      name: names[v],
      regions: [
        bg(7),
        { id: 'moon', d: ovalPath(100, 138, 72, 28), ci: 5, back: true },
        { id: 'body', d: rectPath(56, 91, 88, 42), ci: 4 },
        { id: 'cabin', d: rectPath(80, 65, 42, 31), ci: 2 },
        { id: 'window', d: ovalPath(101, 80, 12, 9), ci: 1 },
        { id: 'wheel_l', d: ovalPath(73, 138, 13, 13), ci: 6 },
        { id: 'wheel_r', d: ovalPath(128, 138, 13, 13), ci: 6 },
        { id: 'antenna', d: triPath(120, 65, 137, 40, 129, 68), ci: 3 },
        { id: 'star', d: starPath(42, 42, 12, 5), ci: 2 },
      ],
    };
  }

  if (mode === 2) {
    return {
      name: names[v],
      regions: [
        bg(7),
        { id: 'planet', d: ovalPath(100, 104, 42, 37), ci: 0 },
        { id: 'ring', d: `M34,111 C63,82 139,79 168,103 C142,112 68,130 34,111Z`, ci: 2 },
        { id: 'crater_1', d: ovalPath(88, 94, 8, 7), ci: 6 },
        { id: 'crater_2', d: ovalPath(115, 116, 10, 8), ci: 6 },
        { id: 'star_1', d: starPath(44, 48, 12, 5), ci: 5 },
        { id: 'star_2', d: starPath(158, 55, 10, 4), ci: 5 },
        { id: 'moon', d: ovalPath(145, 153, 14, 14), ci: 1 },
      ],
    };
  }

  return {
    name: names[v],
    regions: [
      bg(7),
      { id: 'rocket_body', d: `M84,39 C79,66 78,116 82,142 L118,142 C122,116 121,66 116,39 C112,19 88,19 84,39Z`, ci: 4 },
      { id: 'nose', d: triPath(82, 42, 100, 12, 118, 42), ci: 0 },
      { id: 'window', d: ovalPath(100, 76, 12, 12), ci: 1 },
      { id: 'fin_l', d: triPath(82, 121, 59, 150, 83, 148), ci: 2 },
      { id: 'fin_r', d: triPath(118, 121, 141, 150, 117, 148), ci: 2 },
      { id: 'flame_outer', d: `M88,142 C86,163 96,178 100,187 C104,178 114,163 112,142Z`, ci: 3 },
      { id: 'flame_inner', d: `M94,144 C92,158 98,167 100,173 C102,167 108,158 106,144Z`, ci: 2 },
      { id: 'star', d: starPath(38 + v * 3, 47, 10, 4), ci: 5 },
    ],
  };
}

function buildFood(v) {
  const names = ['Birthday Cake', 'Ice Cream', 'Pizza Slice', 'Apple Snack', 'Cupcake', 'Burger Stack', 'Donut Ring', 'Watermelon', 'Cookie Plate', 'Juice Box'];
  const mode = v % 5;

  if (mode === 1) {
    return {
      name: names[v],
      regions: [
        bg(6),
        { id: 'cone', d: triPath(72, 99, 128, 99, 101, 181), ci: 5 },
        { id: 'scoop_1', d: ovalPath(100, 89, 34, 27), ci: 0 },
        { id: 'scoop_2', d: ovalPath(88, 63, 29, 24), ci: 2 },
        { id: 'scoop_3', d: ovalPath(114, 62, 28, 24), ci: 4 },
        { id: 'cherry', d: ovalPath(100, 36, 9, 9), ci: 7 },
        { id: 'stripe_1', d: rectPath(85, 125, 31, 5), ci: 1 },
        { id: 'stripe_2', d: rectPath(79, 145, 43, 5), ci: 1 },
      ],
    };
  }

  if (mode === 2) {
    return {
      name: names[v],
      regions: [
        bg(6),
        { id: 'slice', d: triPath(45, 54, 160, 84, 80, 172), ci: 2 },
        { id: 'crust', d: `M45,54 C81,38 128,49 160,84 L150,94 C118,74 80,64 50,69Z`, ci: 5 },
        { id: 'pep_1', d: ovalPath(88, 82, 9, 8), ci: 0 },
        { id: 'pep_2', d: ovalPath(105, 116, 9, 8), ci: 0 },
        { id: 'pep_3', d: ovalPath(76, 132, 8, 8), ci: 0 },
        { id: 'leaf', d: ovalPath(123, 92, 11, 6), ci: 3 },
      ],
    };
  }

  if (mode === 3) {
    return {
      name: names[v],
      regions: [
        bg(6),
        { id: 'fruit', d: ovalPath(100, 108, 42, 49), ci: 0 },
        { id: 'shine', d: ovalPath(86, 86, 11, 15), ci: 2 },
        { id: 'stem', d: rectPath(96, 47, 8, 27), ci: 5 },
        { id: 'leaf', d: ovalPath(117, 58, 22, 10), ci: 3 },
        { id: 'ground_shadow', d: ovalPath(100, 164, 46, 9), ci: 4 },
        { id: 'seed_1', d: ovalPath(94, 108, 5, 7), ci: 7 },
        { id: 'seed_2', d: ovalPath(113, 125, 5, 7), ci: 7 },
      ],
    };
  }

  if (mode === 4) {
    return {
      name: names[v],
      regions: [
        bg(6),
        { id: 'wrapper', d: `M60,99 L140,99 L129,172 L71,172Z`, ci: 4 },
        { id: 'frosting', d: `M56,99 C62,68 84,57 100,75 C116,53 142,70 144,99Z`, ci: 5 },
        { id: 'frost_tip', d: ovalPath(100, 62, 16, 15), ci: 2 },
        { id: 'sprinkle_1', d: rectPath(82, 88, 13, 5), ci: 0 },
        { id: 'sprinkle_2', d: rectPath(111, 78, 12, 5), ci: 3 },
        { id: 'stripe_1', d: rectPath(74, 116, 8, 55), ci: 1 },
        { id: 'stripe_2', d: rectPath(118, 116, 8, 55), ci: 1 },
      ],
    };
  }

  return {
    name: names[v],
    regions: [
      bg(6),
      { id: 'plate', d: ovalPath(100, 164, 63, 13), ci: 5, back: true },
      { id: 'layer_1', d: rectPath(42, 114, 116, 43), ci: 0 },
      { id: 'layer_2', d: rectPath(55, 78, 90, 39), ci: 4 },
      { id: 'frost', d: `M42,108 C60,98 79,116 99,105 C120,94 139,112 158,107 L158,122 C139,116 120,128 99,119 C79,130 60,115 42,124Z`, ci: 2 },
      { id: 'candle_1', d: rectPath(78, 41, 10, 38), ci: 3 },
      { id: 'candle_2', d: rectPath(112, 41, 10, 38), ci: 3 },
      { id: 'flame_1', d: ovalPath(83, 34, 8, 10), ci: 1 },
      { id: 'flame_2', d: ovalPath(117, 34, 8, 10), ci: 1 },
    ],
  };
}

function buildVehicles(v) {
  const names = ['Tiny Car', 'City Bus', 'Paper Boat', 'Blue Train', 'Sky Plane', 'Fire Truck', 'Scooter Zip', 'Taxi Time', 'Race Kart', 'Sail Ship'];
  const mode = v % 5;

  if (mode === 2 || mode === 4) {
    return {
      name: names[v],
      regions: [
        bg(6),
        { id: 'road', d: rectPath(0, 150, 200, 50), ci: 5, back: true },
        { id: 'body', d: mode === 4 ? `M44,95 L163,73 L140,111 L162,131 L121,124 L100,151 L91,119 L43,113Z` : `M36,113 L166,113 L137,155 L65,155Z`, ci: 4 },
        { id: 'top', d: mode === 4 ? triPath(97, 84, 126, 46, 122, 97) : triPath(66, 111, 102, 72, 139, 111), ci: 0 },
        { id: 'window', d: mode === 4 ? ovalPath(113, 93, 15, 8) : rectPath(87, 93, 36, 18), ci: 2 },
        { id: 'detail_1', d: ovalPath(75, 137, 10, 10), ci: 7 },
        { id: 'detail_2', d: ovalPath(130, 137, 10, 10), ci: 7 },
        { id: 'sun', d: ovalPath(34, 38, 14, 14), ci: 1 },
      ],
    };
  }

  if (mode === 1) {
    return {
      name: names[v],
      regions: [
        bg(6),
        { id: 'road', d: rectPath(0, 148, 200, 52), ci: 5, back: true },
        { id: 'bus_body', d: rectPath(35, 78, 130, 65), ci: 1 },
        { id: 'front', d: rectPath(145, 94, 20, 49), ci: 4 },
        { id: 'window_1', d: rectPath(48, 91, 26, 20), ci: 2 },
        { id: 'window_2', d: rectPath(83, 91, 26, 20), ci: 2 },
        { id: 'window_3', d: rectPath(118, 91, 26, 20), ci: 2 },
        { id: 'wheel_l', d: ovalPath(65, 146, 13, 13), ci: 7 },
        { id: 'wheel_r', d: ovalPath(137, 146, 13, 13), ci: 7 },
      ],
    };
  }

  if (mode === 3) {
    return {
      name: names[v],
      regions: [
        bg(6),
        { id: 'track', d: rectPath(0, 151, 200, 49), ci: 5, back: true },
        { id: 'engine', d: rectPath(38, 92, 54, 47), ci: 0 },
        { id: 'carriage', d: rectPath(98, 86, 64, 53), ci: 4 },
        { id: 'chimney', d: rectPath(50, 68, 18, 24), ci: 7 },
        { id: 'window', d: rectPath(111, 98, 31, 22), ci: 2 },
        { id: 'wheel_1', d: ovalPath(58, 145, 12, 12), ci: 7 },
        { id: 'wheel_2', d: ovalPath(110, 145, 12, 12), ci: 7 },
        { id: 'wheel_3', d: ovalPath(145, 145, 12, 12), ci: 7 },
      ],
    };
  }

  return {
    name: names[v],
    regions: [
      bg(6),
      { id: 'road', d: rectPath(0, 148, 200, 52), ci: 5, back: true },
      { id: 'car_body', d: `M35,122 C45,96 69,85 106,85 C134,85 152,99 164,122 L164,142 L35,142Z`, ci: 4 },
      { id: 'hood', d: rectPath(38, 118, 127, 16), ci: 0 },
      { id: 'window_l', d: `M72,91 L98,91 L94,116 L61,116Z`, ci: 2 },
      { id: 'window_r', d: `M103,91 L129,96 L143,116 L101,116Z`, ci: 2 },
      { id: 'wheel_l', d: ovalPath(67, 145, 14, 14), ci: 7 },
      { id: 'wheel_r', d: ovalPath(136, 145, 14, 14), ci: 7 },
      { id: 'light', d: ovalPath(156, 126, 7, 6), ci: 1 },
    ],
  };
}

function buildFestivals(v) {
  const names = ['Gift Box', 'Flying Kite', 'Diya Glow', 'Party Drum', 'Lantern Night', 'Star Garland', 'Festival Mask', 'Sparkle Pot', 'Ribbon Flag', 'Confetti Cup'];
  const mode = v % 5;

  if (mode === 1) {
    return {
      name: names[v],
      regions: [
        bg(6),
        { id: 'kite', d: `M100,38 L145,95 L100,148 L55,95Z`, ci: 0 },
        { id: 'kite_left', d: triPath(100, 38, 100, 95, 55, 95), ci: 2 },
        { id: 'kite_right', d: triPath(100, 38, 145, 95, 100, 95), ci: 4 },
        { id: 'tail_1', d: `M96,148 C84,162 107,172 96,184 L103,184 C116,171 93,161 104,148Z`, ci: 5 },
        { id: 'bow_1', d: triPath(96, 164, 82, 157, 90, 171), ci: 1 },
        { id: 'bow_2', d: triPath(104, 164, 118, 157, 110, 171), ci: 1 },
        { id: 'cloud', d: cloudPath(24, 38, 0.7), ci: 6 },
      ],
    };
  }

  if (mode === 2) {
    return {
      name: names[v],
      regions: [
        bg(7),
        { id: 'glow', d: ovalPath(100, 93, 54, 55), ci: 2, back: true },
        { id: 'flame_outer', d: `M100,33 C76,70 86,101 100,110 C114,101 124,70 100,33Z`, ci: 1 },
        { id: 'flame_inner', d: `M100,55 C90,77 94,93 100,99 C106,93 110,77 100,55Z`, ci: 2 },
        { id: 'bowl', d: `M45,122 C68,164 132,164 155,122 C126,135 74,135 45,122Z`, ci: 0 },
        { id: 'rim', d: ovalPath(100, 122, 56, 13), ci: 5 },
        { id: 'dot_l', d: ovalPath(73, 132, 5, 5), ci: 3 },
        { id: 'dot_r', d: ovalPath(127, 132, 5, 5), ci: 3 },
      ],
    };
  }

  if (mode === 3) {
    return {
      name: names[v],
      regions: [
        bg(6),
        { id: 'drum', d: `M49,82 C65,62 135,62 151,82 L136,155 C120,172 80,172 64,155Z`, ci: 4 },
        { id: 'top', d: ovalPath(100, 82, 52, 18), ci: 2 },
        { id: 'stripe', d: `M61,111 C83,124 119,124 139,111 L134,129 C115,142 84,142 66,129Z`, ci: 0 },
        { id: 'stick_1', d: rectPath(50, 48, 11, 61), ci: 5 },
        { id: 'stick_2', d: rectPath(139, 48, 11, 61), ci: 5 },
        { id: 'star_1', d: starPath(36, 41, 11, 5), ci: 1 },
        { id: 'star_2', d: starPath(164, 42, 11, 5), ci: 1 },
      ],
    };
  }

  if (mode === 4) {
    return {
      name: names[v],
      regions: [
        bg(7),
        { id: 'lantern', d: `M68,63 C74,43 126,43 132,63 L136,136 C128,157 72,157 64,136Z`, ci: 5 },
        { id: 'top', d: rectPath(75, 52, 50, 17), ci: 1 },
        { id: 'center', d: ovalPath(100, 104, 31, 45), ci: 2 },
        { id: 'stripe_l', d: rectPath(78, 72, 8, 66), ci: 0 },
        { id: 'stripe_r', d: rectPath(114, 72, 8, 66), ci: 0 },
        { id: 'tassel', d: triPath(88, 148, 112, 148, 100, 181), ci: 3 },
        { id: 'stars', d: starPath(38, 42, 12, 5), ci: 2 },
      ],
    };
  }

  return {
    name: names[v],
    regions: [
      bg(6),
      { id: 'box', d: rectPath(47, 88, 106, 82), ci: 0 },
      { id: 'lid', d: rectPath(39, 71, 122, 25), ci: 4 },
      { id: 'ribbon_v', d: rectPath(88, 71, 24, 99), ci: 2 },
      { id: 'ribbon_h', d: rectPath(47, 116, 106, 20), ci: 2 },
      { id: 'bow_l', d: `M100,71 C70,45 48,63 64,82 C77,91 92,83 100,71Z`, ci: 5 },
      { id: 'bow_r', d: `M100,71 C130,45 152,63 136,82 C123,91 108,83 100,71Z`, ci: 5 },
      { id: 'sparkle', d: starPath(160, 48, 12, 5), ci: 1 },
    ],
  };
}

function buildUnderwater(v) {
  const names = ['Stripe Fish', 'Sea Turtle', 'Octopus Wave', 'Shell Home', 'Jelly Float', 'Starfish Sand', 'Crab Smile', 'Submarine', 'Sea Horse', 'Coral Reef'];
  const mode = v % 5;

  if (mode === 1) {
    return {
      name: names[v],
      regions: [
        bg(4),
        { id: 'sand', d: rectPath(0, 160, 200, 40), ci: 5, back: true },
        { id: 'shell', d: ovalPath(100, 112, 49, 39), ci: 3 },
        { id: 'head', d: ovalPath(143, 105, 22, 19), ci: 3 },
        { id: 'flipper_l', d: ovalPath(65, 128, 25, 11), ci: 0 },
        { id: 'flipper_r', d: ovalPath(124, 143, 22, 10), ci: 0 },
        { id: 'shell_mark_1', d: ovalPath(95, 101, 15, 14), ci: 2 },
        { id: 'shell_mark_2', d: ovalPath(113, 125, 12, 12), ci: 2 },
        { id: 'eye', d: ovalPath(151, 99, 4, 4), ci: 7 },
      ],
    };
  }

  if (mode === 2) {
    return {
      name: names[v],
      regions: [
        bg(4),
        { id: 'head', d: ovalPath(100, 82, 42, 39), ci: 0 },
        { id: 'eye_l', d: ovalPath(86, 74, 5, 6), ci: 7 },
        { id: 'eye_r', d: ovalPath(114, 74, 5, 6), ci: 7 },
        { id: 'leg_1', d: `M68,110 C52,137 62,157 79,135Z`, ci: 0 },
        { id: 'leg_2', d: `M88,116 C78,151 90,164 101,133Z`, ci: 0 },
        { id: 'leg_3', d: `M111,116 C122,151 110,164 99,133Z`, ci: 0 },
        { id: 'leg_4', d: `M132,110 C148,137 138,157 121,135Z`, ci: 0 },
        { id: 'bubble', d: ovalPath(154, 45, 10, 10), ci: 2 },
      ],
    };
  }

  if (mode === 3) {
    return {
      name: names[v],
      regions: [
        bg(4),
        { id: 'sand', d: rectPath(0, 155, 200, 45), ci: 5, back: true },
        { id: 'shell_base', d: `M49,139 C59,78 141,78 151,139Z`, ci: 5 },
        { id: 'stripe_1', d: `M77,137 C75,105 88,87 100,83 C93,106 92,122 94,139Z`, ci: 1 },
        { id: 'stripe_2', d: `M123,137 C125,105 112,87 100,83 C107,106 108,122 106,139Z`, ci: 1 },
        { id: 'pearl', d: ovalPath(100, 132, 13, 12), ci: 2 },
        { id: 'seaweed_l', d: `M28,160 C20,134 32,114 25,94 C43,113 36,139 47,160Z`, ci: 3 },
        { id: 'seaweed_r', d: `M170,160 C160,133 178,111 168,91 C190,114 184,139 190,160Z`, ci: 3 },
      ],
    };
  }

  if (mode === 4) {
    return {
      name: names[v],
      regions: [
        bg(4),
        { id: 'bell', d: `M55,100 C60,48 140,48 145,100 C132,118 68,118 55,100Z`, ci: 5 },
        { id: 'glow', d: ovalPath(100, 94, 32, 23), ci: 2 },
        { id: 'tentacle_1', d: `M68,110 C55,137 73,150 63,170 L72,170 C82,149 64,139 76,113Z`, ci: 0 },
        { id: 'tentacle_2', d: `M89,114 C79,142 97,153 86,176 L95,176 C106,151 89,142 97,116Z`, ci: 0 },
        { id: 'tentacle_3', d: `M107,116 C115,142 98,151 109,176 L118,176 C127,153 117,142 115,114Z`, ci: 0 },
        { id: 'tentacle_4', d: `M124,113 C136,139 118,149 128,170 L137,170 C147,150 145,137 132,110Z`, ci: 0 },
        { id: 'bubble', d: ovalPath(39, 58, 8, 8), ci: 2 },
      ],
    };
  }

  return {
    name: names[v],
    regions: [
      bg(4),
      { id: 'body', d: `M43,100 C62,59 125,59 158,100 C124,141 64,140 43,100Z`, ci: 0 },
      { id: 'tail', d: `M154,100 C171,77 187,82 184,100 C187,118 171,123 154,100Z`, ci: 1 },
      { id: 'fin_top', d: triPath(84, 66, 105, 41, 119, 68), ci: 3 },
      { id: 'fin_bottom', d: triPath(93, 130, 111, 157, 124, 128), ci: 3 },
      { id: 'stripe_1', d: `M80,68 C73,89 73,112 80,132 C88,112 88,89 80,68Z`, ci: 6 },
      { id: 'stripe_2', d: `M104,63 C97,88 97,115 104,139 C112,115 112,88 104,63Z`, ci: 6 },
      { id: 'eye', d: ovalPath(62, 91, 6, 6), ci: 2 },
      { id: 'bubble', d: ovalPath(34, 67, 8, 8), ci: 5 },
    ],
  };
}

function buildFantasy(v) {
  const names = ['Castle Door', 'Magic Wand', 'Dragon Egg', 'Unicorn Cloud', 'Wizard Hat', 'Fairy Door', 'Crystal Cave', 'Moon Crown', 'Pegasus Wing', 'Treasure Chest'];
  const mode = v % 5;

  if (mode === 1) {
    return {
      name: names[v],
      regions: [
        bg(6),
        { id: 'wand', d: `M70,153 L147,76 L158,87 L81,164Z`, ci: 5 },
        { id: 'star_top', d: starPath(150, 64, 31, 13), ci: 2 },
        { id: 'gem', d: ovalPath(100, 124, 10, 10), ci: 4 },
        { id: 'spark_1', d: starPath(55, 54, 11, 5), ci: 1 },
        { id: 'spark_2', d: starPath(90, 39, 9, 4), ci: 0 },
        { id: 'spark_3', d: starPath(157, 135, 10, 4), ci: 3 },
      ],
    };
  }

  if (mode === 2) {
    return {
      name: names[v],
      regions: [
        bg(7),
        { id: 'ground', d: rectPath(0, 153, 200, 47), ci: 5, back: true },
        { id: 'egg', d: `M67,125 C67,70 88,35 100,35 C112,35 133,70 133,125 C133,160 67,160 67,125Z`, ci: 2 },
        { id: 'crack_1', d: triPath(78, 85, 100, 105, 84, 111), ci: 4 },
        { id: 'crack_2', d: triPath(100, 105, 122, 86, 115, 116), ci: 4 },
        { id: 'wing_l', d: `M67,111 C35,93 39,58 74,74Z`, ci: 0 },
        { id: 'wing_r', d: `M133,111 C165,93 161,58 126,74Z`, ci: 0 },
        { id: 'star', d: starPath(157, 43, 13, 5), ci: 1 },
      ],
    };
  }

  if (mode === 3) {
    return {
      name: names[v],
      regions: [
        bg(6),
        { id: 'body', d: ovalPath(97, 119, 43, 35), ci: 6 },
        { id: 'head', d: ovalPath(115, 76, 32, 27), ci: 6 },
        { id: 'horn', d: triPath(105, 54, 122, 15, 130, 59), ci: 2 },
        { id: 'mane_1', d: ovalPath(88, 73, 12, 20), ci: 5 },
        { id: 'mane_2', d: ovalPath(87, 99, 12, 21), ci: 0 },
        { id: 'wing', d: `M57,101 C27,73 38,44 74,79 C67,92 64,99 57,101Z`, ci: 4 },
        { id: 'tail', d: `M56,122 C34,123 31,151 53,148 C44,139 49,132 59,132Z`, ci: 5 },
        { id: 'eye', d: ovalPath(125, 71, 4, 4), ci: 7 },
      ],
    };
  }

  if (mode === 4) {
    return {
      name: names[v],
      regions: [
        bg(7),
        { id: 'brim', d: ovalPath(100, 138, 58, 16), ci: 5 },
        { id: 'hat', d: triPath(59, 134, 103, 29, 143, 134), ci: 4 },
        { id: 'band', d: `M70,108 C93,120 121,120 134,108 L128,124 C108,133 88,132 75,124Z`, ci: 0 },
        { id: 'moon', d: ovalPath(103, 71, 14, 14), ci: 2 },
        { id: 'star_1', d: starPath(84, 91, 10, 4), ci: 1 },
        { id: 'star_2', d: starPath(124, 96, 9, 4), ci: 1 },
      ],
    };
  }

  return {
    name: names[v],
    regions: [
      bg(6),
      { id: 'grass', d: rectPath(0, 157, 200, 43), ci: 3, back: true },
      { id: 'tower_l', d: rectPath(38, 82, 35, 75), ci: 4 },
      { id: 'tower_r', d: rectPath(127, 82, 35, 75), ci: 4 },
      { id: 'wall', d: rectPath(67, 105, 66, 52), ci: 5 },
      { id: 'roof_l', d: triPath(35, 82, 55, 48, 76, 82), ci: 0 },
      { id: 'roof_r', d: triPath(124, 82, 145, 48, 165, 82), ci: 0 },
      { id: 'door', d: `M85,157 L85,130 C85,111 115,111 115,130 L115,157Z`, ci: 7 },
      { id: 'flag', d: triPath(145, 48, 173, 58, 145, 68), ci: 2 },
      { id: 'window', d: rectPath(91, 114, 18, 18), ci: 6 },
    ],
  };
}

function buildSports(v) {
  const names = ['Soccer Kick', 'Cricket Bat', 'Trophy Shine', 'Basket Ball', 'Tennis Day', 'Skate Star', 'Goal Net', 'Medal Win', 'Baseball Cap', 'Racing Flag'];
  const mode = v % 5;

  if (mode === 1) {
    return {
      name: names[v],
      regions: [
        bg(6),
        { id: 'grass', d: rectPath(0, 155, 200, 45), ci: 3, back: true },
        { id: 'bat', d: `M75,55 C88,43 105,54 98,72 L73,157 C70,167 57,164 61,153Z`, ci: 5 },
        { id: 'handle', d: rectPath(57, 145, 18, 42), ci: 7 },
        { id: 'ball', d: ovalPath(137, 125, 18, 18), ci: 0 },
        { id: 'shine', d: ovalPath(130, 117, 6, 6), ci: 2 },
        { id: 'stump_1', d: rectPath(140, 66, 7, 57), ci: 4 },
        { id: 'stump_2', d: rectPath(153, 66, 7, 57), ci: 4 },
      ],
    };
  }

  if (mode === 2) {
    return {
      name: names[v],
      regions: [
        bg(6),
        { id: 'cup', d: `M62,55 L138,55 C135,111 122,130 100,130 C78,130 65,111 62,55Z`, ci: 2 },
        { id: 'handle_l', d: `M63,70 C35,70 39,116 73,104 L72,91 C55,94 52,80 64,81Z`, ci: 2 },
        { id: 'handle_r', d: `M137,70 C165,70 161,116 127,104 L128,91 C145,94 148,80 136,81Z`, ci: 2 },
        { id: 'base', d: rectPath(75, 133, 50, 25), ci: 5 },
        { id: 'plaque', d: rectPath(86, 141, 28, 8), ci: 0 },
        { id: 'star', d: starPath(100, 86, 20, 8), ci: 1 },
        { id: 'spark', d: starPath(155, 43, 10, 4), ci: 4 },
      ],
    };
  }

  if (mode === 3) {
    return {
      name: names[v],
      regions: [
        bg(6),
        { id: 'ball', d: ovalPath(100, 101, 58, 58), ci: 1 },
        { id: 'stripe_v', d: `M96,44 C83,76 83,124 96,158 L104,158 C117,124 117,76 104,44Z`, ci: 7 },
        { id: 'stripe_h', d: `M45,97 C78,84 122,84 155,97 L155,105 C122,118 78,118 45,105Z`, ci: 7 },
        { id: 'curve_l', d: `M56,61 C75,80 75,122 56,141 L64,141 C82,122 82,80 64,61Z`, ci: 7 },
        { id: 'curve_r', d: `M144,61 C125,80 125,122 144,141 L136,141 C118,122 118,80 136,61Z`, ci: 7 },
        { id: 'shadow', d: ovalPath(100, 170, 49, 8), ci: 5, back: true },
      ],
    };
  }

  if (mode === 4) {
    return {
      name: names[v],
      regions: [
        bg(6),
        { id: 'racket', d: ovalPath(83, 76, 32, 42), ci: 4 },
        { id: 'racket_inner', d: ovalPath(83, 76, 21, 31), ci: 2 },
        { id: 'handle', d: `M98,111 L132,158 L119,167 L85,120Z`, ci: 5 },
        { id: 'ball', d: ovalPath(143, 72, 18, 18), ci: 3 },
        { id: 'ball_stripe', d: `M129,62 C141,72 147,76 162,73 L160,82 C145,85 139,80 133,70Z`, ci: 2 },
        { id: 'spark', d: starPath(47, 44, 10, 4), ci: 1 },
      ],
    };
  }

  return {
    name: names[v],
    regions: [
      bg(6),
      { id: 'field', d: rectPath(0, 154, 200, 46), ci: 3, back: true },
      { id: 'ball', d: ovalPath(100, 96, 55, 55), ci: 6 },
      { id: 'patch_center', d: `M100,71 L121,87 L113,114 L87,114 L79,87Z`, ci: 7 },
      { id: 'patch_l', d: triPath(48, 96, 72, 82, 67, 116), ci: 7 },
      { id: 'patch_r', d: triPath(152, 96, 128, 82, 133, 116), ci: 7 },
      { id: 'patch_top', d: triPath(100, 41, 114, 66, 86, 66), ci: 7 },
      { id: 'patch_bottom', d: triPath(100, 151, 114, 124, 86, 124), ci: 7 },
      { id: 'shadow', d: ovalPath(100, 166, 43, 8), ci: 5, back: true },
    ],
  };
}

function buildEmotions(v) {
  const names = ['Big Smile', 'Sleepy Face', 'Cool Face', 'Love Face', 'Surprise Pop', 'Silly Wink', 'Brave Face', 'Laugh Burst', 'Calm Star', 'Happy Crown'];
  const mouth = [
    `M73,113 C88,142 123,142 137,113Z`,
    `M77,119 C92,131 118,131 133,119 L130,127 C116,136 94,136 80,127Z`,
    rectPath(76, 117, 48, 12),
    `M78,122 C91,144 119,144 132,122 C116,130 94,130 78,122Z`,
    ovalPath(100, 123, 15, 18),
    `M80,123 C98,133 119,127 132,115 L133,124 C117,136 97,141 79,132Z`,
    `M79,120 C93,137 116,137 130,120 L127,129 C114,144 95,144 82,129Z`,
    `M70,112 C83,151 137,151 150,112Z`,
    `M82,124 C96,133 114,133 128,124 L126,132 C113,141 97,141 84,132Z`,
    `M74,114 C86,143 131,143 143,114Z`,
  ][v];

  return {
    name: names[v],
    regions: [
      bg(6),
      { id: 'face', d: ovalPath(100, 103, 62, 61), ci: 2 },
      { id: 'cheek_l', d: ovalPath(65, 111, 12, 9), ci: 5 },
      { id: 'cheek_r', d: ovalPath(135, 111, 12, 9), ci: 5 },
      { id: 'eye_l', d: v === 5 ? `M72,86 C82,77 92,77 101,86 L98,94 C89,88 82,88 75,94Z` : ovalPath(78, 87, 8, 9), ci: 7 },
      { id: 'eye_r', d: v === 2 ? rectPath(111, 83, 22, 10) : ovalPath(122, 87, 8, 9), ci: 7 },
      { id: 'mouth', d: mouth, ci: v === 4 ? 0 : 7 },
      { id: 'detail', d: v === 3 ? starPath(100, 54, 17, 8) : v === 9 ? triPath(66, 45, 100, 21, 134, 45) : starPath(154, 43, 11, 5), ci: v === 9 ? 1 : 4 },
      { id: 'detail_2', d: v === 9 ? rectPath(66, 45, 68, 13) : ovalPath(45, 48, 9, 9), ci: 1 },
      { id: 'shadow', d: ovalPath(100, 169, 48, 8), ci: 5, back: true },
    ],
  };
}

const BUILDERS = [
  buildAnimals,
  buildNature,
  buildSpace,
  buildFood,
  buildVehicles,
  buildFestivals,
  buildUnderwater,
  buildFantasy,
  buildSports,
  buildEmotions,
];

export const CBN_PICTURES = Array.from({ length: WORLD_COUNT * LEVELS_PER_WORLD }, (_, index) => {
  const worldIndex = Math.floor(index / LEVELS_PER_WORLD);
  const levelInWorld = index % LEVELS_PER_WORLD;
  const picture = BUILDERS[worldIndex](levelInWorld);

  return {
    ...picture,
    level: index + 1,
    worldIndex,
  };
});

export function getCBNPalette(level) {
  const safeLevel = clampLevel(level);
  return CBN_PALETTES[Math.floor((safeLevel - 1) / LEVELS_PER_WORLD) % CBN_PALETTES.length];
}

export function getCBNPic(level, worldIdx) {
  const safeLevel = clampLevel(level);
  const inferredWorldIndex = Math.floor((safeLevel - 1) / LEVELS_PER_WORLD);
  const safeWorldIdx = Number(worldIdx);
  const worldIndex = Number.isFinite(safeWorldIdx)
    ? Math.max(0, Math.min(WORLD_COUNT - 1, safeWorldIdx))
    : inferredWorldIndex;
  const levelInWorld = (safeLevel - 1) % LEVELS_PER_WORLD;

  return CBN_PICTURES[(worldIndex * LEVELS_PER_WORLD) + levelInWorld];
}
