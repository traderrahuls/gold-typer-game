import { useState, useEffect, useRef, useCallback } from "react";

const WORD_BANK_TRADING = [
  "gold", "scalp", "entry", "target", "profit", "candle", "trend",
  "ema", "cross", "angle", "support", "resist", "order", "block",
  "liquidity", "grab", "fvg", "gap", "rsi", "bullish", "bearish",
  "signal", "setup", "stoploss", "riskmanagement", "breakout",
  "reversal", "momentum", "volume", "pivot", "zone", "confirm",
  "wait", "patience", "discipline", "strategy", "mayank", "rahul",
  "xau", "usd", "buy", "sell", "tp", "sl", "chart", "trade",
  "pattern", "level", "swing", "scalper",
];

const WORD_BANK_ENGLISH = [
  "apple", "brave", "cloud", "dream", "every", "flame", "grace",
  "heart", "ideal", "jolly", "knife", "light", "magic", "noble",
  "ocean", "peace", "queen", "river", "shine", "truth", "ultra",
  "vivid", "water", "xenon", "youth", "zebra", "alone", "blend",
  "crisp", "dance", "eagle", "frost", "globe", "honey", "image",
  "jewel", "karma", "lemon", "mango", "night", "olive", "power",
  "quest", "robin", "storm", "tiger", "unity", "voice", "winds",
  "yacht", "zonal", "amber", "beach", "crane", "delta", "ember",
  "fable", "giant", "haven", "index", "joker", "kneel", "lunar",
  "maple", "nerve", "orbit", "piano", "quote", "radar", "solar",
  "table", "umbra", "vault", "whole", "extra", "yield", "zones",
];

const TIERS = [
  { name: "ROOKIE", color: "#7dd3fc", minScore: 0 },
  { name: "TRADER", color: "#4ade80", minScore: 150 },
  { name: "SHARP SHOOTER", color: "#facc15", minScore: 400 },
  { name: "GOLD HUNTER", color: "#fb923c", minScore: 800 },
  { name: "EMA MASTER", color: "#f87171", minScore: 1400 },
];

const KEY_ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

const DIFFICULTIES = {
  easy:   { baseSpeed: 8,  spawnInterval: 2.2, label: "EASY" },
  normal: { baseSpeed: 14, spawnInterval: 1.8, label: "NORMAL" },
  hard:   { baseSpeed: 20, spawnInterval: 1.2, label: "HARD" },
};

function getTier(score) {
  let tier = TIERS[0];
  for (const t of TIERS) { if (score >= t.minScore) tier = t; }
  return tier;
}

function randomWord(bank, usedRecently) {
  let w; let tries = 0;
  do {
    w = bank[Math.floor(Math.random() * bank.length)];
    tries++;
  } while (usedRecently.includes(w) && tries < 8);
  return w;
}

let enemyIdCounter = 0;
let particleIdCounter = 0;
let starIdCounter = 0;
let bulletIdCounter = 0;function useAudioEngine() {
  const ctxRef = useRef(null);
  const masterRef = useRef(null);
  const musicRef = useRef(null);
  const mutedRef = useRef(false);
  const volumeRef = useRef(0.35);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctxRef.current = new AC();
      masterRef.current = ctxRef.current.createGain();
      masterRef.current.gain.value = 0.35;
      masterRef.current.connect(ctxRef.current.destination);
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const tone = useCallback((freq, dur, type, gainStart, freqEnd) => {
    if (mutedRef.current) return;
    const ctx = getCtx(); if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (freqEnd) osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd,1), ctx.currentTime + dur);
    gain.gain.setValueAtTime(gainStart || 0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain); gain.connect(masterRef.current);
    osc.start(); osc.stop(ctx.currentTime + dur);
  }, [getCtx]);

  const startMusic = useCallback(() => {
    const ctx = getCtx(); if (!ctx || musicRef.current) return;
    const musicGain = ctx.createGain();
    musicGain.gain.value = 0.08;
    musicGain.connect(masterRef.current);
    const notes = [130.81, 146.83, 164.81, 174.61, 196.00, 220.00, 246.94];
    let step = 0;
    const playNote = () => {
      if (mutedRef.current) { musicRef.current = setTimeout(playNote, 600); return; }
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = notes[step % notes.length] * (step % 14 < 7 ? 1 : 1.5);
      g.gain.setValueAtTime(0.001, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.connect(g); g.connect(musicGain);
      osc.start(); osc.stop(ctx.currentTime + 0.5);
      step++;
      musicRef.current = setTimeout(playNote, 550);
    };
    playNote();
  }, [getCtx]);

  const stopMusic = useCallback(() => {
    if (musicRef.current) { clearTimeout(musicRef.current); musicRef.current = null; }
  }, []);

  const setVolume = useCallback((v) => {
    volumeRef.current = v;
    if (masterRef.current) masterRef.current.gain.value = v;
  }, []);

  const sfx = {
    type:     useCallback(() => tone(680, 0.045, "square", 0.12), [tone]),
    shoot:    useCallback(() => tone(880, 0.07, "sawtooth", 0.1, 440), [tone]),
    explode:  useCallback(() => { tone(160, 0.18, "triangle", 0.25, 40); setTimeout(() => tone(90, 0.12, "square", 0.12, 30), 30); }, [tone]),
    miss:     useCallback(() => tone(140, 0.3, "sawtooth", 0.2, 60), [tone]),
    wrong:    useCallback(() => tone(220, 0.08, "square", 0.1, 110), [tone]),
    levelUp:  useCallback(() => { tone(440,0.1,"sine",0.2); setTimeout(()=>tone(660,0.12,"sine",0.2),90); setTimeout(()=>tone(880,0.16,"sine",0.22),180); }, [tone]),
    gameOver: useCallback(() => { tone(300,0.2,"sawtooth",0.2,150); setTimeout(()=>tone(180,0.3,"sawtooth",0.2,60),150); setTimeout(()=>tone(90,0.5,"sawtooth",0.18,30),320); }, [tone]),
  };

  const setMuted = useCallback((m) => { mutedRef.current = m; }, []);
  return { sfx, setMuted, setVolume, startMusic, stopMusic, getCtx };
}

export default function TraderTypeGame() {
  const [screen, setScreen] = useState("menu");
  const [gameMode, setGameMode] = useState("trading");
  const [difficulty, setDifficulty] = useState("normal");
  const [enemies, setEnemies] = useState([]);
  const [typed, setTyped] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [particles, setParticles] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [stars, setStars] = useState([]);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [shake, setShake] = useState(false);
  const [muted, setMutedState] = useState(false);
  const [volume, setVolumeState] = useState(0.35);
  const [activeKey, setActiveKey] = useState(null);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentWordHint, setCurrentWordHint] = useState("");

  const { sfx, setMuted, setVolume, startMusic, stopMusic, getCtx } = useAudioEngine();

  const containerRef = useRef(null);
  const animFrameRef = useRef(null);
  const spawnTimerRef = useRef(0);
  const lastTimeRef = useRef(0);
  const recentWordsRef = useRef([]);
  const widthRef = useRef(800);
  const heightRef = useRef(500);
  const gameStateRef = useRef({ score: 0, lives: 3, wave: 1 });
  const waveRef = useRef(1);
  const diffRef = useRef("normal");
  const speedMultRef = useRef(1.0);
  const missStreakRef = useRef(0);useEffect(() => {
    gameStateRef.current = { score, lives, wave };
  }, [score, lives, wave]);

  useEffect(() => { setMuted(muted); }, [muted, setMuted]);
  useEffect(() => { setVolume(volume); }, [volume, setVolume]);

  const measure = useCallback(() => {
    if (containerRef.current) {
      widthRef.current = containerRef.current.clientWidth;
      heightRef.current = containerRef.current.clientHeight;
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 60; i++) {
      starIdCounter += 1;
      arr.push({
        id: starIdCounter,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.02 + 0.005,
      });
    }
    setStars(arr);
  }, []);

  useEffect(() => {
    if (screen !== "playing") return;
    const id = setInterval(() => {
      setStars((prev) => prev.map((s) => {
        let ny = s.y + s.speed * 8;
        if (ny > 100) ny = 0;
        return { ...s, y: ny };
      }));
    }, 60);
    return () => clearInterval(id);
  }, [screen]);

  const startGame = () => {
    getCtx();
    enemyIdCounter = 0; particleIdCounter = 0; bulletIdCounter = 0;
    recentWordsRef.current = [];
    spawnTimerRef.current = 0;
    lastTimeRef.current = performance.now();
    waveRef.current = 1;
    diffRef.current = difficulty;
    speedMultRef.current = 1.0;
    missStreakRef.current = 0;
    setEnemies([]); setParticles([]); setBullets([]);
    setTyped(""); setScore(0); setLives(3);
    setWave(1); setCombo(0); setBestCombo(0);
    setCurrentWordHint("");
    setScreen("playing");
    startMusic();
  };

  const goToMenu = useCallback(() => {
    stopMusic();
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setEnemies([]); setParticles([]); setBullets([]);
    setTyped(""); setShowSettings(false);
    setScreen("menu");
  }, [stopMusic]);

  const endGame = useCallback(() => {
    sfx.gameOver();
    stopMusic();
    setScreen("gameover");
    setHighScore((hs) => Math.max(hs, gameStateRef.current.score));
  }, [sfx, stopMusic]);

  const spawnEnemy = useCallback(() => {
    const bank = gameMode === "trading" ? WORD_BANK_TRADING : WORD_BANK_ENGLISH;
    const word = randomWord(bank, recentWordsRef.current);
    recentWordsRef.current = [...recentWordsRef.current.slice(-4), word];
    const w = widthRef.current || 800;
    const margin = 60;
    const x = margin + Math.random() * Math.max(1, w - margin * 2);
    const diff = DIFFICULTIES[diffRef.current];
    const speedBase = diff.baseSpeed * speedMultRef.current;
    const speed = speedBase + Math.random() * 4;
    enemyIdCounter += 1;
    setEnemies((prev) => [...prev, {
      id: enemyIdCounter, word, x, y: -30,
      speed, hit: false,
    }]);
  }, [gameMode]);

  useEffect(() => {
    if (screen !== "playing") return;
    const loop = (time) => {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = time;

      spawnTimerRef.current -= dt;
      const diff = DIFFICULTIES[diffRef.current];
      const spawnInterval = Math.max(0.5, diff.spawnInterval - waveRef.current * 0.04);
      if (spawnTimerRef.current <= 0) {
        spawnEnemy();
        spawnTimerRef.current = spawnInterval;
      }

      setEnemies((prev) => {
        const h = heightRef.current || 500;
        const next = []; let livesLost = 0;
        for (const e of prev) {
          if (e.hit) continue;
          const ny = e.y + e.speed * dt;
          if (ny >= h - 40) { livesLost += 1; continue; }
          next.push({ ...e, y: ny });
        }
        if (livesLost > 0) {
          sfx.miss();
          missStreakRef.current += livesLost;
          // auto slow down if missing too much
          if (missStreakRef.current >= 2) {
            speedMultRef.current = Math.max(0.5, speedMultRef.current - 0.1);
            missStreakRef.current = 0;
          }
          setLives((l) => {
            const nl = l - livesLost;
            if (nl <= 0) { setTimeout(() => endGame(), 0); return 0; }
            return nl;
          });
          setCombo(0); setTyped("");
          setShake(true); setTimeout(() => setShake(false), 250);
        }
        return next;
      });

      const newWave = 1 + Math.floor(gameStateRef.current.score / 250);
      if (newWave > waveRef.current) {
        waveRef.current = newWave;
        setWave(newWave);
        // gradually speed up on wave increase but not too much
        speedMultRef.current = Math.min(speedMultRef.current + 0.08, 1.8);
        sfx.levelUp();
      }

      setParticles((prev) => prev.map((p) => ({ ...p, life: p.life - dt })).filter((p) => p.life > 0));
      setBullets((prev) => prev.map((b) => ({ ...b, life: b.life - dt * 6 })).filter((b) => b.life > 0));

      animFrameRef.current = requestAnimationFrame(loop);
    };
    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(loop);
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, [screen, spawnEnemy, endGame, sfx]);const pressKey = useCallback((ch) => {
    if (screen !== "playing") return;
    setActiveKey(ch);
    setTimeout(() => setActiveKey(null), 100);
    const nextTyped = typed + ch;

    setEnemies((prev) => {
      const candidates = prev.filter((en) => en.word.startsWith(nextTyped));
      if (candidates.length === 0) {
        sfx.wrong();
        setWrongFlash(true);
        setTimeout(() => setWrongFlash(false), 150);
        // wrong key — don't reset typed, stay on current word
        return prev;
      }
      let target = candidates[0];
      for (const c of candidates) { if (c.y > target.y) target = c; }

      // slow down target word while typing it
      const slowed = prev.map((en) =>
        en.id === target.id ? { ...en, speed: en.speed * 0.6 } : en
      );

      // fire bullet
      bulletIdCounter += 1;
      const fromX = (widthRef.current || 800) / 2;
      const fromY = (heightRef.current || 500) - 36;
      setBullets((bs) => [...bs, {
        id: bulletIdCounter, fromX, fromY,
        toX: target.x, toY: target.y, life: 1,
      }]);
      sfx.shoot();

      if (target.word === nextTyped) {
        sfx.explode();
        const points = 10 + target.word.length * 4 + gameStateRef.current.wave * 2;
        setScore((s) => s + points);
        setCombo((c) => { const nc = c + 1; setBestCombo((b) => Math.max(b, nc)); return nc; });
        particleIdCounter += 1;
        setParticles((ps) => [...ps, {
          id: particleIdCounter, x: target.x, y: target.y, life: 0.5, text: "+" + points,
        }]);
        setTyped("");
        setCurrentWordHint("");
        missStreakRef.current = 0;
        // speed up slightly on successful word
        speedMultRef.current = Math.min(speedMultRef.current + 0.03, 1.8);
        return slowed.map((en) => en.id === target.id ? { ...en, hit: true } : en);
      }

      // show hint for english mode
      if (gameMode === "english") {
        setCurrentWordHint(target.word);
      }
      setTyped(nextTyped);
      return slowed;
    });
  }, [screen, typed, sfx, gameMode]);

  const handleBackspace = useCallback(() => {
    setTyped((t) => t.slice(0, -1));
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (screen !== "playing") return;
    if (e.key === "Escape") { goToMenu(); return; }
    if (e.key === "Backspace") { handleBackspace(); return; }
    if (!/^[a-zA-Z]$/.test(e.key)) return;
    pressKey(e.key.toLowerCase());
  }, [screen, pressKey, handleBackspace, goToMenu]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const hitOnes = enemies.filter((e) => e.hit);
    if (hitOnes.length === 0) return;
    const timer = setTimeout(() => {
      setEnemies((prev) => prev.filter((e) => !e.hit));
    }, 180);
    return () => clearTimeout(timer);
  }, [enemies]);

  const liveLetters = (() => {
    const set = new Set();
    enemies.forEach((e) => {
      if (e.word.startsWith(typed)) {
        const nextChar = e.word[typed.length];
        if (nextChar) set.add(nextChar);
      }
    });
    return set;
  })();

  const tier = getTier(score);

  // Settings Panel
  const SettingsPanel = () => (
    <div style={{
      position: "absolute", inset: 0, background: "rgba(5,4,3,0.92)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", zIndex: 20, gap: 20,
    }}>
      <div style={{ fontSize: 13, letterSpacing: 3, color: "#8a7245", marginBottom: 8 }}>SETTINGS</div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 260 }}>
        <div style={{ fontSize: 11, color: "#8a7245", letterSpacing: 2 }}>MUSIC VOLUME</div>
        <input type="range" min="0" max="1" step="0.05"
          value={volume}
          onChange={(e) => setVolumeState(parseFloat(e.target.value))}
          style={{ width: "100%", accentColor: "#d4af37" }}
        />
        <div style={{ fontSize: 12, color: "#d4af37" }}>{Math.round(volume * 100)}%</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ fontSize: 11, color: "#8a7245", letterSpacing: 2 }}>SOUND</div>
        <button onClick={() => setMutedState((m) => !m)} style={{
          background: muted ? "rgba(255,255,255,0.05)" : "rgba(212,175,55,0.2)",
          border: "1px solid " + (muted ? "#3a2f18" : "#d4af37"),
          borderRadius: 8, color: muted ? "#5a4a2a" : "#d4af37",
          padding: "8px 28px", fontSize: 12, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit", letterSpacing: 2,
        }}>
          {muted ? "OFF" : "ON"}
        </button>
      </div>

      <button onClick={() => setShowSettings(false)} style={{
        marginTop: 16, background: "linear-gradient(180deg,#e8c655,#b8932e)",
        color: "#1a1306", border: "none", padding: "10px 36px",
        fontSize: 13, fontWeight: 700, letterSpacing: 2,
        borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
      }}>RESUME</button>

      <button onClick={goToMenu} style={{
        background: "transparent", border: "1px solid #4a3a1a",
        borderRadius: 8, color: "#8a7245", padding: "8px 28px",
        fontSize: 12, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1,
      }}>MAIN MENU</button>
    </div>
  );return (
    <div style={{
      width: "100%", height: "100vh",
      background: "radial-gradient(ellipse at 50% -10%, #1c1408 0%, #0a0805 55%, #050403 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Courier New', monospace", overflow: "hidden",
      position: "relative", userSelect: "none",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(212,175,55,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.035) 1px, transparent 1px)",
        backgroundSize: "40px 40px", pointerEvents: "none",
      }} />

      <div style={{
        width: "min(900px, 98vw)", height: "min(680px, 96vh)",
        background: "linear-gradient(180deg, #14100a 0%, #0d0a06 100%)",
        border: "1px solid #4a3a1a", borderRadius: 16,
        boxShadow: "0 0 60px rgba(212,175,55,0.08), inset 0 0 80px rgba(0,0,0,0.5)" +
          (wrongFlash ? ", inset 0 0 0 3px rgba(220,60,40,0.6)" : ""),
        display: "flex", flexDirection: "column", overflow: "hidden",
        position: "relative",
        transform: shake ? "translate(2px,-1px)" : "none",
        transition: "transform 0.05s",
      }}>

        {/* HUD */}
        {screen === "playing" && (
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 16px", borderBottom: "1px solid #2a2010",
            background: "rgba(0,0,0,0.3)", zIndex: 5, flexShrink: 0,
          }}>
            <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 9, color: "#8a7245", letterSpacing: 2 }}>SCORE</div>
                <div style={{ fontSize: 18, color: "#d4af37", fontWeight: 700 }}>{score}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: "#8a7245", letterSpacing: 2 }}>WAVE</div>
                <div style={{ fontSize: 18, color: "#e8e3d4", fontWeight: 700 }}>{wave}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: "#8a7245", letterSpacing: 2 }}>COMBO</div>
                <div style={{ fontSize: 18, color: combo > 4 ? "#fb923c" : "#e8e3d4", fontWeight: 700 }}>x{combo}</div>
              </div>
              <div style={{
                fontSize: 10, padding: "2px 8px", borderRadius: 10,
                border: "1px solid #4a3a1a", color: "#8a7245", letterSpacing: 1,
              }}>
                {gameMode === "trading" ? "TRADING" : "ENGLISH"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 5 }}>
                {[0,1,2].map((i) => (
                  <div key={i} style={{
                    width: 13, height: 13, borderRadius: "50%",
                    background: i < lives ? "#d4af37" : "#2a2010",
                    border: "1px solid #4a3a1a", transition: "background 0.3s",
                  }} />
                ))}
              </div>
              <button onClick={() => setShowSettings(true)} style={{
                background: "transparent", border: "1px solid #4a3a1a",
                borderRadius: 6, color: "#8a7245", fontSize: 11,
                padding: "4px 10px", cursor: "pointer", fontFamily: "inherit",
              }}>⚙ MENU</button>
            </div>
          </div>
        )}

        {/* Game area */}
        <div ref={containerRef} style={{
          flex: 1, position: "relative", overflow: "hidden", minHeight: 0,
        }}>
          {showSettings && screen === "playing" && <SettingsPanel />}

          {stars.map((s) => (
            <div key={s.id} style={{
              position: "absolute", left: s.x + "%", top: s.y + "%",
              width: s.size, height: s.size, borderRadius: "50%",
              background: "#d4af37", opacity: s.opacity, pointerEvents: "none",
            }} />
          ))}

          {/* MENU SCREEN */}
          {screen === "menu" && (
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", textAlign: "center", padding: 20,
              overflowY: "auto",
            }}>
              <div style={{ fontSize: 11, letterSpacing: 4, color: "#8a7245", marginBottom: 10 }}>
                TRADERRAHUL PRESENTS
              </div>
              <div style={{
                fontSize: 42, fontWeight: 900, color: "#d4af37", letterSpacing: 2,
                textShadow: "0 0 30px rgba(212,175,55,0.4)", marginBottom: 6,
                fontFamily: "Georgia, serif",
              }}>GOLD TYPER</div>
              <div style={{ fontSize: 12, color: "#a89968", marginBottom: 22, maxWidth: 360, lineHeight: 1.6 }}>
                Type the words to shoot them down. Miss three and it's game over.
              </div>

              {/* Mode Select */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: "#8a7245", letterSpacing: 2, marginBottom: 8 }}>SELECT MODE</div>
                <div style={{ display: "flex", gap: 10 }}>
                  {[
                    { key: "trading", label: "📈 TRADING", desc: "Trading terms" },
                    { key: "english", label: "📚 ENGLISH", desc: "Learn English words" },
                  ].map((m) => (
                    <button key={m.key} onClick={() => setGameMode(m.key)} style={{
                      padding: "10px 18px", borderRadius: 8, cursor: "pointer",
                      fontFamily: "inherit", fontSize: 12, fontWeight: 700,
                      border: gameMode === m.key ? "1px solid #d4af37" : "1px solid #3a2f18",
                      background: gameMode === m.key ? "rgba(212,175,55,0.18)" : "rgba(255,255,255,0.03)",
                      color: gameMode === m.key ? "#d4af37" : "#5a4a2a",
                    }}>
                      <div>{m.label}</div>
                      <div style={{ fontSize: 9, opacity: 0.7, marginTop: 3 }}>{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Select */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 10, color: "#8a7245", letterSpacing: 2, marginBottom: 8 }}>DIFFICULTY</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {Object.entries(DIFFICULTIES).map(([key, val]) => (
                    <button key={key} onClick={() => setDifficulty(key)} style={{
                      padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                      fontFamily: "inherit", fontSize: 11, fontWeight: 700, letterSpacing: 1,
                      border: difficulty === key ? "1px solid #d4af37" : "1px solid #3a2f18",
                      background: difficulty === key ? "rgba(212,175,55,0.18)" : "rgba(255,255,255,0.03)",
                      color: difficulty === key ? "#d4af37" : "#5a4a2a",
                    }}>{val.label}</button>
                  ))}
                </div>
              </div>

              <button onClick={startGame} style={{
                background: "linear-gradient(180deg, #e8c655, #b8932e)",
                color: "#1a1306", border: "none", padding: "13px 44px",
                fontSize: 15, fontWeight: 700, letterSpacing: 2,
                borderRadius: 8, cursor: "pointer", fontFamily: "'Courier New', monospace",
                boxShadow: "0 4px 20px rgba(212,175,55,0.3)", marginBottom: 14,
              }}>START TRADING</button>

              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setMutedState((m) => !m)} style={{
                  background: "transparent", border: "1px solid #4a3a1a",
                  borderRadius: 6, color: "#8a7245", fontSize: 10,
                  padding: "6px 14px", cursor: "pointer", fontFamily: "inherit", letterSpacing: 1,
                }}>{muted ? "SOUND: OFF" : "SOUND: ON"}</button>
              </div>
            </div>
          )}{/* PLAYING SCREEN */}
          {screen === "playing" && (
            <>
              {enemies.map((e) => {
                const isTarget = e.word.startsWith(typed) && typed.length > 0;
                const typedPart = isTarget ? typed : "";
                const restPart = isTarget ? e.word.slice(typed.length) : e.word;
                return (
                  <div key={e.id} style={{
                    position: "absolute", left: e.x, top: e.y,
                    transform: "translate(-50%,-50%) scale(" + (e.hit ? 1.7 : 1) + ")",
                    opacity: e.hit ? 0 : 1,
                    transition: e.hit ? "opacity 0.18s, transform 0.18s" : "none",
                    fontSize: 17, fontWeight: 700, padding: "5px 12px", borderRadius: 6,
                    background: e.hit ? "rgba(251,146,60,0.35)" : isTarget ? "rgba(212,175,55,0.18)" : "rgba(20,16,10,0.7)",
                    border: isTarget ? "1px solid #d4af37" : "1px solid #3a2f18",
                    whiteSpace: "nowrap", pointerEvents: "none",
                    boxShadow: isTarget ? "0 0 16px rgba(212,175,55,0.35)" : "none",
                  }}>
                    <span style={{ color: "#fb923c" }}>{typedPart}</span>
                    <span style={{ color: isTarget ? "#e8e3d4" : "#8a7245" }}>{restPart}</span>
                  </div>
                );
              })}

              {particles.map((p) => (
                <div key={p.id} style={{
                  position: "absolute", left: p.x, top: p.y,
                  transform: "translate(-50%,-50%)",
                  color: "#4ade80", fontWeight: 700, fontSize: 14,
                  opacity: Math.max(p.life * 2, 0), pointerEvents: "none",
                }}>{p.text}</div>
              ))}

              {/* laser bullets */}
              <svg style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                pointerEvents: "none", overflow: "visible",
              }}>
                {bullets.map((b) => {
                  const t = 1 - Math.max(b.life, 0);
                  const progress = Math.min(t, 1);
                  const curX = b.fromX + (b.toX - b.fromX) * progress;
                  const curY = b.fromY + (b.toY - b.fromY) * progress;
                  const tailX = b.fromX + (b.toX - b.fromX) * Math.max(progress - 0.18, 0);
                  const tailY = b.fromY + (b.toY - b.fromY) * Math.max(progress - 0.18, 0);
                  return (
                    <line key={b.id}
                      x1={tailX} y1={tailY} x2={curX} y2={curY}
                      stroke="#ffd76a" strokeWidth={2.5} strokeLinecap="round"
                      opacity={Math.min(b.life * 1.5, 1)}
                      style={{ filter: "drop-shadow(0 0 4px #ffcf40)" }}
                    />
                  );
                })}
              </svg>

              {/* spaceship */}
              <div style={{
                position: "absolute", left: "50%", bottom: 14,
                transform: "translateX(-50%)", width: 34, height: 34,
                pointerEvents: "none",
                filter: "drop-shadow(0 0 8px rgba(212,175,55,0.55))",
              }}>
                <svg viewBox="0 0 64 64" width="34" height="34">
                  <polygon points="32,4 44,40 32,32 20,40" fill="#e8c655" stroke="#fff6da" strokeWidth="1.5" />
                  <polygon points="32,4 38,30 32,26 26,30" fill="#fff6da" opacity="0.7" />
                  <circle cx="32" cy="22" r="3" fill="#1a1306" opacity="0.6" />
                  <polygon points="20,40 14,52 24,44" fill="#b8932e" />
                  <polygon points="44,40 50,52 40,44" fill="#b8932e" />
                </svg>
              </div>

              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 40, height: 1,
                background: "linear-gradient(90deg, transparent, #6b1a1a, transparent)",
              }} />
            </>
          )}

          {/* GAME OVER SCREEN */}
          {screen === "gameover" && (
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              textAlign: "center", padding: 24, background: "rgba(5,4,3,0.85)",
            }}>
              <div style={{ fontSize: 12, letterSpacing: 3, color: "#6b1a1a", marginBottom: 10 }}>ACCOUNT BLOWN</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#e8e3d4", marginBottom: 4, fontFamily: "Georgia, serif" }}>{score} pts</div>
              <div style={{
                fontSize: 13, fontWeight: 700, letterSpacing: 2, color: tier.color,
                marginBottom: 24, padding: "4px 14px",
                border: "1px solid " + tier.color, borderRadius: 20,
              }}>RANK: {tier.name}</div>
              <div style={{ display: "flex", gap: 24, marginBottom: 28, flexWrap: "wrap", justifyContent: "center" }}>
                <div>
                  <div style={{ fontSize: 10, color: "#8a7245", letterSpacing: 1 }}>BEST COMBO</div>
                  <div style={{ fontSize: 18, color: "#fb923c", fontWeight: 700 }}>x{bestCombo}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#8a7245", letterSpacing: 1 }}>HIGH SCORE</div>
                  <div style={{ fontSize: 18, color: "#d4af37", fontWeight: 700 }}>{highScore}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#8a7245", letterSpacing: 1 }}>WAVE</div>
                  <div style={{ fontSize: 18, color: "#e8e3d4", fontWeight: 700 }}>{wave}</div>
                </div>
              </div>
              <button onClick={startGame} style={{
                background: "linear-gradient(180deg,#e8c655,#b8932e)",
                color: "#1a1306", border: "none", padding: "12px 40px",
                fontSize: 14, fontWeight: 700, letterSpacing: 2,
                borderRadius: 8, cursor: "pointer", fontFamily: "'Courier New', monospace",
                marginBottom: 12,
              }}>TRADE AGAIN</button>
              <button onClick={goToMenu} style={{
                background: "transparent", border: "1px solid #4a3a1a",
                borderRadius: 8, color: "#8a7245", padding: "8px 28px",
                fontSize: 12, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1,
              }}>MAIN MENU</button>
            </div>
          )}
        </div>

        {/* Typed display */}
        {screen === "playing" && (
          <div style={{
            padding: "6px 20px", borderTop: "1px solid #2a2010",
            background: "rgba(0,0,0,0.35)", minHeight: 34,
            display: "flex", alignItems: "center",
            justifyContent: "space-between", flexShrink: 0,
          }}>
            <span style={{ fontSize: 16, letterSpacing: 3, color: "#d4af37", fontWeight: 700 }}>
              {typed || "\u00A0"}
              <span style={{ opacity: 0.5, animation: "blink 1s infinite" }}>|</span>
            </span>
            {gameMode === "english" && currentWordHint && (
              <span style={{ fontSize: 11, color: "#5a4a2a", letterSpacing: 1 }}>
                target: <span style={{ color: "#8a7245" }}>{currentWordHint}</span>
              </span>
            )}
          </div>
        )}

        {/* On-screen keyboard */}
        {screen === "playing" && (
          <div style={{
            padding: "8px 8px 12px", background: "rgba(0,0,0,0.45)",
            borderTop: "1px solid #2a2010", flexShrink: 0,
          }}>
            {KEY_ROWS.map((row, ri) => (
              <div key={ri} style={{
                display: "flex", justifyContent: "center", gap: 4, marginBottom: 4,
                paddingLeft: ri === 1 ? 14 : ri === 2 ? 28 : 0,
                paddingRight: ri === 1 ? 14 : ri === 2 ? 28 : 0,
              }}>
                {row.map((k) => {
                  const isLive = liveLetters.has(k);
                  const isActive = activeKey === k;
                  return (
                    <button key={k}
                      onPointerDown={(e) => { e.preventDefault(); pressKey(k); }}
                      style={{
                        flex: 1, maxWidth: 38, minWidth: 20, height: 36, borderRadius: 6,
                        border: isLive ? "1px solid #d4af37" : "1px solid #3a2f18",
                        background: isActive ? "#d4af37" : isLive ? "rgba(212,175,55,0.16)" : "rgba(255,255,255,0.03)",
                        color: isActive ? "#1a1306" : isLive ? "#e8c655" : "#7a6a48",
                        fontSize: 12, fontWeight: 700, textTransform: "uppercase",
                        cursor: "pointer", fontFamily: "inherit",
                        transition: "background 0.08s, color 0.08s",
                        touchAction: "manipulation",
                      }}
                    >{k}</button>
                  );
                })}
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
              <button
                onPointerDown={(e) => { e.preventDefault(); handleBackspace(); }}
                style={{
                  width: 130, height: 32, borderRadius: 6,
                  border: "1px solid #3a2f18", background: "rgba(255,255,255,0.03)",
                  color: "#7a6a48", fontSize: 11, fontWeight: 700,
                  letterSpacing: 1, cursor: "pointer", fontFamily: "inherit",
                  touchAction: "manipulation",
                }}
              >⌫ BACKSPACE</button>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes blink { 0%,50%{opacity:1} 51%,100%{opacity:0} }`}</style>
    </div>
  );
                             }
