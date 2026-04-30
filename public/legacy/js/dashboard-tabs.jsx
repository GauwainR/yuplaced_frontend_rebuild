/**
 * YUPLACED — Dashboard Tab Components
 */

/* ══════════════════════════════════════
   SHARED STYLES
══════════════════════════════════════ */
const inputStyle = {
  width:"100%", boxSizing:"border-box", background:"none",
  border:"1px solid var(--border)", borderBottom:"1px solid var(--pink)",
  color:"var(--text)", fontFamily:"var(--mono)", fontSize:13,
  padding:"10px 12px", outline:"none", letterSpacing:1,
};
const labelStyle = { fontFamily:"var(--mono)", fontSize:9, letterSpacing:2, color:"var(--muted)", marginBottom:8 };

const PRI_OPTIONS = [
  { value:"high", label:"HIGH", color:"#f85149" },
  { value:"med",  label:"MED",  color:"#ff9800" },
  { value:"low",  label:"LOW",  color:"#58a6ff" },
];
const PRESET_COLORS = ["#e040a0","#f85149","#ff9800","#3fb950","#58a6ff","#bc8cff","#00bcd4","#ffffff"];

function fmtTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}) + " · " + d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
}

/* ══════════════════════════════════════
   SHARED — Monthly Heatmap
══════════════════════════════════════ */
function MonthlyHeatmap() {
  const maxLevel = 4;
  return (
    <div className="heatmap-wrap">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <span className="section-title">АКТИВНОСТЬ — АПРЕЛЬ 2026</span>
        <span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--muted)"}}>30 дней · 47 событий</span>
      </div>
      <div style={{display:"flex",alignItems:"flex-end",gap:3,height:60}}>
        {HEATMAP_DATA.map((b,i) => {
          const h = b.level===0?4:Math.round((b.level/maxLevel)*52)+8;
          const op = b.level===0?0.12:0.2+(b.level/maxLevel)*0.8;
          return (<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center"}}><div style={{width:"100%",height:h,background:`rgba(224,64,160,${op})`,transition:"height .3s ease",cursor:"pointer"}} title={`${b.date.toLocaleDateString("ru",{day:"numeric",month:"short"})} · ${b.level} events`}></div></div>);
        })}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
        {[1,8,15,22,29].map(d=>(<span key={d} style={{fontSize:8,color:"var(--muted)",fontFamily:"var(--mono)"}}>{d}</span>))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   OVERVIEW TAB
══════════════════════════════════════ */
function OverviewTab({ onTabChange }) {
  const [focus, setFocus] = React.useState(TODAY_FOCUS_DATA);
  const toggle = id => setFocus(p => p.map(t => t.id===id ? {...t,done:!t.done} : t));
  const open = focus.filter(t=>!t.done).length;
  return (
    <div>
      <div className="focus-block">
        <div className="focus-header"><span className="focus-title">TODAY FOCUS</span><span className="focus-meta">{open} open · {focus.length-open} done</span></div>
        {focus.length===0 ? (<div style={{padding:"20px 0",color:"var(--muted)",fontFamily:"var(--mono)",fontSize:11,letterSpacing:1}}>— No tasks for today yet —</div>) : focus.map(t=>(
          <div key={t.id} className="focus-task">
            <div className={`focus-check ${t.done?"done":""}`} onClick={()=>toggle(t.id)}>{t.done?"✓":""}</div>
            <span className={`focus-task-title ${t.done?"done":""}`}>{t.title}</span>
            <span className={`priority-badge ${PRI_COLORS[t.pri]}`}>{t.pri.toUpperCase()}</span>
          </div>
        ))}
      </div>
      <div className="section-title-row"><span className="section-title">POPULAR FOLDERS</span><span className="section-link" onClick={()=>onTabChange("folders")}>Все папки →</span></div>
      <div className="overview-grid">
        {POPULAR_DATA.length===0 ? (<div style={{gridColumn:"1/-1",padding:"20px 0",color:"var(--muted)",fontFamily:"var(--mono)",fontSize:11,letterSpacing:1}}>— No folders yet. Create your first folder in the Folders tab —</div>) : POPULAR_DATA.map((r,i)=>(
          <div key={i} className="repo-card" onClick={()=>onTabChange("folders")}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><span className="repo-card-name">{r.name}</span><span className="repo-card-badge">ACTIVE</span></div>
            <span className="repo-card-desc">{r.desc}</span>
            <div className="repo-card-meta"><span className="lang-dot" style={{background:r.color}}></span><span style={{fontSize:9,color:"var(--muted)"}}>{r.count}</span></div>
          </div>
        ))}
      </div>
      <MonthlyHeatmap />
      <div className="section-title-row" style={{marginTop:20}}><span className="section-title">RECENT ACTIVITY</span></div>
      <div className="activity-grid">
        {ACTIVITY_DATA.map((a,i)=>(<div key={i} className="activity-card"><div className="activity-stripe" style={{background:a.color}}></div><div className="activity-body"><div className="activity-text" dangerouslySetInnerHTML={{__html:a.html}}></div><div className="activity-time">{a.time}</div></div></div>))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   CREATE FOLDER MODAL
══════════════════════════════════════ */
function CreateFolderModal({ onClose, onCreate }) {
  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState("#e040a0");
  const handleCreate = () => { if(!name.trim()) return; onCreate({name:name.trim().toUpperCase(),color}); onClose(); };
  React.useEffect(() => { const onKey=e=>{if(e.key==="Escape")onClose();}; window.addEventListener("keydown",onKey); return ()=>window.removeEventListener("keydown",onKey); }, []);
  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#0d1117",border:"1px solid var(--border)",padding:"32px 36px",width:420,boxShadow:"0 24px 64px rgba(0,0,0,0.6)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
          <div style={{fontFamily:"var(--mono)",fontSize:11,letterSpacing:3,color:"var(--text)"}}>NEW FOLDER</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontFamily:"var(--mono)",fontSize:16}}>✕</button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",border:"1px solid var(--border)",marginBottom:24,background:"#161b22"}}>
          <span style={{width:8,height:8,borderRadius:"50%",background:color,flexShrink:0,boxShadow:`0 0 8px ${color}`}}></span>
          <span style={{fontFamily:"var(--mono)",fontSize:12,color:name?"var(--text)":"var(--muted)",letterSpacing:1}}>{name||"FOLDER NAME"}</span>
        </div>
        <div style={{marginBottom:20}}><div style={labelStyle}>NAME</div><input autoFocus value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleCreate()} placeholder="e.g. РАБОТА" style={inputStyle} /></div>
        <div style={{marginBottom:28}}>
          <div style={labelStyle}>COLOR</div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {PRESET_COLORS.map(c=>(<div key={c} onClick={()=>setColor(c)} style={{width:24,height:24,borderRadius:"50%",background:c,cursor:"pointer",border:color===c?"2px solid #fff":"2px solid transparent",boxShadow:color===c?`0 0 8px ${c}`:"none",transition:"all .15s"}} />))}
            <div style={{position:"relative",width:24,height:24}}>
              <input type="color" value={color} onChange={e=>setColor(e.target.value)} style={{position:"absolute",inset:0,opacity:0,cursor:"pointer",width:"100%",height:"100%"}} />
              <div style={{width:24,height:24,borderRadius:"50%",border:"1px dashed var(--border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"var(--muted)",pointerEvents:"none"}}>+</div>
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{background:"none",border:"1px solid var(--border)",color:"var(--muted)",padding:"8px 20px",fontFamily:"var(--mono)",fontSize:10,letterSpacing:2,cursor:"pointer"}}>CANCEL</button>
          <button onClick={handleCreate} style={{background:"none",border:"1px solid var(--pink)",color:"var(--pink)",padding:"8px 24px",fontFamily:"var(--mono)",fontSize:10,letterSpacing:2,cursor:"pointer",opacity:name.trim()?1:0.4,transition:"all .2s"}} onMouseOver={e=>{if(name.trim()){e.currentTarget.style.background="var(--pink)";e.currentTarget.style.color="#000";}}} onMouseOut={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color="var(--pink)";}}>CREATE</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   CREATE TASK MODAL
══════════════════════════════════════ */
function CreateTaskModal({ onClose, onCreate, folders, defaultFolderId }) {
  const [title, setTitle] = React.useState("");
  const [pri, setPri] = React.useState("med");
  const [comment, setComment] = React.useState("");
  const [folderId, setFolderId] = React.useState(defaultFolderId || folders[0]?.id || null);
  const handleCreate = () => { if(!title.trim()) return; onCreate({title:title.trim(),pri,comment:comment.trim(),folderId,col:"todo",id:Date.now()}); onClose(); };
  React.useEffect(() => { const onKey=e=>{if(e.key==="Escape")onClose();}; window.addEventListener("keydown",onKey); return ()=>window.removeEventListener("keydown",onKey); }, []);
  const folder = folders.find(f=>f.id===folderId);
  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#0d1117",border:"1px solid var(--border)",padding:"32px 36px",width:480,boxShadow:"0 24px 64px rgba(0,0,0,0.6)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
          <div style={{fontFamily:"var(--mono)",fontSize:11,letterSpacing:3,color:"var(--text)"}}>NEW TASK</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontFamily:"var(--mono)",fontSize:16}}>✕</button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",border:"1px solid var(--border)",marginBottom:24,background:"#161b22"}}>
          {folder&&<span style={{width:6,height:6,borderRadius:"50%",background:folder.color,flexShrink:0}}></span>}
          <span style={{fontFamily:"var(--mono)",fontSize:11,color:title?"var(--text)":"var(--muted)",flex:1,letterSpacing:1}}>{title||"TASK TITLE"}</span>
          <span style={{fontFamily:"var(--mono)",fontSize:9,color:PRI_OPTIONS.find(p=>p.value===pri)?.color,border:`1px solid ${PRI_OPTIONS.find(p=>p.value===pri)?.color}`,padding:"2px 8px",letterSpacing:1}}>{pri.toUpperCase()}</span>
        </div>
        <div style={{marginBottom:20}}><div style={labelStyle}>TITLE</div><input autoFocus value={title} onChange={e=>setTitle(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleCreate()} placeholder="Task title..." style={inputStyle} /></div>
        <div style={{marginBottom:20}}>
          <div style={labelStyle}>PRIORITY</div>
          <div style={{display:"flex",gap:8}}>
            {PRI_OPTIONS.map(p=>(<button key={p.value} onClick={()=>setPri(p.value)} style={{flex:1,padding:"8px 0",background:pri===p.value?p.color+"18":"none",border:`1px solid ${pri===p.value?p.color:"var(--border)"}`,color:pri===p.value?p.color:"var(--muted)",fontFamily:"var(--mono)",fontSize:10,letterSpacing:2,cursor:"pointer",transition:"all .15s"}}>{p.label}</button>))}
          </div>
        </div>
        <div style={{marginBottom:20}}>
          <div style={labelStyle}>FOLDER</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {folders.map(f=>(<div key={f.id} onClick={()=>setFolderId(f.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",border:`1px solid ${folderId===f.id?f.color:"var(--border)"}`,background:folderId===f.id?f.color+"10":"none",cursor:"pointer",transition:"all .15s"}}><span style={{width:8,height:8,borderRadius:"50%",background:f.color,flexShrink:0}}></span><span style={{fontFamily:"var(--mono)",fontSize:11,color:folderId===f.id?"var(--text)":"var(--muted)",letterSpacing:1}}>{f.name}</span>{folderId===f.id&&<span style={{marginLeft:"auto",fontSize:9,color:f.color}}>✓</span>}</div>))}
          </div>
        </div>
        <div style={{marginBottom:28}}><div style={labelStyle}>COMMENT</div><textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Optional notes, context, links..." rows={3} style={{...inputStyle,resize:"none",lineHeight:1.7,borderBottom:"1px solid var(--border)"}} /></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{background:"none",border:"1px solid var(--border)",color:"var(--muted)",padding:"8px 20px",fontFamily:"var(--mono)",fontSize:10,letterSpacing:2,cursor:"pointer"}}>CANCEL</button>
          <button onClick={handleCreate} style={{background:"none",border:"1px solid var(--pink)",color:"var(--pink)",padding:"8px 24px",fontFamily:"var(--mono)",fontSize:10,letterSpacing:2,cursor:"pointer",opacity:title.trim()?1:0.4,transition:"all .2s"}} onMouseOver={e=>{if(title.trim()){e.currentTarget.style.background="var(--pink)";e.currentTarget.style.color="#000";}}} onMouseOut={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color="var(--pink)";}}>ADD TASK</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   TASK SIDEBAR
══════════════════════════════════════ */
function TaskSidebar({ task, folder, onClose, onUpdate }) {
  const [title,   setTitle]   = React.useState(task.title);
  const [pri,     setPri]     = React.useState(task.pri);
  const [comment, setComment] = React.useState(task.comment || "");
  const [col,     setCol]     = React.useState(task.col);
  const [log,     setLog]     = React.useState(task.log || []);

  const priOpt = PRI_OPTIONS.find(p=>p.value===pri);
  const colLabels = { todo:"TO DO", inprog:"IN PROGRESS", done:"DONE" };

  // Добавить запись в лог
  const addLog = (msg) => {
    const entry = { ts: Date.now(), msg };
    setLog(p => [entry, ...p]);
    return entry;
  };

  const handleSave = () => {
    const changes = [];
    if (title !== task.title)   changes.push(`Title: "${task.title}" → "${title}"`);
    if (pri   !== task.pri)     changes.push(`Priority: ${task.pri.toUpperCase()} → ${pri.toUpperCase()}`);
    if (col   !== task.col)     changes.push(`Status: ${colLabels[task.col]} → ${colLabels[col]}`);
    if (comment !== (task.comment||"")) changes.push("Comment updated");
    const newLog = changes.length ? [{ ts:Date.now(), msg: changes.join(" · ") }, ...log] : log;
    onUpdate({ ...task, title, pri, comment, col, log: newLog });
    onClose();
  };

  React.useEffect(() => {
    const onKey = e => { if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div style={{position:"fixed",inset:0,zIndex:900,background:"rgba(0,0,0,0.4)"}} onClick={onClose} />

      {/* Sidebar panel */}
      <div style={{
        position:"fixed", top:0, right:0, bottom:0, zIndex:901,
        width:380, background:"#0d1117",
        borderLeft:"1px solid var(--border)",
        display:"flex", flexDirection:"column",
        boxShadow:"-12px 0 40px rgba(0,0,0,0.5)",
        animation:"slideIn .2s ease",
      }}>
        <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 24px",borderBottom:"1px solid var(--border)",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {folder && <span style={{width:8,height:8,borderRadius:"50%",background:folder.color,boxShadow:`0 0 6px ${folder.color}`}}></span>}
            <span style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:2,color:"var(--muted)"}}>{folder?.name || "TASK"}</span>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontFamily:"var(--mono)",fontSize:18,lineHeight:1}}>✕</button>
        </div>

        {/* Scrollable content */}
        <div style={{flex:1,overflowY:"auto",padding:"24px"}}>

          {/* Title */}
          <div style={{marginBottom:20}}>
            <div style={labelStyle}>TITLE</div>
            <input value={title} onChange={e=>setTitle(e.target.value)} style={{...inputStyle,fontSize:14}} />
          </div>

          {/* Priority */}
          <div style={{marginBottom:20}}>
            <div style={labelStyle}>PRIORITY</div>
            <div style={{display:"flex",gap:8}}>
              {PRI_OPTIONS.map(p=>(<button key={p.value} onClick={()=>setPri(p.value)} style={{flex:1,padding:"7px 0",background:pri===p.value?p.color+"18":"none",border:`1px solid ${pri===p.value?p.color:"var(--border)"}`,color:pri===p.value?p.color:"var(--muted)",fontFamily:"var(--mono)",fontSize:9,letterSpacing:2,cursor:"pointer",transition:"all .15s"}}>{p.label}</button>))}
            </div>
          </div>

          {/* Status */}
          <div style={{marginBottom:20}}>
            <div style={labelStyle}>STATUS</div>
            <div style={{display:"flex",gap:8}}>
              {["todo","inprog","done"].map(c=>{
                const colors = {todo:"var(--muted)",inprog:"var(--orange)",done:"var(--green)"};
                return (<button key={c} onClick={()=>setCol(c)} style={{flex:1,padding:"7px 0",background:col===c?colors[c]+"18":"none",border:`1px solid ${col===c?colors[c]:"var(--border)"}`,color:col===c?colors[c]:"var(--muted)",fontFamily:"var(--mono)",fontSize:9,letterSpacing:1,cursor:"pointer",transition:"all .15s"}}>{colLabels[c]}</button>);
              })}
            </div>
          </div>

          {/* Comment */}
          <div style={{marginBottom:24}}>
            <div style={labelStyle}>COMMENT</div>
            <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Notes, context, links..." rows={4} style={{...inputStyle,resize:"none",lineHeight:1.7,borderBottom:"1px solid var(--border)",fontSize:12}} />
          </div>

          {/* Divider */}
          <div style={{borderTop:"1px solid var(--border)",marginBottom:20}}></div>

          {/* Change Log */}
          <div style={{marginBottom:8}}>
            <div style={{...labelStyle,marginBottom:14}}>CHANGE LOG</div>
            {log.length === 0 ? (
              <div style={{fontSize:10,color:"#333",fontStyle:"italic",fontFamily:"var(--mono)"}}>No changes yet</div>
            ) : log.map((entry,i)=>(
              <div key={i} style={{display:"flex",gap:12,marginBottom:12,paddingBottom:12,borderBottom:i<log.length-1?"1px solid #161b22":"none"}}>
                <div style={{width:1,background:"var(--border)",flexShrink:0,alignSelf:"stretch",marginTop:4}}></div>
                <div>
                  <div style={{fontSize:10,color:"var(--text)",lineHeight:1.6,marginBottom:4}}>{entry.msg}</div>
                  <div style={{fontSize:9,color:"#444",fontFamily:"var(--mono)"}}>{fmtTime(entry.ts)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{padding:"16px 24px",borderTop:"1px solid var(--border)",display:"flex",gap:10,flexShrink:0}}>
          <button onClick={onClose} style={{flex:1,background:"none",border:"1px solid var(--border)",color:"var(--muted)",padding:"9px 0",fontFamily:"var(--mono)",fontSize:10,letterSpacing:2,cursor:"pointer"}}>CANCEL</button>
          <button onClick={handleSave} style={{flex:2,background:"none",border:"1px solid var(--pink)",color:"var(--pink)",padding:"9px 0",fontFamily:"var(--mono)",fontSize:10,letterSpacing:2,cursor:"pointer",transition:"all .2s"}} onMouseOver={e=>{e.currentTarget.style.background="var(--pink)";e.currentTarget.style.color="#000";}} onMouseOut={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color="var(--pink)";}}>SAVE CHANGES</button>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════
   FOLDERS TAB
══════════════════════════════════════ */
function FoldersTab() {
  const [folders, setFolders]               = React.useState(FOLDERS_DATA);
  const [activeFolder, setActiveFolder]     = React.useState(folders[0]?.id || null);
  const [folderView, setFolderView]         = React.useState("current");
  const [showFolderModal, setShowFolderModal] = React.useState(false);
  const [showTaskModal, setShowTaskModal]   = React.useState(false);
  const [sidebarTask, setSidebarTask]       = React.useState(null); // task being viewed
  const [tasks, setTasks] = React.useState(()=>{ const m={}; folders.forEach(f=>{ m[f.id]=[...f.tasks]; }); return m; });

  const handleCreateFolder = ({ name, color }) => {
    const f = { id:Date.now(), name, color, tasks:[] };
    setFolders(p=>[...p,f]); setTasks(p=>({...p,[f.id]:[]})); setActiveFolder(f.id);
  };

  const handleCreateTask = ({ title, pri, comment, folderId, col, id }) => {
    setTasks(p=>({...p,[folderId]:[...(p[folderId]||[]),{id,title,pri,comment,col,tag:"",est:"—",log:[{ts:Date.now(),msg:"Task created"}]}]}));
    setActiveFolder(folderId);
  };

  const handleUpdateTask = (updated) => {
    setTasks(p=>({...p,[activeFolder]:p[activeFolder].map(t=>t.id===updated.id?updated:t)}));
  };

  const folder  = folders.find(f=>f.id===activeFolder) || null;
  const ftasks  = tasks[activeFolder] || [];
  const cols    = ["todo","inprog","done"];
  const colLabels = { todo:"TO DO", inprog:"IN PROGRESS", done:"DONE" };
  const toggleDone = id => setTasks(p=>({...p,[activeFolder]:p[activeFolder].map(t=>t.id===id?{...t,col:t.col==="done"?"todo":"done"}:t)}));

  const allCurrent = folders.flatMap(f=>(tasks[f.id]||[]).filter(t=>t.col==="inprog").map(t=>({...t,folderName:f.name,folderColor:f.color})));

  // Task row with ☰ button
  const TaskRow = ({ t, showColor=false }) => (
    <div style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 0",borderBottom:"1px solid #161b22",cursor:"pointer"}} onClick={()=>setSidebarTask(t)}>
      {showColor && <div style={{width:3,minHeight:36,background:folder?.color,flexShrink:0,marginRight:2,alignSelf:"stretch"}}></div>}
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:11,color:"var(--text)",marginBottom:4}}>{t.title}</div>
        {t.comment && <div style={{fontSize:10,color:"var(--muted)",fontStyle:"italic",marginBottom:4}}>{t.comment}</div>}
        <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
          {t.tag&&<span className={`task-tag ${TAG_COLORS[t.tag]||""}`}>{t.tag}</span>}
          <span className={`priority-badge ${PRI_COLORS[t.pri]}`}>{t.pri.toUpperCase()}</span>
        </div>
      </div>
      <button onClick={e=>{e.stopPropagation();setSidebarTask(t);}} style={{background:"none",border:"1px solid var(--border)",color:"var(--muted)",padding:"3px 7px",cursor:"pointer",fontFamily:"var(--mono)",fontSize:10,flexShrink:0,transition:"all .2s"}} onMouseOver={e=>{e.currentTarget.style.borderColor="var(--pink)";e.currentTarget.style.color="var(--pink)";}} onMouseOut={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--muted)";}}>
        ☰
      </button>
    </div>
  );

  return (
    <>
      {showFolderModal && <CreateFolderModal onClose={()=>setShowFolderModal(false)} onCreate={handleCreateFolder} />}
      {showTaskModal   && <CreateTaskModal   onClose={()=>setShowTaskModal(false)}   onCreate={handleCreateTask} folders={folders} defaultFolderId={activeFolder} />}
      {sidebarTask     && <TaskSidebar task={sidebarTask} folder={folder} onClose={()=>setSidebarTask(null)} onUpdate={handleUpdateTask} />}

      {folders.length === 0 ? (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"70vh",width:"100%",gap:20}}>
          <div style={{color:"var(--muted)",fontFamily:"var(--mono)",fontSize:11,letterSpacing:3,textAlign:"center"}}>NO FOLDERS YET</div>
          <div style={{color:"var(--muted)",fontFamily:"var(--mono)",fontSize:9,opacity:0.5,textAlign:"center"}}>Organize your tasks into folders</div>
          <button onClick={()=>setShowFolderModal(true)} style={{marginTop:8,background:"none",border:"1px solid var(--border)",color:"var(--text)",padding:"10px 28px",fontFamily:"var(--mono)",fontSize:9,letterSpacing:2,cursor:"pointer",transition:"border-color .2s"}} onMouseOver={e=>e.target.style.borderColor="var(--pink)"} onMouseOut={e=>e.target.style.borderColor="var(--border)"}>+ CREATE FOLDER</button>
        </div>
      ) : (
        <div className="folders-layout">
          {allCurrent.length > 0 && (
            <div className="current-tasks-panel">
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:3,color:"var(--muted)"}}>CURRENT TASKS</span>
                <span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--pink)"}}>{allCurrent.length} in progress</span>
              </div>
              <div className="current-tasks-chips">
                {allCurrent.map((t,i)=>(<div key={i} className="current-chip" style={{borderLeftColor:t.folderColor}}><span style={{fontSize:10,color:"var(--text)"}}>{t.title}</span><span style={{fontSize:7,color:t.folderColor,fontFamily:"var(--mono)",letterSpacing:1}}>{t.folderName}</span></div>))}
              </div>
            </div>
          )}

          <div style={{display:"flex",flex:1,paddingTop:allCurrent.length?80:0,overflow:"hidden",width:"100%"}}>
            {/* Sidebar */}
            <div className="folders-sidebar">
              <div style={{padding:"10px 14px 6px",fontSize:8,letterSpacing:3,color:"var(--muted)",flexShrink:0}}>FOLDERS</div>
              <div style={{flex:1,overflowY:"auto"}}>
                {folders.map(f=>(<div key={f.id} className={`folder-item ${activeFolder===f.id?"active":""}`} onClick={()=>setActiveFolder(f.id)}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:6,height:6,borderRadius:"50%",background:f.color,flexShrink:0}}></span><span className="folder-item-name">{f.name}</span></div><span className="folder-item-count">{(tasks[f.id]||[]).length}</span></div>))}
              </div>
              <div style={{padding:"12px 14px",borderTop:"1px solid var(--border)",flexShrink:0}}>
                <button onClick={()=>setShowFolderModal(true)} style={{width:"100%",background:"none",border:"1px dashed var(--border)",color:"var(--muted)",padding:"7px",fontFamily:"var(--mono)",fontSize:9,letterSpacing:1,cursor:"pointer",transition:"all .2s"}} onMouseOver={e=>{e.currentTarget.style.borderColor="var(--pink)";e.currentTarget.style.color="var(--pink)";}} onMouseOut={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--muted)";}}>+ NEW FOLDER</button>
              </div>
            </div>

            {/* Main */}
            <div className="folders-main">
              <div className="kanban-header">
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:folder?.color,boxShadow:`0 0 6px ${folder?.color}`}}></span>
                  <span className="kanban-title">{folder?.name}</span>
                  <span style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--mono)"}}>{ftasks.filter(t=>t.col!=="done").length} open · {ftasks.filter(t=>t.col==="done").length} done</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <button onClick={()=>setShowTaskModal(true)} style={{background:"none",border:"1px solid var(--pink)",color:"var(--pink)",padding:"5px 14px",fontFamily:"var(--mono)",fontSize:9,letterSpacing:2,cursor:"pointer",transition:"all .2s"}} onMouseOver={e=>{e.currentTarget.style.background="var(--pink)";e.currentTarget.style.color="#000";}} onMouseOut={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color="var(--pink)";}}>+ ADD TASK</button>
                  <div className="view-toggle">
                    <button className={`view-btn ${folderView==="current"?"active":""}`} onClick={()=>setFolderView("current")}>CURRENT</button>
                    <button className={`view-btn ${folderView==="kanban"?"active":""}`}  onClick={()=>setFolderView("kanban")}>KANBAN</button>
                    <button className={`view-btn ${folderView==="list"?"active":""}`}    onClick={()=>setFolderView("list")}>LIST</button>
                  </div>
                </div>
              </div>

              {folderView==="current" && (
                <div style={{flex:1,overflowY:"auto"}}>
                  <div style={{padding:"8px 0 10px",fontSize:8,letterSpacing:3,color:"#444"}}>IN PROGRESS TODAY</div>
                  {ftasks.filter(t=>t.col==="inprog").length===0 && (<div style={{fontSize:10,color:"#3a3a3a",fontStyle:"italic",padding:"12px 0"}}>No tasks in progress</div>)}
                  {ftasks.filter(t=>t.col==="inprog").map(t=>(<TaskRow key={t.id} t={t} showColor={true} />))}
                </div>
              )}

              {folderView==="kanban" && (
                <div className="kanban-board">
                  {cols.map(col=>(
                    <div key={col} className="kanban-col">
                      <div className={`kanban-col-header ${col}`}><span>{colLabels[col]}</span><span style={{fontSize:9,color:"var(--muted)"}}>{ftasks.filter(t=>t.col===col).length}</span></div>
                      {ftasks.filter(t=>t.col===col).map(t=>(
                        <div key={t.id} className="kanban-task" style={{cursor:"pointer",position:"relative"}} onClick={()=>setSidebarTask(t)}>
                          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:6}}>
                            <div className="kanban-task-title" style={{flex:1}}>{t.title}</div>
                            <button onClick={e=>{e.stopPropagation();setSidebarTask(t);}} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:11,padding:0,flexShrink:0}}>☰</button>
                          </div>
                          {t.comment && <div style={{fontSize:9,color:"var(--muted)",marginTop:4,fontStyle:"italic",lineHeight:1.5}}>{t.comment}</div>}
                          <div className="kanban-task-meta">{t.tag&&<span className={`task-tag ${TAG_COLORS[t.tag]||""}`}>{t.tag}</span>}<span className={`priority-badge ${PRI_COLORS[t.pri]}`} style={{fontSize:7,padding:"1px 5px"}}>{t.pri.toUpperCase()}</span></div>
                        </div>
                      ))}
                      <button className="add-task-btn" onClick={()=>setShowTaskModal(true)}>+ Add task</button>
                    </div>
                  ))}
                </div>
              )}

              {folderView==="list" && (
                <div style={{flex:1,overflowY:"auto"}}>
                  {ftasks.length===0 && (
                    <div style={{fontSize:10,color:"#3a3a3a",fontStyle:"italic",padding:"20px 0"}}>No tasks yet — click + ADD TASK to create one</div>
                  )}
                  {ftasks.map(t=>(
                    <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #161b22"}}>
                      <div className={`task-checkbox ${t.col==="done"?"done":""}`} onClick={()=>toggleDone(t.id)} style={{cursor:"pointer",flexShrink:0}}>{t.col==="done"?"✓":""}</div>
                      <span className={`task-list-title ${t.col==="done"?"done":""}`} style={{flex:1}}>{t.title}</span>
                      <span className={`priority-badge ${PRI_COLORS[t.pri]}`}>{t.pri.toUpperCase()}</span>
                      {t.est&&t.est!=="—"&&<span className="task-tag time-est">⏱ {t.est}</span>}
                      <span style={{fontSize:9,color:"var(--muted)",fontFamily:"var(--mono)",minWidth:80,textAlign:"right"}}>{colLabels[t.col]}</span>
                      <button onClick={()=>setSidebarTask(t)} style={{background:"none",border:"1px solid var(--border)",color:"var(--muted)",padding:"3px 7px",cursor:"pointer",fontFamily:"var(--mono)",fontSize:10,flexShrink:0,transition:"all .2s"}} onMouseOver={e=>{e.currentTarget.style.borderColor="var(--pink)";e.currentTarget.style.color="var(--pink)";}} onMouseOut={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--muted)";}}>☰</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════
   DAILY REPORT TAB
══════════════════════════════════════ */
function DailyReportTab() {
  const today=new Date().toISOString().slice(0,10);
  const [activeDay,setActiveDay]=React.useState(today);
  const [doneTasks,setDoneTasks]=React.useState([]);
  const [nextTasks,setNextTasks]=React.useState([]);
  const [addNext,setAddNext]=React.useState("");
  const [apiStats,setApiStats]=React.useState(null);
  const [apiDays,setApiDays]=React.useState([]);
  const [valueText,setValueText]=React.useState("");
  const [valueEditing,setValueEditing]=React.useState(false);
  const [valueLoading,setValueLoading]=React.useState(false);
  const [timeOpen,setTimeOpen]=React.useState(false);
  const [noteOpen,setNoteOpen]=React.useState(false);
  const [nextOpen,setNextOpen]=React.useState(true);
  React.useEffect(()=>{Yunote.getStats().then(setApiStats).catch(console.error);Yunote.getDays().then(days=>{setApiDays(days);const day=days.find(d=>d.date_key===today);if(day){setDoneTasks(day.done.map(t=>t.text));setNextTasks(day.next.map(t=>t.text));setValueText(day.value||"");}}).catch(console.error);},[]);
  const generateValue=async()=>{setValueLoading(true);setValueEditing(false);try{const result=await window.claude.complete(`Пользователь сегодня выполнил задачи: ${doneTasks.join(", ")}. Напиши одно короткое вдохновляющее предложение (не больше 15 слов) о том, что он развил или улучшил. Только само предложение, без кавычек.`);setValueText(result.trim());}catch{setValueText("Продуктивный день — каждая задача приближает к цели.");}setValueLoading(false);};
  const addNextTask=()=>{if(addNext.trim()){setNextTasks(p=>[...p,addNext.trim()]);setAddNext("");}};
  return (
    <div className="daily-layout">
      <div className="daily-sidebar">
        <div className="daily-sidebar-section">
          <div className="daily-sidebar-label">RECENT DAYS</div>
          {apiDays.length===0&&<div style={{fontSize:10,color:"var(--muted)",padding:"8px 0"}}>No days yet</div>}
          {apiDays.map(d=>(<div key={d.date_key} className={`day-item-ob ${activeDay===d.date_key?"active":""}`} onClick={()=>setActiveDay(d.date_key)}><span className="dn">{new Date(d.date_key+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'}).toUpperCase()}{d.date_key===today&&<span style={{fontSize:7,color:"var(--pink)",marginLeft:4}}>●</span>}</span><span className="dc">{d.done?.length||0}</span></div>))}
        </div>
        <div className="daily-sidebar-section">
          <div className="daily-sidebar-label">ALL TIME</div>
          <div className="obs-stat"><span className="obs-stat-l">Time tracked</span><span className="obs-stat-v">{apiStats?fmtDuration(apiStats.total_seconds):"—"}</span></div>
          <div className="obs-stat"><span className="obs-stat-l">Tasks done</span><span className="obs-stat-v">{apiStats?apiStats.total_tasks_done:"—"}</span></div>
          <div className="obs-stat"><span className="obs-stat-l">Days logged</span><span className="obs-stat-v">{apiStats?apiStats.total_days:"—"}</span></div>
        </div>
      </div>
      <div className="daily-main">
        <div className="done-section"><div className="ds-header"><span className="ds-label green">DONE</span><span style={{fontSize:9,color:"var(--muted)",fontFamily:"var(--mono)"}}>{doneTasks.length} tasks</span></div><div className="ds-body">{doneTasks.map((t,i)=>(<div key={i} className="b-task"><div className="b-check on" style={{cursor:"default"}}>✓</div><span className="b-text striked">{t}</span></div>))}</div></div>
        <div className="value-section"><div className="ds-header"><span className="ds-label pink">VALUE</span><span style={{fontSize:9,color:"var(--muted)"}}>автоматически</span></div>{!valueEditing?(<div className={`value-insight ${valueLoading?"loading":""} fade-in`}>{valueLoading?"генерация...":`"${valueText}"`}</div>):(<textarea className="value-edit-area" rows={3} value={valueText} onChange={e=>setValueText(e.target.value)} autoFocus />)}<div className="value-actions"><button className="value-btn gen" onClick={generateValue} disabled={valueLoading}>{valueLoading?"...":"⟳ GENERATE"}</button><button className="value-btn" onClick={()=>setValueEditing(v=>!v)}>{valueEditing?"SAVE":"EDIT"}</button></div></div>
        <div className="collapsible-row">
          <div className={`collapsible-section ${timeOpen?"expanded":""}`}><div className="coll-header" onClick={()=>setTimeOpen(v=>!v)}><div><span className="ds-label orange" style={{fontSize:9,letterSpacing:2}}>TIME</span>{!timeOpen&&<span className="coll-summary" style={{marginLeft:8}}>4h 30m</span>}</div><span className={`coll-chevron ${timeOpen?"open":""}`}>▾</span></div>{timeOpen&&(<div className="coll-body fade-in"><div className="time-total">4h 30m</div>{[["Deep work","3h 20m"],["Meetings","1h 10m"]].map(([l,v],i)=>(<div key={i} className="time-entry-row"><span style={{color:"var(--muted)"}}>{l}</span><span style={{fontFamily:"var(--mono)",color:"var(--orange)"}}>{v}</span></div>))}</div>)}</div>
          <div className={`collapsible-section ${noteOpen?"expanded":""}`}><div className="coll-header" onClick={()=>setNoteOpen(v=>!v)}><div><span className="ds-label blue" style={{fontSize:9,letterSpacing:2}}>NOTE</span>{!noteOpen&&<span className="coll-summary" style={{marginLeft:8}}>+ add note</span>}</div><span className={`coll-chevron ${noteOpen?"open":""}`}>▾</span></div>{noteOpen&&(<div className="coll-body fade-in" style={{display:"flex",flexDirection:"column"}}><textarea className="note-area" placeholder="Quick thoughts, blockers, ideas…"></textarea></div>)}</div>
          <div className={`collapsible-section ${nextOpen?"expanded":""}`}><div className="coll-header" onClick={()=>setNextOpen(v=>!v)}><div><span className="ds-label purple" style={{fontSize:9,letterSpacing:2}}>NEXT</span>{!nextOpen&&<span className="coll-summary" style={{marginLeft:8}}>{nextTasks.length} planned</span>}</div><span className={`coll-chevron ${nextOpen?"open":""}`}>▾</span></div>{nextOpen&&(<div className="coll-body fade-in">{nextTasks.map((t,i)=>(<div key={i} className="b-task"><div className="b-check"></div><span className="b-text">{t}</span></div>))}<div className="add-row-s"><input className="add-inp" placeholder="Что дальше?" value={addNext} onChange={e=>setAddNext(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addNextTask()} /><button className="add-sub" onClick={addNextTask}>↵</button></div><div style={{marginTop:10}}><div className="suggested-label">SUGGESTED</div>{SUGGESTED_NEXT.map((s,i)=>(<div key={i} className="suggested-item"><span style={{fontSize:9,color:"#444"}}>→</span><span style={{fontSize:10,color:"var(--muted)",flex:1}}>{s}</span><button onClick={()=>setNextTasks(p=>[...p,s])} style={{background:"none",border:"none",color:"#444",cursor:"pointer",fontFamily:"var(--mono)",fontSize:10,transition:"color .15s"}} onMouseOver={e=>e.target.style.color="var(--pink)"} onMouseOut={e=>e.target.style.color="#444"}>+</button></div>))}</div></div>)}</div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   POMODORO TAB
══════════════════════════════════════ */
function PomodoroTab() {
  const [workMin,setWorkMin]=React.useState(25);const [breakMin,setBreakMin]=React.useState(5);const [phase,setPhase]=React.useState("work");const [secLeft,setSecLeft]=React.useState(25*60);const [running,setRunning]=React.useState(false);const [sessions,setSessions]=React.useState([false,false,false,false]);const [log,setLog]=React.useState([{label:"Deep work — yuplaced",dur:"25:00",color:"#e040a0"},{label:"Short break",dur:"05:00",color:"#3fb950"},{label:"Deep work — refactor",dur:"25:00",color:"#e040a0"}]);const iRef=React.useRef(null);const totalSec=phase==="work"?workMin*60:breakMin*60;const progress=1-secLeft/totalSec;const r=90;const circ=2*Math.PI*r;
  React.useEffect(()=>{if(running){iRef.current=setInterval(()=>{setSecLeft(s=>{if(s<=1){clearInterval(iRef.current);setRunning(false);if(phase==="work"){setSessions(p=>{const n=[...p];const i=n.findIndex(v=>!v);if(i>=0)n[i]=true;return n;});setLog(p=>[{label:"Session done",dur:`${String(workMin).padStart(2,"0")}:00`,color:"#e040a0"},...p.slice(0,9)]);setPhase("break");setSecLeft(breakMin*60);}else{setPhase("work");setSecLeft(workMin*60);}return 0;}return s-1;});},1000);}else clearInterval(iRef.current);return()=>clearInterval(iRef.current);},[running,phase,workMin,breakMin]);
  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;const phaseColor=phase==="work"?"var(--pink)":"var(--green)";const reset=()=>{setRunning(false);setSecLeft(workMin*60);setPhase("work");};
  return (
    <div className="pomo-layout">
      <div className="pomo-main">
        <div className="pomo-circle-wrap"><svg className="pomo-svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r={r} fill="none" stroke="var(--border)" strokeWidth="4"/><circle cx="100" cy="100" r={r} fill="none" stroke={phaseColor} strokeWidth="4" strokeLinecap="square" strokeDasharray={circ} strokeDashoffset={circ*(1-progress)} transform="rotate(-90 100 100)" style={{transition:running?"stroke-dashoffset 1s linear":"none",filter:`drop-shadow(0 0 8px ${phaseColor})`}}/></svg><div className="pomo-center"><span className="pomo-time">{fmt(secLeft)}</span><span className="pomo-phase" style={{color:phaseColor}}>{phase==="work"?"FOCUS":"BREAK"}</span></div></div>
        <div className="pomo-controls"><button className="pomo-btn" onClick={reset}>RESET</button><button className="pomo-btn primary" onClick={()=>setRunning(v=>!v)}>{running?"PAUSE":"START"}</button><button className="pomo-btn" onClick={()=>{setRunning(false);setPhase(p=>p==="work"?"break":"work");setSecLeft(phase==="work"?breakMin*60:workMin*60);}}>SKIP</button></div>
        <div><div style={{fontSize:9,letterSpacing:3,color:"var(--muted)",marginBottom:8,textAlign:"center"}}>SESSION PROGRESS</div><div className="pomo-sessions">{sessions.map((s,i)=><div key={i} className={`pomo-session-dot ${s?"done":""}`}></div>)}</div></div>
      </div>
      <div className="pomo-sidebar">
        <div className="pomo-card"><div className="pomo-card-title">SETTINGS</div>{[["Work",workMin,setWorkMin,1,90],["Break",breakMin,setBreakMin,1,30]].map(([label,val,setter,min,max])=>(<div key={label} className="pomo-setting"><span className="pomo-setting-label">{label} duration</span><div className="pomo-setting-val"><button className="pomo-setting-btn" onClick={()=>{setter(v=>Math.max(min,v-1));if(!running&&label==="Work")setSecLeft((val-1)*60);}}>-</button>{val}m<button className="pomo-setting-btn" onClick={()=>{setter(v=>Math.min(max,v+1));if(!running&&label==="Work")setSecLeft((val+1)*60);}}>+</button></div></div>))}<div className="pomo-setting"><span className="pomo-setting-label">Daily goal</span><div className="pomo-setting-val"><button className="pomo-setting-btn" onClick={()=>setSessions(p=>p.length>1?p.slice(0,-1):p)}>-</button>{sessions.length}<button className="pomo-setting-btn" onClick={()=>setSessions(p=>[...p,false])}>+</button></div></div></div>
        <div className="pomo-card"><div className="pomo-card-title">SESSION LOG</div>{log.map((l,i)=>(<div key={i} className="pomo-log-item"><div className="pomo-log-dot" style={{background:l.color}}></div><span className="pomo-log-label">{l.label}</span><span className="pomo-log-time">{l.dur}</span></div>))}</div>
        <div className="pomo-card"><div className="pomo-card-title">TODAY</div>{[["Sessions",`${sessions.filter(Boolean).length}/${sessions.length}`,"var(--pink)"],["Focus time",`${sessions.filter(Boolean).length*workMin}m`,"var(--orange)"],["Streak","5 days","var(--green)"]].map(([l,v,c])=>(<div key={l} className="pomo-setting"><span className="pomo-setting-label">{l}</span><span style={{fontFamily:"var(--mono)",fontSize:11,color:c}}>{v}</span></div>))}</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   SETTINGS TAB
══════════════════════════════════════ */
function SettingsTab({ username, accentColor, setTweak, stats }) {
  const [nick,setNick]=React.useState(username);
  const presets=["#e040a0","#f85149","#58a6ff","#3fb950","#ff9800","#bc8cff"];
  return (
    <div className="settings-outer">
      <div className="settings-form">
        <div className="settings-card"><div className="settings-card-title">PROFILE</div><div className="settings-avatar-row"><div className="settings-avatar" style={{borderColor:accentColor,color:accentColor}}>{nick[0]?.toUpperCase()||"?"}</div><div style={{display:"flex",flexDirection:"column",gap:6}}><button className="btn-settings">Change avatar</button><span style={{fontSize:9,color:"var(--muted)"}}>PNG, JPG — max 2MB</span></div></div><div className="settings-row"><span className="settings-label">NICKNAME</span><input className="settings-input" value={nick} onChange={e=>{setNick(e.target.value);setTweak("username",e.target.value);}} placeholder="your_handle" /></div></div>
        <div className="settings-card"><div className="settings-card-title">APPEARANCE</div><div className="settings-row"><span className="settings-label">ACCENT COLOR</span><div style={{display:"flex",alignItems:"center",gap:10}}><input type="color" value={accentColor} onChange={e=>setTweak("accentColor",e.target.value)} style={{width:40,height:28,border:"1px solid var(--border)",background:"none",cursor:"pointer",padding:2}} /><span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--muted)"}}>{accentColor}</span></div></div><div className="settings-row"><span className="settings-label">PRESETS</span><div style={{display:"flex",gap:8}}>{presets.map(c=>(<div key={c} onClick={()=>setTweak("accentColor",c)} style={{width:20,height:20,background:c,cursor:"pointer",border:accentColor===c?"2px solid #fff":"2px solid transparent",transition:"border .15s"}}></div>))}</div></div></div>
        <div className="settings-card"><div className="settings-card-title">STATISTICS</div><div className="stat-grid">{[["Tasks done",stats?String(stats.total_tasks_done):"—"],["Time tracked",stats?fmtDuration(stats.total_seconds):"—"],["Days logged",stats?String(stats.total_days):"—"]].map(([l,v])=>(<div key={l} className="stat-item"><div className="stat-item-label">{l}</div><div className="stat-item-val">{v}</div></div>))}</div></div>
        <div className="settings-card"><div className="settings-card-title">ACCOUNT</div><div style={{display:"flex",gap:10,flexWrap:"wrap"}}><button className="btn-settings">Export data</button><button className="btn-settings">Import data</button><button className="btn-settings danger" style={{marginLeft:"auto"}}>Delete account</button></div></div>
      </div>
      <div className="settings-preview">
        <div className="preview-card">
          <div className="preview-title">THEME PREVIEW</div>
          <div className="preview-topbar"><div style={{width:6,height:6,borderRadius:"50%",background:accentColor}}></div><span style={{fontFamily:"var(--mono)",fontSize:8,letterSpacing:2,color:accentColor}}>YUPLACED</span><span style={{fontFamily:"var(--mono)",fontSize:8,color:"#444",margin:"0 4px"}}>/</span><span style={{fontFamily:"var(--mono)",fontSize:8,color:"var(--muted)"}}>YUNOTE</span><div style={{marginLeft:"auto",width:14,height:14,borderRadius:"50%",background:"linear-gradient(135deg,#1c2128,#272e3a)",border:`1px solid ${accentColor}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:accentColor,fontFamily:"var(--mono)"}}>G</div></div>
          <div className="preview-tabs"><div className="preview-tab a" style={{borderBottomColor:accentColor,color:"var(--text)"}}>OVERVIEW</div><div className="preview-tab">FOLDERS</div><div className="preview-tab">DAILY</div></div>
          <div className="preview-focus" style={{borderLeftColor:accentColor}}><div className="preview-focus-title" style={{color:accentColor}}>TODAY FOCUS</div>{["Ревью PR","CI/CD setup"].map((t,i)=>(<div key={i} className="preview-task-row"><div className="preview-checkbox" style={{borderColor:i===0?"#3fb950":"#444",background:i===0?"#3fb95015":"none"}}></div><span className="preview-task-text" style={{textDecoration:i===0?"line-through":"none",color:i===0?"#555":"var(--muted)"}}>{t}</span></div>))}</div>
          <div className="preview-accent-bar" style={{background:accentColor}}></div>
          <div className="preview-swatches">{["#1c2128","#161b22","#0d1117"].map(c=>(<div key={c} style={{flex:1,height:8,background:c,border:"1px solid var(--border)"}}></div>))}<div style={{width:16,height:8,background:accentColor}}></div></div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MonthlyHeatmap, OverviewTab, FoldersTab, DailyReportTab, PomodoroTab, SettingsTab });