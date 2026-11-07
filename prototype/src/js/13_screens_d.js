/* ============================================================
   SanderOS EVO — Gestor de Archivos: Home, explorador simple,
   panel doble, vista previa, detalles y operaciones
   ============================================================ */
function fsNode(path){
  if(path==='/'||path==='') return {name:'Almacenamiento interno',type:'dir',children:FS['/'].children};
  const parts=path.split('/').filter(Boolean);
  let node={type:'dir',children:FS['/'].children};
  for(const p of parts){
    const next=(node.children||[]).find(c=>c.name===p);
    if(!next) return null;
    node=next;
  }
  return node;
}
function fsSort(items){
  const dir=S.files.sort;
  const dirs=items.filter(i=>i.type==='dir'), files=items.filter(i=>i.type!=='dir');
  const byName=(a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true});
  const byDate=(a,b)=>(b.date||'').localeCompare(a.date||'');
  const bySize=(a,b)=>parseInt((b.size||'0').replace(/\D/g,''))-parseInt((a.size||'0').replace(/\D/g,''));
  const fn=dir==='name'?byName:dir==='date'?byDate:bySize;
  return [...dirs.sort(byName),...files.sort(fn)];
}
function fsCrumb(path){
  const parts=path.split('/').filter(Boolean);
  let acc=[];
  return [`<button class="cr ${path==='/'?'on':''}" data-p="/">Interno</button>`].concat(
    parts.map((p,i)=>{acc.push(p);const pp='/'+acc.join('/');return `<span class="cs">${ic('chev-r',12)}</span><button class="cr ${i===parts.length-1?'on':''}" data-p="${pp}">${esc(p)}</button>`;})
  ).join('');
}
function fmtSize(n){return n;}
function fmRow(item,path,pane){
  const m=FM_TYPE_META[item.type]||FM_TYPE_META.txt;
  const sel=S.files.sel.has(path+'/'+item.name);
  const inSel=S.files.selMode;
  const locked=item.locked?'':`data-open="${path}/${item.name}"`;
  return `<div class="row ${sel?'on':''}" ${locked} data-name="${esc(item.name)}" data-pane="${pane}">
    ${inSel?`<span class="chk ${sel?'on':''}" data-chk="${path}/${item.name}">${ic('check',13)}</span>`:''}
    ${item.img?`<span class="r-ic img"><img src="${IMG[item.img]}"></span>`:`<span class="r-ic" style="background:${m.c}22;color:${m.c}">${ic(m.ic,18)}</span>`}
    <div class="r-tt"><div class="t">${esc(item.name)}${item.hidden?' <span class="tx3" style="font-size:10px">(oculto)</span>':''}</div>
    <div class="s">${item.type==='dir'?`${(item.children||[]).length} elementos`:esc(item.size)+' · '+esc(item.date||'')}</div></div>
    <div class="r-en">
      ${item.locked?`<span class="badge dim">Sistema</span>`:''}
      <button class="ibtn sm" data-more="${path}/${item.name}" title="Más opciones">${ic('more-v',17)}</button>
    </div></div>`;
}
function fmGridTile(item,path){
  const m=FM_TYPE_META[item.type]||FM_TYPE_META.txt;
  return `<div class="fm-gtile" data-open="${path}/${item.name}">
    <span class="gi ${item.img?'img':''}" ${item.img?`style="background:#000"`:''} ${item.img?`><img src="${IMG[item.img]}" style="width:100%;height:100%;object-fit:cover;border-radius:14px"></span`:`style="color:${m.c}">${ic(m.ic,30)}</span>`}
    <span class="gt">${esc(item.name)}</span>
    <span class="gs">${item.type==='dir'?(item.children||[]).length+' el.':esc(item.size)}</span></div>`;
}
function fmToolbar(v,opts={}){
  return `
  <button class="ibtn solid" data-nav="up" title="Subir">${ic('arr-l',20)}</button>
  <div class="crumbs" style="flex:1" id="crumbZone"></div>
  <div class="search" style="max-width:240px;flex:0 1 240px"><span class="s-ic">${ic('search',15)}</span><input class="inp" style="height:40px" placeholder="Buscar…"></div>
  <div class="sel sm"><select id="fmSort"><option value="name" ${S.files.sort==='name'?'selected':''}>Nombre</option><option value="date" ${S.files.sort==='date'?'selected':''}>Fecha</option><option value="size" ${S.files.sort==='size'?'selected':''}>Tamaño</option></select></div>
  <button class="ibtn solid" data-view="toggle" title="Vista">${ic(S.files.view==='list'?'grid':'rows',19)}</button>
  ${opts.dual?'':`<button class="ibtn solid" data-mode="dual" title="Panel doble">${ic('layout',19)}</button>`}
  <button class="ibtn solid" id="fmMore" title="Más">${ic('more-v',19)}</button>`;
}

/* ---------------- HOME DEL GESTOR ---------------- */
reg('files-home',{title:'Archivos · Inicio',group:'Archivos',render(v){
  const usb=S.usb;
  v.innerHTML=`
  <div class="fm">
    <div class="mod-head">
      <div class="mh-ic">${ic('folder',24)}</div>
      <div><div class="mh-t">Archivos</div><div class="mh-s">Almacenamiento del vehículo · ${S.files.mode==='dual'?'panel doble':'panel simple'}</div></div>
      <div class="mh-act">
        <div class="seg">
          <button class="sg ${S.files.mode==='single'?'on c':''}" data-m="single">Simple</button>
          <button class="sg ${S.files.mode==='dual'?'on c':''}" data-m="dual">Doble panel</button>
        </div>
      </div>
    </div>
    <div class="fm-toolbar">
      <div class="fm-storage" style="flex:1;display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="stor-card" data-open="/" data-nav="internal">
          <div class="sc-t">${ic('hard-drive',20)}<span class="t">Almacenamiento interno</span><span class="s">26,4 / 32 GB</span></div>
          <div class="prog thin"><i style="width:82%"></i></div>
          <div class="tx2" style="font-size:11px">5,6 GB libres · usado al 82%</div>
        </div>
        <div class="stor-card" style="${usb?'':'opacity:.7'}" id="usbCard">
          <div class="sc-t">${ic('usb',20)}<span class="t">Memoria USB</span><span class="s">${usb?'58,2 / 64 GB':'no conectada'}</span></div>
          ${usb?`<div class="prog thin"><i style="width:91%"></i></div><div class="tx2" style="font-size:11px">5,8 GB libres · Kingston DataTraveler</div>
          <div style="display:flex;gap:8px;margin-top:4px"><button class="btn xs" data-open="/usb">Explorar</button><button class="btn xs ghost" id="usbEject">${ic('power',12)} Expulsar</button></div>`
          :`<div class="tx2" style="font-size:11.5px;display:flex;gap:8px;align-items:center;margin-top:6px">${ic('info',14)} Conecta una memoria para explorarla aquí.</div>`}
        </div>
      </div>
    </div>
    <div class="fm-body">
      <div class="cap" style="margin:0 4px 9px">Categorías</div>
      <div class="grid" style="grid-template-columns:repeat(6,1fr);margin-bottom:16px">
        ${[['Imágenes','image','#5CE2A8','/DCIM/Camera',4],['Vídeos','film','#FF9E64','/Vídeos',2],['Audio','music','#B48CFF','/Música',4],['Documentos','file-txt','#8FD9F2','/Documentos',3],['Descargas','download','#F5C86B','/Descargas',3],['App (APK)','file-apk','#7EE0FF','/Descargas',1]].map(c=>`
        <button class="fm-tile" data-open="${c[3]}">
          <span class="ft-ic" style="background:${c[2]}22;color:${c[2]}">${ic(c[1],24)}</span>
          <span class="ft-tt"><span class="t">${c[0]}</span><span class="s">${c[4]} elementos</span></span>
        </button>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:14px">
        <div>
          <div class="cap" style="margin:0 4px 9px">Recientes</div>
          <div class="card" style="padding:6px 8px">
            ${RECENT_FILES.map(f=>{const m=FM_TYPE_META[f.type];return `
            <div class="row" data-open="${f.path}/${f.name}">
              ${f.img?`<span class="r-ic img"><img src="${IMG[f.img]}"></span>`:`<span class="r-ic" style="background:${m.c}22;color:${m.c}">${ic(m.ic,17)}</span>`}
              <div class="r-tt"><div class="t">${esc(f.name)}</div><div class="s">${esc(f.path)} · ${esc(f.date)}</div></div>
              <div class="r-en mono" style="font-size:11px">${esc(f.size)}</div>
            </div>`;}).join('')}
          </div>
        </div>
        <div>
          <div class="cap" style="margin:0 4px 9px">Favoritos</div>
          <div class="card" style="padding:6px 8px">
            ${FAV_FOLDERS.map(f=>`
            <div class="row" data-open="${f.path}">
              <span class="r-ic" style="background:var(--acc-soft);color:var(--acc-ink)">${ic('star',17)}</span>
              <div class="r-tt"><div class="t">${esc(f.name)}</div><div class="s">${esc(f.n)}</div></div>
            </div>`).join('')}
            <div class="row" data-open="/.config" style="opacity:.6">
              <span class="r-ic">${ic('star',17)}</span>
              <div class="r-tt"><div class="t">.config</div><div class="s">carpeta oculta</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  $$('.sg[data-m]',v).forEach(b=>b.onclick=()=>{S.files.mode=b.dataset.m;save();go(S.files.mode==='dual'?'files-dual':'files');});
  $$('[data-open]',v).forEach(el=>el.onclick=e=>{
    if(e.target.closest('[data-nav]')&&el.dataset.nav) { go('files'); return; }
    openPath(el.dataset.open);
  });
  const ej=$('#usbEject',v); if(ej) ej.onclick=e=>{e.stopPropagation();S.usb=false;toast({icon:'usb',color:'warn',title:'USB expulsada',body:'Puedes retirar la memoria con seguridad.'});go('files-home');};
  const uc=$('#usbCard',v); if(uc&&!S.usb) uc.onclick=()=>{S.usb=true;toast({icon:'usb',color:'ok',title:'USB conectada',body:'Kingston DataTraveler 64 GB (demo).'});go('files-home');};
}});
function openPath(p){
  if(p==='/usb'){ go('files'); toast({icon:'info',color:'acc',title:'USB en demo',body:'La memoria USB de 64 GB es de demostración.'}); return; }
  const n=fsNode(p);
  if(!n){ toast({icon:'alert',color:'err',title:'Ruta no encontrada',body:esc(p)}); return; }
  if(n.type==='dir'){ S.files.path=p; go(S.files.mode==='dual'?'files-dual':'files'); }
  else openFile(p,n);
}

/* ---------------- EXPLORADOR PANEL SIMPLE ---------------- */
reg('files',{title:'Explorador de archivos',group:'Archivos',render(v){
  const path=S.files.path||'/';
  const node=fsNode(path)||fsNode('/');
  let items=(node.children||[]).filter(i=>S.files.hidden||!i.hidden);
  if(S.files.query) items=items.filter(i=>i.name.toLowerCase().includes(S.files.query.toLowerCase()));
  items=fsSort(items);
  v.innerHTML=`
  <div class="fm">
    <div class="mod-head" style="padding-bottom:8px">
      <button class="ibtn" onclick="go('files-home')">${ic('home',20)}</button>
      <div class="mh-ic">${ic('folder-open',24)}</div>
      <div><div class="mh-t">${esc(node.name)}</div><div class="mh-s">${items.length} elementos · ${path}</div></div>
      <div class="mh-act">
        ${S.files.selMode?`<span class="badge acc">${S.files.sel.size} selec.</span>
        <button class="btn xs" id="selAll">Todo</button>
        <button class="btn xs primary" id="selCopy">${ic('copy',12)}</button>
        <button class="btn xs" id="selMove">${ic('share',12)}</button>
        <button class="btn xs danger" id="selDel">${ic('trash',12)}</button>
        <button class="ibtn sm" id="selExit">${ic('x',16)}</button>`:
        `<button class="btn sm" id="selStart">${ic('check',14)} Seleccionar</button>`}
      </div>
    </div>
    <div class="fm-toolbar">${fmToolbar(v)}</div>
    <div class="fm-body" id="fmBody">
      ${items.length===0?`<div class="state-blank"><div class="sb-ic">${ic('folder',32)}</div><div class="t">Carpeta vacía</div><div class="s">No hay elementos aquí${S.files.query?' que coincidan con la búsqueda':''}.</div></div>`:
      S.files.view==='list'?`<div style="display:flex;flex-direction:column;gap:2px">${items.map(i=>fmRow(i,path,'L')).join('')}</div>`
      :`<div class="fm-grid">${items.map(i=>fmGridTile(i,path)).join('')}</div>`}
    </div>
  </div>`;
  $('#crumbZone',v).innerHTML=fsCrumb(path);
  $$('.cr',v).forEach(c=>c.onclick=()=>{S.files.path=c.dataset.p;go('files');});
  $$('[data-nav="up"]',v).forEach(b=>b.onclick=()=>{S.files.path=path.split('/').slice(0,-1).join('/')||'/';go('files');});
  $('#fmSort',v).onchange=e=>{S.files.sort=e.target.value;save();go('files');};
  $$('[data-view="toggle"]',v).forEach(b=>b.onclick=()=>{S.files.view=S.files.view==='list'?'grid':'list';save();go('files');});
  $$('[data-mode="dual"]',v).forEach(b=>b.onclick=()=>{S.files.mode='dual';save();go('files-dual');});
  $('#fmMore',v).onclick=()=>fmSettingsMenu();
  $$('.inp',v).forEach(inp=>inp.oninput=e=>{S.files.query=e.target.value;const b=$('#fmBody',v);
    const items2=fsSort((fsNode(path).children||[]).filter(i=>(S.files.hidden||!i.hidden)&&(!S.files.query||i.name.toLowerCase().includes(S.files.query.toLowerCase()))));
    b.innerHTML=items2.length===0?`<div class="state-blank"><div class="sb-ic">${ic('search',30)}</div><div class="t">Sin resultados</div></div>`
      :S.files.view==='list'?`<div style="display:flex;flex-direction:column;gap:2px">${items2.map(i=>fmRow(i,path,'L')).join('')}</div>`
      :`<div class="fm-grid">${items2.map(i=>fmGridTile(i,path)).join('')}</div>`;
    bindFiles(v,path);
  });
  bindFiles(v,path);
  const sa=$('#selAll',v); if(sa) sa.onclick=()=>{(fsNode(path).children||[]).forEach(i=>S.files.sel.add(path+'/'+i.name));go('files');};
  const sx=$('#selExit',v); if(sx) sx.onclick=()=>{S.files.selMode=false;S.files.sel.clear();go('files');};
  const ss=$('#selStart',v); if(ss) ss.onclick=()=>{S.files.selMode=true;go('files');};
  const sc=$('#selCopy',v); if(sc) sc.onclick=()=>batchOp('copy');
  const sm=$('#selMove',v); if(sm) sm.onclick=()=>batchOp('move');
  const sd=$('#selDel',v); if(sd) sd.onclick=()=>batchOp('delete');
}});
function bindFiles(v,path){
  $$('[data-open]',v).forEach(el=>el.onclick=e=>{
    if(e.target.closest('[data-more]')||e.target.closest('[data-chk]')) return;
    openPath(el.dataset.open);
  });
  $$('[data-more]',v).forEach(b=>b.onclick=e=>{e.stopPropagation();ctxDialog(b.dataset.more);});
  $$('[data-chk]',v).forEach(c=>c.onclick=e=>{e.stopPropagation();
    if(S.files.sel.has(c.dataset.chk)) S.files.sel.delete(c.dataset.chk); else S.files.sel.add(c.dataset.chk);
    go(S.files.mode==='dual'?'files-dual':'files');
  });
}

/* ---------------- EXPLORADOR PANEL DOBLE ---------------- */
reg('files-dual',{title:'Explorador doble panel',group:'Archivos',render(v){
  const pl=S.files.paneL||'/', pr=S.files.paneR||'/Música';
  const nl=fsNode(pl)||fsNode('/'), nr=fsNode(pr)||fsNode('/');
  const il=fsSort((nl.children||[]).filter(i=>S.files.hidden||!i.hidden));
  const ir=fsSort((nr.children||[]).filter(i=>S.files.hidden||!i.hidden));
  const pane=(node,items,path,side)=>{
    return `<div class="fm-pane ${side==='L'?'src':''}" data-pane="${side}">
      <div class="fp-head">
        <span class="lbl">${side==='L'?'PANEL IZQ':'PANEL DER'}</span>
        <div class="crumbs" style="flex:1;font-size:11px">${fsCrumb(path)}</div>
        <button class="ibtn sm" data-nav="up" data-side="${side}">${ic('arr-l',15)}</button>
      </div>
      <div class="fp-body">
        ${items.length===0?`<div class="state-blank" style="padding:26px"><div class="sb-ic" style="width:50px;height:50px;border-radius:14px">${ic('folder',22)}</div><div class="s">Carpeta vacía</div></div>`
        :`<div style="display:flex;flex-direction:column;gap:1px">${items.map(i=>fmRow(i,path,side)).join('')}</div>`}
      </div>
    </div>`;
  };
  v.innerHTML=`
  <div class="fm">
    <div class="mod-head" style="padding-bottom:8px">
      <button class="ibtn" onclick="go('files-home')">${ic('home',20)}</button>
      <div class="mh-ic">${ic('layout',24)}</div>
      <div><div class="mh-t">Panel doble</div><div class="mh-s">Copia y mueve archivos entre las dos carpetas</div></div>
      <div class="mh-act">
        <div class="seg">
          <button class="sg" data-m="single">Simple</button>
          <button class="sg on c" data-m="dual">Doble</button>
        </div>
      </div>
    </div>
    <div class="fm-toolbar" style="padding-bottom:8px">
      <button class="ibtn solid" id="dualHidden" title="Mostrar ocultos">${ic(S.files.hidden?'eye-off':'eye',19)}</button>
      <div class="sel sm"><select id="fmSort"><option value="name" ${S.files.sort==='name'?'selected':''}>Nombre</option><option value="date" ${S.files.sort==='date'?'selected':''}>Fecha</option><option value="size" ${S.files.sort==='size'?'selected':''}>Tamaño</option></select></div>
      <span style="flex:1"></span>
      ${S.files.sel.size?`<span class="badge acc">${S.files.sel.size} seleccionado(s)</span>
        <button class="btn sm primary" id="dualDo">${ic(S.files.dualCopy==='copy'?'copy':'share',14)} ${S.files.dualCopy==='copy'?'Copiar a la derecha':'Mover a la derecha'}</button>`:
        `<span class="tx2 t-xs">${ic('info',13)} Toca los círculos de la izquierda para seleccionar</span>`}
    </div>
    <div class="fm-dual">
      ${pane(nl,il,pl,'L')}
      ${pane(nr,ir,pr,'R')}
      <div class="fm-dual-actions" style="grid-column:1/-1;grid-row:2;display:flex;gap:8px;justify-content:center;padding-top:2px">
        <button class="btn xs" id="dualSwap" title="Intercambiar paneles">${ic('refresh',13)} Intercambiar</button>
        <button class="btn xs" id="dualCopyMode">${ic('copy',13)} Modo: ${S.files.dualCopy==='copy'?'Copiar':'Mover'}</button>
        <button class="btn xs ghost" onclick="go('files')">${ic('rows',13)} Ver panel simple</button>
      </div>
    </div>
  </div>`;
  $$('[data-nav="up"]',v).forEach(b=>b.onclick=()=>{
    const side=b.dataset.side;
    const p=(side==='L'?pl:pr).split('/').slice(0,-1).join('/')||'/';
    if(side==='L') S.files.paneL=p; else S.files.paneR=p;
    go('files-dual');
  });
  $$('.cr',v).forEach(c=>c.onclick=()=>{
    const pane=c.closest('.fm-pane').dataset.pane;
    if(pane==='L') S.files.paneL=c.dataset.p; else S.files.paneR=c.dataset.p;
    go('files-dual');
  });
  $$('[data-open]',v).forEach(el=>el.onclick=e=>{
    if(e.target.closest('[data-more]')||e.target.closest('[data-chk]')) return;
    const side=el.closest('.fm-pane').dataset.pane;
    const n=fsNode(el.dataset.open);
    if(n&&n.type==='dir'){ if(side==='L') S.files.paneL=el.dataset.open; else S.files.paneR=el.dataset.open; go('files-dual'); }
    else openFile(el.dataset.open,n);
  });
  $$('[data-chk]',v).forEach(c=>c.onclick=e=>{e.stopPropagation();
    if(S.files.sel.has(c.dataset.chk)) S.files.sel.delete(c.dataset.chk); else S.files.sel.add(c.dataset.chk);
    go('files-dual');
  });
  $$('[data-more]',v).forEach(b=>b.onclick=e=>{e.stopPropagation();ctxDialog(b.dataset.more);});
  $$('.sg[data-m]',v).forEach(b=>b.onclick=()=>{S.files.mode='single';save();go('files');});
  $('#fmSort',v).onchange=e=>{S.files.sort=e.target.value;save();go('files-dual');};
  $('#dualHidden',v).onclick=()=>{S.files.hidden=!S.files.hidden;save();go('files-dual');};
  $('#dualSwap',v).onclick=()=>{const t=S.files.paneL;S.files.paneL=S.files.paneR;S.files.paneR=t;go('files-dual');};
  $('#dualCopyMode',v).onclick=()=>{S.files.dualCopy=S.files.dualCopy==='copy'?'move':'copy';go('files-dual');};
  const dd=$('#dualDo',v); if(dd) dd.onclick=()=>batchOp(S.files.dualCopy,'R');
}});

/* ---------------- VISTA PREVIA (fullscreen) ---------------- */
let _fpZoom=1;
function openFile(path,node){
  if(!node) node=fsNode(path);
  if(!node) return;
  if(node.type==='img'){
    _fpZoom=1;
    const fp=$('#fprev');
    fp.innerHTML=`
    <div class="fp-top">
      <button class="ibtn" id="fpBack">${ic('arr-l',22)}</button>
      <div class="t">${esc(node.name)}</div>
      <span class="mono tx2" style="font-size:12px">${esc(node.size)} · ${esc(node.date)}</span>
      <span style="flex:1"></span>
      <button class="ibtn" id="fpZin">${ic('zoom-in',20)}</button>
      <button class="ibtn" id="fpZout">${ic('zoom-out',20)}</button>
      <button class="ibtn" id="fpInfo">${ic('info',20)}</button>
      <button class="ibtn" id="fpMore">${ic('more-v',20)}</button>
    </div>
    <div class="fp-stage"><img src="${IMG[node.img]}" id="fpImg" alt=""></div>`;
    fp.classList.add('on');
    $('#fpBack').onclick=()=>fp.classList.remove('on');
    $('#fpZin').onclick=()=>{_fpZoom=Math.min(2,_fpZoom+.25);$('#fpImg').style.transform=`scale(${_fpZoom})`;};
    $('#fpZout').onclick=()=>{_fpZoom=Math.max(.6,_fpZoom-.25);$('#fpImg').style.transform=`scale(${_fpZoom})`;};
    $('#fpInfo').onclick=()=>detailsDialog(path,node);
    $('#fpMore').onclick=()=>ctxDialog(path);
    return;
  }
  if(node.type==='aud'){ S.media.idx=TRACKS.findIndex(t=>node.name.toLowerCase().includes(t.title.toLowerCase().slice(0,8)))>=0?TRACKS.findIndex(t=>node.name.toLowerCase().includes(t.title.toLowerCase().slice(0,8))):S.media.idx; S.media.pos=0;S.media.playing=true; renderBottombar(); go('nowplaying'); return; }
  if(node.type==='vid'){ const vv=VIDEOS.find(x=>node.name.includes(x.title.slice(0,6))); openVPlayer(vv?vv.id:1); return; }
  dialog({icon:(FM_TYPE_META[node.type]||FM_TYPE_META.txt).ic,color:'acc',title:node.name,
    body:`<div class="kv"><span class="k">Tipo</span><span class="v">${(FM_TYPE_META[node.type]||{t:'Archivo'}).t}</span></div>
    <div class="kv"><span class="k">Tamaño</span><span class="v">${esc(node.size)}</span></div>
    <div class="kv"><span class="k">Modificado</span><span class="v">${esc(node.date||'—')}</span></div>
    <div class="kv"><span class="k">Ruta</span><span class="v">${esc(path.split('/').slice(0,-1).join('/')||'/')}</span></div>`,
    actions:[{label:'Cerrar',cls:'ghost'},{label:ic('info',14)+' Detalles',cls:'',onClick:()=>detailsDialog(path,node)}]});
}
function detailsDialog(path,node){
  const m=FM_TYPE_META[node.type]||FM_TYPE_META.txt;
  dialog({icon:m.ic,color:'acc',title:'Detalles del archivo',body:`
    <div style="display:flex;gap:14px;align-items:center;margin-bottom:12px">
      <span class="r-ic" style="width:52px;height:52px;background:${m.c}22;color:${m.c}">${ic(m.ic,24)}</span>
      <div><div style="font-weight:700;font-size:15px">${esc(node.name)}</div><div class="tx2" style="font-size:12px">${m.t}</div></div>
    </div>
    <div class="kv"><span class="k">Ruta completa</span><span class="v">${esc(path)}</span></div>
    <div class="kv"><span class="k">Tamaño</span><span class="v">${esc(node.size)}</span></div>
    <div class="kv"><span class="k">Modificado</span><span class="v">${esc(node.date||'—')}</span></div>
    <div class="kv"><span class="k">Permisos</span><span class="v">rw-r-- (media)</span></div>
    <div class="kv"><span class="k">Almacenamiento</span><span class="v">Interno · 32 GB</span></div>`,
    actions:[{label:'Cerrar',cls:'ghost'}]});
}
function ctxDialog(path){
  const node=fsNode(path); if(!node) return;
  const m=FM_TYPE_META[node.type]||FM_TYPE_META.txt;
  const isDir=node.type==='dir';
  dialog({icon:m.ic,color:'acc',title:node.name,body:`
    <div style="display:flex;flex-direction:column;gap:3px">
      ${[['copy','Copiar','copy'],['share','Mover','share'],['pencil','Renombrar','edit'],['file-zip','Comprimir en ZIP','zip'],['info','Detalles','info'],['trash','Eliminar','del']].map(a=>`
      <button class="setrow" data-op="${a[2]}" style="border-radius:10px">
        <span class="sr-ic" style="width:36px;height:36px;background:${a[2]==='del'?'var(--err-soft)':'var(--bg-raise)'};color:${a[2]==='del'?'var(--err)':'var(--tx-2)'}">${ic(a[0],17)}</span>
        <div class="sr-tt"><div class="t" style="font-size:14px">${a[1]}</div></div>
      </button>`).join('')}
    </div>`,
    actions:[{label:'Cancelar',cls:'ghost'}]});
  $$('[data-op]',_dlg).forEach(b=>b.onclick=()=>{
    const op=b.dataset.op; closeDialog();
    if(op==='copy') opProgress('Copiando',node,()=>{});
    if(op==='share') opProgress('Moviendo',node,()=>{});
    if(op==='edit') renameDialog(path,node);
    if(op==='zip') opProgress('Comprimiendo',node,()=>toast({icon:'package',color:'ok',title:'ZIP creado',body:node.name.replace(/\.\w+$/,'')+'.zip (demo)'}));
    if(op==='info') detailsDialog(path,node);
    if(op==='del') deleteDialog(path,node);
  });
}
function deleteDialog(path,node){
  const n=S.files.confirmDel?node.name:'';
  confirmDlg({icon:'trash',color:'err',title:'¿Eliminar «'+node.name+'»?',
    body:`El ${node.type==='dir'?'directorio y todo su contenido':'archivo'} se moverá a la papelera del sistema.<br><span class="mono" style="font-size:11px">${esc(path)}</span>`,
    ok:'Eliminar',onOk(){ toast({icon:'trash',color:'err',title:'Eliminado',body:esc(node.name)+' (demo)'}); if(S.screen==='files') go('files'); }});
}
function renameDialog(path,node){
  dialog({icon:'pencil',color:'acc',title:'Renombrar',body:`
    <input class="inp" id="rnInp" value="${esc(node.name)}" style="width:100%">`,
    actions:[{label:'Cancelar',cls:'ghost'},{label:'Renombrar',cls:'primary',onClick(){
      const nv=$('#rnInp').value.trim();
      if(nv&&nv!==node.name) toast({icon:'pencil',color:'ok',title:'Renombrado',body:esc(node.name)+' → '+esc(nv)+' (demo)'});
    }}]});
  setTimeout(()=>{const i=$('#rnInp');if(i){i.focus();i.select();}},80);
}
function opProgress(verb,node,done){
  const ov=dialog({icon:'copy',color:'acc',title:verb+' «'+node.name+'»',keep:true,
    body:`<div class="prog" style="margin:6px 0 10px"><i id="opBar" style="width:0%"></i></div>
    <div style="display:flex;justify-content:space-between" class="tx2 t-xs mono"><span id="opStat">0 / ${esc(node.size)}</span><span id="opPct">0%</span></div>`,
    actions:[{label:'Cancelar',cls:'ghost',onClick(){}}]});
  let p=0;
  const tm=setInterval(()=>{
    p+=8+Math.random()*14;
    if(p>=100){ p=100; clearInterval(tm); done();
      setTimeout(()=>{closeDialog(); toast({icon:'check-c',color:'ok',title:verb.slice(0,-3)+' completado',body:esc(node.name)+' (demo)'});},350); }
    const bar=$('#opBar'); if(bar){bar.style.width=p+'%';$('#opPct').textContent=Math.round(p)+'%';
      $('#opStat').textContent=Math.round(parseInt(node.size.replace(/\D/g,''))*p/100)+' / '+node.size;}
    else clearInterval(tm);
  },260);
}
function batchOp(op,side){
  const n=S.files.sel.size;
  if(!n){ toast({icon:'info',color:'acc',title:'Nada seleccionado',body:'Marca archivos con el círculo de la izquierda.'}); return; }
  if(op==='delete'){
    confirmDlg({icon:'trash',color:'err',title:'¿Eliminar '+n+' elemento(s)?',body:'Los elementos seleccionados se moverán a la papelera.',ok:'Eliminar',
      onOk(){ toast({icon:'trash',color:'err',title:n+' elementos eliminados',body:'(demo)'}); S.files.sel.clear();S.files.selMode=false; go('files'); }});
    return;
  }
  const verb=op==='copy'?'Copiando':'Moviendo';
  dialog({icon:op==='copy'?'copy':'share',color:'acc',title:verb+' '+n+' elemento(s)',body:`
    <div class="prog" style="margin:6px 0 10px"><i id="opBar" style="width:0%"></i></div>
    <div style="display:flex;justify-content:space-between" class="tx2 t-xs mono"><span>Origen: Panel izquierdo</span><span id="opPct">0%</span></div>
    <div class="tx2 t-xs" style="margin-top:6px">Destino: <b style="color:var(--tx-1)">${esc(side==='R'?(S.files.paneR||'/Música'):'panel derecho')}</b></div>`,
    actions:[{label:'Cancelar',cls:'ghost'}]});
  let p=0;
  const tm=setInterval(()=>{
    p+=10+Math.random()*12;
    if(p>=100){p=100;clearInterval(tm);
      setTimeout(()=>{closeDialog();S.files.sel.clear();S.files.selMode=false;
        toast({icon:'check-c',color:'ok',title:(op==='copy'?'Copia':'Movimiento')+' completado',body:n+' elemento(s) · '+(S.files.dualCopy==='copy'&&side?'panel derecho':'(demo)')});
        if(S.screen==='files-dual'||S.screen==='files') go(S.screen);},320);}
    const bar=$('#opBar'); if(bar){bar.style.width=p+'%';$('#opPct').textContent=Math.round(p)+'%';} else clearInterval(tm);
  },240);
}
function fmSettingsMenu(){
  dialog({icon:'settings',color:'acc',title:'Ajustes del Gestor de Archivos',body:`
    <div style="display:flex;flex-direction:column;gap:3px">
      <div class="setrow"><div class="sr-tt"><div class="t">Confirmar antes de eliminar</div></div><div class="sr-ctl"><div class="sw ${S.files.confirmDel?'on':''}" id="fmConfirm"></div></div></div>
      <div class="setrow"><div class="sr-tt"><div class="t">Mostrar archivos ocultos</div></div><div class="sr-ctl"><div class="sw ${S.files.hidden?'on':''}" id="fmHidden"></div></div></div>
      <div class="setrow"><div class="sr-tt"><div class="t">Pantalla de inicio</div><div class="s">Al abrir el módulo Archivos</div></div>
      <div class="sr-ctl"><div class="sel sm"><select><option>Inicio (recomendado)</option><option>Última carpeta</option></select></div></div></div>
      <div class="setrow"><div class="sr-tt"><div class="t">Modo por defecto</div></div>
      <div class="sr-ctl"><div class="sel sm"><select id="fmModeSel"><option ${S.files.mode==='single'?'selected':''}>Panel simple</option><option ${S.files.mode==='dual'?'selected':''}>Panel doble</option></select></div></div></div>
    </div>`,actions:[{label:'Listo',cls:'primary'}]});
  $('#fmConfirm').onclick=e=>{S.files.confirmDel=!S.files.confirmDel;e.currentTarget.classList.toggle('on');save();};
  $('#fmHidden').onclick=e=>{S.files.hidden=!S.files.hidden;e.currentTarget.classList.toggle('on');save();};
  $('#fmModeSel').onchange=e=>{S.files.mode=e.target.value;save();};
}
