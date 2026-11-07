/* ============================================================
   SanderOS EVO — Núcleo: estado, temas, enrutador, shell,
   diálogos, toasts, notificaciones, motores (media/OBD/GPS)
   ============================================================ */
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const pad=n=>String(n).padStart(2,'0');
const fmtDur=s=>`${Math.floor(s/60)}:${pad(s%60)}`;
const DOW=['Dom.','Lun.','Mar.','Mié.','Jue.','Vie.','Sáb.'];
const MON=['Ene.','Feb.','Mar.','Abr.','May.','Jun.','Jul.','Ago.','Sep.','Oct.','Nov.','Dic.'];

/* ---------------- Estado global ---------------- */
const S = {
  screen:'driving', dockPage:0,
  theme:'auto', accent:'cyan', wallpaper:'mesh', anims:true,
  obd:{state:'off', demo:false, vals:{}, log:[]},
  gps:{on:false},
  drive:{demo:false, speed:0},
  nav:{provider:'karta', active:false, dest:null},
  media:{idx:0, playing:true, pos:37, shuffle:false, repeat:'off', vol:62, queue:TRACKS.map(t=>t.id)},
  bt:{on:true, connected:'Ana — Galaxy A54'},
  files:{mode:'single', view:'list', sort:'name', hidden:false, confirmDel:true, path:'/', paneL:'/', paneR:'/Música', sel:new Set(), dualCopy:'copy'},
  phonePerm:false,
  notifs:NOTIF_SEED.map(n=>({...n})),
  video:{cur:1, playing:false, pos:0, subs:'es', fullscreen:false},
  obdDemoCodes:false,
  eq:{on:true, preset:'Plano', gains:[...EQ_PRESETS['Plano']]},
  settings:{lang:'es', time24:true, startup:'driving', reverseAudio:'mute', videoBlock:true, driveMode:true, notifBehavior:'subtle'},
  onboarded:false, bootDone:false,
};

/* ---------------- Persistencia ---------------- */
function save(){
  try{ localStorage.setItem('sanderosevo', JSON.stringify({
    theme:S.theme, accent:S.accent, wallpaper:S.wallpaper, anims:S.anims,
    dockPages:S.dockPages, dockPage:S.dockPage, onboarded:S.onboarded,
    navProvider:S.nav.provider, files:{mode:S.files.mode, view:S.files.view, sort:S.files.sort, hidden:S.files.hidden, confirmDel:S.files.confirmDel},
    eq:{...S.eq}, settings:S.settings, mediaVol:S.media.vol,
  })); }catch(e){}
}
function load(){
  try{
    const d=JSON.parse(localStorage.getItem('sanderosevo')||'{}');
    Object.assign(S, {theme:d.theme??'auto', accent:d.accent??'cyan', wallpaper:d.wallpaper??'mesh', anims:d.anims??true,
      onboarded:!!d.onboarded, dockPage:d.dockPage??0});
    if(d.dockPages&&d.dockPages.length) S.dockPages=d.dockPages; else S.dockPages=[DOCK_DEFAULT.slice()];
    if(d.navProvider) S.nav.provider=d.navProvider;
    if(d.files) Object.assign(S.files, d.files);
    if(d.eq) Object.assign(S.eq, d.eq);
    if(d.settings) Object.assign(S.settings, d.settings);
    if(typeof d.mediaVol==='number') S.media.vol=d.mediaVol;
  }catch(e){ S.dockPages=[DOCK_DEFAULT.slice()]; }
}
S.dockPages=[DOCK_DEFAULT.slice()];

/* ---------------- Temas ---------------- */
const ACCENTS={
  cyan:{name:'Cian Eléctrico', mid:'#00D2FF', inkM:'#00D2FF', inkL:'#0276A6', softM:'rgba(0,210,255,.12)', softL:'rgba(0,180,228,.12)'},
  nova:{name:'Nova Azul', mid:'#3D8BFF', inkM:'#5EA6FF', inkL:'#1155C0', softM:'rgba(23,107,206,.16)', softL:'rgba(23,107,206,.10)'},
  green:{name:'Verde Éxito', mid:'#16C784', inkM:'#2EE6A0', inkL:'#0B8A5C', softM:'rgba(22,199,132,.12)', softL:'rgba(14,158,104,.10)'},
  amber:{name:'Ámbar', mid:'#F5A623', inkM:'#FFC14D', inkL:'#9A6A0A', softM:'rgba(245,166,35,.12)', softL:'rgba(199,127,17,.10)'},
  silver:{name:'Plata', mid:'#C4D2E4', inkM:'#D7E3F1', inkL:'#51617A', softM:'rgba(196,210,228,.12)', softL:'rgba(81,97,122,.10)'},
};
function resolvedTheme(){
  if(S.theme!=='auto') return S.theme;
  const h=new Date().getHours();
  return (h>=7&&h<19)?'light':'midnight';
}
function applyTheme(anim=true){
  const dev=$('.device'), t=resolvedTheme();
  $$('#ptThemeG .pt-btn').forEach(b=>b.classList.toggle('on', b.dataset.t===S.theme));
  if(anim){dev.classList.add('theme-anim'); setTimeout(()=>dev.classList.remove('theme-anim'),520);}
  dev.dataset.theme = t;
  document.body.classList.toggle('stage-light', t==='light');
  const a=ACCENTS[S.accent]||ACCENTS.cyan;
  const ink = t==='light'? a.inkL : a.inkM;
  const soft = t==='light'? a.softL : a.softM;
  dev.style.setProperty('--acc', a.mid);
  dev.style.setProperty('--acc-ink', ink);
  dev.style.setProperty('--acc-soft', soft);
  dev.style.setProperty('--line-acc', t==='light'? 'rgba(0,150,200,.4)':'rgba('+[0,210,255].join(',')+',.38)');
  const wp=$('.screen-root');
  wp.classList.remove('wp-mesh','wp-grad');
  if(S.wallpaper==='mesh') wp.classList.add('wp-mesh');
  if(S.wallpaper==='grad') wp.classList.add('wp-grad');
  document.body.classList.toggle('no-anim', !S.anims);
  refreshDS(); refreshToolbar();
}
function setTheme(mode){ S.theme=mode; applyTheme(); save(); }

/* ---------------- Registro de pantallas ---------------- */
const SCREENS={};
function reg(id,def){ SCREENS[id]={...def,id}; }
let _viewEl=null;
function go(id,{push=true}={}){
  const def=SCREENS[id]; if(!def) return;
  closeNotifPanel();
  S.screen=id;
  ['vplayer','fprev','call'].forEach(f=>{ if(f!=='call') $('#'+f)?.classList.remove('on'); });
  const host=$('#modView');
  const old=_viewEl;
  const v=document.createElement('div'); v.className='mod-view'; v.dataset.screen=id;
  def.render(v);
  host.appendChild(v);
  requestAnimationFrame(()=>requestAnimationFrame(()=>v.classList.add('on')));
  if(old){ old.classList.remove('on'); setTimeout(()=>old.remove(), 320); }
  _viewEl=v;
  renderDock(); updateToolbarSel();
  if(def.onShow) def.onShow(v);
}

/* ---------------- Barra superior ---------------- */
function renderTopbar(){
  const tb=$('#topbar');
  tb.innerHTML=`
  <div class="tb-brand" id="tbHome" title="Volver a Vista de Conducción">
    <div class="tb-logo"><span class="w-mark" style="height:24px"></span></div>
    <div class="tb-wordmark wordmark"><span class="w-sander">Sander</span><span class="w-os">OS</span><span class="w-evo">EVO</span></div>
  </div>
  <div class="tb-mid">
    <button class="tb-btn" id="tbBell" title="Notificaciones">${ic('bell',22)}<span class="bdg" id="tbBadge" style="display:none">0</span></button>
    <div class="tb-div"></div>
    <div class="tb-wifi">${ic('wifi',20)}<span class="t">Conectado</span></div>
  </div>
  <div class="tb-right">
    <div class="tb-clock">
      <div class="h" id="tbTime">--:--</div>
      <div class="tb-div"></div>
      <div class="d" id="tbDate"><b></b></div>
    </div>
    <div class="tb-div"></div>
    <button class="tb-btn" id="tbSettings" title="Ajustes">${ic('settings',22)}</button>
  </div>`;
  $('#tbHome').onclick=()=>go('driving');
  $('#tbSettings').onclick=()=>go('settings');
  $('#tbBell').onclick=toggleNotifPanel;
  tickClock();
}
function tickClock(){
  const d=new Date();
  const t=$('#tbTime'), dd=$('#tbDate');
  if(t) t.textContent=`${pad(d.getHours())}:${pad(d.getMinutes())}`;
  if(dd) dd.innerHTML=`<b>${DOW[d.getDay()]}</b> ${d.getDate()} ${MON[d.getMonth()]}`;
}
function notifCount(){ return S.notifs.filter(n=>n.active).length; }
function refreshBadge(){
  const b=$('#tbBadge'); if(!b) return;
  const n=notifCount();
  b.style.display=n?'grid':'none'; b.textContent=n;
  const bell=$('#notifBellBadge');
  if(bell){ bell.style.display=n?'grid':'none'; bell.textContent=n; }
}

/* ---------------- Dock ---------------- */
function dockModules(){ return S.dockPages[S.dockPage]||S.dockPages[0]; }
function renderDock(){
  const dock=$('#dock'), pages=$('#dockPages');
  const mods=dockModules();
  dock.innerHTML=mods.map(m=>{
    const M=MODULES[m]; if(!M) return '';
    const badge = m==='notifs'&&notifCount()?`<span class="dt-badge">${notifCount()}</span>`:'';
    return `<button class="dock-tile ${S.screen===m?'on':''}" data-mod="${m}" title="${esc(M.label)}">
      ${badge}<span class="dt-ic" style="color:${S.screen===m?'var(--acc-ink)':''}">${ic(M.icon,38)}</span>
      <span class="dt-lb">${esc(M.label)}</span></button>`;
  }).join('');
  $$('.dock-tile',dock).forEach(t=>t.onclick=()=>go(t.dataset.mod));
  if(pages){
    pages.innerHTML=S.dockPages.map((_,i)=>`<span class="pg ${i===S.dockPage?'on':''}"></span>`).join('');
    $$('.pg',pages).forEach((p,i)=>p.onclick=()=>{S.dockPage=i;renderDock();save();});
  }
}
function dockAddPage(){ S.dockPages.push([]); S.dockPage=S.dockPages.length-1; renderDock(); save(); }
function dockRemovePage(i){ if(S.dockPages.length<=1)return; S.dockPages.splice(i,1); S.dockPage=Math.min(S.dockPage,S.dockPages.length-1); renderDock(); save(); }
function dockMove(mod,dir){
  const arr=S.dockPages[S.dockPage]; const i=arr.indexOf(mod);
  const j=i+dir; if(i<0||j<0||j>=arr.length) return;
  [arr[i],arr[j]]=[arr[j],arr[i]]; renderDock(); save();
}

/* ---------------- Barra inferior ---------------- */
function obdStateBadge(){
  const o=S.obd;
  if(o.state==='connected') return {cls:'ok', ic:'gauge', main:'OBD2', sub:'Conectado'};
  if(o.state==='connecting') return {cls:'warn', ic:'gauge', main:'OBD2', sub:'Conectando…'};
  return {cls:'dim', ic:'gauge', main:'OBD2', sub:'Sin conectar'};
}
function speedSource(){
  if(S.gps.on||S.drive.demo) return {v:S.drive.demo?Math.round(S.drive.speed):(S.gps.on?Math.round(S.drive.speed):null), src:'GPS', demo:S.drive.demo&&!S.gps.on};
  return null;
}
function renderBottombar(){
  const bb=$('#bottombar');
  const ob=obdStateBadge();
  const sp=speedSource();
  const tr=TRACKS[S.media.idx];
  bb.innerHTML=`
  <div class="bb-cell" title="Clima (demo)">
    <span class="bb-ic acc">${ic('sun',18)}</span>
    <span class="bb-tt"><span class="v">22°C</span><span class="s">Despejado · Córdoba</span></span>
  </div>
  <div class="sep"><div class="bb-sep"></div></div>
  <div class="bb-cell clickable" id="bbObd" title="Monitor OBD2">
    <span class="bb-ic ${ob.cls}">${ic(ob.ic,17)}</span>
    <span class="bb-tt"><span class="v">${ob.main}</span><span class="s">${ob.sub}</span></span>
  </div>
  <div class="sep"><div class="bb-sep"></div></div>
  <div class="bb-cell clickable" id="bbGps" title="GPS">
    <span class="bb-ic ${sp?'acc':'dim'}">${ic('pin',17)}</span>
    <span class="bb-tt"><span class="v" id="bbGpsV">${sp&&sp.v!=null?sp.v+' <small style="font-size:11px">km/h</small>':'—'}</span><span class="s" id="bbGpsS">GPS ${sp?(sp.demo?'· demo':''):'· sin señal'}</span></span>
  </div>
  <div class="sep"><div class="bb-sep"></div></div>
  <div class="bb-cell bb-music clickable" id="bbMusic" title="Reproductor de audio">
    <img src="${IMG[tr.cover]}" alt="" style="width:34px;height:34px;border-radius:8px;object-fit:cover;box-shadow:0 0 0 1px var(--line)">
    <span class="bb-tt"><span class="v">${esc(tr.title)}</span><span class="s">${esc(tr.artist)}</span></span>
  </div>
  <div class="bb-ctrl">
    <button class="cbtn" id="bbPrev" title="Anterior">${ic('skip-b',20)}</button>
    <button class="cbtn main" id="bbPlay" title="Reproducir / Pausar">${ic(S.media.playing?'pause':'play',22)}</button>
    <button class="cbtn" id="bbNext" title="Siguiente">${ic('skip-f',20)}</button>
  </div>
  <div class="sep"><div class="bb-sep"></div></div>
  <button class="tb-btn bb-bell" id="notifBell" title="Notificaciones" style="width:40px;height:40px">${ic('bell',20)}<span class="bdg" id="notifBellBadge" style="display:none">0</span></button>`;
  $('#bbObd').onclick=()=>go('obd');
  $('#bbGps').onclick=()=>go('vehicle');
  $('#bbMusic').onclick=()=>go('nowplaying');
  $('#bbPrev').onclick=()=>mediaNext(-1);
  $('#bbNext').onclick=()=>mediaNext(1);
  $('#bbPlay').onclick=mediaToggle;
  $('#notifBell').onclick=toggleNotifPanel;
  refreshBadge();
}

/* ---------------- Diálogos ---------------- */
let _dlg=null;
function dialog(o){
  closeDialog();
  const ov=$('#ovl');
  const act=(o.actions||[]).map((a,i)=>`<button class="btn ${a.cls||''}" data-i="${i}" ${a.disabled?'disabled':''}>${a.label}</button>`).join('');
  ov.innerHTML=`<div class="ovl-bg"></div><div class="dlg ${o.lg?'d-lg':''} ovl-card">
    <div class="dlg-h">${o.icon?`<div class="di" style="background:var(--${o.color||'acc'}-soft);color:var(--${o.color||'acc'})">${ic(o.icon,22)}</div>`:''}
      <div class="dt">${o.title}</div>${o.badge||''}</div>
    <div class="dlg-b">${o.body||''}</div>
    ${o.extra||''}
    <div class="dlg-f">${act}</div></div>`;
  ov.classList.add('on');
  $$('.dlg-f .btn',ov).forEach(b=>b.onclick=()=>{ const a=o.actions[+b.dataset.i]; if(a.keep!==true) closeDialog(); a.onClick&&a.onClick(); });
  $('.ovl-bg',ov).onclick=closeDialog;
  _dlg=ov; return ov;
}
function closeDialog(){ const ov=$('#ovl'); if(ov){ov.classList.remove('on'); ov.innerHTML='';} _dlg=null; }
function confirmDlg(o){
  dialog({icon:o.icon||'alert', color:o.color||'warn', title:o.title, body:o.body,
    actions:[{label:'Cancelar',cls:'ghost'},{label:o.ok||'Confirmar',cls:o.cls||'danger',onClick:o.onOk}]});
}

/* ---------------- Toasts ---------------- */
function toast(o){
  const w=$('#toasts');
  const t=document.createElement('div'); t.className='toast';
  t.innerHTML=`<span class="bb-ic ${o.color||'acc'}" style="width:38px;height:38px;border-radius:11px;display:grid;place-items:center;background:var(--${o.color||'acc'}-soft);color:var(--${o.color||'acc'})">${ic(o.icon||'info',19)}</span>
    <div style="flex:1;min-width:0"><div style="font-weight:700;font-size:14px">${esc(o.title)}</div>${o.body?`<div class="tx2" style="font-size:12.5px;margin-top:1px">${o.body}</div>`:''}</div>
    <button class="ibtn sm">${ic('x',16)}</button>`;
  const kill=()=>{ t.classList.add('out'); setTimeout(()=>t.remove(),300); };
  t.querySelector('button').onclick=kill;
  w.appendChild(t);
  setTimeout(kill, o.timeout||3600);
}

/* ---------------- Panel de notificaciones ---------------- */
let _npOpen=false;
function toggleNotifPanel(){ _npOpen?closeNotifPanel():openNotifPanel(); }
function openNotifPanel(){ if(_npOpen)return; _npOpen=true; renderNotifPanel(); $('#notifPanel').classList.add('on'); }
function closeNotifPanel(){ if(!_npOpen)return; _npOpen=false; $('#notifPanel').classList.remove('on'); }
function renderNotifPanel(){
  const p=$('#notifPanel');
  const act=S.notifs.filter(n=>n.active), old=S.notifs.filter(n=>!n.active);
  const card=n=>`<div class="notif-card" data-id="${n.id}">
    <span class="ni" style="background:var(--${n.color}-soft);color:var(--${n.color})">${ic(n.icon,21)}</span>
    <div class="nt"><div class="t">${esc(n.title)}</div><div class="s">${esc(n.body)}</div><div class="tm">${esc(n.time)}</div></div>
    <button class="ibtn sm" data-dismiss="${n.id}" title="Descartar">${ic('x',16)}</button></div>`;
  p.innerHTML=`<div style="padding:18px 24px 8px;display:flex;align-items:center;gap:12px">
      <div style="font-family:var(--f-brand);font-weight:800;font-size:19px">Notificaciones</div>
      <span class="badge dim">${act.length} activas</span>
      <button class="btn ghost sm" style="margin-left:auto" id="npHistory">${ic('history',15)} Historial</button>
      <button class="ibtn sm" id="npClose">${ic('x',18)}</button>
    </div>
    <div style="padding:4px 24px 20px;display:flex;flex-direction:column;gap:9px;max-height:420px;overflow-y:auto">
      ${act.length?act.map(card).join(''):`<div class="state-blank" style="padding:22px"><div class="sb-ic" style="width:56px;height:56px;border-radius:16px">${ic('bell',26)}</div><div class="s">No hay notificaciones activas</div></div>`}
      ${old.length?`<div class="cap" style="margin-top:6px">Anteriores</div>`+old.map(card).join(''):''}
    </div>`;
  $('#npClose').onclick=closeNotifPanel;
  $('#npHistory').onclick=()=>{ closeNotifPanel(); go('notifs'); };
  $$('[data-dismiss]',p).forEach(b=>b.onclick=e=>{
    e.stopPropagation();
    S.notifs=S.notifs.filter(n=>n.id!==+b.dataset.dismiss);
    renderNotifPanel(); refreshBadge(); renderDock();
  });
  $$('.notif-card',p).forEach(c=>c.onclick=()=>{ closeNotifPanel(); go('notifs'); });
}

/* ---------------- Motor multimedia (demo) ---------------- */
function curTrack(){ return TRACKS[S.media.idx]; }
function mediaToggle(){
  S.media.playing=!S.media.playing;
  const b=$('#bbPlay'); if(b) b.innerHTML=ic(S.media.playing?'pause':'play',22);
  if(S.screen==='nowplaying') go('nowplaying');
}
function mediaNext(dir=1){
  const q=S.media.queue;
  let i=q.indexOf(TRACKS[S.media.idx].id);
  if(S.media.shuffle){ i=Math.floor(Math.random()*q.length); }
  else i=(i+dir+q.length)%q.length;
  S.media.idx=TRACKS.findIndex(t=>t.id===q[i]);
  S.media.pos=0;
  renderBottombar();
  if(S.screen==='nowplaying') go('nowplaying');
}
function mediaEnded(){
  if(S.media.repeat==='one'){ S.media.pos=0; return; }
  if(S.media.repeat==='all'||S.media.queue.length>1){
    const last = S.media.queue.indexOf(TRACKS[S.media.idx].id)===S.media.queue.length-1;
    if(last&&S.media.repeat==='off'&&S.media.shuffle===false){ S.media.playing=false; renderBottombar(); return; }
    mediaNext(1);
  }
}

/* ---------------- Motor OBD2 (simulación etiquetada DEMO) ---------------- */
function obdConnect(){
  if(S.obd.state==='connecting'||S.obd.state==='connected') return;
  S.obd.state='connecting'; S.obd.log=[];
  const steps=[
    ['Buscando adaptadores Bluetooth…',300],
    ['Encontrado: Konnwei KW906 (00:1D:A5:xx)',1300],
    ['Estableciendo conexión SPP…',1200],
    ['Inicializando ELM327… ATZ',900],
    ['Protocolo: ISO 15765-4 (CAN 11-bit, 500 k)',1000],
    ['Leyendo PIDs soportados…',900],
    ['Conectado · 8 PID disponibles',600],
  ];
  let t=0;
  steps.forEach(([msg,d])=>{ t+=d; setTimeout(()=>{
    S.obd.log.push(msg);
    if(S.screen==='obd') go('obd');
    if(S.screen==='obd-conn') go('obd-conn');
  },t); });
  setTimeout(()=>{
    S.obd.state='connected';
    S.notifs.unshift({id:Date.now(),icon:'gauge',color:'ok',title:'OBD2 — Conectado',body:'Adaptador Konnwei KW906 vinculado. Datos en vivo disponibles.',time:'ahora',active:true});
    toast({icon:'gauge',color:'ok',title:'OBD2 conectado',body:'Konnwei KW906 · CAN 11-bit · 500 k'});
    refreshBadge(); renderBottombar(); renderDock();
    if(S.screen==='obd'||S.screen==='obd-conn') go(S.screen);
  },t+400);
}
function obdDisconnect(){
  S.obd.state='off'; S.obd.vals={};
  renderBottombar(); renderDock();
  if(['obd','obd-conn','obd-live','obd-diag'].includes(S.screen)) go(S.screen);
}
function obdVal(p){
  if(S.obd.state!=='connected') return null;
  const base=S.drive.demo?p.demo[1]:p.demo[0];
  const jitter=(Math.sin(Date.now()/1700+p.min)*.5+.5)*(p.max-p.min)*.006;
  return base+jitter*(p.max>500?6:1);
}

/* ---------------- Simulación de conducción (DEMO) ---------------- */
function setDrive(on){
  S.drive.demo=on;
  if(!on){ S.drive.speed=0; }
  const r=$('.drv-road'); if(r) r.style.setProperty('--road-t','1s');
  renderBottombar();
  if(S.screen==='driving') go('driving');
  if(on){ toast({icon:'car-front',color:'acc',title:'Marcha simulada activada',body:'Los valores mostrados son de DEMOSTRACIÓN.'}); }
  renderBottombar();
}

/* ---------------- Reloj / tick global ---------------- */
setInterval(()=>{
  tickClock();
  if(S.media.playing){
    S.media.pos++;
    if(S.media.pos>=curTrack().dur){ mediaEnded(); }
    const p=$('#npPos'); if(p) p.textContent=fmtDur(S.media.pos);
    const bar=$('#npBar'); if(bar) bar.style.width=(S.media.pos/curTrack().dur*100)+'%';
    const d=$('#dashPos'); if(d) d.textContent=fmtDur(S.media.pos);
    const db=$('#dashBar'); if(db) db.style.width=(S.media.pos/curTrack().dur*100)+'%';
  }
  if(S.drive.demo&&S.drive.speed<72) S.drive.speed=Math.min(72,S.drive.speed+4);
  if(S.drive.demo||S.gps.on){
    const sp=speedSource();
    const bbv=$('#bbGpsV');
    if(bbv&&sp){ bbv.innerHTML=sp.v!=null?Math.round(sp.v)+' <small style="font-size:11px">km/h</small>':'—'; }
    const bbs=$('#bbGpsS');
    if(bbs&&sp){ bbs.textContent='GPS '+(sp.demo?'· demo':''); }
  }
  if(S.screen==='driving'){
    const sp=speedSource();
    const n=$('#dvSpeed');
    if(n){ n.innerHTML = sp&&sp.v!=null? String(Math.round(sp.v)) : '<span class="dim">— —</span>'; }
    const road=$('.drv.road-on'); if(road&&sp&&sp.v){ road.style.setProperty('--road-t', Math.max(.32, 1.05-sp.v/110)+'s'); }
  }
  if(S.obd.state==='connected'&&['obd-live','obd'].includes(S.screen)) updateGauges();
},1000);

/* Auto-tema: reevalúa cada minuto */
setInterval(()=>{ if(S.theme==='auto') applyTheme(); },60000);

/* ---------------- Atajos de teclado del prototipo ---------------- */
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){ closeDialog(); closeNotifPanel(); }
  if(e.key==='ArrowRight'){ const m=dockModules(); const i=m.indexOf(S.screen); if(i>=0&&i<m.length-1) go(m[i+1]); }
  if(e.key==='ArrowLeft'){ const m=dockModules(); const i=m.indexOf(S.screen); if(i>0) go(m[i-1]); }
});

/* ---------------- Actualización de pantallas vivas ---------------- */
function updateGauges(){
  $$('[data-gauge]').forEach(g=>{
    const p=OBD_PIDS.find(x=>x.pid===g.dataset.gauge); if(!p) return;
    const v=obdVal(p);
    const num=g.querySelector('.n'); if(num) num.textContent=v==null?'— —':(v>=1000?Math.round(v):v.toFixed(v<20?1:0));
    const arc=g.querySelector('.g-val');
    if(arc&&v!=null){
      const r=arc.r.baseVal.value, C=2*Math.PI*r, frac=Math.max(0,Math.min(1,(v-p.min)/(p.max-p.min)));
      arc.style.strokeDasharray=C*.75; arc.style.strokeDashoffset=C*.75*(1-frac);
      g.classList.toggle('warn', v>=p.warn && v<p.max*.96);
      g.classList.toggle('err', v>=p.max*.96);
    }
  });
}
function refreshDS(){ if(S.screen==='design'){ const v=_viewEl; if(v) SCREENS.design.render(v); } }

/* ---------------- Toolbar del prototipo (fuera del diseño) ---------------- */
function refreshToolbar(){
  const sel=$('#ptTheme'); if(sel) sel.value=S.theme;
}
function updateToolbarSel(){
  const sel=$('#ptScreens'); if(!sel) return;
  const val=S.screen==='vplayer'?'video':S.screen;
  if([...sel.options].some(o=>o.value===val)) sel.value=val;
}
function buildToolbar(){
  const tb=$('#ptoolbar');
  tb.innerHTML=`
    <span class="pt-title">Sander<b>OS</b> EVO · Prototipo interactivo</span>
    <span class="pt-sep"></span>
    <div class="pt-group" id="ptThemeG">
      <button class="pt-btn ${S.theme==='midnight'?'on':''}" data-t="midnight">Midnight</button>
      <button class="pt-btn ${S.theme==='light'?'on':''}" data-t="light">Light</button>
      <button class="pt-btn ${S.theme==='auto'?'on':''}" data-t="auto">Auto</button>
    </div>
    <span class="pt-sep"></span>
    <select class="pt-select" id="ptScreens"></select>
    <span class="pt-note">1280 × 720 · Renault Sandero 2017 · ← → cambia módulo</span>`;
  $$('#ptThemeG .pt-btn').forEach(b=>b.onclick=()=>{ setTheme(b.dataset.t); $$('#ptThemeG .pt-btn').forEach(x=>x.classList.toggle('on',x===b)); });
  const sel=$('#ptScreens');
  const groups={};
  Object.values(SCREENS).forEach(s=>{ (s.group||'Otros'); (groups[s.group||'Otros']=groups[s.group||'Otros']||[]).push(s); });
  Object.entries(groups).forEach(([g,list])=>{
    const og=document.createElement('optgroup'); og.label=g;
    list.sort((a,b)=>a.id.localeCompare(b.id)).forEach(s=>{ const o=document.createElement('option'); o.value=s.id; o.textContent=s.title; og.appendChild(o); });
    sel.appendChild(og);
  });
  sel.onchange=()=>{ if(sel.value==='video'){ go('video'); } else go(sel.value); };
}

/* ---------------- Escalado del dispositivo ---------------- */
function fitScale(){
  const wrap=$('.device-wrap');
  const availW=window.innerWidth-28, availH=window.innerHeight-92;
  const sc=Math.min(1, availW/1280, availH/720);
  $('.device').style.transform=`scale(${sc})`;
  wrap.style.width=(1280*sc)+'px'; wrap.style.height=(720*sc)+'px';
}
window.addEventListener('resize',fitScale);
