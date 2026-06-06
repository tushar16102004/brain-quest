# BrainQuest 🌈 — React App

Kids learning app — Puzzles, Math, Coloring, Science — 100 levels each!

---

## 🚀 Setup & Run

```bash
cd brainquest-react
npm install
npm start
```

Browser mein `http://localhost:3000` pe khulega.

## 📦 Build for Production

```bash
npm run build
```

`build/` folder mein ready files hongi — kisi bhi hosting pe deploy karo.

---

## 📁 Folder Structure

```
brainquest-react/
├── public/
│   └── index.html              # HTML entry point
├── src/
│   ├── index.js                # React entry point
│   ├── index.css               # Global styles, animations, CSS variables
│   ├── App.jsx                 # 🏠 Main app — routing + state orchestration
│   │
│   ├── data/
│   │   └── gameData.js         # 📊 ALL game data — worlds, questions, pictures, badges
│   │
│   ├── hooks/
│   │   └── useGameState.js     # 💾 Central state + localStorage save/load
│   │
│   ├── utils/
│   │   ├── sound.js            # 🔊 Web Audio API sound effects
│   │   └── confetti.js         # 🎉 Confetti animation
│   │
│   ├── components/
│   │   └── UI.jsx              # 🧱 Shared UI — BlobBg, BackBtn, BottomNav, WinOverlay, etc.
│   │
│   ├── screens/
│   │   └── Screens.jsx         # 📱 All non-game screens — Splash, Avatar, Home, LevelSelect, Rewards, Parents, Settings
│   │
│   └── games/
│       └── Games.jsx           # 🎮 All 4 games — PuzzleGame, MathGame, ScienceGame, ColoringGame
│
└── package.json
```

---

## 🎮 Games

| Game | File | Description |
|------|------|-------------|
| 🧩 Puzzles | `Games.jsx > PuzzleGame` | Memory match tiles, 100 levels, 10 worlds |
| 🔢 Math | `Games.jsx > MathGame` | Auto-generated math questions, AI-powered |
| 🔬 Science | `Games.jsx > ScienceGame` | Built-in Q1-10, AI questions level 11+ |
| 🎨 Coloring | `Games.jsx > ColoringGame` | Color by Number SVG pictures |

---

## ✏️ Kaise Update Karein

### Naya Game Add Karna
1. `Games.jsx` mein naya component banao
2. `App.jsx` mein route add karo
3. `Screens.jsx > HomeScreen` mein game card add karo
4. `useGameState.js` mein `levels`, `stars`, `questDone` mein key add karo

### Science Questions Add/Change Karna
- `data/gameData.js` → `SCI_WORLDS` array mein apne world ke `qs` array mein question add karo

### Math Difficulty Change Karna
- `data/gameData.js` → `generateMathQuestions()` function mein `maxA`, `maxB`, `ops` arrays edit karo

### Naya Color Palette Add Karna (Coloring Game)
- `data/gameData.js` → `CBN_PALETTES` array mein naya palette add karo

### Naya SVG Picture Add Karna
- `data/gameData.js` → `CBN_PICTURES` array mein naya picture add karo

### XP System Change Karna
- `data/gameData.js` → `getXP()` function edit karo

### Badges Add/Change Karna
- `data/gameData.js` → `ALL_BADGES` array mein badge add karo

---

## 🌐 AI Features

Science (level 11+) aur Math mein AI-powered questions Claude API se aate hain.
API key ki zaroorat nahi — `claude.ai` environment mein automatically handle hota hai.

---

## 📱 Mobile Ready

- Touch events supported
- `viewport` meta tag set hai
- `user-scalable=no` — zoom disabled for game feel
- Bottom nav fixed at bottom
- All tap targets 44px+ size

---

## 🎨 Theme Change Karna

`index.css` ke top pe CSS variables hain:

```css
:root {
  --orange: #FF7A00;  /* Primary color */
  --green:  #00C853;  /* Success color */
  --purple: #AA00FF;  /* Accent color */
  /* ... */
}
```

Yahan se sab colors ek jagah se change ho jayenge.
