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
  { name:"BEGINNER", color:"#7dd3fc", minScore:0 },
  { name:"LEARNER",  color:"#4ade80", minScore:150 },
  { name:"SPEAKER",  color:"#facc15", minScore:400 },
  { name:"FLUENT",   color:"#fb923c", minScore:800 },
  { name:"MASTER",   color:"#f87171", minScore:1400 },
];

const KEY_ROWS = [
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l"],
  ["z","x","c","v","b","n","m"],
];

const DIFFICULTIES = {
  easy:   { baseSpeed:7,  spawnInterval:2.4, label:"EASY" },
  normal: { baseSpeed:13, spawnInterval:1.8, label:"NORMAL" },
  hard:   { baseSpeed:20, spawnInterval:1.2, label:"HARD" },
};

function getTier(score) {
  let tier = TIERS[0];
  for (const t of TIERS) { if (score >= t.minScore) tier = t; }
  return tier;
}

function randomWord(bank, usedRecently) {
  let w; let tries = 0;
  do { w = bank[Math.floor(Math.random()*bank.length)]; tries++; }
  while (usedRecently.includes(w) && tries < 8);
  return w;
}

let eid=0, pid=0, bid=0;

function useAudio() {
  const ctxR=useRef(null), mastR=useRef(null), musicTimer=useRef(null);
  const mutedR=useRef(false), volR=useRef(0.35);

  const ctx=useCallback(()=>{
    if (!ctxR.current) {
      const AC=window.AudioContext||window.webkitAudioContext;
      if (!AC) return null;
      ctxR.current=new AC();
      mastR.current=ctxR.current.createGain();
      mastR.current.gain.value=0.35;
      mastR.current.connect(ctxR.current.destination);
    }
    if (ctxR.current.state==="suspended") ctxR.current.resume();
    return ctxR.current;
  },[]);

  const tone=useCallback((freq,dur,type,g0,f1)=>{
    if (mutedR.current) return;
    const c=ctx(); if (!c) return;
    const o=c.createOscillator(), g=c.createGain();
    o.type=type||"sine";
    o.frequency.setValueAtTime(freq,c.currentTime);
    if (f1) o.frequency.exponentialRampToValueAtTime(Math.max(f1,1),c.currentTime+dur);
    g.gain.setValueAtTime(g0||0.3,c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+dur);
    o.connect(g); g.connect(mastR.current);
    o.start(); o.stop(c.currentTime+dur);
  },[ctx]);

  const startMusic=useCallback(()=>{
    const c=ctx(); if (!c||musicTimer.current) return;
    const mg=c.createGain(); mg.gain.value=0.07; mg.connect(mastR.current);
    const scale=[130.81,146.83,164.81,174.61,196.00,220.00,246.94,261.63];
    let step=0;
    const tick=()=>{
      if (!mutedR.current) {
        const o=c.createOscillator(), g=c.createGain();
        o.type="triangle";
        o.frequency.value=scale[step%scale.length]*(step%16<8?1:1.5);
        g.gain.setValueAtTime(0.001,c.currentTime);
        g.gain.linearRampToValueAtTime(0.1,c.currentTime+0.05);
        g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.42);
        o.connect(g); g.connect(mg);
        o.start(); o.stop(c.currentTime+0.45);
        step++;
      }
      musicTimer.current=setTimeout(tick,520);
    };
    tick();
  },[ctx]);

  const stopMusic=useCallback(()=>{
    if (musicTimer.current){clearTimeout(musicTimer.current);musicTimer.current=null;}
  },[]);

  const setMuted=useCallback((m)=>{mutedR.current=m;},[]);
  const setVol=useCallback((v)=>{volR.current=v;if(mastR.current)mastR.current.gain.value=v;},[]);

  const sfx={
    type:    useCallback(()=>tone(680,0.04,"square",0.1),[tone]),
    shoot:   useCallback(()=>tone(880,0.07,"sawtooth",0.09,440),[tone]),
    explode: useCallback(()=>{tone(160,0.18,"triangle",0.22,40);setTimeout(()=>tone(90,0.1,"square",0.1,30),30);},[tone]),
    miss:    useCallback(()=>tone(140,0.28,"sawtooth",0.18,60),[tone]),
    wrong:   useCallback(()=>tone(200,0.07,"square",0.09,100),[tone]),
    levelUp: useCallback(()=>{tone(440,0.1,"sine",0.18);setTimeout(()=>tone(660,0.11,"sine",0.18),85);setTimeout(()=>tone(880,0.14,"sine",0.2),170);},[tone]),
    gameOver:useCallback(()=>{tone(280,0.2,"sawtooth",0.18,120);setTimeout(()=>tone(160,0.28,"sawtooth",0.18,55),140);setTimeout(()=>tone(80,0.45,"sawtooth",0.15,25),300);},[tone]),
  };

  return {sfx,setMuted,setVol,startMusic,stopMusic,ctx};
}

function Starfield() {
  const canvasRef=useRef(null);
  useEffect(()=>{
    const el=canvasRef.current; if (!el) return;
    const ctx2=el.getContext("2d");
    const STARS=Array.from({length:220},()=>({
      x:Math.random(),y:Math.random(),z:Math.random(),pz:Math.random(),
    }));
    let raf;
    const draw=()=>{
      el.width=window.innerWidth; el.height=window.innerHeight;
      ctx2.fillStyle="#04030a";
      ctx2.fillRect(0,0,el.width,el.height);
      const cx=el.width/2, cy=el.height/2;
      STARS.forEach(s=>{
        s.pz=s.z; s.z-=0.005;
        if (s.z<=0){s.x=Math.random();s.y=Math.random();s.z=1;s.pz=1;}
        const sx=(s.x-0.5)/s.z*el.width+cx;
        const sy=(s.y-0.5)/s.z*el.height+cy;
        const px=(s.x-0.5)/s.pz*el.width+cx;
        const py=(s.y-0.5)/s.pz*el.height+cy;
        const size=Math.max(0.4,(1-s.z)*2.2);
        const op=Math.min(1,(1-s.z)*1.5);
        ctx2.beginPath();
        ctx2.strokeStyle=`rgba(160,210,255,${op})`;
        ctx2.lineWidth=size;
        ctx2.moveTo(px,py); ctx2.lineTo(sx,sy);
        ctx2.stroke();
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={canvasRef} style={{position:"fixed",inset:0,width:"100%",height:"100%",zIndex:0,pointerEvents:"none"}}/>;
}

export default function GiglifeGame() {
  const [screen,setScreen]=useState("menu");
  const [gameMode,setGameMode]=useState("english");
  const [difficulty,setDifficulty]=useState("normal");
  const [enemies,setEnemies]=useState([]);
  const [typed,setTyped]=useState("");
  const [score,setScore]=useState(0);
  const [lives,setLives]=useState(3);
  const [wave,setWave]=useState(1);
  const [particles,setParticles]=useState([]);
  const [bullets,setBullets]=useState([]);
  const [combo,setCombo]=useState(0);
  const [bestCombo,setBestCombo]=useState(0);
  const [highScore,setHighScore]=useState(0);
  const [shake,setShake]=useState(false);
  const [muted,setMutedState]=useState(false);
  const [volume,setVolState]=useState(0.35);
  const [activeKey,setActiveKey]=useState(null);
  const [wrongFlash,setWrongFlash]=useState(false);
  const [showSettings,setShowSettings]=useState(false);
  const [wordHint,setWordHint]=useState("");

  const {sfx,setMuted,setVol,startMusic,stopMusic,ctx:getCtx}=useAudio();
  const containerRef=useRef(null);
  const rafRef=useRef(null);
  const spawnTimer=useRef(0);
  const lastTime=useRef(0);
  const recentWords=useRef([]);
  const W=useRef(800), H=useRef(500);
  const gState=useRef({score:0,lives:3,wave:1});
  const waveRef=useRef(1);
  const diffRef=useRef("normal");
  const speedMult=useRef(1.0);
  const missStreak=useRef(0);

  useEffect(()=>{gState.current={score,lives,wave};},[score,lives,wave]);
  useEffect(()=>{setMuted(muted);},[muted,setMuted]);
  useEffect(()=>{setVol(volume);},[volume,setVol]);

  const measure=useCallback(()=>{
    if (containerRef.current){W.current=containerRef.current.clientWidth;H.current=containerRef.current.clientHeight;}
  },[]);
  useEffect(()=>{measure();window.addEventListener("resize",measure);return()=>window.removeEventListener("resize",measure);},[measure]);

  const startGame=()=>{
    getCtx(); eid=0;pid=0;bid=0;
    recentWords.current=[];spawnTimer.current=0;
    lastTime.current=performance.now();
    waveRef.current=1;diffRef.current=difficulty;
    speedMult.current=1.0;missStreak.current=0;
    setEnemies([]);setParticles([]);setBullets([]);
    setTyped("");setScore(0);setLives(3);
    setWave(1);setCombo(0);setBestCombo(0);
    setWordHint("");setScreen("playing");startMusic();
  };

  const goMenu=useCallback(()=>{
    stopMusic();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setEnemies([]);setParticles([]);setBullets([]);
    setTyped("");setShowSettings(false);setWordHint("");
    setScreen("menu");
  },[stopMusic]);

  const endGame=useCallback(()=>{
    sfx.gameOver();stopMusic();
    setScreen("gameover");
    setHighScore(hs=>Math.max(hs,gState.current.score));
  },[sfx,stopMusic]);

  const spawnEnemy=useCallback(()=>{
    const bank=gameMode==="trading"?WORD_BANK_TRADING:WORD_BANK_ENGLISH;
    const word=randomWord(bank,recentWords.current);
    recentWords.current=[...recentWords.current.slice(-5),word];
    const margin=70;
    const x=margin+Math.random()*Math.max(1,W.current-margin*2);
    const d=DIFFICULTIES[diffRef.current];
    const speed=d.baseSpeed*speedMult.current+Math.random()*3;
    eid++;
    setEnemies(prev=>[...prev,{id:eid,word,x,y:-35,speed,hit:false}]);
  },[gameMode]);

  useEffect(()=>{
    if (screen!=="playing") return;
    const loop=(time)=>{
      const dt=Math.min((time-lastTime.current)/1000,0.05);
      lastTime.current=time;
      spawnTimer.current-=dt;
      const d=DIFFICULTIES[diffRef.current];
      const si=Math.max(0.5,d.spawnInterval-waveRef.current*0.04);
      if (spawnTimer.current<=0){spawnEnemy();spawnTimer.current=si;}
      setEnemies(prev=>{
        const h=H.current||500;
        const next=[];let lost=0;
        for (const e of prev){
          if (e.hit) continue;
          const ny=e.y+e.speed*dt;
          if (ny>=h-44){lost++;continue;}
          next.push({...e,y:ny});
        }
        if (lost>0){
          sfx.miss();
          missStreak.current+=lost;
          if (missStreak.current>=2){speedMult.current=Math.max(0.45,speedMult.current-0.1);missStreak.current=0;}
          setLives(l=>{const nl=l-lost;if(nl<=0){setTimeout(()=>endGame(),0);return 0;}return nl;});
          setCombo(0);setTyped("");setWordHint("");
          setShake(true);setTimeout(()=>setShake(false),250);
        }
        return next;
      });
      const nw=1+Math.floor(gState.current.score/250);
      if (nw>waveRef.current){waveRef.current=nw;setWave(nw);speedMult.current=Math.min(speedMult.current+0.07,1.75);sfx.levelUp();}
      setParticles(prev=>prev.map(p=>({...p,life:p.life-dt})).filter(p=>p.life>0));
      setBullets(prev=>prev.map(b=>({...b,life:b.life-dt*6})).filter(b=>b.life>0));
      rafRef.current=requestAnimationFrame(loop);
    };
    lastTime.current=performance.now();
    rafRef.current=requestAnimationFrame(loop);
    return()=>{if(rafRef.current)cancelAnimationFrame(rafRef.current);};
  },[screen,spawnEnemy,endGame,sfx]);const pressKey=useCallback((ch)=>{
    if (screen!=="playing") return;
    setActiveKey(ch);setTimeout(()=>setActiveKey(null),100);
    const next=typed+ch;
    setEnemies(prev=>{
      const cands=prev.filter(en=>en.word.startsWith(next));
      if (cands.length===0){
        sfx.wrong();
        setWrongFlash(true);setTimeout(()=>setWrongFlash(false),150);
        return prev;
      }
      let tgt=cands[0];
      for (const c of cands){if(c.y>tgt.y)tgt=c;}
      const slowed=prev.map(en=>en.id===tgt.id?{...en,speed:Math.max(en.speed*0.55,2)}:en);
      bid++;
      setBullets(bs=>[...bs,{id:bid,fromX:W.current/2,fromY:H.current-44,toX:tgt.x,toY:tgt.y,life:1}]);
      sfx.shoot();
      if (tgt.word===next){
        sfx.explode();
        const pts=10+tgt.word.length*4+gState.current.wave*2;
        setScore(s=>s+pts);
        setCombo(c=>{const nc=c+1;setBestCombo(b=>Math.max(b,nc));return nc;});
        pid++;
        setParticles(ps=>[...ps,{id:pid,x:tgt.x,y:tgt.y,life:0.55,text:"+"+pts}]);
        setTyped("");setWordHint("");
        missStreak.current=0;
        speedMult.current=Math.min(speedMult.current+0.025,1.75);
        return slowed.map(en=>en.id===tgt.id?{...en,hit:true}:en);
      }
      if (gameMode==="english") setWordHint(tgt.word);
      setTyped(next);
      return slowed;
    });
  },[screen,typed,sfx,gameMode]);

  const handleBS=useCallback(()=>setTyped(t=>t.slice(0,-1)),[]);

  const handleKey=useCallback((e)=>{
    if (screen!=="playing") return;
    if (e.key==="Escape"){goMenu();return;}
    if (e.key==="Backspace"){handleBS();return;}
    if (!/^[a-zA-Z]$/.test(e.key)) return;
    pressKey(e.key.toLowerCase());
  },[screen,pressKey,handleBS,goMenu]);

  useEffect(()=>{
    window.addEventListener("keydown",handleKey);
    return()=>window.removeEventListener("keydown",handleKey);
  },[handleKey]);

  useEffect(()=>{
    const hits=enemies.filter(e=>e.hit);
    if (!hits.length) return;
    const t=setTimeout(()=>setEnemies(prev=>prev.filter(e=>!e.hit)),180);
    return()=>clearTimeout(t);
  },[enemies]);

  const liveLetters=(()=>{
    const s=new Set();
    enemies.forEach(e=>{if(e.word.startsWith(typed)){const nc=e.word[typed.length];if(nc)s.add(nc);}});
    return s;
  })();

  const indicatorLetters=(()=>{
    const s=new Set();
    if (typed.length===0) enemies.forEach(e=>s.add(e.word[0]));
    return s;
  })();

  const tier=getTier(score);

  const SettingsPanel=()=>(
    <div style={{position:"absolute",inset:0,background:"rgba(4,3,10,0.95)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:30,gap:20}}>
      <div style={{fontSize:13,letterSpacing:4,color:"#6ea8d4",marginBottom:4}}>SETTINGS</div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,width:260}}>
        <div style={{fontSize:11,color:"#4a7a9b",letterSpacing:2}}>VOLUME</div>
        <input type="range" min="0" max="1" step="0.05" value={volume}
          onChange={e=>setVolState(parseFloat(e.target.value))}
          style={{width:"100%",accentColor:"#00e5ff"}}/>
        <div style={{fontSize:12,color:"#00e5ff"}}>{Math.round(volume*100)}%</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
        <div style={{fontSize:11,color:"#4a7a9b",letterSpacing:2}}>SOUND</div>
        <button onClick={()=>setMutedState(m=>!m)} style={{
          background:muted?"rgba(255,255,255,0.04)":"rgba(0,229,255,0.15)",
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
    <div style={{position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Courier New',monospace",overflow:"hidden",userSelect:"none"}}>
      <Starfield/>
      <div style={{position:"relative",zIndex:1,width:"100vw",height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:wrongFlash?"inset 0 0 0 3px rgba(255,60,40,0.7)":"none",transform:shake?"translate(3px,-2px)":"none",transition:"transform 0.05s"}}>

        {screen==="playing"&&(
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 18px",background:"rgba(4,3,10,0.7)",borderBottom:"1px solid rgba(0,229,255,0.12)",flexShrink:0,zIndex:10}}>
            <div style={{display:"flex",gap:20,alignItems:"center"}}>
              <div><div style={{fontSize:9,color:"#2a6a7a",letterSpacing:2}}>SCORE</div><div style={{fontSize:20,color:"#00e5ff",fontWeight:700}}>{score}</div></div>
              <div><div style={{fontSize:9,color:"#2a6a7a",letterSpacing:2}}>WAVE</div><div style={{fontSize:20,color:"#e8e3d4",fontWeight:700}}>{wave}</div></div>
              <div><div style={{fontSize:9,color:"#2a6a7a",letterSpacing:2}}>COMBO</div><div style={{fontSize:20,color:combo>4?"#fb923c":"#e8e3d4",fontWeight:700}}>x{combo}</div></div>
              <div style={{fontSize:9,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(0,229,255,0.2)",color:"#2a7a8a",letterSpacing:1}}>{gameMode==="trading"?"TRADING":"ENGLISH"} · {DIFFICULTIES[difficulty].label}</div>
            </div>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{display:"flex",gap:5}}>
                {[0,1,2].map(i=><div key={i} style={{width:13,height:13,borderRadius:"50%",background:i<lives?"#00e5ff":"#0a2030",border:"1px solid rgba(0,229,255,0.3)",transition:"background 0.3s"}}/>)}
              </div>
              <button onClick={()=>setShowSettings(true)} style={{background:"rgba(0,229,255,0.08)",border:"1px solid rgba(0,229,255,0.25)",borderRadius:6,color:"#2a8a9a",fontSize:11,padding:"4px 12px",cursor:"pointer",fontFamily:"inherit"}}>⚙ MENU</button>
            </div>
          </div>
        )}

        <div ref={containerRef} style={{flex:1,position:"relative",overflow:"hidden",minHeight:0}}>
          {showSettings&&screen==="playing"&&<SettingsPanel/>}

          {screen==="menu"&&(
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"20px 16px",overflowY:"auto"}}>
              <div style={{fontSize:11,letterSpacing:5,color:"#2a6a7a",marginBottom:10}}>GREAT IDEA · GREAT LIFE</div>
              <div style={{fontSize:52,fontWeight:900,color:"#00e5ff",letterSpacing:3,textShadow:"0 0 40px rgba(0,229,255,0.5)",marginBottom:8,fontFamily:"Georgia,serif"}}>GIGLIFE</div>
              <div style={{fontSize:13,color:"rgba(0,229,255,0.6)",marginBottom:6,maxWidth:400,lineHeight:1.7}}>Type words. Learn English. Level up your life.</div>
              <div style={{fontSize:11,color:"rgba(100,180,200,0.5)",marginBottom:24,maxWidth:360,lineHeight:1.6}}>Words fall from above — type them to shoot them down. Build your vocabulary while improving your typing speed. The more you play, the better you get.</div>
              <div style={{marginBottom:18}}>
                <div style={{fontSize:10,color:"#2a6a7a",letterSpacing:2,marginBottom:10}}>SELECT MODE</div>
                <div style={{display:"flex",gap:12,justifyContent:"center"}}>
                  {[{key:"english",label:"📚 ENGLISH",desc:"Learn English words"},{key:"trading",label:"📈 TRADING",desc:"Trading vocabulary"}].map(m=>(
                    <button key={m.key} onClick={()=>setGameMode(m.key)} style={{padding:"12px 20px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,border:gameMode===m.key?"1px solid #00e5ff":"1px solid #1a3a4a",background:gameMode===m.key?"rgba(0,229,255,0.12)":"rgba(255,255,255,0.02)",color:gameMode===m.key?"#00e5ff":"#2a5a6a"}}>
                      <div>{m.label}</div><div style={{fontSize:9,opacity:0.6,marginTop:4}}>{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:24}}>
                <div style={{fontSize:10,color:"#2a6a7a",letterSpacing:2,marginBottom:10}}>DIFFICULTY</div>
                <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                  {Object.entries(DIFFICULTIES).map(([key,val])=>(
                    <button key={key} onClick={()=>setDifficulty(key)} style={{padding:"8px 18px",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:700,letterSpacing:1,border:difficulty===key?"1px solid #00e5ff":"1px solid #1a3a4a",background:difficulty===key?"rgba(0,229,255,0.12)":"rgba(255,255,255,0.02)",color:difficulty===key?"#00e5ff":"#2a5a6a"}}>{val.label}</button>
                  ))}
                </div>
              </div>
              <button onClick={startGame} style={{background:"linear-gradient(180deg,#00e5ff,#0088aa)",color:"#04030a",border:"none",padding:"14px 50px",fontSize:16,fontWeight:700,letterSpacing:3,borderRadius:10,cursor:"pointer",fontFamily:"'Courier New',monospace",boxShadow:"0 0 30px rgba(0,229,255,0.4)",marginBottom:16}}>START</button>
              <button onClick={()=>setMutedState(m=>!m)} style={{background:"transparent",border:"1px solid #1a3a4a",borderRadius:6,color:"#2a6a7a",fontSize:10,padding:"6px 16px",cursor:"pointer",fontFamily:"inherit",letterSpacing:1}}>{muted?"SOUND: OFF":"SOUND: ON"}</button>
              <a href="/privacy.html" target="_blank" style={{marginTop:10,display:"block",fontSize:10,color:"#1a4a5a",letterSpacing:1,textDecoration:"none",borderBottom:"1px solid #1a3a4a",paddingBottom:2}}>Privacy Policy</a>
            </div>
          )}

          {screen==="playing"&&(<>
            {enemies.map(e=>{
              const isTgt=e.word.startsWith(typed)&&typed.length>0;
              const isInd=!isTgt&&typed.length===0&&indicatorLetters.has(e.word[0]);
              const tp=isTgt?typed:"";
              const rp=isTgt?e.word.slice(typed.length):e.word;
              return (
                <div key={e.id} style={{position:"absolute",left:e.x,top:e.y,transform:`translate(-50%,-50%) scale(${e.hit?1.7:1})`,opacity:e.hit?0:1,transition:e.hit?"opacity 0.18s,transform 0.18s":"none",fontSize:17,fontWeight:700,padding:"5px 13px",borderRadius:6,background:e.hit?"rgba(0,229,255,0.2)":isTgt?"rgba(0,229,255,0.13)":isInd?"rgba(0,229,255,0.06)":"rgba(4,3,10,0.75)",border:isTgt?"1px solid #00e5ff":isInd?"1px solid rgba(0,229,255,0.35)":"1px solid rgba(0,229,255,0.1)",whiteSpace:"nowrap",pointerEvents:"none",boxShadow:isTgt?"0 0 18px rgba(0,229,255,0.3)":isInd?"0 0 8px rgba(0,229,255,0.15)":"none"}}>
                  {isInd&&<div style={{position:"absolute",top:-8,left:"50%",transform:"translateX(-50%)",width:5,height:5,borderRadius:"50%",background:"rgba(0,229,255,0.6)",boxShadow:"0 0 6px rgba(0,229,255,0.8)"}}/>}
                  <span style={{color:"#fb923c"}}>{tp}</span>
                  <span style={{color:isTgt?"#e8f8ff":isInd?"rgba(0,229,255,0.7)":"rgba(0,229,255,0.4)"}}>{rp}</span>
                </div>
              );
            })}
            {particles.map(p=><div key={p.id} style={{position:"absolute",left:p.x,top:p.y,transform:"translate(-50%,-50%)",color:"#4ade80",fontWeight:700,fontSize:14,opacity:Math.max(p.life*2,0),pointerEvents:"none"}}>{p.text}</div>)}
            <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",overflow:"visible"}}>
              {bullets.map(b=>{
                const t=1-Math.max(b.life,0);
                const prog=Math.min(t,1);
                const cx2=b.fromX+(b.toX-b.fromX)*prog;
                const cy2=b.fromY+(b.toY-b.fromY)*prog;
                const tx=b.fromX+(b.toX-b.fromX)*Math.max(prog-0.18,0);
                const ty=b.fromY+(b.toY-b.fromY)*Math.max(prog-0.18,0);
                return <line key={b.id} x1={tx} y1={ty} x2={cx2} y2={cy2} stroke="#00e5ff" strokeWidth={2.2} strokeLinecap="round" opacity={Math.min(b.life*1.5,1)} style={{filter:"drop-shadow(0 0 5px #00cfff)"}}/>;
              })}
            </svg>
            <div style={{position:"absolute",left:"50%",bottom:12,transform:"translateX(-50%)",width:36,height:36,pointerEvents:"none",filter:"drop-shadow(0 0 10px rgba(0,229,255,0.7))"}}>
              <svg viewBox="0 0 64 64" width="36" height="36">
                <polygon points="32,3 46,42 32,33 18,42" fill="#00e5ff" stroke="#aaf5ff" strokeWidth="1.2"/>
                <polygon points="32,3 39,32 32,27 25,32" fill="#aaf5ff" opacity="0.8"/>
                <circle cx="32" cy="22" r="3.5" fill="#04030a" opacity="0.7"/>
                <polygon points="18,42 11,55 23,46" fill="#0088aa"/>
                <polygon points="46,42 53,55 41,46" fill="#0088aa"/>
                <line x1="32" y1="42" x2="32" y2="56" stroke="rgba(0,229,255,0.4)" strokeWidth="2"/>
              </svg>
            </div>
            <div style={{position:"absolute",left:0,right:0,bottom:44,height:1,background:"linear-gradient(90deg,transparent,rgba(255,60,40,0.5),transparent)"}}/>
          </>)}

          {screen==="gameover"&&(
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:24,background:"rgba(4,3,10,0.9)"}}>
              <div style={{fontSize:12,letterSpacing:3,color:"#6b1a1a",marginBottom:10}}>GAME OVER</div>
              <div style={{fontSize:38,fontWeight:900,color:"#e8f8ff",marginBottom:4,fontFamily:"Georgia,serif"}}>{score} pts</div>
              <div style={{fontSize:13,fontWeight:700,letterSpacing:2,color:tier.color,marginBottom:24,padding:"4px 16px",border:"1px solid "+tier.color,borderRadius:20}}>RANK: {tier.name}</div>
              <div style={{display:"flex",gap:24,marginBottom:28,flexWrap:"wrap",justifyContent:"center"}}>
                <div><div style={{fontSize:10,color:"#2a6a7a",letterSpacing:1}}>BEST COMBO</div><div style={{fontSize:18,color:"#fb923c",fontWeight:700}}>x{bestCombo}</div></div>
                <div><div style={{fontSize:10,color:"#2a6a7a",letterSpacing:1}}>HIGH SCORE</div><div style={{fontSize:18,color:"#00e5ff",fontWeight:700}}>{highScore}</div></div>
                <div><div style={{fontSize:10,color:"#2a6a7a",letterSpacing:1}}>WAVE</div><div style={{fontSize:18,color:"#e8e3d4",fontWeight:700}}>{wave}</div></div>
              </div>
              <button onClick={startGame} style={{background:"linear-gradient(180deg,#00e5ff,#0088aa)",color:"#04030a",border:"none",padding:"12px 44px",fontSize:14,fontWeight:700,letterSpacing:2,borderRadius:8,cursor:"pointer",fontFamily:"'Courier New',monospace",marginBottom:12}}>PLAY AGAIN</button>
              <button onClick={goMenu} style={{background:"transparent",border:"1px solid #1a3a4a",borderRadius:8,color:"#2a6a7a",padding:"8px 28px",fontSize:12,cursor:"pointer",fontFamily:"inherit",letterSpacing:1}}>MAIN MENU</button>
            </div>
          )}
        </div>

        {screen==="playing"&&(
          <div style={{padding:"6px 18px",background:"rgba(4,3,10,0.8)",borderTop:"1px solid rgba(0,229,255,0.1)",minHeight:34,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
            <span style={{fontSize:17,letterSpacing:3,color:"#00e5ff",fontWeight:700}}>
              {typed||"\u00A0"}<span style={{opacity:0.4,animation:"blink 1s infinite"}}>|</span>
            </span>
            {gameMode==="english"&&wordHint&&(
              <span style={{fontSize:11,color:"rgba(0,229,255,0.3)",letterSpacing:1}}>word: <span style={{color:"rgba(0,229,255,0.55)"}}>{wordHint}</span></span>
            )}
          </div>
        )}

        {screen==="playing"&&(
          <div style={{padding:"8px 8px 12px",background:"rgba(4,3,10,0.85)",borderTop:"1px solid rgba(0,229,255,0.08)",flexShrink:0}}>
            {KEY_ROWS.map((row,ri)=>(
              <div key={ri} style={{display:"flex",justifyContent:"center",gap:4,marginBottom:4,paddingLeft:ri===1?14:ri===2?28:0,paddingRight:ri===1?14:ri===2?28:0}}>
                {row.map(k=>{
                  const live=liveLetters.has(k);
                  const ind=!live&&indicatorLetters.has(k);
                  const act=activeKey===k;
                  return (
                    <button key={k} onPointerDown={e=>{e.preventDefault();pressKey(k);}} style={{flex:1,maxWidth:38,minWidth:20,height:54,borderRadius:6,border:act?"1px solid #00e5ff":live?"1px solid #00e5ff":ind?"1px solid rgba(0,229,255,0.4)":"1px solid #0a2030",background:act?"#00e5ff":live?"rgba(0,229,255,0.18)":ind?"rgba(0,229,255,0.07)":"rgba(255,255,255,0.02)",color:act?"#04030a":live?"#00e5ff":ind?"rgba(0,229,255,0.5)":"#1a4a5a",fontSize:12,fontWeight:700,textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",transition:"background 0.08s,color 0.08s",touchAction:"manipulation",boxShadow:ind?"0 0 6px rgba(0,229,255,0.2)":"none"}}>{k}</button>
                  );
                })}
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"center",marginTop:3}}>
              <button onPointerDown={e=>{e.preventDefault();handleBS();}} style={{width:130,height:32,borderRadius:6,border:"1px solid #0a2030",background:"rgba(255,255,255,0.02)",color:"#1a4a5a",fontSize:11,fontWeight:700,letterSpacing:1,cursor:"pointer",fontFamily:"inherit",touchAction:"manipulation"}}>⌫ BACKSPACE</button>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes blink{0%,50%{opacity:1}51%,100%{opacity:0}}`}</style>
    </div>
  );
      }
