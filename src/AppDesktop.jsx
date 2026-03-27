import { useState, useEffect, useCallback } from "react";

const T = {
  bg:"#F0F7F9", card:"#FFFFFF", muted:"#E8F4F6", border:"#C8E6EC",
  text:"#0A2540", text2:"#3A6B7A", text3:"#7AADB8",
  gradient:"linear-gradient(135deg,#1BC4A0,#1A9FD4,#1A6FD4)",
  pink:"#1A9FD4", pinkSoft:"rgba(26,159,212,0.10)",
  teamA:"#F4845F", teamASoft:"#FEF3EE", teamABorder:"#FAC4AD",
  teamB:"#D4A017", teamBSoft:"#FDF8E6", teamBBorder:"#EDD87A",
  shadow:"0 1px 3px rgba(0,0,0,0.07)",
  shadowMd:"0 4px 12px rgba(0,0,0,0.08)",
  shadowLg:"0 10px 32px rgba(0,0,0,0.10)",
  r:4, rMd:6, rLg:8, rXl:12, rFull:9999,
};

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

const MONTHS = ["Ian","Feb","Mar","Apr","Mai","Iun","Iul","Aug","Sep","Oct","Nov","Dec"];
const fmtDate   = d => `${String(d.getDate()).padStart(2,"0")} ${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
const parseDate = str => { const [dd,mmm,yy]=str.split(" "); return new Date(2000+Number(yy),Math.max(0,MONTHS.indexOf(mmm)),Number(dd)); };
const dateYear  = str => str.split(" ")[2]||"";

const calcStats = matches => {
  const s={};
  Object.entries(PLAYERS).forEach(([alias,{team}])=>{
    const wins=matches.filter(m=>m.winner===team).length;
    const gamesWon=matches.reduce((acc,m)=>{
      if(m.winner!==team) return acc;
      return acc+m.partide.filter(p=>p.setWinner===team).length+(team==="A"?m.setsA||0:m.setsB||0);
    },0);
    let streak=0; for(const m of matches){if(m.winner===team)streak++;else break;}
    s[alias]={meciuri:matches.length,victorii:wins,jocuri:gamesWon,
      rata:matches.length>0?Math.round(wins/matches.length*100)+"%":"0%",streak};
  });
  return s;
};

// ── PRIMITIVES ────────────────────────────────────────────────────────────
const Avatar = ({alias,size=36})=>{
  const p=PLAYERS[alias]||{};
  return <div style={{width:size,height:size,borderRadius:"50%",background:p.color||"#94A3B8",
    display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",
    fontSize:size*0.32,fontWeight:700,flexShrink:0,boxShadow:`0 2px 8px ${p.color}44`}}>
    {p.initials||alias.slice(0,2)}
  </div>;
};

const AvatarPair = ({aliases,size=36,light=false})=>(
  <div style={{display:"flex",alignItems:"center"}}>
    {aliases.map((alias,i)=>{
      const p=PLAYERS[alias]||{};
      return <div key={alias} style={{marginLeft:i===0?0:-Math.round(size*0.12),zIndex:i===0?2:1,
        position:"relative",width:size,height:size,borderRadius:"50%",
        background:light?"rgba(255,255,255,0.22)":(p.color||"#94A3B8"),
        display:"flex",alignItems:"center",justifyContent:"center",
        color:"#fff",fontSize:size*0.32,fontWeight:700,flexShrink:0}}>
        {p.initials||alias.slice(0,2)}
      </div>;
    })}
  </div>
);

const Badge = ({children,variant="default"})=>{
  const v={default:{bg:T.muted,color:T.text2,border:T.border},
    teamA:{bg:T.teamASoft,color:T.text2,border:T.teamABorder},
    teamB:{bg:T.teamBSoft,color:T.text2,border:T.teamBBorder}}[variant]||{bg:T.muted,color:T.text2,border:T.border};
  return <span style={{fontSize:11,fontWeight:500,padding:"2px 8px",borderRadius:T.r,
    background:v.bg,color:v.color,border:`1px solid ${v.border}`,display:"inline-flex",alignItems:"center"}}>
    {children}
  </span>;
};

const Card = ({children,style={},onClick})=>{
  const [hov,setHov]=useState(false);
  return <div onClick={onClick} onMouseEnter={()=>onClick&&setHov(true)} onMouseLeave={()=>onClick&&setHov(false)}
    style={{background:T.card,border:`1px solid ${hov?"#1A9FD4":T.border}`,borderRadius:T.rXl,
      boxShadow:hov?T.shadowMd:T.shadow,transition:"border-color 0.15s, box-shadow 0.15s",
      cursor:onClick?"pointer":"default",overflow:"hidden",...style}}>
    {children}
  </div>;
};

const GradBtn = ({children,onClick,sm=false})=>(
  <button onClick={onClick}
    onMouseEnter={e=>e.currentTarget.style.opacity="0.88"}
    onMouseLeave={e=>e.currentTarget.style.opacity="1"}
    style={{background:T.gradient,border:"none",borderRadius:T.rFull,
      padding:sm?"8px 18px":"10px 24px",cursor:"pointer",
      fontSize:sm?16:14,fontWeight:600,color:"#fff",
      boxShadow:"0 2px 12px rgba(26,159,212,0.35)",transition:"opacity 0.15s",
      whiteSpace:"nowrap"}}>
    {children}
  </button>
);

const SecLabel = ({children})=>(
  <div style={{fontSize:10,fontWeight:600,color:T.text3,textTransform:"uppercase",
    letterSpacing:"0.07em",marginBottom:10}}>{children}</div>
);

const Divider = ({mx=0})=><div style={{height:1,background:T.border,margin:`0 ${mx}px`}}/>;

const SetPill = ({p,matchWinner})=>{
  const isA=p.setWinner==="A";
  const first=p.setWinner===matchWinner?p.W:p.L, second=p.setWinner===matchWinner?p.L:p.W;
  return <span style={{fontSize:11,fontWeight:600,padding:"2px 7px",borderRadius:T.r,
    background:isA?T.teamASoft:T.teamBSoft,color:T.text2,
    border:`1px solid ${isA?T.teamABorder:T.teamBBorder}`,whiteSpace:"nowrap"}}>
    {first}–{second}
  </span>;
};

const PinKeypad = ({pin,setPin,onSuccess,pinErr,setPinErr,title,titleColor=T.text})=>(
  <>
    <div style={{fontSize:18,fontWeight:700,color:titleColor,marginBottom:4}}>{title}</div>
    <div style={{fontSize:12,color:T.text2,marginBottom:20}}>Introdu PIN pentru acces</div>
    <div style={{display:"flex",justifyContent:"center",gap:14,marginBottom:8}}>
      {[0,1,2,3].map(i=>(
        <div key={i} style={{width:12,height:12,borderRadius:"50%",
          background:pin.length>i?(titleColor===T.text?T.pink:titleColor):T.muted,
          border:`1.5px solid ${pin.length>i?(titleColor===T.text?T.pink:titleColor):T.border}`,
          transition:"all 0.15s"}}/>
      ))}
    </div>
    {pinErr&&<div style={{textAlign:"center",fontSize:11,color:"#DC2626",marginBottom:6}}>PIN incorect</div>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:16,maxWidth:240,margin:"16px auto 0"}}>
      {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((k,i)=>(
        <button key={i}
          onClick={()=>{
            if(k==="⌫"){setPin(p=>p.slice(0,-1));setPinErr(false);}
            else if(k!==""){
              const np=pin+k; setPin(np);
              if(np.length===4){if(np==="7777") onSuccess(); else{setPinErr(true);setTimeout(()=>setPin(""),500);}}
            }
          }}
          onMouseEnter={e=>k!==""&&(e.currentTarget.style.background=T.border)}
          onMouseLeave={e=>k!==""&&(e.currentTarget.style.background=T.muted)}
          style={{height:52,borderRadius:T.rLg,fontSize:20,fontWeight:400,
            cursor:k===""?"default":"pointer",background:k===""?"transparent":T.muted,
            border:k===""?"none":`1px solid ${T.border}`,color:T.text,opacity:k===""?0:1,
            transition:"background 0.1s"}}>
          {k}
        </button>
      ))}
    </div>
  </>
);

// ── MATCH ROW ─────────────────────────────────────────────────────────────
const MatchRow = ({m,onClick,isSelected=false})=>{
  const [hov,setHov]=useState(false);
  const aWin=m.winner==="A";
  const [sW,sL]=m.score.split("-");
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{display:"grid",gridTemplateColumns:"2fr auto 2fr auto",alignItems:"center",gap:16,
        padding:"12px 20px",cursor:"pointer",
        background:isSelected?"rgba(26,159,212,0.05)":hov?"rgba(26,159,212,0.02)":"transparent",
        borderLeft:`3px solid ${isSelected?T.pink:hov?T.pink+"55":"transparent"}`,
        transition:"all 0.12s"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <AvatarPair aliases={aWin?["Paul","BGN"]:["Laur","GxG"]} size={30}/>
        <div>
          <div style={{fontSize:13,fontWeight:600,color:T.text}}>{aWin?"Paul & BGN":"Laur & GxG"}</div>
          {m.weekend&&<div style={{fontSize:11,color:T.text3}}>🏆 {m.weekend}</div>}
          {m.quote&&<div style={{fontSize:11,color:T.text3,fontStyle:"italic",
            maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>"{m.quote}"</div>}
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
        <span style={{fontSize:18,fontWeight:800,color:T.text}}>{sW}</span>
        <span style={{fontSize:12,color:T.text3}}>–</span>
        <span style={{fontSize:18,fontWeight:800,color:T.text3}}>{sL}</span>
      </div>
      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
        {m.partide.map((p,j)=><SetPill key={j} p={p} matchWinner={m.winner}/>)}
      </div>
      <div style={{fontSize:12,color:T.text3,textAlign:"right",flexShrink:0}}>{m.date}</div>
    </div>
  );
};

// ══ MAIN ══════════════════════════════════════════════════════════════════
export default function SepticaClubDesktop() {
  const [page,          setPage]          = useState("home");
  const [selMatch,      setSelMatch]      = useState(null);
  const [selPlayer,     setSelPlayer]     = useState(null);
  const [matches,       setMatches]       = useState(INITIAL_MATCHES);
  const [editMatch,     setEditMatch]     = useState(null);
  const [mounted,       setMounted]       = useState(false);
  const [showPin,       setShowPin]       = useState(false);
  const [showAdd,       setShowAdd]       = useState(false);
  const [pin,           setPin]           = useState("");
  const [pinErr,        setPinErr]        = useState(false);
  const [showDeletePin, setShowDeletePin] = useState(false);
  const [deletePin,     setDeletePin]     = useState("");
  const [deletePinErr,  setDeletePinErr]  = useState(false);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [profilePhotos, setProfilePhotos] = useState({});
  const [showPhotoPin,  setShowPhotoPin]  = useState(false);
  const [photoPin,      setPhotoPin]      = useState("");
  const [photoPinErr,   setPhotoPinErr]   = useState(false);
  const [photoTarget,   setPhotoTarget]   = useState(null);

  useEffect(()=>{setTimeout(()=>setMounted(true),60);},[]);

  const openMatch   = useCallback(m=>{setSelMatch(m);setPage("match");},[]);
  const openPlayer  = useCallback(alias=>{setSelPlayer(alias);setPage("player");},[]);
  const openAdd     = useCallback(()=>{setEditMatch(null);setShowPin(true);},[]);
  const openEdit    = useCallback(m=>{setEditMatch(m);setShowPin(true);},[]);
  const deleteMatch = useCallback(id=>{setMatches(prev=>prev.filter(m=>m.id!==id));setSelMatch(null);setPage("meciuri");},[]);
  const handlePhotoUpload = useCallback((alias,file)=>{
    if(!file) return;
    const r = new FileReader();
    r.onload = e => setProfilePhotos(prev=>({...prev,[alias]:e.target.result}));
    r.readAsDataURL(file);
  },[]);
  const requestPhotoChange = useCallback(alias=>{setPhotoTarget(alias);setShowPhotoPin(true);},[]);
  const playerStats = calcStats(matches);

  // ── TOP NAV ───────────────────────────────────────────────────────────────
  const TopNav = ()=>(
    <div style={{
      background:"rgba(240,247,249,0.92)",
      backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
      borderBottom:`1px solid ${T.border}`,
      position:"sticky", top:0, zIndex:50,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 180px", height:60,
    }}>
      {/* Logo */}
      <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <div style={{width:34,height:34,borderRadius:T.rMd,background:T.gradient,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:20,fontWeight:900,color:"#fff",boxShadow:"0 2px 10px rgba(26,159,212,0.35)"}}>7</div>
        <div>
          <div style={{fontSize:24,fontWeight:700,color:T.text,lineHeight:1.1}}>Șeptică pe Vorbite</div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{display:"flex",alignItems:"center",gap:2}}>
        {[
          {id:"home",    label:"Acasă",    suit:"♠", red:false},
          {id:"meciuri", label:"Meciuri",  suit:"♥", red:true },
          {id:"players", label:"Jucători", suit:"♣", red:false},
          {id:"album",   label:"Album",    suit:"♦", red:true },
        ].map(nav=>{
          const active=page===nav.id||(page==="match"&&nav.id==="meciuri")||(page==="player"&&nav.id==="players");
          const col = nav.red?"#D42B2B":"#111";
          return (
            <button key={nav.id} onClick={()=>setPage(nav.id)} style={{
              display:"flex",alignItems:"center",gap:7,padding:"8px 16px",
              borderRadius:T.rFull,border:"none",cursor:"pointer",
              background:active?`${col}0F`:"transparent",
              color:active?col:T.text2,
              fontSize:15,fontWeight:active?700:500,
              transition:"all 0.15s"}}>
              <span style={{fontSize:18,lineHeight:1,color:col}}>{nav.suit}</span>
              {nav.label}
            </button>
          );
        })}
      </nav>

      {/* CTA */}
      <GradBtn onClick={openAdd} sm>+ Adaugă meci nou</GradBtn>
    </div>
  );

  // ── HOME ──────────────────────────────────────────────────────────────────
  const HomePage = ()=>{
    const winsA=matches.filter(m=>m.winner==="A").length;
    const winsB=matches.filter(m=>m.winner==="B").length;
    const total=matches.length;
    const setsA=matches.reduce((a,m)=>a+m.partide.filter(p=>p.setWinner==="A").length+(m.setsA||0),0);
    const setsB=matches.reduce((a,m)=>a+m.partide.filter(p=>p.setWinner==="B").length+(m.setsB||0),0);
    return (
      <div style={{opacity:mounted?1:0,transition:"opacity 0.4s",display:"flex",flexDirection:"column",gap:20}}>

        {/* Hero */}
        <div style={{background:T.gradient,borderRadius:T.rXl,padding:"40px 48px",
          boxShadow:"0 8px 32px rgba(26,159,212,0.2)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:32}}>
            <div style={{flex:1,textAlign:"center"}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
                <AvatarPair aliases={["Paul","BGN"]} size={48} light/>
              </div>
              <div style={{fontSize:80,fontWeight:800,lineHeight:1,letterSpacing:"-0.03em",color:"#fff"}}>{setsA}</div>
              <div style={{fontSize:14,color:"rgba(255,255,255,0.55)",marginTop:6}}>{winsA} {winsA===1?"victorie":"victorii"}</div>
            </div>
            <div style={{textAlign:"center",flexShrink:0}}>
              <div style={{fontSize:24,color:"rgba(255,255,255,0.4)",fontWeight:700}}>vs</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.3)",marginTop:4}}>{total} meciuri</div>
            </div>
            <div style={{flex:1,textAlign:"center"}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
                <AvatarPair aliases={["Laur","GxG"]} size={48} light/>
              </div>
              <div style={{fontSize:80,fontWeight:800,lineHeight:1,letterSpacing:"-0.03em",color:"rgba(255,255,255,0.35)"}}>{setsB}</div>
              <div style={{fontSize:14,color:"rgba(255,255,255,0.55)",marginTop:6}}>{winsB} {winsB===1?"victorie":"victorii"}</div>
            </div>
          </div>
        </div>

        {/* Meciuri recente */}
        <Card>
          <div style={{padding:"14px 20px 12px",borderBottom:`1px solid ${T.border}`,
            display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <SecLabel>Meciuri recente</SecLabel>
            <button onClick={()=>setPage("meciuri")} style={{fontSize:12,color:T.pink,
              background:"none",border:"none",cursor:"pointer",fontWeight:600}}>
              Vezi toate →
            </button>
          </div>
          {matches.slice(0,4).map((m,i)=>(
            <div key={m.id}>
              <MatchRow m={m} onClick={()=>openMatch(m)} isSelected={selMatch?.id===m.id}/>
              {i<Math.min(matches.length,4)-1&&<Divider/>}
            </div>
          ))}
        </Card>
      </div>
    );
  };

  // ── MATCHES PAGE ──────────────────────────────────────────────────────────
  const MatchesPage = ()=>(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h1 style={{fontSize:22,fontWeight:700,color:T.text,margin:0}}>Lista de meciuri</h1>
      </div>
      <Card>
        <div style={{display:"grid",gridTemplateColumns:"2fr auto 2fr auto",gap:16,
          padding:"10px 20px",borderBottom:`1px solid ${T.border}`}}>
          {["Echipă câștigătoare","Scor","Jocuri","Data"].map(h=>(
            <div key={h} style={{fontSize:10,fontWeight:600,color:T.text3,textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</div>
          ))}
        </div>
        {matches.map((m,i)=>(
          <div key={m.id}>
            <MatchRow m={m} onClick={()=>openMatch(m)} isSelected={selMatch?.id===m.id}/>
            {i<matches.length-1&&<Divider/>}
          </div>
        ))}
      </Card>
    </div>
  );

  // ── MATCH DETAIL ──────────────────────────────────────────────────────────
  const MatchDetailPage = ()=>{
    const m=selMatch;
    if(!m) return <div style={{color:T.text3,padding:"60px 0",textAlign:"center",fontSize:14}}>Selectează un meci din listă</div>;
    const aWin=m.winner==="A";
    const [sW,sL]=m.score.split("-");
    const heroBg=aWin?"linear-gradient(135deg,#F4845F,#E06040)":"linear-gradient(135deg,#D4A017,#B8880F)";
    return (
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <button onClick={()=>setPage("meciuri")} style={{display:"flex",alignItems:"center",gap:6,
            background:"none",border:"none",cursor:"pointer",fontSize:13,fontWeight:500,color:T.text2}}>
            ← Meciuri
          </button>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>openEdit(m)}
              onMouseEnter={e=>e.currentTarget.style.borderColor=T.pink}
              onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}
              style={{background:"transparent",border:`1px solid ${T.border}`,borderRadius:T.rMd,
                padding:"7px 16px",cursor:"pointer",fontSize:13,fontWeight:500,color:T.text2,transition:"border-color 0.15s"}}>
              ✎ Editează
            </button>
            <button onClick={()=>{setDeleteTarget(m.id);setShowDeletePin(true);}}
              onMouseEnter={e=>{e.currentTarget.style.background="#FEF2F2";e.currentTarget.style.borderColor="#DC2626";}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="#FCA5A5";}}
              style={{background:"transparent",border:"1px solid #FCA5A5",borderRadius:T.rMd,
                padding:"7px 16px",cursor:"pointer",fontSize:13,fontWeight:500,color:"#DC2626",transition:"all 0.15s"}}>
              🗑 Șterge
            </button>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,alignItems:"start"}}>
          {/* Hero scor */}
          <Card style={{background:heroBg,border:"none",boxShadow:"0 8px 28px rgba(0,0,0,0.14)"}}>
            <div style={{padding:"40px 32px",textAlign:"center"}}>
              {m.weekend&&<div style={{display:"inline-block",marginBottom:12,background:"rgba(255,255,255,0.18)",
                borderRadius:T.rFull,padding:"4px 14px",fontSize:12,color:"#fff"}}>🏆 {m.weekend}</div>}
              <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{m.date}</div>
              <div style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.85)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:28}}>
                {aWin?"Paul & BGN":"Laur & GxG"} câștigă
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:28}}>
                {[{aliases:["Paul","BGN"],label:"Paul & BGN",score:aWin?sW:sL,dim:!aWin},
                  {aliases:["Laur","GxG"],label:"Laur & GxG",score:aWin?sL:sW,dim:aWin}].map((t,i)=>(
                  <div key={i} style={{textAlign:"center"}}>
                    <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
                      <AvatarPair aliases={t.aliases} size={36} light/>
                    </div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>{t.label}</div>
                    <div style={{fontSize:88,fontWeight:800,lineHeight:1,letterSpacing:"-0.03em",
                      color:t.dim?"rgba(255,255,255,0.28)":"#fff"}}>{t.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Detalii */}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {m.partide.length>0&&(
              <Card>
                <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.border}`}}>
                  <SecLabel>Partide</SecLabel>
                </div>
                {m.partide.map((p,i)=>{
                  const f=p.setWinner===m.winner?p.W:p.L, s=p.setWinner===m.winner?p.L:p.W;
                  return <div key={i}>
                    <div style={{display:"flex",alignItems:"center",padding:"13px 18px",gap:14}}>
                      <span style={{fontSize:12,color:T.text2,width:64}}>Partida {i+1}</span>
                      <div style={{flex:1,display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:24,fontWeight:700,color:T.text}}>{f}</span>
                        <span style={{fontSize:13,color:T.text3}}>–</span>
                        <span style={{fontSize:24,fontWeight:700,color:T.text3}}>{s}</span>
                      </div>
                      <Badge variant={p.setWinner==="A"?"teamA":"teamB"}>{p.setWinner==="A"?"Paul & BGN":"Laur & GxG"}</Badge>
                    </div>
                    {i<m.partide.length-1&&<Divider mx={18}/>}
                  </div>;
                })}
              </Card>
            )}
            {m.quote&&(
              <Card style={{borderLeft:`4px solid #1A9FD4`,borderRadius:0}}>
                <div style={{padding:"18px 20px",fontSize:15,color:T.text,fontStyle:"italic",lineHeight:1.6}}>
                  "{m.quote}"
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── PLAYERS PAGE ──────────────────────────────────────────────────────────
  const PlayersPage = ()=>{
    const winsA = matches.filter(m=>m.winner==="A").length;
    const winsB = matches.filter(m=>m.winner==="B").length;

    const TeamCard = ({team, aliases, name, wins, heroBg, soft, border, variant})=>{
      const st = playerStats[aliases[0]];
      return (
        <Card style={{overflow:"visible"}}>
          {/* Team header */}
          <div style={{background:heroBg,borderRadius:`${T.rXl}px ${T.rXl}px 0 0`,padding:"24px 28px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <AvatarPair aliases={aliases} size={44} light/>
                <div>
                  <div style={{fontSize:18,fontWeight:700,color:"#fff"}}>{name}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:2}}>
                    {wins} {wins===1?"victorie":"victorii"}
                  </div>
                </div>
              </div>
              {/* Team stats pills */}
              <div style={{display:"flex",gap:16}}>
                {[
                  {l:"Meciuri", v:st.meciuri},
                  {l:"Victorii", v:st.victorii},
                  {l:"Rată", v:st.rata},
                  {l:"Streak", v:`${st.streak}`},
                ].map(s=>(
                  <div key={s.l} style={{textAlign:"center"}}>
                    <div style={{fontSize:22,fontWeight:800,color:"#fff",lineHeight:1}}>{s.v}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.55)",marginTop:3,textTransform:"uppercase",letterSpacing:"0.05em"}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Players row */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",borderTop:`1px solid ${T.border}`}}>
            {aliases.map((alias,i)=>{
              const p=PLAYERS[alias];
              return (
                <div key={alias} style={{
                  padding:"20px 28px",
                  borderRight:i===0?`1px solid ${T.border}`:"none",
                  display:"flex",alignItems:"center",gap:14,
                }}>
                  <div style={{position:"relative",cursor:"pointer",flexShrink:0}} onClick={()=>requestPhotoChange(alias)}>
                    {profilePhotos[alias]
                      ?<img src={profilePhotos[alias]} alt={alias} style={{width:48,height:48,borderRadius:"50%",objectFit:"cover"}}/>
                      :<Avatar alias={alias} size={48}/>}
                    <div style={{position:"absolute",bottom:0,right:0,width:16,height:16,borderRadius:"50%",
                      background:"rgba(255,255,255,0.9)",display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:8,boxShadow:"0 1px 3px rgba(0,0,0,0.15)"}}>✎</div>
                    <input id={`pu-${alias}`} type="file" accept="image/*" style={{display:"none"}}
                      onChange={e=>handlePhotoUpload(alias,e.target.files[0])}/>
                  </div>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                      <span style={{fontSize:15,fontWeight:700,color:T.text}}>{p.full}</span>
                      {p.captain&&<span style={{fontSize:9,color:T.text3,background:T.muted,
                        borderRadius:T.r,padding:"1px 5px",border:`1px solid ${T.border}`}}>⚑ căpitan</span>}
                    </div>
                    <Badge variant={variant}>{alias}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      );
    };

    return (
      <div>
        <h1 style={{fontSize:22,fontWeight:700,color:T.text,margin:"0 0 24px"}}>Jucători</h1>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <TeamCard team="A" aliases={["Paul","BGN"]} name="Paul & BGN" wins={winsA}
            heroBg="linear-gradient(135deg,#F4845F,#E06040)"
            soft={T.teamASoft} border={T.teamABorder} variant="teamA"/>
          <TeamCard team="B" aliases={["Laur","GxG"]} name="Laur & GxG" wins={winsB}
            heroBg="linear-gradient(135deg,#D4A017,#B8880F)"
            soft={T.teamBSoft} border={T.teamBBorder} variant="teamB"/>
        </div>
      </div>
    );
  };

  // ── ALBUM PAGE ────────────────────────────────────────────────────────────
  const AlbumPage = ()=>{
    const sorted=[...matches].sort((a,b)=>parseDate(a.date)-parseDate(b.date));
    const years=[...new Set(sorted.map(m=>dateYear(m.date)).filter(Boolean))];
    return (
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <h1 style={{fontSize:22,fontWeight:700,color:T.text,margin:0}}>Istoric</h1>
        </div>
        <div style={{maxWidth:640}}>
          {years.map(year=>(
            <div key={year} style={{marginBottom:28}}>
              <div style={{fontSize:12,fontWeight:700,color:T.text3,letterSpacing:"0.06em",marginBottom:14}}>{year}</div>
              <div style={{position:"relative",paddingLeft:22}}>
                <div style={{position:"absolute",left:4,top:4,bottom:4,width:2,background:T.border,borderRadius:1}}/>
                {sorted.filter(m=>dateYear(m.date)===year).map(m=>{
                  const aWin=m.winner==="A", teamColor=aWin?T.teamA:T.teamB;
                  return (
                    <div key={m.id} style={{position:"relative",marginBottom:22,cursor:"pointer"}} onClick={()=>openMatch(m)}>
                      <div style={{position:"absolute",left:-22,top:5,width:10,height:10,borderRadius:"50%",
                        background:teamColor,border:`2px solid ${T.bg}`}}/>
                      <div style={{fontSize:11,color:T.text3,marginBottom:3}}>
                        {m.date}{m.location?` · 📍 ${m.location}`:""}{m.weekend?` · 🏆 ${m.weekend}`:""}
                      </div>
                      <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:5}}>
                        {aWin?"Paul & BGN":"Laur & GxG"} câștigă {m.score.replace("-","–")}
                      </div>
                      {m.partide.length>0&&<div style={{display:"flex",gap:4,marginBottom:m.quote?6:0}}>
                        {m.partide.map((p,j)=><SetPill key={j} p={p} matchWinner={m.winner}/>)}
                      </div>}
                      {m.quote&&<div style={{fontSize:13,color:T.text3,fontStyle:"italic",lineHeight:1.5}}>"{m.quote}"</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── ADD/EDIT ──────────────────────────────────────────────────────────────
  const AddMatchPage = ()=>{
    const isEdit=!!editMatch;
    const [type,  setType]  = useState(isEdit?(editMatch.weekend?"weekend":"normal"):"normal");
    const [winner,setWinner]= useState(isEdit?editMatch.winner:null);
    const [jocuri,setJocuri]= useState(()=>{
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
    const inp={width:"100%",padding:"9px 12px",borderRadius:T.rMd,border:`1px solid ${T.border}`,
      background:T.bg,color:T.text,fontSize:14,fontFamily:"'Inter',sans-serif",boxSizing:"border-box",outline:"none"};
    const lbl={fontSize:11,fontWeight:600,color:T.text2,marginBottom:6,display:"block",textTransform:"uppercase",letterSpacing:"0.04em"};
    return (
      <div style={{maxWidth:560}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28}}>
          <button onClick={()=>{setShowAdd(false);setEditMatch(null);}}
            style={{background:"none",border:"none",cursor:"pointer",fontSize:13,fontWeight:500,color:T.text2}}>
            ← Înapoi
          </button>
          <h1 style={{fontSize:20,fontWeight:700,color:T.text,margin:0}}>{isEdit?"Editează meciul":"Meci nou"}</h1>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div>
            <SecLabel>Tip meci</SecLabel>
            <div style={{display:"flex",gap:8}}>
              {[{id:"normal",label:"⚔️ Meci normal"},{id:"weekend",label:"🏆 Finala"}].map(t=>(
                <button key={t.id} onClick={()=>setType(t.id)} style={{flex:1,padding:"13px",
                  borderRadius:T.rXl,cursor:"pointer",border:`1.5px solid ${type===t.id?T.pink:T.border}`,
                  background:type===t.id?T.pinkSoft:T.card,fontSize:13,fontWeight:700,color:T.text,transition:"all 0.15s"}}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <SecLabel>Câștigător</SecLabel>
            <div style={{display:"flex",gap:8}}>
              {[{id:"A",label:"Paul & BGN",color:T.teamA,soft:T.teamASoft,aliases:["Paul","BGN"]},
                {id:"B",label:"Laur & GxG",color:T.teamB,soft:T.teamBSoft,aliases:["Laur","GxG"]}].map(t=>(
                <button key={t.id} onClick={()=>setWinner(t.id)} style={{flex:1,padding:"13px",
                  borderRadius:T.rXl,cursor:"pointer",border:`1.5px solid ${winner===t.id?t.color:T.border}`,
                  background:winner===t.id?t.soft:T.card,display:"flex",alignItems:"center",
                  justifyContent:"center",gap:8,fontSize:13,fontWeight:700,color:T.text,transition:"all 0.15s"}}>
                  <AvatarPair aliases={t.aliases} size={22}/>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          {type==="weekend"&&(
            <Card style={{padding:"16px"}}>
              <div style={{marginBottom:12}}>
                <label style={lbl}>Numele finalei</label>
                <input style={inp} placeholder="ex: Finala 2026" defaultValue={isEdit?editMatch.weekend||"":""}/>
              </div>
              <label style={lbl}>Locație</label>
              <input style={inp} placeholder="ex: București" defaultValue={isEdit?editMatch.location||"":""}/>
            </Card>
          )}
          <Card style={{padding:"16px"}}>
            <label style={lbl}>Data</label>
            <input style={inp} type="date" defaultValue={isEdit?editMatch.date:fmtDate(new Date())}/>
          </Card>
          {type==="normal"&&(
            <Card style={{padding:"16px"}}>
              <label style={lbl}>Scoruri jocuri</label>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {jocuri.map((j,n)=>(
                  <div key={n} style={{display:"grid",gridTemplateColumns:"80px 1fr 20px 1fr",alignItems:"center",gap:10}}>
                    <span style={{fontSize:12,color:T.text3}}>Joc {n+1}{n===2?" · opt.":""}</span>
                    <input style={{...inp,textAlign:"center",fontSize:18,fontWeight:700}} type="number" placeholder="0" value={j.a}
                      onChange={e=>setJocuri(prev=>prev.map((x,i)=>i===n?{...x,a:e.target.value}:x))}/>
                    <span style={{fontSize:14,color:T.text3,textAlign:"center"}}>–</span>
                    <input style={{...inp,textAlign:"center",fontSize:18,fontWeight:700}} type="number" placeholder="0" value={j.b}
                      onChange={e=>setJocuri(prev=>prev.map((x,i)=>i===n?{...x,b:e.target.value}:x))}/>
                  </div>
                ))}
              </div>
              {(winsA>0||winsB>0)&&(
                <div style={{marginTop:12,padding:"10px 14px",background:T.muted,borderRadius:T.rLg,
                  display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{fontSize:12,color:T.text2}}>Scor calculat</span>
                  <span style={{fontSize:22,fontWeight:800,color:T.text}}>{winsA}–{winsB}</span>
                </div>
              )}
            </Card>
          )}
          {type==="weekend"&&(
            <Card style={{padding:"16px"}}>
              <label style={lbl}>Scor total jocuri</label>
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                {["Paul & BGN","Laur & GxG"].map((l,i)=>(
                  <div key={i} style={{flex:1,textAlign:"center"}}>
                    <div style={{fontSize:11,color:T.text3,marginBottom:6}}>{l}</div>
                    <input style={{...inp,textAlign:"center",fontSize:24,fontWeight:800}} type="number" min="0" placeholder="0"
                      defaultValue={isEdit?(i===0?editMatch.score.split("-")[0]:editMatch.score.split("-")[1]):""}/>
                  </div>
                ))}
              </div>
            </Card>
          )}
          <Card style={{padding:"16px"}}>
            <label style={lbl}>Comentariu <span style={{color:T.text3,fontWeight:400,textTransform:"none"}}>(opțional)</span></label>
            <textarea style={{...inp,height:80,resize:"none"}}
              placeholder='ex: "Seara în care nimeni nu a dormit..."'
              defaultValue={isEdit?(editMatch.quote||""):""}/>
          </Card>
          <GradBtn onClick={()=>{setShowAdd(false);setEditMatch(null);}}>
            {isEdit?"✓ Salvează modificările":"✓ Salvează meciul"}
          </GradBtn>
        </div>
      </div>
    );
  };

  // ── MODAL ─────────────────────────────────────────────────────────────────
  const Modal = ({children,onClose})=>(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(10,37,64,0.35)",
      display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,
      backdropFilter:"blur(6px)",WebkitBackdropFilter:"blur(6px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:T.card,borderRadius:T.rXl,
        padding:"32px 32px 36px",width:380,boxShadow:T.shadowLg}}>
        {children}
      </div>
    </div>
  );

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'Inter',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <TopNav/>
      <main style={{maxWidth:960,margin:"0 auto",padding:"32px 32px 60px"}}>
        {showAdd ? <AddMatchPage/> : (
          <>
            {page==="home"    && <HomePage/>}
            {page==="meciuri" && <MatchesPage/>}
            {page==="match"   && <MatchDetailPage/>}
            {page==="players" && <PlayersPage/>}
            {page==="player"  && <PlayersPage/>}
            {page==="album"   && <AlbumPage/>}
          </>
        )}
      </main>

      {showPin&&!showAdd&&(
        <Modal onClose={()=>{setShowPin(false);setPin("");setPinErr(false);}}>
          <PinKeypad pin={pin} setPin={setPin} pinErr={pinErr} setPinErr={setPinErr} title="Introdu PIN"
            onSuccess={()=>{setShowPin(false);setPin("");setShowAdd(true);}}/>
        </Modal>
      )}
      {showDeletePin&&(
        <Modal onClose={()=>{setShowDeletePin(false);setDeletePin("");setDeletePinErr(false);}}>
          <PinKeypad pin={deletePin} setPin={setDeletePin} pinErr={deletePinErr} setPinErr={setDeletePinErr}
            title="Șterge meciul" titleColor="#DC2626"
            onSuccess={()=>{deleteMatch(deleteTarget);setShowDeletePin(false);setDeletePin("");setDeleteTarget(null);}}/>
        </Modal>
      )}
      {showPhotoPin&&(
        <Modal onClose={()=>{setShowPhotoPin(false);setPhotoPin("");setPhotoPinErr(false);setPhotoTarget(null);}}>
          <PinKeypad pin={photoPin} setPin={setPhotoPin} pinErr={photoPinErr} setPinErr={setPhotoPinErr}
            title="Schimbă poza"
            onSuccess={()=>{setShowPhotoPin(false);setPhotoPin("");document.getElementById(`pu-${photoTarget}`).click();setPhotoTarget(null);}}/>
        </Modal>
      )}
    </div>
  );
}
