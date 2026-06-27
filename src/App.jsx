import { useState, useEffect, useRef, useCallback } from "react";

// ── WORD BANKS ───────────────────────────────────────────────────────────────
const WORD_BANK_TRADING = [
  "gold","scalp","entry","target","profit","candle","trend","ema","cross","angle",
  "support","resist","order","block","liquidity","grab","fvg","gap","rsi","bullish",
  "bearish","signal","setup","stoploss","breakout","reversal","momentum","volume",
  "pivot","zone","confirm","wait","patience","discipline","strategy","trade",
  "pattern","level","swing","scalper","xauusd","bitcoin","chart","buy","sell",
];

const WORD_BANK_ENGLISH = [
  "apple","brave","cloud","dream","flame","grace","heart","ideal","jolly","knife",
  "light","magic","noble","ocean","peace","queen","river","shine","truth","vivid",
  "water","youth","zebra","blend","crisp","dance","eagle","frost","globe","honey",
  "image","jewel","karma","lemon","mango","night","olive","power","quest","robin",
  "storm","tiger","unity","voice","winds","amber","beach","crane","delta","ember",
  "fable","giant","haven","joker","lunar","maple","nerve","orbit","piano","radar",
  "solar","table","vault","whole","extra","yield","smile","focus","learn","think",
  "grow","speak","write","listen","share","build","create","achieve","success",
];

// Wave definitions — each wave has a fixed word list
function buildWaves(bank) {
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  const waves = [];
  let i = 0;
  let waveNum = 1;
  while (i < shuffled.length) {
    const count = Math.min(4 + waveNum, 8, shuffled.length - i);
    waves.push({ num: waveNum, words: shuffled.slice(i, i + count) });
    i += count;
    waveNum++;
  }
  return waves;
}

function parseCustomText(text) {
  // Split text into words, clean up
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length >= 2 && w.length <= 14);
  if (words.length < 4) return null;
  // Build waves from custom text
  const waves = [];
  let i = 0;
  let waveNum = 1;
  while (i < words.length) {
    const count = Math.min(4 + waveNum, 8, words.length - i);
    waves.push({ num: waveNum, words: words.slice(i, i + count) });
    i += count;
    waveNum++;
  }
  return waves;
}

const KEY_ROWS = [
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l"],
  ["z","x","c","v","b","n","m"],
];

const DIFFICULTIES = {
  easy:   { speed: 28, label: "EASY",   color: "#2dd4bf" },
  normal: { speed: 48, label: "NORMAL", color: "#facc15" },
  hard:   { speed: 78, label: "HARD",   color: "#f43f5e" },
};

// ZType teal color palette
const T = {
  bg:      "#0a1a1a",
  grid:    "rgba(0,180,160,0.06)",
  accent:  "#00e5cc",
  dim:     "rgba(0,229,204,0.35)",
  text:    "rgba(0,229,204,0.85)",
  textLo:  "rgba(0,229,204,0.3)",
  typed:   "#fb923c",
  keyBg:   "rgba(0,40,36,0.9)",
  keyBdr:  "rgba(0,229,204,0.18)",
  keyLit:  "rgba(0,229,204,0.22)",
  keyAct:  "#00e5cc",
  red:     "#f43f5e",
  green:   "#2dd4bf",
};

let eid = 0, pid = 0, bid = 0;

// ── AUDIO ────────────────────────────────────────────────────────────────────
function useAudio() {
  const ctxR = useRef(null), mastR = useRef(null);
  const musicT = useRef(null), mutedR = useRef(false);

  const getCtx = useCallback(() => {
    if (!ctxR.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctxR.current = new AC();
      mastR.current = ctxR.current.createGain();
      mastR.current.gain.value = 0.28;
      mastR.current.connect(ctxR.current.destination);
    }
    if (ctxR.current.state === "suspended") ctxR.current.resume();
    return ctxR.current;
  }, []);

  const tone = useCallback((freq, dur, type, g0, f1) => {
    if (mutedR.current) return;
    const c = getCtx(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, c.currentTime);
    if (f1) o.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), c.currentTime + dur);
    g.gain.setValueAtTime(g0 || 0.22, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    o.connect(g); g.connect(mastR.current);
    o.start(); o.stop(c.currentTime + dur);
  }, [getCtx]);

  const startMusic = useCallback(() => {
    const c = getCtx(); if (!c || musicT.current) return;
    const mg = c.createGain(); mg.gain.value = 0.055; mg.connect(mastR.current);
    const scale = [130.81, 146.83, 164.81, 196.00, 220.00, 246.94, 261.63, 293.66];
    let step = 0;
    const tick = () => {
      if (!mutedR.current) {
        const o = c.createOscillator(), g = c.createGain();
        o.type = "triangle";
        o.frequency.value = scale[step % scale.length] * (step % 16 < 8 ? 1 : 2);
        g.gain.setValueAtTime(0.001, c.currentTime);
        g.gain.linearRampToValueAtTime(0.07, c.currentTime + 0.06);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4);
        o.connect(g); g.connect(mg);
        o.start(); o.stop(c.currentTime + 0.44);
        step++;
      }
      musicT.current = setTimeout(tick, 510);
    };
    tick();
  }, [getCtx]);

  const stopMusic = useCallback(() => {
    if (musicT.current) { clearTimeout(musicT.current); musicT.current = null; }
  }, []);

  const setMuted = useCallback((m) => { mutedR.current = m; }, []);
  const setVol = useCallback((v) => { if (mastR.current) mastR.current.gain.value = v; }, []);

  const sfx = {
    type:     useCallback(() => tone(700, 0.04, "square", 0.08), [tone]),
    shoot:    useCallback(() => tone(900, 0.07, "sawtooth", 0.07, 420), [tone]),
    explode:  useCallback(() => { tone(180, 0.15, "triangle", 0.18, 38); setTimeout(() => tone(88, 0.09, "square", 0.08, 28), 28); }, [tone]),
    miss:     useCallback(() => tone(140, 0.25, "sawtooth", 0.15, 55), [tone]),
    wrong:    useCallback(() => tone(210, 0.06, "square", 0.07, 95), [tone]),
    waveClear:useCallback(() => { tone(440, 0.09, "sine", 0.16); setTimeout(() => tone(550, 0.1, "sine", 0.16), 80); setTimeout(() => tone(660, 0.14, "sine", 0.18), 160); setTimeout(() => tone(880, 0.2, "sine", 0.2), 250); }, [tone]),
    gameOver: useCallback(() => { tone(260, 0.18, "sawtooth", 0.15, 110); setTimeout(() => tone(150, 0.25, "sawtooth", 0.15, 50), 130); setTimeout(() => tone(75, 0.4, "sawtooth", 0.13, 22), 290); }, [tone]),
  };

  return { sfx, setMuted, setVol, startMusic, stopMusic, getCtx };
}

// ── STARFIELD ────────────────────────────────────────────────────────────────
function Starfield() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ctx = el.getContext("2d");
    const STARS = Array.from({ length: 200 }, () => ({
      x: Math.random(), y: Math.random(), z: Math.random(), pz: Math.random(),
    }));
    let raf;
    const draw = () => {
      el.width = window.innerWidth; el.height = window.innerHeight;
      ctx.fillStyle = "#0a1a1a";
      ctx.fillRect(0, 0, el.width, el.height);
      // grid
      ctx.strokeStyle = "rgba(0,180,160,0.06)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < el.width; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, el.height); ctx.stroke(); }
      for (let y = 0; y < el.height; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(el.width, y); ctx.stroke(); }
      const cx = el.width / 2, cy = el.height / 2;
      STARS.forEach(s => {
        s.pz = s.z; s.z -= 0.004;
        if (s.z <= 0) { s.x = Math.random(); s.y = Math.random(); s.z = 1; s.pz = 1; }
        const sx = (s.x - 0.5) / s.z * el.width + cx;
        const sy = (s.y - 0.5) / s.z * el.height + cy;
        const px = (s.x - 0.5) / s.pz * el.width + cx;
        const py = (s.y - 0.5) / s.pz * el.height + cy;
        const sz = Math.max(0.3, (1 - s.z) * 2.2);
        const op = Math.min(1, (1 - s.z) * 1.5);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,229,204,${op * 0.7})`;
        ctx.lineWidth = sz;
        ctx.moveTo(px, py); ctx.lineTo(sx, sy);
        ctx.stroke();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />;
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function GiglifeGame() {
  const [screen, setScreen]           = useState("menu"); // menu | loadtext | playing | waveclear | gameover
  const [gameMode, setGameMode]       = useState("english");
  const [difficulty, setDifficulty]   = useState("normal");
  const [customText, setCustomText]   = useState("");
  const [customError, setCustomError] = useState("");

  const [waves, setWaves]             = useState([]);
  const [waveIdx, setWaveIdx]         = useState(0);
  const [enemies, setEnemies]         = useState([]);
  const [typed, setTyped]             = useState("");
  const [score, setScore]             = useState(0);
  const [lives, setLives]             = useState(3);
  const [particles, setParticles]     = useState([]);
  const [bullets, setBullets]         = useState([]);
  const [combo, setCombo]             = useState(0);
  const [bestCombo, setBestCombo]     = useState(0);
  const [highScore, setHighScore]     = useState(0);
  const [shake, setShake]             = useState(false);
  const [muted, setMutedState]        = useState(false);
  const [volume, setVolState]         = useState(0.28);
  const [activeKey, setActiveKey]     = useState(null);
  const [wrongFlash, setWrongFlash]   = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [wordHint, setWordHint]       = useState("");
  const [waveScore, setWaveScore]     = useState(0);

  const { sfx, setMuted, setVol, startMusic, stopMusic, getCtx } = useAudio();

  const areaRef    = useRef(null);
  const rafRef     = useRef(null);
  const spawnQ     = useRef([]); // queue of words to spawn in this wave
  const spawnT     = useRef(0);
  const lastT      = useRef(0);
  const W          = useRef(800);
  const H          = useRef(500);
  const gSt        = useRef({ score: 0, lives: 3 });
  const speedR     = useRef(48);
  const missS      = useRef(0);
  const waveIdxR   = useRef(0);
  const wavesR     = useRef([]);
  const scoreR     = useRef(0);

  useEffect(() => { gSt.current = { score, lives }; }, [score, lives]);
  useEffect(() => { scoreR.current = score; }, [score]);
  useEffect(() => { setMuted(muted); }, [muted, setMuted]);
  useEffect(() => { setVol(volume); }, [volume, setVol]);

  const measure = useCallback(() => {
    if (areaRef.current) { W.current = areaRef.current.clientWidth; H.current = areaRef.current.clientHeight; }
  }, []);
  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Start a wave — spawn enemies from wave's word list
  const startWave = useCallback((waveList, idx, diff) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    eid = 0; pid = 0; bid = 0;
    setEnemies([]); setParticles([]); setBullets([]);
    setTyped(""); setWordHint("");
    missS.current = 0;
    speedR.current = DIFFICULTIES[diff].speed;

    const wave = waveList[idx];
    if (!wave) return;

    // Put all wave words in spawn queue
    spawnQ.current = [...wave.words];
    spawnT.current = 0;
    lastT.current = performance.now();
    setScreen("playing");
  }, []);

  const startGame = useCallback((mode, diff, customWaves) => {
    getCtx();
    const bank = mode === "trading" ? WORD_BANK_TRADING : WORD_BANK_ENGLISH;
    const waveList = customWaves || buildWaves(bank);
    wavesR.current = waveList;
    waveIdxR.current = 0;
    setWaves(waveList);
    setWaveIdx(0);
    setScore(0); setLives(3); setCombo(0); setBestCombo(0);
    setWaveScore(0);
    startMusic();
    startWave(waveList, 0, diff);
  }, [getCtx, startMusic, startWave]);

  const goMenu = useCallback(() => {
    stopMusic();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setEnemies([]); setParticles([]); setBullets([]);
    setTyped(""); setShowSettings(false); setWordHint("");
    setScreen("menu");
  }, [stopMusic]);

  const endGame = useCallback(() => {
    sfx.gameOver(); stopMusic();
    setHighScore(h => Math.max(h, scoreR.current));
    setScreen("gameover");
  }, [sfx, stopMusic]);

  const nextWave = useCallback(() => {
    const nextIdx = waveIdxR.current + 1;
    if (nextIdx >= wavesR.current.length) {
      // All waves done — game complete!
      endGame();
      return;
    }
    waveIdxR.current = nextIdx;
    setWaveIdx(nextIdx);
    setWaveScore(0);
    startWave(wavesR.current, nextIdx, difficulty);
  }, [difficulty, endGame, startWave]);

  // Spawn enemies from queue
  const spawnFromQueue = useCallback(() => {
    if (!spawnQ.current.length) return false;
    const word = spawnQ.current.shift();
    const margin = 60;
    const x = margin + Math.random() * Math.max(1, W.current - margin * 2);
    eid++;
    setEnemies(prev => [...prev, { id: eid, word, x, y: -38, speed: speedR.current, hit: false }]);
    return true;
  }, []);

  // Game loop
  useEffect(() => {
    if (screen !== "playing") return;
    const loop = (time) => {
      const dt = Math.min((time - lastT.current) / 1000, 0.05);
      lastT.current = time;

      // Spawn from queue with interval
      spawnT.current -= dt;
      if (spawnT.current <= 0 && spawnQ.current.length > 0) {
        spawnFromQueue();
        spawnT.current = 0.9 + Math.random() * 0.5;
      }

      setEnemies(prev => {
        const h = H.current || 500;
        const next = []; let lost = 0;
        for (const e of prev) {
          if (e.hit) continue;
          const ny = e.y + e.speed * dt;
          if (ny >= h - 52) { lost++; continue; }
          next.push({ ...e, y: ny });
        }
        if (lost > 0) {
          sfx.miss();
          missS.current += lost;
          if (missS.current >= 2) { speedR.current = Math.max(20, speedR.current - 8); missS.current = 0; }
          setLives(l => {
            const nl = l - lost;
            if (nl <= 0) { setTimeout(() => endGame(), 0); return 0; }
            return nl;
          });
          setCombo(0); setTyped(""); setWordHint("");
          setShake(true); setTimeout(() => setShake(false), 220);
        }

        // Check if wave is complete (all spawned + all destroyed)
        if (spawnQ.current.length === 0 && next.length === 0 && prev.length > 0) {
          setTimeout(() => {
            sfx.waveClear();
            setScreen("waveclear");
          }, 300);
        }

        return next;
      });

      setParticles(p => p.map(x => ({ ...x, life: x.life - dt })).filter(x => x.life > 0));
      setBullets(p => p.map(x => ({ ...x, life: x.life - dt * 6 })).filter(x => x.life > 0));
      rafRef.current = requestAnimationFrame(loop);
    };
    lastT.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [screen, spawnFromQueue, endGame, sfx]);

  const pressKey = useCallback((ch) => {
    if (screen !== "playing") return;
    setActiveKey(ch); setTimeout(() => setActiveKey(null), 90);
    const next = typed + ch;
    setEnemies(prev => {
      const cands = prev.filter(e => e.word.startsWith(next));
      if (!cands.length) {
        sfx.wrong(); setWrongFlash(true); setTimeout(() => setWrongFlash(false), 130);
        return prev;
      }
      let tgt = cands[0];
      for (const c of cands) { if (c.y > tgt.y) tgt = c; }
      // slow target
      const slowed = prev.map(e => e.id === tgt.id ? { ...e, speed: Math.max(e.speed * 0.5, 8) } : e);
      // bullet
      bid++;
      setBullets(bs => [...bs, { id: bid, fromX: W.current / 2, fromY: H.current - 52, toX: tgt.x, toY: tgt.y, life: 1 }]);
      sfx.shoot();

      if (tgt.word === next) {
        sfx.explode();
        const pts = 10 + tgt.word.length * 4 + (waveIdxR.current + 1) * 3;
        setScore(s => s + pts);
        setWaveScore(ws => ws + pts);
        setCombo(c => { const nc = c + 1; setBestCombo(b => Math.max(b, nc)); return nc; });
        pid++;
        setParticles(ps => [...ps, { id: pid, x: tgt.x, y: tgt.y, life: 0.55, text: "+" + pts }]);
        setTyped(""); setWordHint("");
        missS.current = 0;
        speedR.current = Math.min(speedR.current + 1.5, DIFFICULTIES[difficulty].speed * 1.6);
        return slowed.map(e => e.id === tgt.id ? { ...e, hit: true } : e);
      }
      if (gameMode === "english") setWordHint(tgt.word);
      setTyped(next);
      return slowed;
    });
  }, [screen, typed, sfx, gameMode, difficulty]);

  const handleBS = useCallback(() => setTyped(t => t.slice(0, -1)), []);

  const handleKey = useCallback((e) => {
    if (screen === "waveclear") { if (e.key === "Enter" || e.key === " ") nextWave(); return; }
    if (screen !== "playing") return;
    if (e.key === "Escape") { goMenu(); return; }
    if (e.key === "Backspace") { handleBS(); return; }
    if (!/^[a-zA-Z]$/.test(e.key)) return;
    pressKey(e.key.toLowerCase());
  }, [screen, pressKey, handleBS, goMenu, nextWave]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  useEffect(() => {
    const hits = enemies.filter(e => e.hit);
    if (!hits.length) return;
    const t = setTimeout(() => setEnemies(p => p.filter(e => !e.hit)), 160);
    return () => clearTimeout(t);
  }, [enemies]);

  const liveLetters = (() => {
    const s = new Set();
    enemies.forEach(e => { if (e.word.startsWith(typed)) { const c = e.word[typed.length]; if (c) s.add(c); } });
    return s;
  })();

  const indLetters = (() => {
    const s = new Set();
    if (!typed.length) enemies.forEach(e => s.add(e.word[0]));
    return s;
  })();

  const currentWave = waves[waveIdx];
  const waveNum = String(waveIdx + 1).padStart(3, "0");
  const scoreStr = String(score).padStart(6, "0");

  // ── SETTINGS PANEL ───────────────────────────────────────────────────────
  const Settings = () => (
    <div style={{ position: "absolute", inset: 0, background: "rgba(10,26,26,0.97)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 30, gap: 20 }}>
      <div style={{ fontSize: 13, letterSpacing: 4, color: T.textLo, marginBottom: 4 }}>SETTINGS</div>
      <div style={{ width: 280, border: "1px solid " + T.keyBdr, borderRadius: 12, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16, background: "rgba(0,40,36,0.6)" }}>
        <div>
          <div style={{ fontSize: 10, color: T.textLo, letterSpacing: 2, marginBottom: 8 }}>VOLUME</div>
          <input type="range" min="0" max="1" step="0.05" value={volume} onChange={e => setVolState(parseFloat(e.target.value))} style={{ width: "100%", accentColor: T.accent }} />
          <div style={{ fontSize: 12, color: T.accent, textAlign: "right", marginTop: 4 }}>{Math.round(volume * 100)}%</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: T.textLo, letterSpacing: 2 }}>SOUND</span>
          <button onClick={() => setMutedState(m => !m)} style={{ background: muted ? "transparent" : "rgba(0,229,204,0.12)", border: "1px solid " + (muted ? T.keyBdr : T.accent), borderRadius: 20, color: muted ? T.textLo : T.accent, padding: "5px 20px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: 2 }}>{muted ? "OFF" : "ON"}</button>
        </div>
      </div>
      <button onClick={() => setShowSettings(false)} style={{ background: T.accent, color: "#0a1a1a", border: "none", padding: "10px 40px", fontSize: 13, fontWeight: 700, letterSpacing:13, fontWeight: 700, letterSpacing: 3, borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}>RESUME</button>
      <button onClick={goMenu} style={{ background: "transparent", border: "1px solid " + T.keyBdr, borderRadius: 8, color: T.textLo, padding: "8px 28px", fontSize: 11, cursor: "pointer", fontFamily: "inherit", letterSpacing: 2 }}>MAIN MENU</button>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, fontFamily: "'Courier New', monospace", overflow: "hidden", userSelect: "none", background: T.bg }}>
      <Starfield />
      <div style={{
        position: "relative", zIndex: 1, width: "100%", height: "100%",
        display: "flex", flexDirection: "column", overflow: "hidden",
        outline: wrongFlash ? "2px solid " + T.red : "none",
        transform: shake ? "translate(3px,-2px)" : "none", transition: "transform 0.04s",
      }}>

        {/* ── HUD ── */}
        {(screen === "playing" || screen === "waveclear") && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px", background: "rgba(10,26,26,0.85)", borderBottom: "1px solid rgba(0,229,204,0.1)", flexShrink: 0, zIndex: 10 }}>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 8, color: T.textLo, letterSpacing: 2 }}>WAVE</div>
                <div style={{ fontSize: 18, color: T.accent, fontWeight: 700, letterSpacing: 2 }}>{waveNum}</div>
              </div>
              <div>
                <div style={{ fontSize: 8, color: T.textLo, letterSpacing: 2 }}>SCORE</div>
                <div style={{ fontSize: 18, color: T.text, fontWeight: 700, letterSpacing: 2 }}>{scoreStr}</div>
              </div>
              <div>
                <div style={{ fontSize: 8, color: T.textLo, letterSpacing: 2 }}>COMBO</div>
                <div style={{ fontSize: 18, color: combo > 4 ? "#fb923c" : T.text, fontWeight: 700 }}>×{combo}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 5 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: i < lives ? T.accent : "rgba(0,229,204,0.1)", border: "1px solid rgba(0,229,204,0.3)", transition: "all 0.3s", boxShadow: i < lives ? "0 0 8px " + T.accent : "none" }} />
                ))}
              </div>
              <button onClick={() => setShowSettings(true)} style={{ background: "transparent", border: "1px solid rgba(0,229,204,0.2)", borderRadius: 6, color: T.textLo, fontSize: 10, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit", letterSpacing: 1 }}>⚙</button>
            </div>
          </div>
        )}

        {/* ── GAME AREA ── */}
        <div ref={areaRef} style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 0 }}>
          {showSettings && screen === "playing" && <Settings />}

          {/* ── MENU ── */}
          {screen === "menu" && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px 16px", overflowY: "auto" }}>
              <div style={{ fontSize: 10, letterSpacing: 6, color: T.textLo, marginBottom: 12 }}>GREAT IDEA · GREAT LIFE</div>
              <div style={{ fontSize: 58, fontWeight: 900, color: T.accent, letterSpacing: 4, textShadow: "0 0 40px rgba(0,229,204,0.5)", marginBottom: 8, fontFamily: "Georgia, serif", filter: "drop-shadow(0 0 20px rgba(0,229,204,0.4))" }}>GIGLIFE</div>
              <div style={{ fontSize: 12, color: T.dim, marginBottom: 6, letterSpacing: 1 }}>Type words. Learn English. Level up your life.</div>
              <div style={{ fontSize: 10, color: T.textLo, marginBottom: 28, maxWidth: 340, lineHeight: 1.8 }}>Words fall from above — type them to destroy them.<br />Miss three and it's game over.</div>

              {/* Mode */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 9, color: T.textLo, letterSpacing: 3, marginBottom: 10 }}>SELECT MODE</div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  {[
                    { key: "english", label: "📚 ENGLISH", desc: "Learn English" },
                    { key: "trading", label: "📈 TRADING", desc: "Trading terms" },
                  ].map(m => (
                    <button key={m.key} onClick={() => setGameMode(m.key)} style={{ padding: "10px 18px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 700, border: "1px solid " + (gameMode === m.key ? T.accent : T.keyBdr), background: gameMode === m.key ? "rgba(0,229,204,0.1)" : "rgba(0,40,36,0.5)", color: gameMode === m.key ? T.accent : T.textLo, transition: "all 0.2s" }}>
                      <div>{m.label}</div>
                      <div style={{ fontSize: 9, opacity: 0.5, marginTop: 4 }}>{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 9, color: T.textLo, letterSpacing: 3, marginBottom: 10 }}>DIFFICULTY</div>
                <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                  {Object.entries(DIFFICULTIES).map(([key, val]) => (
                    <button key={key} onClick={() => setDifficulty(key)} style={{ padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 10, fontWeight: 700, letterSpacing: 1, border: "1px solid " + (difficulty === key ? val.color : T.keyBdr), background: difficulty === key ? "rgba(0,229,204,0.08)" : "rgba(0,40,36,0.5)", color: difficulty === key ? val.color : T.textLo, transition: "all 0.2s" }}>{val.label}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", justifyContent: "center" }}>
                <button onClick={() => startGame(gameMode, difficulty, null)} style={{ background: T.accent, color: "#0a1a1a", border: "none", padding: "13px 44px", fontSize: 15, fontWeight: 700, letterSpacing: 3, borderRadius: 8, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 0 30px rgba(0,229,204,0.4)" }}>NEW GAME</button>
                <button onClick={() => setScreen("loadtext")} style={{ background: "transparent", border: "1px solid " + T.accent, color: T.accent, padding: "13px 20px", fontSize: 12, fontWeight: 700, letterSpacing: 2, borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}>LOAD TEXT</button>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <button onClick={() => setMutedState(m => !m)} style={{ background: "transparent", border: "1px solid " + T.keyBdr, borderRadius: 6, color: T.textLo, fontSize: 10, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit", letterSpacing: 1 }}>{muted ? "🔇 MUTED" : "🔊 SOUND"}</button>
                <a href="/privacy.html" target="_blank" style={{ fontSize: 9, color: T.textLo, letterSpacing: 1, textDecoration: "none", borderBottom: "1px solid " + T.keyBdr, paddingBottom: 2 }}>Privacy Policy</a>
              </div>
            </div>
          )}

          {/* ── LOAD TEXT ── */}
          {screen === "loadtext" && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 20px", overflowY: "auto" }}>
              <div style={{ fontSize: 11, letterSpacing: 4, color: T.textLo, marginBottom: 16 }}>LOAD YOUR OWN TEXT</div>
              <div style={{ fontSize: 11, color: T.textLo, marginBottom: 16, maxWidth: 360, textAlign: "center", lineHeight: 1.7 }}>
                Paste any text below. Each word becomes an enemy.<br />
                Perfect for learning custom vocabulary!
              </div>
              <textarea
                value={customText}
                onChange={e => { setCustomText(e.target.value); setCustomError(""); }}
                placeholder="Paste your text here... Each sentence becomes a wave of enemies."
                style={{
                  width: "100%", maxWidth: 400, height: 160,
                  background: "rgba(0,40,36,0.6)", border: "1px solid " + T.keyBdr,
                  borderRadius: 8, color: T.text, fontSize: 13, padding: "12px",
                  fontFamily: "inherit", resize: "vertical", outline: "none",
                  lineHeight: 1.6,
                }}
              />
              {customError && <div style={{ color: T.red, fontSize: 11, marginTop: 8 }}>{customError}</div>}
              <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap", justifyContent: "center" }}>
                <button onClick={() => {
                  const waves = parseCustomText(customText);
                  if (!waves) { setCustomError("Too few words! Paste at least 8 words."); return; }
                  startGame(gameMode, difficulty, waves);
                }} style={{ background: T.accent, color: "#0a1a1a", border: "none", padding: "11px 36px", fontSize: 13, fontWeight: 700, letterSpacing: 2, borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}>PLAY!</button>
                <button onClick={() => { setScreen("menu"); setCustomError(""); }} style={{ background: "transparent", border: "1px solid " + T.keyBdr, borderRadius: 8, color: T.textLo, padding: "11px 24px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1 }}>BACK</button>
              </div>
            </div>
          )}

          {/* ── PLAYING ── */}
          {screen === "playing" && (<>
            {enemies.map(e => {
              const isTgt = e.word.startsWith(typed) && typed.length > 0;
              const isInd = !isTgt && !typed.length && indLetters.has(e.word[0]);
              const tp = isTgt ? typed : "";
              const rp = isTgt ? e.word.slice(typed.length) : e.word;
              return (
                <div key={e.id} style={{
                  position: "absolute", left: e.x, top: e.y,
                  transform: `translate(-50%,-50%) scale(${e.hit ? 1.8 : 1})`,
                  opacity: e.hit ? 0 : 1,
                  transition: e.hit ? "opacity 0.15s,transform 0.15s" : "none",
                  fontSize: 16, fontWeight: 700, padding: "5px 12px", borderRadius: 4,
                  background: isTgt ? "rgba(0,229,204,0.12)" : "rgba(10,26,26,0.88)",
                  border: "1px solid " + (isTgt ? T.accent : isInd ? "rgba(0,229,204,0.3)" : "rgba(0,229,204,0.14)"),
                  whiteSpace: "nowrap", pointerEvents: "none",
                  boxShadow: isTgt ? "0 0 18px rgba(0,229,204,0.22)" : "none",
                  letterSpacing: 1,
                }}>
                  {isInd && <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: T.accent, boxShadow: "0 0 6px " + T.accent }} />}
                  <span style={{ color: T.typed }}>{tp}</span>
                  <span style={{ color: isTgt ? T.text : isInd ? "rgba(0,229,204,0.65)" : T.textLo }}>{rp}</span>
                </div>
              );
            })}

            {particles.map(p => (
              <div key={p.id} style={{ position: "absolute", left: p.x, top: p.y, transform: "translate(-50%,-50%)", color: T.accent, fontWeight: 700, fontSize: 14, opacity: Math.max(p.life * 2, 0), pointerEvents: "none", textShadow: "0 0 8px " + T.accent }}>{p.text}</div>
            ))}

            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}>
              <defs>
                <filter id="glow2"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              {bullets.map(b => {
                const t = 1 - Math.max(b.life, 0);
                const prog = Math.min(t, 1);
                const cx2 = b.fromX + (b.toX - b.fromX) * prog;
                const cy2 = b.fromY + (b.toY - b.fromY) * prog;
                const tx = b.fromX + (b.toX - b.fromX) * Math.max(prog - 0.16, 0);
                const ty = b.fromY + (b.toY - b.fromY) * Math.max(prog - 0.16, 0);
                return <line key={b.id} x1={tx} y1={ty} x2={cx2} y2={cy2} stroke={T.accent} strokeWidth={2} strokeLinecap="round" opacity={Math.min(b.life * 1.5, 1)} filter="url(#glow2)" />;
              })}
            </svg>

            {/* ship — ZType style */}
            <div style={{ position: "absolute", left: "50%", bottom: 10, transform: "translateX(-50%)", pointerEvents: "none", filter: "drop-shadow(0 0 10px rgba(0,229,204,0.7))" }}>
              <svg viewBox="0 0 60 60" width="38" height="38">
                <polygon points="30,2 44,42 30,32 16,42" fill={T.accent} stroke="#aafff5" strokeWidth="0.8" />
                <polygon points="30,2 37,30 30,24 23,30" fill="#ffffff" opacity="0.9" />
                <circle cx="30" cy="20" r="3.5" fill="#0a1a1a" opacity="0.8" />
                <polygon points="16,42 10,56 22,46" fill="#008878" />
                <polygon points="44,42 50,56 38,46" fill="#008878" />
                <line x1="30" y1="42" x2="30" y2="58" stroke="rgba(0,229,204,0.4)" strokeWidth="2" />
              </svg>
            </div>

            <div style={{ position: "absolute", left: 0, right: 0, bottom: 50, height: 1, background: "linear-gradient(90deg,transparent,rgba(244,63,94,0.5),transparent)" }} />
          </>)}

          {/* ── WAVE CLEAR ── */}
          {screen === "waveclear" && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", padding: "0 32px" }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: T.accent, letterSpacing: 4, marginBottom: 8 }}>WAVE {waveNum} CLEAR</div>
              <div style={{ fontSize: 14, color: T.textLo, letterSpacing: 3, marginBottom: 32 }}>SCORE: {scoreStr}</div>
              {waveIdx + 1 < waves.length ? (
                <div style={{ fontSize: 12, color: T.dim, letterSpacing: 2, animation: "blink 1s infinite" }}>TAP TO CONTINUE →</div>
              ) : (
                <div style={{ fontSize: 12, color: T.accent, letterSpacing: 2 }}>ALL WAVES COMPLETE!</div>
              )}
              <button
                onClick={nextWave}
                style={{ marginTop: 24, background: T.accent, color: "#0a1a1a", border: "none", padding: "12px 36px", fontSize: 13, fontWeight: 700, letterSpacing: 2, borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}>
                {waveIdx + 1 < waves.length ? "NEXT WAVE" : "FINISH"}
              </button>
            </div>
          )}

          {/* ── GAME OVER ── */}
          {screen === "gameover" && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 32, background: "rgba(10,26,26,0.92)" }}>
              <div style={{ fontSize: 11, letterSpacing: 4, color: T.red, marginBottom: 12 }}>GAME OVER</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: T.text, marginBottom: 4, fontFamily: "Georgia,serif", letterSpacing: 3 }}>{scoreStr}</div>
              <div style={{ fontSize: 11, color: T.textLo, letterSpacing: 3, marginBottom: 28 }}>FINAL SCORE</div>
              <div style={{ display: "flex", gap: 28, marginBottom: 32, flexWrap: "wrap", justifyContent: "center" }}>
                {[
                  { label: "BEST COMBO", val: "×" + bestCombo, color: "#fb923c" },
                  { label: "HIGH SCORE", val: String(highScore).padStart(6, "0"), color: T.accent },
                  { label: "WAVE", val: waveNum, color: T.text },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: 9, color: T.textLo, letterSpacing: 2, marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 20, color: s.color, fontWeight: 700, letterSpacing: 2 }}>{s.val}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => startGame(gameMode, difficulty, null)} style={{ background: T.accent, color: "#0a1a1a", border: "none", padding: "12px 44px", fontSize: 14, fontWeight: 700, letterSpacing: 3, borderRadius: 8, cursor: "pointer", fontFamily: "inherit", marginBottom: 12, boxShadow: "0 0 24px rgba(0,229,204,0.3)" }}>PLAY AGAIN</button>
              <button onClick={goMenu} style={{ background: "transparent", border: "1px solid " + T.keyBdr, borderRadius: 8, color: T.textLo, padding: "9px 28px", fontSize: 11, cursor: "pointer", fontFamily: "inherit", letterSpacing: 2 }}>MAIN MENU</button>
            </div>
          )}
        </div>

        {/* ── TYPED DISPLAY ── */}
        {screen === "playing" && (
          <div style={{ padding: "6px 16px", background: "rgba(10,26,26,0.88)", borderTop: "1px solid rgba(0,229,204,0.08)", minHeight: 34, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <span style={{ fontSize: 17, letterSpacing: 4, color: T.accent, fontWeight: 700 }}>
              {typed || "\u00A0"}
              <span style={{ opacity: 0.4, animation: "blink 1s infinite" }}>_</span>
            </span>
            {gameMode === "english" && wordHint && (
              <span style={{ fontSize: 11, color: T.textLo, letterSpacing: 1 }}>→ <span style={{ color: T.dim }}>{wordHint}</span></span>
            )}
          </div>
        )}

        {/* ── KEYBOARD ── */}
        {screen === "playing" && (
          <div style={{ padding: "10px 10px 14px", background: "rgba(0,20,18,0.95)", borderTop: "1px solid rgba(0,229,204,0.08)", flexShrink: 0 }}>
            {KEY_ROWS.map((row, ri) => (
              <div key={ri} style={{ display: "flex", justifyContent: "center", gap: 5, marginBottom: 5, paddingLeft: ri === 1 ? 18 : ri === 2 ? 36 : 0, paddingRight: ri === 1 ? 18 : ri === 2 ? 36 : 0 }}>
                {row.map(k => {
                  const live = liveLetters.has(k);
                  const ind = !live && indLetters.has(k);
                  const act = activeKey === k;
                  return (
                    <button key={k} onPointerDown={e => { e.preventDefault(); pressKey(k); }} style={{
                      flex: 1, maxWidth: 44, minWidth: 24, height: 48,
                      borderRadius: 6, fontWeight: 700, fontSize: 15,
                      textTransform: "uppercase", cursor: "pointer",
                      fontFamily: "inherit", touchAction: "manipulation",
                      transition: "all 0.06s",
                      border: "1px solid " + (act || live ? T.accent : ind ? "rgba(0,229,204,0.3)" : T.keyBdr),
                      background: act ? T.accent : live ? T.keyLit : ind ? "rgba(0,229,204,0.06)" : T.keyBg,
                      color: act ? "#0a1a1a" : live ? T.accent : ind ? "rgba(0,229,204,0.5)" : T.textLo,
                      boxShadow: act ? "0 0 14px rgba(0,229,204,0.5)" : live ? "0 0 8px rgba(0,229,204,0.2)" : "none",
                    }}>{k}</button>
                  );
                })}
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
              <button onPointerDown={e => { e.preventDefault(); handleBS(); }} style={{ width: 160, height: 40, borderRadius: 6, border: "1px solid " + T.keyBdr, background: T.keyBg, color: T.textLo, fontSize: 12, fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontFamily: "inherit", touchAction: "manipulation" }}>⌫  BACKSPACE</button>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes blink{0%,50%{opacity:1}51%,100%{opacity:0}}*{box-sizing:border-box}body{margin:0;overflow:hidden}`}</style>
    </div>
  );
}
