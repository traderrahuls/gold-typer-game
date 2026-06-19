import { useState, useEffect, useRef, useCallback } from "react";

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

const TIERS = [
  { name: "BEGINNER",     color: "#7dd3fc", minScore: 0 },
  { name: "LEARNER",      color: "#4ade80", minScore: 150 },
  { name: "SPEAKER",      color: "#facc15", minScore: 400 },
  { name: "FLUENT",       color: "#fb923c", minScore: 800 },
  { name: "MASTER",       color: "#f87171", minScore: 1400 },
];

const KEY_ROWS = [
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l"],
  ["z","x","c","v","b","n","m"],
];

const DIFFICULTIES = {
  easy:   { baseSpeed: 7,  spawnInterval: 2.4, label: "EASY" },
  normal: { baseSpeed: 13, spawnInterval: 1.8, label: "NORMAL" },
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

let eid = 0, pid = 0, bid = 0;

// ── AUDIO ──────────────────────────────────────────────────────────────────
function useAudio() {
  const ctxR = useRef(null);
  const mastR = useRef(null);
  const musicTimer = useRef(null);
  const mutedR = useRef(false);
  const volR = useRef(0.35);

  const ctx = useCallback(() => {
    if (!ctxR.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctxR.current = new AC();
      mastR.current = ctxR.current.createGain();
      mastR.current.gain.value = 0.35;
      mastR.current.connect(ctxR.current.destination);
    }
    if (ctxR.current.state === "suspended") ctxR.current.resume();
    return ctxR.current;
  }, []);

  const tone = useCallback((freq, dur, type, g0, f1) => {
    if (mutedR.current) return;
    const c = ctx(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, c.currentTime);
    if (f1) o.frequency.exponentialRampToValueAtTime(Math.max(f1,1), c.currentTime+dur);
    g.gain.setValueAtTime(g0||0.3, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime+dur);
    o.connect(g); g.connect(mastR.current);
    o.start(); o.stop(c.currentTime+dur);
  }, [ctx]);

  const startMusic = useCallback(() => {
    const c = ctx(); if (!c || musicTimer.current) return;
    const mg = c.createGain(); mg.gain.value = 0.07; mg.connect(mastR.current);
    const scale = [130.81,146.83,164.81,174.61,196.00,220.00,246.94,261.63];
    let step = 0;
    const tick = () => {
      if (!mutedR.current) {
        const o = c.createOscillator(), g = c.createGain();
        o.type = "triangle";
        const oct = step % 16 < 8 ? 1 : 1.5;
        o.frequency.value = scale[step % scale.length] * oct;
        g.gain.setValueAtTime(0.001, c.currentTime);
        g.gain.linearRampToValueAtTime(0.1, c.currentTime+0.05);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime+0.42);
        o.connect(g); g.connect(mg);
        o.start(); o.stop(c.currentTime+0.45);
        step++;
      }
      musicTimer.current = setTimeout(tick, 520);
    };
    tick();
  }, [ctx]);

  const stopMusic = useCallback(() => {
    if (musicTimer.current) { clearTimeout(musicTimer.current); musicTimer.current = null; }
  }, []);

  const setMuted = useCallback((m) => { mutedR.current = m; }, []);
  const setVol = useCallback((v) => {
    volR.current = v;
    if (mastR.current) mastR.current.gain.value = v;
  }, []);

  const sfx = {
    type:    useCallback(() => tone(680,0.04,"square",0.1), [tone]),
    shoot:   useCallback(() => tone(880,0.07,"sawtooth",0.09,440), [tone]),
    explode: useCallback(() => { tone(160,0.18,"triangle",0.22,40); setTimeout(()=>tone(90,0.1,"square",0.1,30),30); }, [tone]),
    miss:    useCallback(() => tone(140,0.28,"sawtooth",0.18,60), [tone]),
    wrong:   useCallback(() => tone(200,0.07,"square",0.09,100), [tone]),
    levelUp: useCallback(() => { tone(440,0.1,"sine",0.18); setTimeout(()=>tone(660,0.11,"sine",0.18),85); setTimeout(()=>tone(880,0.14,"sine",0.2),170); }, [tone]),
    gameOver:useCallback(() => { tone(280,0.2,"sawtooth",0.18,120); setTimeout(()=>tone(160,0.28,"sawtooth",0.18,55),140); setTimeout(()=>tone(80,0.45,"sawtooth",0.15,25),300); }, [tone]),
  };

  return { sfx, setMuted, setVol, startMusic, stopMusic, ctx };
}

// ── STARFIELD CANVAS ────────────────────────────────────────────────────────
function Starfield() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const el = canvasRef.current; if (!el) return;
    const ctx2 = el.getContext("2d");
    const STARS = Array.from({length:220}, () => ({
      x: Math.random(), y: Math.random(), z: Math.random(), pz: Math.random(),
    }));
    let raf;
    const draw = () => {
      el.width = window.innerWidth;
      el.height = window.innerHeight;
      ctx2.fillStyle = "#04030a";
      ctx2.fillRect(0,0,el.width,el.height);
      const cx = el.width/2, cy = el.height/2;
      STARS.forEach(s => {
        s.pz = s.z;
        s.z -= 0.005;
        if (s.z <= 0) { s.x=Math.random(); s.y=Math.random(); s.z=1; s.pz=1; }
        const sx = (s.x-0.5)/s.z*el.width+cx;
        const sy = (s.y-0.5)/s.z*el.height+cy;
        const px = (s.x-0.5)/s.pz*el.width+cx;
        const py = (s.y-0.5)/s.pz*el.height+cy;
        const size = Math.max(0.4,(1-s.z)*2.2);
        const op = Math.min(1,(1-s.z)*1.5);
        ctx2.beginPath();
        ctx2.strokeStyle = `rgba(160,210,255,${op})`;
        ctx2.lineWidth = size;
        ctx2.moveTo(px,py); ctx2.lineTo(sx,sy);
        ctx2.stroke();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas ref={canvasRef} style={{
      position:"fixed", inset:0, width:"100%", height:"100%",
      zIndex:0, pointerEvents:"none",
    }} />
  );
}

// ── MAIN GAME ───────────────────────────────────────────────────────────────
export default function GiglifeGame() {
  const [screen, setScreen]           = useState("menu");
  const [gameMode, setGameMode]       = useState("english");
  const [difficulty, setDifficulty]   = useState("normal");
  const [enemies, setEnemies]         = useState([]);
  const [typed, setTyped]             = useState("");
  const [score, setScore]             = useState(0);
  const [lives, setLives]             = useState(3);
  const [wave, setWave]               = useState(1);
  const [particles, setParticles]     = useState([]);
  const [bullets, setBullets]         = useState([]);
  const [combo, setCombo]             = useState(0);
  const [bestCombo, setBestCombo]     = useState(0);
  const [highScore, setHighScore]     = useState(0);
  const [shake, setShake]             = useState(false);
  const [muted, setMutedState]        = useState(false);
  const [volume, setVolState]         = useState(0.35);
  const [activeKey, setActiveKey]     = useState(null);
  const [wrongFlash, setWrongFlash]   = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [wordHint, setWordHint]       = useState("");

  const { sfx, setMuted, setVol, startMusic, stopMusic, ctx: getCtx } = useAudio();

  const containerRef  = useRef(null);
  const rafRef        = useRef(null);
  const spawnTimer    = useRef(0);
  const lastTime      = useRef(0);
  const recentWords   = useRef([]);
  const W             = useRef(800);
  const H             = useRef(500);
  const gState        = useRef({ score:0, lives:3, wave:1 });
  const waveRef       = useRef(1);
  const diffRef       = useRef("normal");
  const speedMult     = useRef(1.0);
  const missStreak    = useRef(0);

  useEffect(() => { gState.current = { score, lives, wave }; }, [score,lives,wave]);
  useEffect(() => { setMuted(muted); }, [muted,setMuted]);
  useEffect(() => { setVol(volume); }, [volume,setVol]);

  const measure = useCallback(() => {
    if (containerRef.current) {
      W.current = containerRef.current.clientWidth;
      H.current = containerRef.current.clientHeight;
    }
  }, []);
  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const startGame = () => {
    getCtx();
    eid=0; pid=0; bid=0;
    recentWords.current=[];
    spawnTimer.current=0;
    lastTime.current=performance.now();
    waveRef.current=1;
    diffRef.current=difficulty;
    speedMult.current=1.0;
    missStreak.current=0;
    setEnemies([]); setParticles([]); setBullets([]);
    setTyped(""); setScore(0); setLives(3);
    setWave(1); setCombo(0); setBestCombo(0);
    setWordHint(""); setScreen("playing");
    startMusic();
  };

  const goMenu = useCallback(() => {
    stopMusic();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setEnemies([]); setParticles([]); setBullets([]);
    setTyped(""); setShowSettings(false); setWordHint("");
    setScreen("menu");
  }, [stopMusic]);

  const endGame = useCallback(() => {
    sfx.gameOver(); stopMusic();
    setScreen("gameover");
    setHighScore(hs => Math.max(hs, gState.current.score));
  }, [sfx,stopMusic]);

  const spawnEnemy = useCallback(() => {
    const bank = gameMode==="trading" ? WORD_BANK_TRADING : WORD_BANK_ENGLISH;
    const word = randomWord(bank, recentWords.current);
    recentWords.current = [...recentWords.current.slice(-5), word];
    const margin = 70;
    const x = margin + Math.random() * Math.max(1, W.current - margin*2);
    const d = DIFFICULTIES[diffRef.current];
    const speed = d.baseSpeed * speedMult.current + Math.random()*3;
    eid++;
    setEnemies(prev => [...prev, { id:eid, word, x, y:-35, speed, hit:false }]);
  }, [gameMode]);

  useEffect(() => {
    if (screen !== "playing") return;
    const loop = (time) => {
      const dt = Math.min((time - lastTime.current)/1000, 0.05);
      lastTime.current = time;
      spawnTimer.current -= dt;
      const d = DIFFICULTIES[diffRef.current];
      const si = Math.max(0.5, d.spawnInterval - waveRef.current*0.04);
      if (spawnTimer.current <= 0) { spawnEnemy(); spawnTimer.current = si; }

      setEnemies(prev => {
        const h = H.current || 500;
        const next=[]; let lost=0;
        for (const e of prev) {
          if (e.hit) continue;
          const ny = e.y + e.speed*dt;
          if (ny >= h-44) { lost++; continue; }
          next.push({...e, y:ny});
        }
        if (lost > 0) {
          sfx.miss();
          missStreak.current += lost;
          if (missStreak.current >= 2) {
            speedMult.current = Math.max(0.45, speedMult.current-0.1);
            missStreak.current = 0;
          }
          setLives(l => {
            const nl = l-lost;
            if (nl <= 0) { setTimeout(()=>endGame(),0); return 0; }
            return nl;
          });
          setCombo(0); setTyped(""); setWordHint("");
          setShake(true); setTimeout(()=>setShake(false),250);
        }
        return next;
      });

      const nw = 1 + Math.floor(gState.current.score/250);
      if (nw > waveRef.current) {
        waveRef.current = nw; setWave(nw);
        speedMult.current = Math.min(speedMult.current+0.07, 1.75);
        sfx.levelUp();
      }

      setParticles(prev => prev.map(p=>({...p,life:p.life-dt})).filter(p=>p.life>0));
      setBullets(prev => prev.map(b=>({...b,life:b.life-dt*6})).filter(b=>b.life>0));
      rafRef.current = requestAnimationFrame(loop);
    };
    lastTime.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [screen, spawnEnemy, endGame, sfx]);

  const pressKey = useCallback((ch) => {
    if (screen !== "playing") return;
    setActiveKey(ch); setTimeout(()=>setActiveKey(null),100);
    const next = typed + ch;
    setEnemies(prev => {
      const cands = prev.filter(en => en.word.startsWith(next));
      if (cands.length === 0) {
        sfx.wrong();
        setWrongFlash(true); setTimeout(()=>setWrongFlash(false),150);
        return prev; // don't reset typed — stay on current word
      }
      let tgt = cands[0];
      for (const c of cands) { if (c.y > tgt.y) tgt = c; }

      // slow down target word while being typed
      const slowed = prev.map(en => en.id===tgt.id ? {...en, speed: Math.max(en.speed*0.55, 2)} : en);

      // fire bullet
      bid++;
      setBullets(bs => [...bs, {
        id:bid, fromX:W.current/2, fromY:H.current-44,
        toX:tgt.x, toY:tgt.y, life:1,
      }]);
      sfx.shoot();

      if (tgt.word === next) {
        sfx.explode();
        const pts = 10 + tgt.word.length*4 + gState.current.wave*2;
        setScore(s=>s+pts);
        setCombo(c=>{ const nc=c+1; setBestCombo(b=>Math.max(b,nc)); return nc; });
        pid++;
        setParticles(ps=>[...ps,{id:pid,x:tgt.x,y:tgt.y,life:0.55,text:"+"+pts}]);
        setTyped(""); setWordHint("");
        missStreak.current = 0;
        speedMult.current = Math.min(speedMult.current+0.025, 1.75);
        return slowed.map(en=>en.id===tgt.id?{...en,hit:true}:en);
      }
      if (gameMode==="english") setWordHint(tgt.word);
      setTyped(next);
      return slowed;
    });
  }, [screen,typed,sfx,gameMode]);

  const handleBS = useCallback(()=>setTyped(t=>t.slice(0,-1)),[]);

  const handleKey = useCallback((e) => {
    if (screen!=="playing") return;
    if (e.key==="Escape") { goMenu(); return; }
    if (e.key==="Backspace") { handleBS(); return; }
    if (!/^[a-zA-Z]$/.test(e.key)) return;
    pressKey(e.key.toLowerCase());
  }, [screen,pressKey,handleBS,goMenu]);

  useEffect(()=>{
    window.addEventListener("keydown",handleKey);
    return ()=>window.removeEventListener("keydown",handleKey);
  },[handleKey]);

  useEffect(()=>{
    const hits = enemies.filter(e=>e.hit);
    if (!hits.length) return;
    const t = setTimeout(()=>setEnemies(prev=>prev.filter(e=>!e.hit)),180);
    return ()=>clearTimeout(t);
  },[enemies]);

  const liveLetters = (() => {
    const s = new Set();
    enemies.forEach(e=>{
      if (e.word.startsWith(typed)) {
        const nc = e.word[typed.length];
        if (nc) s.add(nc);
      }
    });
    return s;
  })();

  // next letters that haven't been typed yet (for indicator glow before typing)
  const indicatorLetters = (() => {
    const s = new Set();
    enemies.forEach(e=>{
      if (typed.length===0) s.add(e.word[0]);
    });
    return s;
  })();

  const tier = getTier(score);

  const SettingsPanel = () => (
    <div style={{
      position:"absolute",inset:0,background:"rgba(4,3,10,0.95)",
      display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",zIndex:30,gap:20,
    }}>
      <div style={{fontSize:13,letterSpacing:4,color:"#6ea8d4",marginBottom:4}}>SETTINGS</div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,width:260}}>
        <div style={{fontSize:11,color:"#4a7a9b",letterSpacing:2}}>MUSIC & SOUND VOLUME</div>
        <input type="range" min="0" max="1" step="0.05" value={volume}
          onChange={e=>setVolState(parseFloat(e.target.value))}
          style={{width:"100%",accentColor:"#00e5ff"}}
        />
        <div style={{fontSize:12,color:"#00e5ff"}}>{Math.round(volume*100)}%</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
        <div style={{fontSize:11,color:"#4a7a9b",letterSpacing:2}}>SOUND</div>
        <button onClick={()=>setMutedState(m=>!m)} style={{
          background: muted?"rgba(255,255,255,0.04)":"rgba(0,229,255,0.15)",
          border:"1px solid "+(muted?"#1a3a4a":"#00e5ff"),
          borderRadius:8,color:muted?"#2a5a6a":"#00e5ff",
          padding:"8px 32px",fontSize:12,fontWeight:700,
          cursor:"pointer",fontFamily:"inherit",letterSpacing:2,
        }}>{muted?"OFF":"ON"}</button>
      </div>
      <button onClick={()=>setShowSettings(false)} style={{
        marginTop:12,background:"linear-gradient(180deg,#00e5ff,#0099aa)",
        color:"#04030a",border:"none",padding:"10px 36px",
        fontSize:13,fontWeight:700,letterSpacing:2,
        borderRadius:8,cursor:"pointer",fontFamily:"inherit",
      }}>RESUME</button>
      <button onClick={goMenu} style={{
        background:"transparent",border:"1px solid #1a3a4a",
        borderRadius:8,color:"#4a7a9b",padding:"8px 28px",
        fontSize:12,cursor:"pointer",fontFamily:"inherit",letterSpacing:1,
      }}>MAIN MENU</button>
    </div>
  );

  return (
    <div style={{
      position:"fixed",inset:0,
      display:"flex",alignItems:"center",justifyContent:"center",
      fontFamily:"'Courier New',monospace",overflow:"hidden",userSelect:"none",
    }}>
      <Starfield />

      <div style={{
        position:"relative",zIndex:1,
        width:"100vw",height:"100vh",
        display:"flex",flexDirection:"column",overflow:"hidden",
        boxShadow: wrongFlash?"inset 0 0 0 3px rgba(255,60,40,0.7)":"none",
        transform: shake?"translate(3px,-2px)":"none",
        transition:"transform 0.05s",
      }}>

        {/* ── HUD ── */}
        {screen==="playing" && (
          <div style={{
            display:"flex",justifyContent:"space-between",alignItems:"center",
            padding:"10px 18px",
            background:"rgba(4,3,10,0.7)",
            borderBottom:"1px solid rgba(0,229,255,0.12)",
            flexShrink:0,zIndex:10,
          }}>
            <div style={{display:"flex",gap:20,alignItems:"center"}}>
              <div>
                <div style={{fontSize:9,color:"#2a6a7a",letterSpacing:2}}>SCORE</div>
                <div style={{fontSize:20,color:"#00e5ff",fontWeight:700}}>{score}</div>
              </div>
              <div>
                <div style={{fontSize:9,color:"#2a6a7a",letterSpacing:2}}>WAVE</div>
                <div style={{fontSize:20,color:"#e8e3d4",fontWeight:700}}>{wave}</div>
              </div>
              <div>
                <div style={{fontSize:9,color:"#2a6a7a",letterSpacing:2}}>COMBO</div>
                <div style={{fontSize:20,color:combo>4?"#fb923c":"#e8e3d4",fontWeight:700}}>x{combo}</div>
              </div>
              <div style={{
                fontSize:9,padding:"2px 8px",borderRadius:10,
                border:"1px solid rgba(0,229,255,0.2)",color:"#2a7a8a",letterSpacing:1,
              }}>{gameMode==="trading"?"TRADING":"ENGLISH"} · {DIFFICULTIES[difficulty].label}</div>
            </div>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{display:"flex",gap:5}}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{
                    width:13,height:13,borderRadius:"50%",
      
