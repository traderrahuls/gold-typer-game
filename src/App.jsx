import { useState, useEffect, useRef, useCallback } from "react";

// ── WORD BANKS ────────────────────────────────────────────────────────────────
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

function buildWaves(bank) {
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  const waves = []; let i = 0, wn = 1;
  while (i < shuffled.length) {
    const count = Math.min(4 + wn, 8, shuffled.length - i);
    waves.push({ num: wn, words: shuffled.slice(i, i + count) });
    i += count; wn++;
  }
  return waves;
}

function parseCustomText(text) {
  const words = text.toLowerCase().replace(/[^a-z\s]/g,"").split(/\s+/).filter(w => w.length >= 2 && w.length <= 14);
  if (words.length < 4) return null;
  const waves = []; let i = 0, wn = 1;
  while (i < words.length) {
    const count = Math.min(4 + wn, 8, words.length - i);
    waves.push({ num: wn, words: words.slice(i, i + count) });
    i += count; wn++;
  }
  return waves;
}

const KEY_ROWS = [
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l"],
  ["z","x","c","v","b","n","m"],
];

const DIFFICULTIES = {
  easy:   { speed: 28, label: "Easy",   color: "#10B981" },
  normal: { speed: 48, label: "Normal", color: "#F59E0B" },
  hard:   { speed: 78, label: "Hard",   color: "#EF4444" },
};

// GigiLife color palette
const G = {
  bg:       "#0f1729",
  bgCard:   "#1a2540",
  bgDark:   "#0a1020",
  blue:     "#2563EB",
  green:    "#10B981",
  yellow:   "#F59E0B",
  purple:   "#8B5CF6",
  red:      "#EF4444",
  white:    "#FFFFFF",
  textDim:  "rgba(255,255,255,0.5)",
  textMid:  "rgba(255,255,255,0.75)",
  border:   "rgba(255,255,255,0.1)",
  accent:   "#00e5cc",
};

let eid=0, pid=0, bid=0;

// ── AUDIO (safe MP3 + WebAudio SFX) ──────────────────────────────────────────
function useAudio(volume, muted) {
  const ctxR  = useRef(null);
  const mastR = useRef(null);
  const audioR = useRef(null);
  const volR  = useRef(volume);
  const mutR  = useRef(muted);

  useEffect(() => { volR.current = volume; if (audioR.current) audioR.current.volume = muted ? 0 : Math.min(volume,1); }, [volume, muted]);
  useEffect(() => { mutR.current = muted; if (audioR.current) audioR.current.volume = muted ? 0 : Math.min(volR.current,1); }, [muted]);

  const getCtx = useCallback(() => {
    if (!ctxR.current) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctxR.current = new AC();
        mastR.current = ctxR.current.createGain();
        mastR.current.gain.value = 0.25;
        mastR.current.connect(ctxR.current.destination);
      } catch(e) { return null; }
    }
    try { if (ctxR.current.state === "suspended") ctxR.current.resume(); } catch(e) {}
    return ctxR.current;
  }, []);

  const tone = useCallback((freq, dur, type, g0, f1) => {
    if (mutR.current) return;
    try {
      const c = getCtx(); if (!c) return;
      const o = c.createOscillator(), g = c.createGain();
      o.type = type || "sine";
      o.frequency.setValueAtTime(freq, c.currentTime);
      if (f1) o.frequency.exponentialRampToValueAtTime(Math.max(f1,1), c.currentTime+dur);
      g.gain.setValueAtTime(g0||0.2, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime+dur);
      o.connect(g); g.connect(mastR.current);
      o.start(); o.stop(c.currentTime+dur);
    } catch(e) {}
  }, [getCtx]);

  const startMusic = useCallback(() => {
    try {
      if (audioR.current) return;
      const a = new Audio();
      a.src = "/Chill_Relaxing_Lofi_Hip_Hop_Instrumental_-_Starstruck_256k_.mp3";
      a.loop = true;
      a.preload = "none";
      a.volume = mutR.current ? 0 : Math.min(volR.current, 1);
      audioR.current = a;
      setTimeout(() => { try { a.play().catch(()=>{}); } catch(e){} }, 800);
    } catch(e) {}
  }, []);

  const stopMusic = useCallback(() => {
    try {
      if (audioR.current) {
        audioR.current.pause();
        audioR.current.currentTime = 0;
        audioR.current = null;
      }
    } catch(e) {}
  }, []);

  const sfx = {
    type:     useCallback(()=>tone(700,0.04,"square",0.08),[tone]),
    shoot:    useCallback(()=>tone(900,0.07,"sawtooth",0.07,420),[tone]),
    explode:  useCallback(()=>{tone(180,0.15,"triangle",0.18,38);setTimeout(()=>tone(88,0.09,"square",0.08,28),28);},[tone]),
    miss:     useCallback(()=>tone(140,0.25,"sawtooth",0.14,55),[tone]),
    wrong:    useCallback(()=>tone(210,0.06,"square",0.07,95),[tone]),
    waveClear:useCallback(()=>{tone(440,0.09,"sine",0.15);setTimeout(()=>tone(550,0.1,"sine",0.15),80);setTimeout(()=>tone(660,0.13,"sine",0.17),160);setTimeout(()=>tone(880,0.18,"sine",0.18),250);},[tone]),
    gameOver: useCallback(()=>{tone(260,0.17,"sawtooth",0.14,110);setTimeout(()=>tone(150,0.24,"sawtooth",0.14,50),130);setTimeout(()=>tone(75,0.38,"sawtooth",0.12,22),290);},[tone]),
  };

  return { sfx, startMusic, stopMusic, getCtx };
}

// ── STARFIELD ─────────────────────────────────────────────────────────────────
function Starfield() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ctx = el.getContext("2d");
    const STARS = Array.from({length:180}, ()=>({x:Math.random(),y:Math.random(),z:Math.random(),pz:Math.random()}));
    let raf;
    const draw = () => {
      el.width = window.innerWidth; el.height = window.innerHeight;
      ctx.fillStyle = "#0f1729"; ctx.fillRect(0,0,el.width,el.height);
      const cx=el.width/2, cy=el.height/2;
      STARS.forEach(s=>{
        s.pz=s.z; s.z-=0.003;
        if(s.z<=0){s.x=Math.random();s.y=Math.random();s.z=1;s.pz=1;}
        const sx=(s.x-0.5)/s.z*el.width+cx, sy=(s.y-0.5)/s.z*el.height+cy;
        const px=(s.x-0.5)/s.pz*el.width+cx, py=(s.y-0.5)/s.pz*el.height+cy;
        const sz=Math.max(0.3,(1-s.z)*2); const op=Math.min(1,(1-s.z)*1.4);
        ctx.beginPath(); ctx.strokeStyle=`rgba(148,180,255,${op*0.6})`; ctx.lineWidth=sz;
        ctx.moveTo(px,py); ctx.lineTo(sx,sy); ctx.stroke();
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,width:"100%",height:"100%",zIndex:0,pointerEvents:"none"}}/>;
}

// ── SPLASH SCREEN ─────────────────────────────────────────────────────────────
function SplashScreen({ onDone }) {
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    setTimeout(() => setOpacity(1), 100);
    setTimeout(() => { setOpacity(0); setTimeout(onDone, 600); }, 2200);
  }, [onDone]);
  return (
    <div style={{ position:"fixed",inset:0,zIndex:100,background:"linear-gradient(160deg,#0f1729 0%,#1a2570 50%,#0f1729 100%)", display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center", opacity, transition:"opacity 0.6s" }}>
      <Starfield />
      <div style={{position:"relative",zIndex:1,textAlign:"center"}}>
        <div style={{ fontSize:72,fontWeight:900,fontFamily:"'Poppins',Georgia,sans-serif",marginBottom:8,
          background:"linear-gradient(135deg,#4299e1,#10B981,#F59E0B,#EF4444)",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
          filter:"drop-shadow(0 0 30px rgba(66,153,225,0.5))",
        }}>GigiLife</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,0.7)",letterSpacing:4,marginBottom:32}}>LEARN & PLAY</div>
        <div style={{display:"flex",gap:24,justifyContent:"center",marginBottom:32}}>
          {["Play Smart","Learn Faster","Grow Better"].map(t=>(
            <div key={t} style={{fontSize:11,color:"rgba(255,255,255,0.5)",letterSpacing:1}}>{t}</div>
          ))}
        </div>
        <div style={{width:48,height:4,borderRadius:2,background:"rgba(255,255,255,0.2)",margin:"0 auto",overflow:"hidden"}}>
          <div style={{height:"100%",background:"linear-gradient(90deg,#2563EB,#10B981)",animation:"load 2s linear forwards"}} />
        </div>
      </div>
      <style>{`@keyframes load{from{width:0}to{width:100%}}`}</style>
    </div>
  );
}

// ── HOME DASHBOARD ─────────────────────────────────────────────────────────────
function HomeDashboard({ onPlay, totalScore, gamesPlayed }) {
  const games = [
    { id:"typing", icon:"⌨️", name:"Typing Blaster", desc:"Type to shoot!", color:"#2563EB", available:true },
    { id:"quiz",   icon:"❓", name:"Quiz Arena",     desc:"Test knowledge", color:"#F59E0B", available:false },
    { id:"math",   icon:"🔢", name:"Math Master",    desc:"Number skills",  color:"#10B981", available:false },
    { id:"words",  icon:"📖", name:"English Words",  desc:"Build vocab",    color:"#8B5CF6", available:false },
    { id:"science",icon:"🔬", name:"Science Lab",    desc:"Explore science",color:"#06B6D4", available:false },
    { id:"chess",  icon:"♟️", name:"Chess",          desc:"Strategy game",  color:"#64748B", available:false },
    { id:"tictac", icon:"⭕", name:"Tic Tac Toe",    desc:"Classic game",   color:"#EF4444", available:false },
    { id:"memory", icon:"🧠", name:"Memory Match",   desc:"Train memory",   color:"#EC4899", available:false },
  ];

  return (
    <div style={{ position:"absolute",inset:0,overflowY:"auto",padding:"16px 14px 24px" }}>
      {/* Header */}
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
        <div>
          <div style={{ fontSize:11,color:G.textDim,letterSpacing:1 }}>WELCOME TO</div>
          <div style={{ fontSize:26,fontWeight:900,color:G.white, background:"linear-gradient(135deg,#4299e1,#10B981)", WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>GigiLife</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:9,color:G.textDim,letterSpacing:1,marginBottom:4 }}>LEARN & PLAY</div>
          <div style={{ display:"flex",gap:10 }}>
            <div style={{ background:"rgba(245,158,11,0.15)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:20,padding:"4px 12px",fontSize:11,color:"#F59E0B",fontWeight:700 }}>⭐ {totalScore}</div>
            <div style={{ background:"rgba(16,185,129,0.15)",border:"1px solid rgba(16,185,129,0.3)",borderRadius:20,padding:"4px 12px",fontSize:11,color:"#10B981",fontWeight:700 }}>🎮 {gamesPlayed}</div>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div style={{ display:"flex",gap:16,marginBottom:20,justifyContent:"center" }}>
        {[{icon:"📚",label:"Learn",sub:"सीखें",color:"#2563EB"},{icon:"🎮",label:"Play",sub:"खेलें",color:"#10B981"},{icon:"📈",label:"Grow",sub:"बढ़ें",color:"#F59E0B"}].map(item=>(
          <div key={item.label} style={{ flex:1,background:G.bgCard,border:"1px solid "+G.border,borderRadius:12,padding:"10px 8px",textAlign:"center" }}>
            <div style={{fontSize:20,marginBottom:4}}>{item.icon}</div>
            <div style={{fontSize:11,fontWeight:700,color:item.color}}>{item.label}</div>
            <div style={{fontSize:9,color:G.textDim}}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Daily Challenge */}
      <div style={{ background:"linear-gradient(135deg,#F59E0B22,#EF444422)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:14,padding:"14px 16px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <div>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
            <span style={{fontSize:18}}>🔥</span>
            <span style={{fontSize:13,fontWeight:700,color:G.white}}>Daily Challenge</span>
          </div>
          <div style={{fontSize:11,color:G.textDim}}>Play daily & win rewards!</div>
        </div>
        <button onClick={()=>onPlay("english","normal")} style={{ background:"linear-gradient(135deg,#F59E0B,#EF4444)",color:G.white,border:"none",padding:"8px 18px",borderRadius:20,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>Play →</button>
      </div>

      {/* Games Grid */}
      <div style={{ fontSize:11,color:G.textDim,letterSpacing:2,marginBottom:12 }}>PLAY & LEARN</div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20 }}>
        {games.map(game=>(
          <div key={game.id}
            onClick={()=>game.available && onPlay("english","normal")}
            style={{
              background:game.available?`linear-gradient(135deg,${game.color}22,${game.color}11)`:G.bgCard,
              border:`1px solid ${game.available?game.color+"44":G.border}`,
              borderRadius:14,padding:"14px 12px",cursor:game.available?"pointer":"default",
              position:"relative",overflow:"hidden",
              opacity:game.available?1:0.6,
            }}>
            {!game.available && (
              <div style={{ position:"absolute",top:8,right:8,fontSize:8,background:"rgba(255,255,255,0.1)",padding:"2px 6px",borderRadius:8,color:G.textDim,letterSpacing:1 }}>SOON</div>
            )}
            <div style={{fontSize:28,marginBottom:8}}>{game.icon}</div>
            <div style={{fontSize:12,fontWeight:700,color:game.available?G.white:G.textMid,marginBottom:3}}>{game.name}</div>
            <div style={{fontSize:10,color:G.textDim}}>{game.desc}</div>
            {game.available && (
              <div style={{ marginTop:8,display:"inline-block",background:game.color,borderRadius:10,padding:"2px 10px",fontSize:9,fontWeight:700,color:G.white }}>PLAY NOW</div>
            )}
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
        {[
          {icon:"🏆",label:"Win Rewards",desc:"Earn coins & badges",color:"#F59E0B"},
          {icon:"📊",label:"Track Progress",desc:"View performance",color:"#10B981"},
          {icon:"🥇",label:"Leaderboard",desc:"Top players",color:"#2563EB"},
          {icon:"🛡️",label:"Safe & Secure",desc:"Kid friendly",color:"#8B5CF6"},
        ].map(f=>(
          <div key={f.label} style={{ background:G.bgCard,border:"1px solid "+G.border,borderRadius:10,padding:"10px 12px",display:"flex",gap:10,alignItems:"center" }}>
            <span style={{fontSize:18}}>{f.icon}</span>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:f.color}}>{f.label}</div>
              <div style={{fontSize:9,color:G.textDim}}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN GAME ─────────────────────────────────────────────────────────────────
export default function GiglifeGame() {
  const [showSplash, setShowSplash]     = useState(true);
  const [screen, setScreen]             = useState("home");
  const [gameMode, setGameMode]         = useState("english");
  const [difficulty, setDifficulty]     = useState("normal");
  const [customText, setCustomText]     = useState("");
  const [customError, setCustomError]   = useState("");
  const [waves, setWaves]               = useState([]);
  const [waveIdx, setWaveIdx]           = useState(0);
  const [enemies, setEnemies]           = useState([]);
  const [typed, setTyped]               = useState("");
  const [score, setScore]               = useState(0);
  const [totalScore, setTotalScore]     = useState(0);
  const [gamesPlayed, setGamesPlayed]   = useState(0);
  const [lives, setLives]               = useState(3);
  const [particles, setParticles]       = useState([]);
  const [bullets, setBullets]           = useState([]);
  const [combo, setCombo]               = useState(0);
  const [bestCombo, setBestCombo]       = useState(0);
  const [highScore, setHighScore]       = useState(0);
  const [shake, setShake]               = useState(false);
  const [muted, setMuted]               = useState(false);
  const [volume, setVolume]             = useState(0.8);
  const [activeKey, setActiveKey]       = useState(null);
  const [wrongFlash, setWrongFlash]     = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [wordHint, setWordHint]         = useState("");
  const [waveScore, setWaveScore]       = useState(0);

  const { sfx, startMusic, stopMusic, getCtx } = useAudio(volume, muted);

  const areaRef  = useRef(null);
  const rafRef   = useRef(null);
  const spawnQ   = useRef([]);
  const spawnT   = useRef(0);
  const lastT    = useRef(0);
  const W        = useRef(800);
  const H        = useRef(500);
  const gSt      = useRef({score:0,lives:3});
  const speedR   = useRef(48);
  const missS    = useRef(0);
  const waveIdxR = useRef(0);
  const wavesR   = useRef([]);
  const scoreR   = useRef(0);

  useEffect(()=>{gSt.current={score,lives};},[score,lives]);
  useEffect(()=>{scoreR.current=score;},[score]);

  const measure = useCallback(()=>{
    if(areaRef.current){W.current=areaRef.current.clientWidth;H.current=areaRef.current.clientHeight;}
  },[]);
  useEffect(()=>{measure();window.addEventListener("resize",measure);return()=>window.removeEventListener("resize",measure);},[measure]);

  const startWave = useCallback((waveList, idx, diff) => {
    if(rafRef.current) cancelAnimationFrame(rafRef.current);
    eid=0;pid=0;bid=0;
    setEnemies([]);setParticles([]);setBullets([]);
    setTyped("");setWordHint("");missS.current=0;
    speedR.current=DIFFICULTIES[diff].speed;
    spawnQ.current=[...waveList[idx].words];
    spawnT.current=0;lastT.current=performance.now();
    setScreen("playing");
  },[]);

  const launchGame = useCallback((mode, diff, customWaves) => {
    try { getCtx(); } catch(e) {}
    const bank = mode==="trading"?WORD_BANK_TRADING:WORD_BANK_ENGLISH;
    const waveList = customWaves || buildWaves(bank);
    wavesR.current=waveList; waveIdxR.current=0;
    setWaves(waveList); setWaveIdx(0);
    setScore(0); setLives(3); setCombo(0); setBestCombo(0); setWaveScore(0);
    setGameMode(mode); setDifficulty(diff);
    startMusic();
    startWave(waveList, 0, diff);
  },[getCtx,startMusic,startWave]);

  const goHome = useCallback(()=>{
    stopMusic();
    if(rafRef.current) cancelAnimationFrame(rafRef.current);
    setEnemies([]);setParticles([]);setBullets([]);
    setTyped("");setShowSettings(false);setWordHint("");
    setScreen("home");
  },[stopMusic]);

  const endGame = useCallback(()=>{
    sfx.gameOver(); stopMusic();
    setHighScore(h=>Math.max(h,scoreR.current));
    setTotalScore(t=>t+scoreR.current);
    setGamesPlayed(g=>g+1);
    setScreen("gameover");
  },[sfx,stopMusic]);

  const nextWave = useCallback(()=>{
    const nextIdx = waveIdxR.current+1;
    if(nextIdx>=wavesR.current.length){endGame();return;}
    waveIdxR.current=nextIdx; setWaveIdx(nextIdx); setWaveScore(0);
    startWave(wavesR.current, nextIdx, difficulty);
  },[difficulty,endGame,startWave]);

  const spawnFromQueue = useCallback(()=>{
    if(!spawnQ.current.length) return false;
    const word=spawnQ.current.shift();
    const margin=60;
    const x=margin+Math.random()*Math.max(1,W.current-margin*2);
    eid++;
    setEnemies(prev=>[...prev,{id:eid,word,x,y:-38,speed:speedR.current,hit:false}]);
    return true;
  },[]);

  useEffect(()=>{
    if(screen!=="playing") return;
    const loop=(time)=>{
      const dt=Math.min((time-lastT.current)/1000,0.05);
      lastT.current=time;
      spawnT.current-=dt;
      if(spawnT.current<=0&&spawnQ.current.length>0){
        spawnFromQueue();
        spawnT.current=0.9+Math.random()*0.5;
      }
      setEnemies(prev=>{
        const h=H.current||500;
        const next=[];let lost=0;
        for(const e of prev){
          if(e.hit) continue;
          const ny=e.y+e.speed*dt;
          if(ny>=h-52){lost++;continue;}
          next.push({...e,y:ny});
        }
        if(lost>0){
          sfx.miss();missS.current+=lost;
          if(missS.current>=2){speedR.current=Math.max(20,speedR.current-8);missS.current=0;}
          setLives(l=>{const nl=l-lost;if(nl<=0){setTimeout(()=>endGame(),0);return 0;}return nl;});
          setCombo(0);setTyped("");setWordHint("");
          setShake(true);setTimeout(()=>setShake(false),220);
        }
        if(spawnQ.current.length===0&&next.length===0&&prev.length>0){
          setTimeout(()=>{sfx.waveClear();setScreen("waveclear");},300);
        }
        return next;
      });
      setParticles(p=>p.map(x=>({...x,life:x.life-dt})).filter(x=>x.life>0));
      setBullets(p=>p.map(x=>({...x,life:x.life-dt*6})).filter(x=>x.life>0));
      rafRef.current=requestAnimationFrame(loop);
    };
    lastT.current=performance.now();
    rafRef.current=requestAnimationFrame(loop);
    return()=>{if(rafRef.current)cancelAnimationFrame(rafRef.current);};
  },[screen,spawnFromQueue,endGame,sfx]);

  const pressKey=useCallback((ch)=>{
    if(screen!=="playing") return;
    setActiveKey(ch);setTimeout(()=>setActiveKey(null),90);
    const next=typed+ch;
    setEnemies(prev=>{
      const cands=prev.filter(e=>e.word.startsWith(next));
      if(!cands.length){sfx.wrong();setWrongFlash(true);setTimeout(()=>setWrongFlash(false),130);return prev;}
      let tgt=cands[0];
      for(const c of cands){if(c.y>tgt.y)tgt=c;}
      const slowed=prev.map(e=>e.id===tgt.id?{...e,speed:Math.max(e.speed*0.5,8)}:e);
      bid++;
      setBullets(bs=>[...bs,{id:bid,fromX:W.current/2,fromY:H.current-52,toX:tgt.x,toY:tgt.y,life:1}]);
      sfx.shoot();
      if(tgt.word===next){
        sfx.explode();
        const pts=10+tgt.word.length*4+(waveIdxR.current+1)*3;
        setScore(s=>s+pts);setWaveScore(ws=>ws+pts);
        setCombo(c=>{const nc=c+1;setBestCombo(b=>Math.max(b,nc));return nc;});
        pid++;
        setParticles(ps=>[...ps,{id:pid,x:tgt.x,y:tgt.y,life:0.55,text:"+"+pts}]);
        setTyped("");setWordHint("");
        missS.current=0;speedR.current=Math.min(speedR.current+1.5,DIFFICULTIES[difficulty].speed*1.6);
        return slowed.map(e=>e.id===tgt.id?{...e,hit:true}:e);
      }
      if(gameMode==="english") setWordHint(tgt.word);
      setTyped(next);
      return slowed;
    });
  },[screen,typed,sfx,gameMode,difficulty]);

  const handleBS=useCallback(()=>setTyped(t=>t.slice(0,-1)),[]);
  const handleKey=useCallback((e)=>{
    if(screen==="waveclear"){if(e.key==="Enter"||e.key===" ")nextWave();return;}
    if(screen!=="playing") return;
    if(e.key==="Escape"){goHome();return;}
    if(e.key==="Backspace"){handleBS();return;}
    if(!/^[a-zA-Z]$/.test(e.key)) return;
    pressKey(e.key.toLowerCase());
  },[screen,pressKey,handleBS,goHome,nextWave]);

  useEffect(()=>{window.addEventListener("keydown",handleKey);return()=>window.removeEventListener("keydown",handleKey);},[handleKey]);
  useEffect(()=>{
    const hits=enemies.filter(e=>e.hit);if(!hits.length) return;
    const t=setTimeout(()=>setEnemies(p=>p.filter(e=>!e.hit)),160);
    return()=>clearTimeout(t);
  },[enemies]);

  const liveLetters=(()=>{const s=new Set();enemies.forEach(e=>{if(e.word.startsWith(typed)){const c=e.word[typed.length];if(c)s.add(c);}});return s;})();
  const indLetters=(()=>{const s=new Set();if(!typed.length)enemies.forEach(e=>s.add(e.word[0]));return s;})();
  const waveNum=String(waveIdx+1).padStart(3,"0");
  const scoreStr=String(score).padStart(6,"0");

  const SettingsPanel=()=>(
    <div style={{position:"absolute",inset:0,background:"rgba(10,16,32,0.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:30,gap:20,padding:24}}>
      <div style={{fontSize:18,fontWeight:700,color:G.white,marginBottom:4}}>⚙️ Settings</div>
      <div style={{width:"100%",maxWidth:320,background:G.bgCard,border:"1px solid "+G.border,borderRadius:16,padding:"20px 24px",display:"flex",flexDirection:"column",gap:18}}>
        <div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
            <span style={{fontSize:12,color:G.textMid,fontWeight:600}}>🔊 Volume</span>
            <span style={{fontSize:13,color:G.yellow,fontWeight:700}}>{Math.round(volume*100)}%</span>
          </div>
          <input type="range" min="0" max="1" step="0.05" value={volume} onChange={e=>setVolume(parseFloat(e.target.value))} style={{width:"100%",accentColor:G.blue}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:12,color:G.textMid,fontWeight:600}}>Mute All</span>
          <button onClick={()=>setMuted(m=>!m)} style={{background:muted?"rgba(239,68,68,0.15)":"rgba(16,185,129,0.15)",border:"1px solid "+(muted?"#EF4444":"#10B981"),borderRadius:20,color:muted?"#EF4444":"#10B981",padding:"6px 24px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{muted?"OFF":"ON"}</button>
        </div>
      </div>
      <div style={{display:"flex",gap:12}}>
        <button onClick={()=>setShowSettings(false)} style={{background:G.blue,color:G.white,border:"none",padding:"10px 32px",fontSize:13,fontWeight:700,borderRadius:10,cursor:"pointer",fontFamily:"inherit"}}>Resume</button>
        <button onClick={goHome} style={{background:"transparent",border:"1px solid "+G.border,borderRadius:10,color:G.textMid,padding:"10px 24px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Home</button>
      </div>
    </div>
  );

  return (
    <div style={{position:"fixed",inset:0,fontFamily:"'Poppins','Segoe UI',sans-serif",overflow:"hidden",userSelect:"none",background:G.bg}}>
      {showSplash && <SplashScreen onDone={()=>setShowSplash(false)}/>}
      <Starfield/>
      <div style={{position:"relative",zIndex:1,width:"100%",height:"100%",display:"flex",flexDirection:"column",overflow:"hidden",outline:wrongFlash?"2px solid "+G.red:"none",transform:shake?"translate(3px,-2px)":"none",transition:"transform 0.04s"}}>

        {/* HUD */}
        {(screen==="playing"||screen==="waveclear")&&(
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 16px",background:"rgba(10,16,32,0.9)",borderBottom:"1px solid "+G.border,flexShrink:0,zIndex:10}}>
            <div style={{display:"flex",gap:16,alignItems:"center"}}>
              <div style={{display:"flex",gap:4,alignItems:"center"}}>
                <span style={{fontSize:9,color:G.textDim,letterSpacing:2}}>WAVE</span>
                <span style={{fontSize:16,color:G.yellow,fontWeight:700}}>{waveNum}</span>
              </div>
              <div style={{display:"flex",gap:4,alignItems:"center"}}>
                <span style={{fontSize:9,color:G.textDim,letterSpacing:2}}>SCORE</span>
                <span style={{fontSize:16,color:G.white,fontWeight:700}}>{scoreStr}</span>
              </div>
              <div style={{display:"flex",gap:4,alignItems:"center"}}>
                <span style={{fontSize:9,color:G.textDim,letterSpacing:2}}>COMBO</span>
                <span style={{fontSize:16,color:combo>4?G.yellow:G.white,fontWeight:700}}>×{combo}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <div style={{display:"flex",gap:4}}>
                {[0,1,2].map(i=><div key={i} style={{width:12,height:12,borderRadius:"50%",background:i<lives?G.yellow:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",transition:"all 0.3s",boxShadow:i<lives?"0 0 8px "+G.yellow:"none"}}/>)}
              </div>
              <button onClick={()=>setShowSettings(true)} style={{background:"rgba(255,255,255,0.08)",border:"1px solid "+G.border,borderRadius:8,color:G.textMid,fontSize:16,width:32,height:32,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>⚙</button>
            </div>
          </div>
        )}

        {/* Game Area */}
        <div ref={areaRef} style={{flex:1,position:"relative",overflow:"hidden",minHeight:0}}>
          {showSettings&&screen==="playing"&&<SettingsPanel/>}

          {/* HOME */}
          {screen==="home"&&(
            <HomeDashboard
              onPlay={(mode,diff)=>launchGame(mode,diff,null)}
              totalScore={totalScore}
              gamesPlayed={gamesPlayed}
            />
          )}

          {/* GAME SELECT */}
          {screen==="gameselect"&&(
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px 16px",overflowY:"auto"}}>
              <div style={{fontSize:18,fontWeight:700,color:G.white,marginBottom:20}}>⌨️ Typing Blaster</div>

              <div style={{width:"100%",maxWidth:360,marginBottom:16}}>
                <div style={{fontSize:10,color:G.textDim,letterSpacing:2,marginBottom:10}}>MODE</div>
                <div style={{display:"flex",gap:10}}>
                  {[{key:"english",label:"📚 English",desc:"Learn words"},{key:"trading",label:"📈 Trading",desc:"Trading terms"}].map(m=>(
                    <button key={m.key} onClick={()=>setGameMode(m.key)} style={{flex:1,padding:"10px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:700,border:"1px solid "+(gameMode===m.key?G.blue:G.border),background:gameMode===m.key?"rgba(37,99,235,0.15)":G.bgCard,color:gameMode===m.key?G.blue:G.textMid,transition:"all 0.2s"}}>
                      <div>{m.label}</div><div style={{fontSize:9,opacity:0.6,marginTop:3}}>{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{width:"100%",maxWidth:360,marginBottom:24}}>
                <div style={{fontSize:10,color:G.textDim,letterSpacing:2,marginBottom:10}}>DIFFICULTY</div>
                <div style={{display:"flex",gap:8}}>
                  {Object.entries(DIFFICULTIES).map(([key,val])=>(
                    <button key={key} onClick={()=>setDifficulty(key)} style={{flex:1,padding:"9px 8px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:700,border:"1px solid "+(difficulty===key?val.color:G.border),background:difficulty===key?val.color+"22":G.bgCard,color:difficulty===key?val.color:G.textMid,transition:"all 0.2s"}}>{val.label}</button>
                  ))}
                </div>
              </div>

              <div style={{display:"flex",gap:10,width:"100%",maxWidth:360}}>
                <button onClick={()=>launchGame(gameMode,difficulty,null)} style={{flex:1,background:"linear-gradient(135deg,"+G.blue+","+G.purple+")",color:G.white,border:"none",padding:"14px",fontSize:15,fontWeight:700,letterSpacing:2,borderRadius:12,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 0 20px rgba(37,99,235,0.3)"}}>START</button>
                <button onClick={()=>setScreen("loadtext")} style={{background:G.bgCard,border:"1px solid "+G.border,color:G.textMid,padding:"14px 16px",fontSize:12,fontWeight:600,borderRadius:12,cursor:"pointer",fontFamily:"inherit"}}>📝 Load Text</button>
              </div>

              <button onClick={goHome} style={{marginTop:16,background:"transparent",border:"none",color:G.textDim,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>← Back to Home</button>
            </div>
          )}

          {/* LOAD TEXT */}
          {screen==="loadtext"&&(
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px 16px",overflowY:"auto"}}>
              <div style={{fontSize:16,fontWeight:700,color:G.white,marginBottom:8}}>📝 Load Your Own Text</div>
              <div style={{fontSize:11,color:G.textDim,marginBottom:16,textAlign:"center",maxWidth:340,lineHeight:1.7}}>Paste any text — each word becomes an enemy!<br/>Perfect for students to practice their lessons.</div>
              <textarea value={customText} onChange={e=>{setCustomText(e.target.value);setCustomError("");}} placeholder="Paste your text here..." style={{width:"100%",maxWidth:400,height:150,background:G.bgCard,border:"1px solid "+G.border,borderRadius:12,color:G.white,fontSize:13,padding:"12px",fontFamily:"inherit",resize:"vertical",outline:"none",lineHeight:1.6}}/>
              {customError&&<div style={{color:G.red,fontSize:11,marginTop:8}}>{customError}</div>}
              <div style={{display:"flex",gap:10,marginTop:16}}>
                <button onClick={()=>{const w=parseCustomText(customText);if(!w){setCustomError("Too few words! Need at least 8 words.");return;}launchGame(gameMode,difficulty,w);}} style={{background:G.green,color:G.white,border:"none",padding:"11px 32px",fontSize:13,fontWeight:700,borderRadius:10,cursor:"pointer",fontFamily:"inherit"}}>Play!</button>
                <button onClick={()=>setScreen("gameselect")} style={{background:G.bgCard,border:"1px solid "+G.border,borderRadius:10,color:G.textMid,padding:"11px 20px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Back</button>
              </div>
            </div>
          )}

          {/* PLAYING */}
          {screen==="playing"&&(<>
            {enemies.map(e=>{
              const isTgt=e.word.startsWith(typed)&&typed.length>0;
              const isInd=!isTgt&&!typed.length&&indLetters.has(e.word[0]);
              const tp=isTgt?typed:"";const rp=isTgt?e.word.slice(typed.length):e.word;
              return(
                <div key={e.id} style={{position:"absolute",left:e.x,top:e.y,transform:`translate(-50%,-50%) scale(${e.hit?1.8:1})`,opacity:e.hit?0:1,transition:e.hit?"opacity 0.15s,transform 0.15s":"none",fontSize:15,fontWeight:700,padding:"5px 12px",borderRadius:6,background:isTgt?"rgba(37,99,235,0.2)":"rgba(10,16,32,0.88)",border:"1px solid "+(isTgt?G.blue:isInd?"rgba(37,99,235,0.35)":G.border),whiteSpace:"nowrap",pointerEvents:"none",boxShadow:isTgt?"0 0 16px rgba(37,99,235,0.3)":"none",letterSpacing:1}}>
                  {isInd&&<div style={{position:"absolute",top:-8,left:"50%",transform:"translateX(-50%)",width:4,height:4,borderRadius:"50%",background:G.blue,boxShadow:"0 0 6px "+G.blue}}/>}
                  <span style={{color:G.yellow}}>{tp}</span>
                  <span style={{color:isTgt?G.white:isInd?"rgba(37,99,235,0.7)":"rgba(148,180,255,0.4)"}}>{rp}</span>
                </div>
              );
            })}
            {particles.map(p=><div key={p.id} style={{position:"absolute",left:p.x,top:p.y,transform:"translate(-50%,-50%)",color:G.green,fontWeight:700,fontSize:14,opacity:Math.max(p.life*2,0),pointerEvents:"none",textShadow:"0 0 8px "+G.green}}>{p.text}</div>)}
            <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",overflow:"visible"}}>
              <defs><filter id="gl"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
              {bullets.map(b=>{const t=1-Math.max(b.life,0);const prog=Math.min(t,1);const cx2=b.fromX+(b.toX-b.fromX)*prog;const cy2=b.fromY+(b.toY-b.fromY)*prog;const tx=b.fromX+(b.toX-b.fromX)*Math.max(prog-0.16,0);const ty=b.fromY+(b.toY-b.fromY)*Math.max(prog-0.16,0);return<line key={b.id} x1={tx} y1={ty} x2={cx2} y2={cy2} stroke={G.blue} strokeWidth={2} strokeLinecap="round" opacity={Math.min(b.life*1.5,1)} filter="url(#gl)"/>;})}
            </svg>
            <div style={{position:"absolute",left:"50%",bottom:10,transform:"translateX(-50%)",pointerEvents:"none",filter:"drop-shadow(0 0 12px rgba(37,99,235,0.8))"}}>
              <svg viewBox="0 0 60 60" width="36" height="36">
                <polygon points="30,2 44,42 30,32 16,42" fill={G.blue} stroke="#aaccff" strokeWidth="0.8"/>
                <polygon points="30,2 37,30 30,24 23,30" fill="#ffffff" opacity="0.9"/>
                <circle cx="30" cy="20" r="3.5" fill={G.bgDark} opacity="0.8"/>
                <polygon points="16,42 10,56 22,46" fill="#1a3a8a"/>
                <polygon points="44,42 50,56 38,46" fill="#1a3a8a"/>
              </svg>
            </div>
            <div style={{position:"absolute",left:0,right:0,bottom:50,height:1,background:"linear-gradient(90deg,transparent,rgba(239,68,68,0.5),transparent)"}}/>
          </>)}

          {/* WAVE CLEAR */}
          {screen==="waveclear"&&(
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"flex-start",justifyContent:"center",padding:"0 28px"}}>
              <div style={{fontSize:11,color:G.yellow,letterSpacing:4,marginBottom:8}}>COMPLETED</div>
              <div style={{fontSize:36,fontWeight:900,color:G.white,marginBottom:4}}>WAVE {waveNum} CLEAR!</div>
              <div style={{fontSize:14,color:G.textDim,letterSpacing:2,marginBottom:28}}>+{waveScore} pts this wave</div>
              <button onClick={nextWave} style={{background:"linear-gradient(135deg,"+G.blue+","+G.purple+")",color:G.white,border:"none",padding:"12px 36px",fontSize:14,fontWeight:700,letterSpacing:2,borderRadius:12,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 0 20px rgba(37,99,235,0.3)"}}>
                {waveIdx+1<waves.length?"NEXT WAVE →":"FINISH"}
              </button>
            </div>
          )}

          {/* GAME OVER */}
          {screen==="gameover"&&(
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:28,background:"rgba(10,16,32,0.94)"}}>
              <div style={{fontSize:11,letterSpacing:4,color:G.red,marginBottom:12}}>GAME OVER</div>
              <div style={{fontSize:52,fontWeight:900,color:G.white,marginBottom:4,letterSpacing:2}}>{scoreStr}</div>
              <div style={{fontSize:11,color:G.textDim,letterSpacing:3,marginBottom:24}}>FINAL SCORE</div>
              <div style={{display:"flex",gap:24,marginBottom:28,flexWrap:"wrap",justifyContent:"center"}}>
                {[{label:"BEST COMBO",val:"×"+bestCombo,color:G.yellow},{label:"HIGH SCORE",val:String(highScore).padStart(6,"0"),color:G.blue},{label:"WAVE",val:waveNum,color:G.white}].map(s=>(
                  <div key={s.label} style={{background:G.bgCard,border:"1px solid "+G.border,borderRadius:12,padding:"10px 16px"}}>
                    <div style={{fontSize:9,color:G.textDim,letterSpacing:2,marginBottom:4}}>{s.label}</div>
                    <div style={{fontSize:18,color:s.color,fontWeight:700}}>{s.val}</div>
                  </div>
                ))}
              </div>
              <button onClick={()=>launchGame(gameMode,difficulty,null)} style={{background:"linear-gradient(135deg,"+G.blue+","+G.purple+")",color:G.white,border:"none",padding:"12px 44px",fontSize:14,fontWeight:700,letterSpacing:2,borderRadius:12,cursor:"pointer",fontFamily:"inherit",marginBottom:12,boxShadow:"0 0 20px rgba(37,99,235,0.3)"}}>PLAY AGAIN</button>
              <button onClick={goHome} style={{background:"transparent",border:"1px solid "+G.border,borderRadius:10,color:G.textDim,padding:"9px 28px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>🏠 Home</button>
            </div>
          )}
        </div>

        {/* TYPED DISPLAY */}
        {screen==="playing"&&(
          <div style={{padding:"6px 16px",background:"rgba(10,16,32,0.9)",borderTop:"1px solid "+G.border,minHeight:34,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
            <span style={{fontSize:17,letterSpacing:3,color:G.blue,fontWeight:700}}>
              {typed||"\u00A0"}<span style={{opacity:0.4,animation:"blink 1s infinite"}}>_</span>
            </span>
            {gameMode==="english"&&wordHint&&<span style={{fontSize:11,color:G.textDim}}>→ <span style={{color:"rgba(37,99,235,0.7)"}}>{wordHint}</span></span>}
          </div>
        )}

        {/* KEYBOARD */}
        {screen==="playing"&&(
          <div style={{padding:"8px 8px 12px",background:"rgba(10,16,32,0.95)",borderTop:"1px solid "+G.border,flexShrink:0}}>
            {KEY_ROWS.map((row,ri)=>(
              <div key={ri} style={{display:"flex",justifyContent:"center",gap:5,marginBottom:5,paddingLeft:ri===1?18:ri===2?36:0,paddingRight:ri===1?18:ri===2?36:0}}>
                {row.map(k=>{
                  const live=liveLetters.has(k),ind=!live&&indLetters.has(k),act=activeKey===k;
                  return(
                    <button key={k} onPointerDown={e=>{e.preventDefault();pressKey(k);}} style={{flex:1,maxWidth:42,minWidth:22,height:46,borderRadius:8,fontWeight:700,fontSize:14,textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",touchAction:"manipulation",transition:"all 0.06s",border:"1px solid "+(act||live?G.blue:ind?"rgba(37,99,235,0.3)":"rgba(255,255,255,0.08)"),background:act?G.blue:live?"rgba(37,99,235,0.2)":ind?"rgba(37,99,235,0.07)":"rgba(255,255,255,0.04)",color:act?G.white:live?G.blue:ind?"rgba(37,99,235,0.6)":"rgba(255,255,255,0.25)",boxShadow:act?"0 0 12px rgba(37,99,235,0.5)":live?"0 0 6px rgba(37,99,235,0.2)":"none"}}>{k}</button>
                  );
                })}
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"center",marginTop:4}}>
              <button onPointerDown={e=>{e.preventDefault();handleBS();}} style={{width:160,height:40,borderRadius:8,border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.3)",fontSize:12,fontWeight:700,letterSpacing:1,cursor:"pointer",fontFamily:"inherit",touchAction:"manipulation"}}>⌫ BACKSPACE</button>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes blink{0%,50%{opacity:1}51%,100%{opacity:0}}*{box-sizing:border-box}body{margin:0;overflow:hidden}`}</style>
    </div>
  );
}
