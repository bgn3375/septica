import { useState, useEffect, useRef, useCallback } from "react";

// ── THEME ─────────────────────────────────────────────────────────────────
const T = {
  bg:"#F0F7F9", card:"#FFFFFF", muted:"#E8F4F6", border:"#C8E6EC",
  text:"#0A2540", text2:"#3A6B7A", text3:"#7AADB8",
  gradient:"linear-gradient(135deg,#1BC4A0,#1A9FD4,#1A6FD4)",
  pink:"#1A9FD4", pinkSoft:"rgba(26,159,212,0.10)",
  teamA:"#F4845F", teamASoft:"#FEF3EE", teamABorder:"#FAC4AD",
  teamB:"#D4A017", teamBSoft:"#FDF8E6", teamBBorder:"#EDD87A",
  shadow:"0 1px 3px rgba(0,0,0,0.07)",
  shadowMd:"0 4px 12px rgba(0,0,0,0.08)",
  shadowLg:"0 10px 24px rgba(0,0,0,0.08)",
  r:4, rMd:6, rLg:8, rXl:12, rFull:9999,
};

const NAV_H      = 52;
const FAB_GAP    = 10;
const FAB_BOTTOM = NAV_H + FAB_GAP;

// ── DATA ──────────────────────────────────────────────────────────────────
const PLAYERS = {
  Paul:{ full:"Paul Roman",      alias:"Paul", team:"A", initials:"PR", captain:true,  color:"#F4845F" },
  BGN: { full:"Bogdan",          alias:"BGN",  team:"A", initials:"BG", captain:false, color:"#E06040" },
  Laur:{ full:"Laurențiu Lazăr", alias:"Laur", team:"B", initials:"LL", captain:true,  color:"#D4A017" },
  GxG: { full:"George Talpoș",   alias:"GxG",  team:"B", initials:"GT", captain:false, color:"#B8880F" },
};

const INITIAL_MATCHES = [
  { id:3, date:"23 Mar 26", location:"", winner:"A", score:"2-0",
    partide:[{setWinner:"A",W:52,L:20},{setWinner:"A",W:54,L:50}], quote:"", photos:0 },
  { id:2, date:"24 Feb 26", location:"", winner:"A", score:"2-1",
    partide:[{setWinner:"B",W:56,L:0},{setWinner:"A",W:52,L:28},{setWinner:"A",W:51,L:45}],
    quote:"Seara în care BGN a tras echipa de la 0-56 la victorie. Clasic.", photos:0 },
  { id:1, date:"28 Ian 26", location:"", winner:"A", score:"2-0",
    partide:[{setWinner:"A",W:57,L:7},{setWinner:"A",W:54,L:28}], quote:"", photos:0 },
  { id:4, date:"16 Dec 25", weekend:"Finala 2025", location:"București",
    winner:"B", score:"8-5", setsA:5, setsB:8, partide:[], photos:4, quote:"" },
];

// ── DATE HELPERS ──────────────────────────────────────────────────────────
const MONTHS = ["Ian","Feb","Mar","Apr","Mai","Iun","Iul","Aug","Sep","Oct","Nov","Dec"];

const fmtDate  = d => `${String(d.getDate()).padStart(2,"0")} ${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
const parseDate = str => { const [dd,mmm,yy] = str.split(" "); return new Date(2000+Number(yy), Math.max(0,MONTHS.indexOf(mmm)), Number(dd)); };
const dateYear  = str => str.split(" ")[2] || "";

// ── STATS CALCULATOR ──────────────────────────────────────────────────────
const calcStats = matches => {
  const s = {};
  Object.entries(PLAYERS).forEach(([alias, { team }]) => {
    const wins = matches.filter(m => m.winner===team).length;
    const gamesWon = matches.reduce((acc,m) => {
      if (m.winner!==team) return acc;
      return acc + m.partide.filter(p=>p.setWinner===team).length + (team==="A"?m.setsA||0:m.setsB||0);
    }, 0);
    let streak = 0;
    for (const m of matches) { if (m.winner===team) streak++; else break; }
    s[alias] = { meciuri:matches.length, victorii:wins, jocuri:gamesWon,
                 rata: matches.length>0 ? Math.round(wins/matches.length*100)+"%" : "0%", streak };
  });
  return s;
};

// ── PRIMITIVE COMPONENTS ──────────────────────────────────────────────────
const Avatar = ({ alias, size=36 }) => {
  const p = PLAYERS[alias]||{};
  return <div style={{ width:size, height:size, borderRadius:"50%", background:p.color||"#94A3B8",
    display:"flex", alignItems:"center", justifyContent:"center", color:"#fff",
    fontSize:size*0.32, fontWeight:700, flexShrink:0, boxShadow:`0 2px 8px ${p.color}44` }}>
    {p.initials||alias.slice(0,2)}
  </div>;
};

const AvatarPair = ({ aliases, size=36, light=false }) => (
  <div style={{ display:"flex", alignItems:"center" }}>
    {aliases.map((alias,i) => {
      const p = PLAYERS[alias]||{};
      return <div key={alias} style={{ marginLeft:i===0?0:-Math.round(size*0.12), zIndex:i===0?2:1,
        position:"relative", width:size, height:size, borderRadius:"50%",
        background:light?"rgba(255,255,255,0.22)":(p.color||"#94A3B8"),
        display:"flex", alignItems:"center", justifyContent:"center",
        color:"#fff", fontSize:size*0.32, fontWeight:700, flexShrink:0 }}>
        {p.initials||alias.slice(0,2)}
      </div>;
    })}
  </div>
);

const Badge = ({ children, variant="default" }) => {
  const v = { default:{bg:T.muted,color:T.text2,border:T.border},
    teamA:{bg:T.teamASoft,color:T.text2,border:T.teamABorder},
    teamB:{bg:T.teamBSoft,color:T.text2,border:T.teamBBorder} }[variant]||{bg:T.muted,color:T.text2,border:T.border};
  return <span style={{ fontSize:11, fontWeight:500, padding:"2px 8px", borderRadius:T.r,
    background:v.bg, color:v.color, border:`1px solid ${v.border}`, display:"inline-flex", alignItems:"center" }}>
    {children}
  </span>;
};

const Card = ({ children, style={}, onClick }) => {
  const [hov, setHov] = useState(false);
  return <div onClick={onClick} onMouseEnter={() => onClick&&setHov(true)} onMouseLeave={() => onClick&&setHov(false)}
    style={{ background:T.card, border:`1px solid ${hov?"#1A9FD4":T.border}`, borderRadius:T.rXl,
      boxShadow:hov?T.shadowMd:T.shadow, transition:"border-color 0.15s, box-shadow 0.15s",
      cursor:onClick?"pointer":"default", overflow:"hidden", ...style }}>
    {children}
  </div>;
};

const GradBtn = ({ children, onClick, full=false, sm=false }) => (
  <button onClick={onClick} onMouseEnter={e=>e.currentTarget.style.opacity="0.88"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}
    style={{ background:T.gradient, border:"none", borderRadius:T.rMd, padding:sm?"7px 14px":"10px 20px",
      cursor:"pointer", fontSize:sm?12:16, fontWeight:500, color:"#fff", width:full?"100%":"auto",
      boxShadow:"0 2px 8px rgba(26,159,212,0.28)", transition:"opacity 0.15s" }}>
    {children}
  </button>
);

const FloatingAddBtn = ({ onClick, bottom, label="+ Adaugă meci nou" }) => (
  <div style={{ position:"absolute", bottom, left:12, right:12, zIndex:35 }}>
    <button onClick={onClick}
      onMouseEnter={e=>{e.currentTarget.style.opacity="0.9";e.currentTarget.style.transform="translateY(-1px)";}}
      onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(0)";}}
      style={{ width:"100%", height:40, padding:"0 20px", background:T.gradient, border:"none",
        borderRadius:T.rFull, cursor:"pointer", fontSize:14, fontWeight:600, color:"#fff",
        boxShadow:"0 4px 20px rgba(26,159,212,0.4)", transition:"opacity 0.15s, transform 0.15s" }}>
      {label}
    </button>
  </div>
);

const SecLabel = ({ children }) => (
  <div style={{ fontSize:10, fontWeight:600, color:T.text3, textTransform:"uppercase",
    letterSpacing:"0.07em", marginBottom:8 }}>{children}</div>
);

const Divider = ({ mx=0 }) => <div style={{ height:1, background:T.border, margin:`0 ${mx}px` }} />;

const SetPill = ({ p, matchWinner }) => {
  const isA = p.setWinner==="A";
  const first = p.setWinner===matchWinner?p.W:p.L, second = p.setWinner===matchWinner?p.L:p.W;
  return <span style={{ fontSize:10, fontWeight:600, padding:"1px 5px", borderRadius:T.r,
    background:isA?T.teamASoft:T.teamBSoft, color:T.text2,
    border:`1px solid ${isA?T.teamABorder:T.teamBBorder}`, whiteSpace:"nowrap" }}>
    {first}–{second}
  </span>;
};

const ScoreDisplay = ({ sW, sL, size=16, light=false }) => (
  <div style={{ display:"flex", alignItems:"center", gap:3, flexShrink:0 }}>
    <span style={{ fontSize:size, fontWeight:800, color:light?"#fff":T.text }}>{sW}</span>
    <span style={{ fontSize:size*0.7, color:light?"rgba(255,255,255,0.4)":T.text3 }}>–</span>
    <span style={{ fontSize:size, fontWeight:800, color:light?"rgba(255,255,255,0.38)":T.text3 }}>{sL}</span>
  </div>
);

const LiquidBtn = ({ icon="←", onClick, label }) => {
  const [pressed, setPressed] = useState(false);
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>{setHov(false);setPressed(false);}}
      onMouseDown={()=>setPressed(true)} onMouseUp={()=>setPressed(false)}
      onTouchStart={()=>setPressed(true)} onTouchEnd={()=>{setPressed(false);onClick?.();}}
      title={label}
      style={{ position:"relative", width:36, height:36, borderRadius:"50%",
        border:`1px solid ${hov?"rgba(26,159,212,0.45)":"rgba(148,163,184,0.35)"}`,
        background:pressed?"rgba(26,159,212,0.18)":hov?"rgba(26,159,212,0.08)":"rgba(255,255,255,0.72)",
        backdropFilter:"blur(10px)", WebkitBackdropFilter:"blur(10px)",
        boxShadow:pressed?"inset 0 2px 6px rgba(0,0,0,0.10)":hov
          ?"0 4px 16px rgba(26,159,212,0.18), inset 0 1px 0 rgba(255,255,255,0.8)"
          :"0 2px 8px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
        cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:14, color:hov?"#1A9FD4":T.text2,
        transform:pressed?"scale(0.92)":hov?"scale(1.06)":"scale(1)",
        transition:"all 0.18s cubic-bezier(0.34,1.56,0.64,1)", flexShrink:0 }}>
      <div style={{ position:"absolute", top:2, left:4, right:4, height:"38%", borderRadius:"50%",
        background:"linear-gradient(180deg,rgba(255,255,255,0.55) 0%,rgba(255,255,255,0) 100%)",
        pointerEvents:"none" }} />
      <span style={{ position:"relative", lineHeight:1, fontWeight:500 }}>{icon}</span>
    </button>
  );
};

const MatchCard = ({ m, onPress, isLatest=false }) => {
  const isWeekend = !!m.weekend, aWin = m.winner==="A";
  const teamColor = aWin?T.teamA:T.teamB;
  const aliases   = aWin?["Paul","BGN"]:["Laur","GxG"];
  const teamName  = aWin?"Paul & BGN":"Laur & GxG";
  const [sW,sL]   = m.score.split("-");
  return (
    <Card onClick={onPress} style={{ position:"relative", background:isWeekend?(aWin?T.teamASoft:T.teamBSoft):T.card }}>
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:teamColor }} />
      <div style={{ padding:"9px 12px 9px 11px" }}>
        {isWeekend ? (
          <>
            <div style={{ textAlign:"center", marginBottom:5 }}>
              <span style={{ fontSize:14, fontWeight:700, color:T.text }}>{m.weekend}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <AvatarPair aliases={aliases} size={24} />
                <span style={{ fontSize:13, fontWeight:700, color:T.text, marginLeft:4 }}>{teamName}</span>
              </div>
              <ScoreDisplay sW={sW} sL={sL} size={16} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontSize:11, color:T.text3 }}>{m.date}</span>
              {m.location&&<span style={{ fontSize:11, color:T.text3 }}>📍 {m.location}</span>}
            </div>
          </>
        ) : (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <AvatarPair aliases={aliases} size={24} />
                <span style={{ fontSize:isLatest?14:13, fontWeight:700, color:T.text, marginLeft:4 }}>{teamName}</span>
              </div>
              <ScoreDisplay sW={sW} sL={sL} size={isLatest?16:14} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:11, color:T.text3 }}>{m.date}</span>
              <div style={{ display:"flex", gap:3 }}>
                {m.partide.map((p,j)=><SetPill key={j} p={p} matchWinner={m.winner} />)}
              </div>
            </div>
            {m.quote&&<div style={{ marginTop:4, fontSize:11, color:T.text3, fontStyle:"italic",
              whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>"{m.quote}"</div>}
          </>
        )}
      </div>
    </Card>
  );
};

const PinKeypad = ({ pin, setPin, onSuccess, pinErr, setPinErr, title, titleColor=T.text }) => (
  <>
    <div style={{ width:30, height:3, background:T.border, borderRadius:T.rFull, margin:"0 auto 16px" }} />
    <div style={{ fontSize:16, fontWeight:700, color:titleColor, marginBottom:3 }}>{title}</div>
    <div style={{ fontSize:11, color:T.text2, marginBottom:18 }}>Introdu PIN</div>
    <div style={{ display:"flex", justifyContent:"center", gap:14, marginBottom:5 }}>
      {[0,1,2,3].map(i=>(
        <div key={i} style={{ width:11, height:11, borderRadius:"50%",
          background:pin.length>i?(titleColor===T.text?T.pink:titleColor):T.muted,
          border:`1.5px solid ${pin.length>i?(titleColor===T.text?T.pink:titleColor):T.border}`,
          transition:"all 0.15s" }} />
      ))}
    </div>
    {pinErr&&<div style={{ textAlign:"center", fontSize:10, color:"#DC2626", marginBottom:3 }}>PIN incorect</div>}
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:16 }}>
      {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((k,i)=>(
        <button key={i}
          onClick={()=>{
            if(k==="⌫"){setPin(p=>p.slice(0,-1));setPinErr(false);}
            else if(k!==""){
              const np=pin+k; setPin(np);
              if(np.length===4){ if(np==="7777") onSuccess(); else{setPinErr(true);setTimeout(()=>setPin(""),500);} }
            }
          }}
          onMouseEnter={e=>k!==""&&(e.currentTarget.style.background=T.border)}
          onMouseLeave={e=>k!==""&&(e.currentTarget.style.background=T.muted)}
          style={{ height:48, borderRadius:T.rLg, fontSize:18, fontWeight:400,
            cursor:k===""?"default":"pointer", background:k===""?"transparent":T.muted,
            border:k===""?"none":`1px solid ${T.border}`, color:T.text,
            opacity:k===""?0:1, transition:"background 0.1s" }}>
          {k}
        </button>
      ))}
    </div>
  </>
);

// ── PHONE SHELL ───────────────────────────────────────────────────────────
const PhoneShell = ({ children }) => (
  <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-start",
    minHeight:"100vh", background:"#E8EEF2", padding:"32px 16px 48px",
    fontFamily:"'Inter',sans-serif" }}>
    <div style={{ width:290, background:"#1C2E3E", borderRadius:52, padding:11, position:"relative",
      boxShadow:"0 0 0 1px #2A4055, 0 0 0 2.5px #1C2E3E, inset 0 1px 0 rgba(255,255,255,0.07), 0 48px 120px rgba(0,0,0,0.55)", flexShrink:0 }}>
      <div style={{ position:"absolute", left:-4, top:100, width:4, height:32, background:"#2C2C2E", borderRadius:"3px 0 0 3px", boxShadow:"0 44px 0 #2C2C2E, 0 86px 0 #2C2C2E" }} />
      <div style={{ position:"absolute", right:-4, top:122, width:4, height:56, background:"#2C2C2E", borderRadius:"0 3px 3px 0" }} />
      <div style={{ background:T.bg, borderRadius:42, overflow:"hidden", height:580,
        position:"relative", display:"flex", flexDirection:"column" }}>
        <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
          width:90, height:26, background:"#1C2E3E", borderRadius:"0 0 18px 18px",
          zIndex:20, display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
          <div style={{ width:9, height:9, background:"#2C4055", borderRadius:"50%" }} />
          <div style={{ width:32, height:4, background:"#2C4055", borderRadius:3 }} />
        </div>
        <div style={{ padding:"14px 18px 4px", display:"flex", justifyContent:"space-between", alignItems:"center",
          fontSize:11, fontWeight:600, color:T.text, background:"rgba(240,247,249,0.98)", flexShrink:0, zIndex:10 }}>
          <span>9:41</span>
          <div style={{ display:"flex", gap:5, alignItems:"center" }}>
            <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
              <rect x="0" y="4" width="3" height="7" rx="0.5" fill="#0A2540"/>
              <rect x="4.5" y="2.5" width="3" height="8.5" rx="0.5" fill="#0A2540"/>
              <rect x="9" y="1" width="3" height="10" rx="0.5" fill="#0A2540"/>
              <rect x="13.5" y="0" width="2.5" height="11" rx="0.5" fill="#0A2540" opacity="0.28"/>
            </svg>
            <svg width="15" height="11" viewBox="0 0 15 11" fill="#0A2540">
              <path d="M7.5 2.4C9.6 2.4 11.5 3.3 12.9 4.8L14.2 3.4C12.4 1.6 9.9 0.5 7.5 0.5S2.6 1.6 0.8 3.4L2.1 4.8C3.5 3.3 5.4 2.4 7.5 2.4Z" opacity="0.38"/>
              <path d="M7.5 5.2C9 5.2 10.3 5.8 11.2 6.8L12.5 5.4C11.2 4 9.4 3.1 7.5 3.1S3.8 4 2.5 5.4L3.8 6.8C4.7 5.8 6 5.2 7.5 5.2Z" opacity="0.7"/>
              <circle cx="7.5" cy="9.5" r="1.5"/>
            </svg>
            <svg width="25" height="11" viewBox="0 0 25 11" fill="none">
              <rect x=".5" y=".5" width="21" height="10" rx="2.5" stroke="#0A2540" strokeOpacity=".35"/>
              <rect x="1.5" y="1.5" width="18" height="8" rx="1.5" fill="#0A2540"/>
              <path d="M23 3.5C23.8 3.9 24.5 4.7 24.5 5.5C24.5 6.3 23.8 7.1 23 7.5V3.5Z" fill="#0A2540" opacity=".35"/>
            </svg>
          </div>
        </div>
        {children}
      </div>
    </div>
  </div>
);

// ══ MAIN APP ══════════════════════════════════════════════════════════════
export default function SepticaClub() {
  const [page,          setPage]          = useState("home");
  const [selMatch,      setSelMatch]      = useState(null);
  const [selPlayer,     setSelPlayer]     = useState(null);
  const [matches,       setMatches]       = useState(INITIAL_MATCHES);
  const [editMatch,     setEditMatch]     = useState(null);
  const [profilePhotos, setProfilePhotos] = useState({});
  const [mounted,       setMounted]       = useState(false);
  const [showPin,       setShowPin]       = useState(false);
  const [pin,           setPin]           = useState("");
  const [pinErr,        setPinErr]        = useState(false);
  const [showDeletePin, setShowDeletePin] = useState(false);
  const [deletePin,     setDeletePin]     = useState("");
  const [deletePinErr,  setDeletePinErr]  = useState(false);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [showAdd,       setShowAdd]       = useState(false);

  useEffect(()=>{ setTimeout(()=>setMounted(true),60); },[]);

  const handlePhotoUpload = useCallback((alias,file)=>{
    if(!file) return;
    const r = new FileReader();
    r.onload = e => setProfilePhotos(prev=>({...prev,[alias]:e.target.result}));
    r.readAsDataURL(file);
  },[]);

  const openMatch   = useCallback(m=>{ setSelMatch(m); setPage("match"); },[]);
  const openPlayer  = useCallback(alias=>setSelPlayer(alias),[]);
  const openAdd     = useCallback(()=>{ setEditMatch(null); setShowPin(true); },[]);
  const openEdit    = useCallback(m=>{ setEditMatch(m); setShowPin(true); },[]);
  const deleteMatch = useCallback(id=>{ setMatches(prev=>prev.filter(m=>m.id!==id)); setPage("meciuri"); },[]);

  const playerStats = calcStats(matches);

  // ── TOP BAR ──────────────────────────────────────────────────────────────
  const TopBar = ({ back, backFn, action }) => (
    <div style={{ background:"rgba(240,247,249,0.95)", borderBottom:`1px solid ${T.border}`,
      padding:"7px 12px", display:"flex", alignItems:"center", justifyContent:"space-between",
      flexShrink:0, zIndex:10 }}>
      {back ? (
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <LiquidBtn icon="←" onClick={backFn} label={back} />
          <span style={{ fontSize:11, color:T.text3, fontWeight:500 }}>{back}</span>
        </div>
      ) : (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:26, height:26, borderRadius:T.rMd, background:T.gradient,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:15, fontWeight:900, color:"#fff",
              boxShadow:"0 2px 8px rgba(26,159,212,0.3)" }}>7</div>
            <span style={{ fontSize:14, fontWeight:700, color:T.text }}>Șeptică pe Vorbite</span>
          </div>
          <span style={{ fontSize:10, color:T.text3, letterSpacing:"0.06em", textTransform:"uppercase" }}>Est. 1995</span>
        </div>
      )}
      {action}
    </div>
  );

  // ── BOTTOM NAV ───────────────────────────────────────────────────────────
  const BottomNav = () => (
    <div style={{ position:"absolute", bottom:0, left:0, right:0,
      background:"rgba(255,255,255,0.97)", borderTop:"1.5px solid transparent",
      backgroundImage:`linear-gradient(rgba(255,255,255,0.97),rgba(255,255,255,0.97)),${T.gradient}`,
      backgroundOrigin:"border-box", backgroundClip:"padding-box,border-box",
      display:"flex", justifyContent:"space-around", alignItems:"center",
      paddingTop:6, paddingBottom:10, zIndex:10 }}>
      {[
        {id:"home",    label:"Acasă",    suit:"♠", red:false},
        {id:"meciuri", label:"Meciuri",  suit:"♥", red:true },
        {id:"players", label:"Jucători", suit:"♣", red:false},
        {id:"album",   label:"Album",    suit:"♦", red:true },
      ].map(nav=>{
        const active = page===nav.id||(page==="match"&&nav.id==="meciuri")||(page==="player"&&nav.id==="players");
        const col = nav.red?"#D42B2B":"#111111";
        return (
          <button key={nav.id} onClick={()=>setPage(nav.id)}
            style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
            <div style={{ width:36, height:26, borderRadius:T.rFull, background:active?`${col}12`:"transparent",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:19, color:col, lineHeight:1 }}>{nav.suit}</span>
            </div>
            <span style={{ fontSize:8, fontWeight:active?700:400, letterSpacing:"0.05em", textTransform:"uppercase", color:col }}>
              {nav.label}
            </span>
          </button>
        );
      })}
    </div>
  );

  // ── HOME PAGE ─────────────────────────────────────────────────────────────
  const HomePage = () => {
    const winsA = matches.filter(m=>m.winner==="A").length;
    const winsB = matches.filter(m=>m.winner==="B").length;
    const total = matches.length;
    const setsA = matches.reduce((a,m)=>a+m.partide.filter(p=>p.setWinner==="A").length+(m.setsA||0),0);
    const setsB = matches.reduce((a,m)=>a+m.partide.filter(p=>p.setWinner==="B").length+(m.setsB||0),0);
    return (
      <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden", opacity:mounted?1:0, transition:"opacity 0.45s" }}>
        <TopBar />
        <div style={{ flex:1, overflowY:"auto", padding:"10px 10px 0" }}>
          <Card style={{ marginBottom:10, background:T.gradient, border:"none", boxShadow:"0 6px 20px rgba(26,159,212,0.22)" }}>
            <div style={{ padding:"14px 16px 8px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                <div style={{ flex:1, textAlign:"center" }}>
                  <div style={{ display:"flex", justifyContent:"center", marginBottom:6 }}>
                    <AvatarPair aliases={["Paul","BGN"]} size={30} light />
                  </div>
                  <div style={{ fontSize:48, fontWeight:800, color:"#fff", lineHeight:1, letterSpacing:"-0.03em" }}>{setsA}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.55)", marginTop:3 }}>{winsA} {winsA===1?"victorie":"victorii"}</div>
                </div>
                <div style={{ textAlign:"center", flexShrink:0 }}>
                  <div style={{ fontSize:14, color:"rgba(255,255,255,0.45)", fontWeight:600 }}>vs</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{total} meciuri</div>
                </div>
                <div style={{ flex:1, textAlign:"center" }}>
                  <div style={{ display:"flex", justifyContent:"center", marginBottom:6 }}>
                    <AvatarPair aliases={["Laur","GxG"]} size={30} light />
                  </div>
                  <div style={{ fontSize:48, fontWeight:800, color:"rgba(255,255,255,0.38)", lineHeight:1, letterSpacing:"-0.03em" }}>{setsB}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.55)", marginTop:3 }}>{winsB} {winsB===1?"victorie":"victorii"}</div>
                </div>
              </div>
            </div>
          </Card>
          <SecLabel>Meciuri recente</SecLabel>
          <div style={{ display:"flex", flexDirection:"column", gap:6, paddingBottom:110 }}>
            {matches.slice(0,3).map((m,i)=>(
              <MatchCard key={m.id} m={m} isLatest={i===0} onPress={()=>openMatch(m)} />
            ))}
          </div>
        </div>
        <FloatingAddBtn onClick={openAdd} bottom={FAB_BOTTOM} />
        <BottomNav />
      </div>
    );
  };

  // ── MATCHES PAGE ──────────────────────────────────────────────────────────
  const MatchesPage = () => (
    <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden" }}>
      <TopBar />
      <div style={{ flex:1, overflowY:"auto", padding:"12px 10px 0" }}>
        <div style={{ fontSize:18, fontWeight:700, color:T.text, letterSpacing:"-0.02em", marginBottom:12 }}>Lista de meciuri</div>
        <div style={{ display:"flex", flexDirection:"column", gap:6, paddingBottom:110 }}>
          {matches.map((m,idx)=>(
            <div key={m.id} style={{ opacity:mounted?1:0, transform:mounted?"none":"translateY(6px)",
              transition:`opacity 0.3s ${idx*0.05}s, transform 0.3s ${idx*0.05}s` }}>
              <MatchCard m={m} onPress={()=>openMatch(m)} />
            </div>
          ))}
        </div>
      </div>
      <FloatingAddBtn onClick={openAdd} bottom={FAB_BOTTOM} />
      <BottomNav />
    </div>
  );

  // ── MATCH DETAIL PAGE ─────────────────────────────────────────────────────
  const MatchDetailPage = () => {
    const m = selMatch; if(!m) return null;
    const aWin = m.winner==="A";
    const [sW,sL] = m.score.split("-");
    const heroBg = aWin?"linear-gradient(135deg,#F4845F,#E06040)":"linear-gradient(135deg,#D4A017,#B8880F)";
    return (
      <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden" }}>
        <TopBar back="Meciuri" backFn={()=>setPage("meciuri")} action={
          <div style={{ display:"flex", gap:6 }}>
            <button onClick={()=>openEdit(m)}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#1A9FD4"}
              onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}
              style={{ background:"transparent", border:`1px solid ${T.border}`, borderRadius:T.rMd,
                padding:"4px 9px", cursor:"pointer", fontSize:11, fontWeight:500, color:T.text2, transition:"border-color 0.15s" }}>✎</button>
            <button onClick={()=>{ setDeleteTarget(m.id); setShowDeletePin(true); }}
              onMouseEnter={e=>{e.currentTarget.style.background="#FEF2F2";e.currentTarget.style.borderColor="#DC2626";}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="#FCA5A5";}}
              style={{ background:"transparent", border:"1px solid #FCA5A5", borderRadius:T.rMd,
                padding:"4px 9px", cursor:"pointer", fontSize:11, fontWeight:500, color:"#DC2626", transition:"all 0.15s" }}>🗑</button>
          </div>
        } />
        <div style={{ flex:1, overflowY:"auto", paddingBottom:70 }}>
          <div style={{ background:heroBg, padding:"20px 20px 18px", textAlign:"center" }}>
            {m.weekend&&<div style={{ display:"inline-block", marginBottom:10, background:"rgba(255,255,255,0.18)", borderRadius:T.rFull, padding:"3px 10px", fontSize:10, color:"#fff" }}>🏆 {m.weekend}</div>}
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.65)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:2 }}>{m.date}</div>
            <div style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.85)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:16 }}>
              {aWin?"Paul & BGN":"Laur & GxG"} câștigă
            </div>
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"center", gap:16 }}>
              {[{aliases:["Paul","BGN"],label:"Paul & BGN",score:sW,dim:!aWin},{aliases:["Laur","GxG"],label:"Laur & GxG",score:sL,dim:aWin}].map((team,i)=>(
                <div key={i} style={{ textAlign:"center" }}>
                  <div style={{ display:"flex", justifyContent:"center", marginBottom:4 }}>
                    <AvatarPair aliases={team.aliases} size={24} light />
                  </div>
                  <div style={{ fontSize:8, color:"rgba(255,255,255,0.6)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>{team.label}</div>
                  <div style={{ fontSize:56, fontWeight:800, lineHeight:1, letterSpacing:"-0.03em", color:team.dim?"rgba(255,255,255,0.38)":"#fff" }}>{team.score}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding:"14px 12px" }}>
            {m.partide.length>0&&(
              <>
                <SecLabel>Partide</SecLabel>
                <Card style={{ marginBottom:12 }}>
                  {m.partide.map((p,i)=>{
                    const f=p.setWinner===m.winner?p.W:p.L, s=p.setWinner===m.winner?p.L:p.W;
                    return <div key={i}>
                      <div style={{ display:"flex", alignItems:"center", padding:"10px 12px", gap:10 }}>
                        <span style={{ fontSize:11, color:T.text2, width:56 }}>Partida {i+1}</span>
                        <div style={{ flex:1, display:"flex", alignItems:"center", gap:6 }}>
                          <span style={{ fontSize:20, fontWeight:700, color:T.text }}>{f}</span>
                          <span style={{ fontSize:11, color:T.text3 }}>–</span>
                          <span style={{ fontSize:20, fontWeight:700, color:T.text3 }}>{s}</span>
                        </div>
                        <Badge variant={p.setWinner==="A"?"teamA":"teamB"}>{p.setWinner==="A"?"Paul & BGN":"Laur & GxG"}</Badge>
                      </div>
                      {i<m.partide.length-1&&<Divider mx={12} />}
                    </div>;
                  })}
                </Card>
              </>
            )}
            {m.quote&&(
              <>
                <SecLabel>Quote seara</SecLabel>
                <Card style={{ marginBottom:12, borderLeft:`3px solid #1A9FD4`, borderRadius:0 }}>
                  <div style={{ padding:"12px 14px", fontSize:12, color:T.text, fontStyle:"italic", lineHeight:1.5 }}>"{m.quote}"</div>
                </Card>
              </>
            )}
          </div>
        </div>
        <BottomNav />
      </div>
    );
  };

  // ── PLAYERS PAGE ──────────────────────────────────────────────────────────
  const PlayersPage = () => {
    if(selPlayer){
      const alias=selPlayer, p=PLAYERS[alias], st=playerStats[alias], isA=p.team==="A";
      const heroBg=isA?"linear-gradient(135deg,#F4845F,#E06040)":"linear-gradient(135deg,#D4A017,#B8880F)";
      return (
        <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden" }}>
          <TopBar back="Jucători" backFn={()=>setSelPlayer(null)} />
          <div style={{ flex:1, overflowY:"auto", paddingBottom:70 }}>
            <div style={{ background:heroBg, padding:"24px 20px 20px", textAlign:"center" }}>
              <div style={{ position:"relative", display:"inline-block", cursor:"pointer" }}
                onClick={()=>document.getElementById(`pu-${alias}`).click()}>
                {profilePhotos[alias]
                  ?<img src={profilePhotos[alias]} alt={alias} style={{ width:64, height:64, borderRadius:"50%", objectFit:"cover", border:"3px solid rgba(255,255,255,0.6)" }}/>
                  :<Avatar alias={alias} size={64} />}
                <div style={{ position:"absolute", bottom:1, right:1, width:18, height:18, borderRadius:"50%",
                  background:"rgba(255,255,255,0.9)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10 }}>✎</div>
                <input id={`pu-${alias}`} type="file" accept="image/*" style={{ display:"none" }}
                  onChange={e=>handlePhotoUpload(alias,e.target.files[0])} />
              </div>
              {p.captain&&<div style={{ display:"inline-block", marginTop:6, background:"rgba(255,255,255,0.18)",
                borderRadius:T.rFull, padding:"2px 8px", fontSize:9, color:"#fff", textTransform:"uppercase" }}>⚑ Căpitan</div>}
              <div style={{ fontSize:18, fontWeight:700, color:"#fff", marginTop:p.captain?5:10, marginBottom:5 }}>{p.full}</div>
              <div style={{ display:"flex", gap:6, justifyContent:"center" }}>
                <span style={{ background:"rgba(255,255,255,0.18)", borderRadius:T.rFull, padding:"2px 8px", fontSize:10, color:"#fff" }}>{alias}</span>
                <span style={{ background:"rgba(255,255,255,0.12)", borderRadius:T.rFull, padding:"2px 8px", fontSize:10, color:"rgba(255,255,255,0.8)" }}>{isA?"Paul & BGN":"Laur & GxG"}</span>
              </div>
            </div>
            <div style={{ padding:"14px 12px" }}>
              <Card>
                {[{label:"Meciuri jucate",value:st.meciuri},{label:"Victorii echipă",value:st.victorii},
                  {label:"Jocuri câștigate",value:st.jocuri},{label:"Rată victorie",value:st.rata},
                  {label:"Streak curent",value:`${st.streak} meciuri`}].map((s,i,arr)=>(
                  <div key={i}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 14px" }}>
                      <span style={{ fontSize:12, color:T.text2 }}>{s.label}</span>
                      <span style={{ fontSize:14, fontWeight:700, color:T.text }}>{s.value}</span>
                    </div>
                    {i<arr.length-1&&<Divider mx={14} />}
                  </div>
                ))}
              </Card>
            </div>
          </div>
          <BottomNav />
        </div>
      );
    }
    return (
      <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden" }}>
        <TopBar />
        <div style={{ flex:1, overflowY:"auto", padding:"12px 10px 70px" }}>
          <div style={{ fontSize:18, fontWeight:700, color:T.text, letterSpacing:"-0.02em", marginBottom:14 }}>Jucători</div>
          {["A","B"].map(team=>{
            const isA=team==="A", wins=matches.filter(m=>m.winner===team).length, teamName=isA?"Paul & BGN":"Laur & GxG";
            return (
              <div key={team} style={{ marginBottom:16 }}>
                <SecLabel>{teamName} · {wins} {wins===1?"victorie":"victorii"}</SecLabel>
                <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                  {Object.entries(PLAYERS).filter(([,p])=>p.team===team).map(([alias])=>(
                    <Card key={alias} onClick={()=>openPlayer(alias)}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 12px" }}>
                        <Avatar alias={alias} size={38} />
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:2 }}>
                            <span style={{ fontSize:13, fontWeight:600, color:T.text }}>{PLAYERS[alias].full}</span>
                            {PLAYERS[alias].captain&&<span style={{ fontSize:8, color:T.text3, background:T.muted, borderRadius:T.r, padding:"1px 4px", border:`1px solid ${T.border}` }}>⚑</span>}
                          </div>
                          <Badge variant={isA?"teamA":"teamB"}>{alias}</Badge>
                        </div>
                        <div>
                          <span style={{ fontSize:20, fontWeight:800, color:T.text, letterSpacing:"-0.02em" }}>{playerStats[alias].jocuri}</span>
                          <span style={{ fontSize:13, fontWeight:500, color:T.text2, marginLeft:2 }}>({playerStats[alias].victorii})</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <BottomNav />
      </div>
    );
  };

  // ── ALBUM PAGE ────────────────────────────────────────────────────────────
  const AlbumPage = () => {
    const sorted=[...matches].sort((a,b)=>parseDate(a.date)-parseDate(b.date));
    const years=[...new Set(sorted.map(m=>dateYear(m.date)).filter(Boolean))];
    return (
      <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden" }}>
        <TopBar />
        <div style={{ flex:1, overflowY:"auto", padding:"12px 10px 110px" }}>
          {years.map(year=>(
            <div key={year} style={{ marginBottom:18 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.text3, letterSpacing:"0.06em", marginBottom:8 }}>{year}</div>
              <div style={{ position:"relative", paddingLeft:16 }}>
                <div style={{ position:"absolute", left:3, top:4, bottom:4, width:1.5, background:T.border, borderRadius:1 }} />
                {sorted.filter(m=>dateYear(m.date)===year).map(m=>{
                  const aWin=m.winner==="A", teamColor=aWin?T.teamA:T.teamB;
                  return (
                    <div key={m.id} style={{ position:"relative", marginBottom:14, cursor:"pointer" }} onClick={()=>openMatch(m)}>
                      <div style={{ position:"absolute", left:-16, top:4, width:7, height:7, borderRadius:"50%", background:teamColor, border:`1.5px solid ${T.bg}` }} />
                      <div style={{ fontSize:10, color:T.text3, marginBottom:2 }}>
                        {m.date}{m.location?` · 📍 ${m.location}`:""}{m.weekend?` · 🏆 ${m.weekend}`:""}
                      </div>
                      <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:2 }}>
                        {aWin?"Paul & BGN":"Laur & GxG"} câștigă {m.score.replace("-","–")}
                      </div>
                      {m.partide.length>0&&<div style={{ display:"flex", gap:3, marginBottom:m.quote?4:0 }}>
                        {m.partide.map((p,j)=><SetPill key={j} p={p} matchWinner={m.winner} />)}
                      </div>}
                      {m.quote&&<div style={{ fontSize:11, color:T.text3, fontStyle:"italic", lineHeight:1.4, marginBottom:m.photos>0?6:0 }}>"{m.quote}"</div>}
                      {m.photos>0&&<div style={{ display:"flex", gap:4 }}>
                        {Array(Math.min(m.photos,3)).fill(0).map((_,pi)=>(
                          <div key={pi} style={{ width:48, height:48, background:T.muted, borderRadius:T.rMd, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, border:`1px solid ${T.border}` }}>📸</div>
                        ))}
                        {m.photos>3&&<div style={{ width:48, height:48, background:T.muted, borderRadius:T.rMd, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:600, color:T.text3, border:`1px solid ${T.border}` }}>+{m.photos-3}</div>}
                      </div>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <FloatingAddBtn onClick={openAdd} bottom={FAB_BOTTOM} label="+ Adaugă poză" />
        <BottomNav />
      </div>
    );
  };

  // ── ADD / EDIT PAGE ───────────────────────────────────────────────────────
  const AddMatchPage = () => {
    const isEdit=!!editMatch;
    const scrollRef=useRef(null), dateRef=useRef(null);
    const [type,   setType]   = useState(isEdit?(editMatch.weekend?"weekend":"normal"):"normal");
    const [winner, setWinner] = useState(isEdit?editMatch.winner:null);
    const [jocuri, setJocuri] = useState(()=>{
      if(isEdit&&!editMatch.weekend){
        const f=editMatch.partide.map(p=>({
          a:p.setWinner===editMatch.winner?String(p.W):String(p.L),
          b:p.setWinner===editMatch.winner?String(p.L):String(p.W),
        }));
        while(f.length<3) f.push({a:"",b:""});
        return f.slice(0,3);
      }
      return [{a:"",b:""},{a:"",b:""},{a:"",b:""}];
    });
    const winsA=jocuri.filter(j=>j.a!==""&&j.b!==""&&Number(j.a)>Number(j.b)).length;
    const winsB=jocuri.filter(j=>j.a!==""&&j.b!==""&&Number(j.b)>Number(j.a)).length;
    const inp={ width:"100%", padding:"8px 10px", borderRadius:T.rMd, border:`1px solid ${T.border}`,
      background:T.bg, color:T.text, fontSize:13, fontFamily:"'Inter',sans-serif", boxSizing:"border-box", outline:"none" };
    const lbl={ fontSize:10, fontWeight:600, color:T.text2, marginBottom:4, display:"block", textTransform:"uppercase", letterSpacing:"0.04em" };
    const scrollToDate=()=>setTimeout(()=>{
      if(dateRef.current&&scrollRef.current){
        const el=dateRef.current, cont=scrollRef.current;
        cont.scrollBy({top:el.getBoundingClientRect().top-cont.getBoundingClientRect().top-80,behavior:"smooth"});
      }
    },80);
    return (
      <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden" }}>
        <TopBar back="Înapoi" backFn={()=>{ setShowAdd(false); setEditMatch(null); setShowPin(false); }} />
        <div ref={scrollRef} style={{ flex:1, overflowY:"auto", padding:"12px 10px 80px" }}>
          <SecLabel>{isEdit?"Editează meciul":"Tip meci"}</SecLabel>
          <div style={{ display:"flex", gap:6, marginBottom:14 }}>
            {[{id:"normal",label:"⚔️ Normal"},{id:"weekend",label:"🏆 Finala"}].map(t=>(
              <button key={t.id} onClick={()=>setType(t.id)} style={{ flex:1, padding:"10px 8px", borderRadius:T.rXl,
                cursor:"pointer", border:`1.5px solid ${type===t.id?"#1A9FD4":T.border}`,
                background:type===t.id?T.pinkSoft:T.card, textAlign:"center", transition:"all 0.15s" }}>
                <span style={{ fontSize:12, fontWeight:700, color:T.text }}>{t.label}</span>
              </button>
            ))}
          </div>
          <SecLabel>Câștigător</SecLabel>
          <div style={{ display:"flex", gap:6, marginBottom:14 }}>
            {[{id:"A",label:"Paul & BGN",color:T.teamA,soft:T.teamASoft,aliases:["Paul","BGN"]},
              {id:"B",label:"Laur & GxG",color:T.teamB,soft:T.teamBSoft,aliases:["Laur","GxG"]}].map(t=>(
              <button key={t.id} onClick={()=>setWinner(t.id)} style={{ flex:1, padding:"10px 8px", borderRadius:T.rXl,
                cursor:"pointer", border:`1.5px solid ${winner===t.id?t.color:T.border}`,
                background:winner===t.id?t.soft:T.card,
                display:"flex", alignItems:"center", justifyContent:"center", gap:6, transition:"all 0.15s" }}>
                <AvatarPair aliases={t.aliases} size={18} />
                <span style={{ fontSize:12, fontWeight:700, color:T.text }}>{t.label}</span>
              </button>
            ))}
          </div>
          {type==="weekend"&&(
            <Card style={{ marginBottom:12, padding:"12px" }}>
              <div style={{ marginBottom:10 }}>
                <label style={lbl}>Numele finalei</label>
                <input style={inp} placeholder="ex: Finala 2026" defaultValue={isEdit?editMatch.weekend||"":""} />
              </div>
              <label style={lbl}>Locație</label>
              <input style={inp} placeholder="ex: București" defaultValue={isEdit?editMatch.location||"":""} />
            </Card>
          )}
          <Card style={{ marginBottom:12, padding:"12px" }}>
            <label style={lbl}>Data</label>
            <input ref={dateRef} style={inp} type="date" defaultValue={isEdit?editMatch.date:fmtDate(new Date())} onFocus={scrollToDate} />
          </Card>
          {type==="normal"&&(
            <Card style={{ marginBottom:12, padding:"12px" }}>
              <label style={lbl}>Scoruri jocuri</label>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {jocuri.map((j,n)=>(
                  <div key={n}>
                    <div style={{ fontSize:9, color:T.text3, marginBottom:4 }}>Joc {n+1}{n===2?" · opțional":""}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <input style={{ ...inp, textAlign:"center", fontSize:16, fontWeight:700, padding:"7px" }}
                        type="number" placeholder="0" value={j.a}
                        onChange={e=>setJocuri(prev=>prev.map((x,i)=>i===n?{...x,a:e.target.value}:x))} />
                      <span style={{ fontSize:12, color:T.text3 }}>–</span>
                      <input style={{ ...inp, textAlign:"center", fontSize:16, fontWeight:700, padding:"7px" }}
                        type="number" placeholder="0" value={j.b}
                        onChange={e=>setJocuri(prev=>prev.map((x,i)=>i===n?{...x,b:e.target.value}:x))} />
                    </div>
                  </div>
                ))}
              </div>
              {(winsA>0||winsB>0)&&(
                <div style={{ marginTop:10, padding:"8px 12px", background:T.muted, borderRadius:T.rLg,
                  display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:10, color:T.text2 }}>Scor calculat</span>
                  <span style={{ fontSize:18, fontWeight:800, color:T.text }}>{winsA}–{winsB}</span>
                </div>
              )}
            </Card>
          )}
          {type==="weekend"&&(
            <Card style={{ marginBottom:12, padding:"12px" }}>
              <label style={lbl}>Scor total jocuri</label>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                {["Paul & BGN","Laur & GxG"].map((lbl2,i)=>(
                  <div key={i} style={{ flex:1, textAlign:"center" }}>
                    <div style={{ fontSize:10, color:T.text3, marginBottom:4 }}>{lbl2}</div>
                    <input style={{ ...inp, textAlign:"center", fontSize:20, fontWeight:800, padding:"7px" }}
                      type="number" min="0" placeholder="0"
                      defaultValue={isEdit?(i===0?editMatch.score.split("-")[0]:editMatch.score.split("-")[1]):""} />
                  </div>
                ))}
              </div>
            </Card>
          )}
          <Card style={{ marginBottom:12, padding:"12px" }}>
            <label style={lbl}>Comentariu <span style={{ color:T.text3, fontWeight:400, textTransform:"none" }}>(opțional)</span></label>
            <textarea style={{ ...inp, height:60, resize:"none" }}
              placeholder='ex: "Seara în care nimeni nu a dormit..."'
              defaultValue={isEdit?(editMatch.quote||""):""} />
          </Card>
          <GradBtn onClick={()=>{ setShowAdd(false); setEditMatch(null); setShowPin(false); }} full>
            {isEdit?"✓ Salvează modificările":"✓ Salvează meciul"}
          </GradBtn>
        </div>
      </div>
    );
  };

  // ── MODALS ────────────────────────────────────────────────────────────────
  const PinModal = () => (
    <div onClick={()=>{ setShowPin(false); setPin(""); setPinErr(false); }}
      style={{ position:"absolute", inset:0, background:"rgba(15,23,42,0.5)",
        display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:60,
        backdropFilter:"blur(4px)", WebkitBackdropFilter:"blur(4px)" }}>
      <div onClick={e=>e.stopPropagation()}
        style={{ width:"100%", background:T.card, borderRadius:"18px 18px 0 0", padding:"18px 18px 24px", boxShadow:T.shadowLg }}>
        <PinKeypad pin={pin} setPin={setPin} pinErr={pinErr} setPinErr={setPinErr} title="Introdu PIN"
          onSuccess={()=>{ setShowPin(false); setPin(""); setShowAdd(true); }} />
      </div>
    </div>
  );

  const DeletePinModal = () => (
    <div onClick={()=>{ setShowDeletePin(false); setDeletePin(""); setDeletePinErr(false); }}
      style={{ position:"absolute", inset:0, background:"rgba(15,23,42,0.5)",
        display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:70,
        backdropFilter:"blur(4px)", WebkitBackdropFilter:"blur(4px)" }}>
      <div onClick={e=>e.stopPropagation()}
        style={{ width:"100%", background:T.card, borderRadius:"18px 18px 0 0", padding:"18px 18px 24px", boxShadow:T.shadowLg }}>
        <PinKeypad pin={deletePin} setPin={setDeletePin} pinErr={deletePinErr} setPinErr={setDeletePinErr}
          title="Șterge meciul" titleColor="#DC2626"
          onSuccess={()=>{ deleteMatch(deleteTarget); setShowDeletePin(false); setDeletePin(""); setDeleteTarget(null); }} />
      </div>
    </div>
  );

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <PhoneShell>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden", position:"relative" }}>
        {showAdd ? <AddMatchPage /> : (
          <>
            {page==="home"    && <HomePage />}
            {page==="meciuri" && <MatchesPage />}
            {page==="match"   && <MatchDetailPage />}
            {page==="players" && <PlayersPage />}
            {page==="album"   && <AlbumPage />}
          </>
        )}
        {showPin       && !showAdd && <PinModal />}
        {showDeletePin && <DeletePinModal />}
      </div>
    </PhoneShell>
  );
}
