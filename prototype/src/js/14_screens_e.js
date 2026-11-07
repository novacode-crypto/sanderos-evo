/* ============================================================
   SanderOS EVO — Pantallas: Teléfono/Bluetooth, Apps,
   Configuración del dock y Centro de notificaciones
   ============================================================ */

/* ---------------- TELÉFONO (dashboard) ---------------- */
reg('phone',{title:'Teléfono',group:'Teléfono',render(v){
  const bt=S.bt;
  v.innerHTML=`
  <div class="lib">
    <div class="mod-head">
      <div class="mh-ic">${ic('phone',24)}</div>
      <div><div class="mh-t">Teléfono</div><div class="mh-s">Bluetooth · audio y llamadas del vehículo</div></div>
      <div class="mh-act">
        <span class="badge ${bt.on?'ok':'dim'}"><span class="dot"></span>${bt.on?'Bluetooth activo':'Bluetooth apagado'}</span>
      </div>
    </div>
    <div class="nav-mod">
      <div class="nav-main">
        <div class="card pad" style="flex:0 0 auto">
          <div style="display:flex;align-items:center;gap:16px">
            <span class="bb-ic acc" style="width:56px;height:56px;border-radius:16px">${ic('bluetooth',26)}</span>
            <div style="flex:1">
              <div style="font-weight:700;font-size:16px">${bt.connected?esc(bt.connected):'Sin dispositivo conectado'}</div>
              <div class="tx2" style="font-size:12.5px;margin-top:2px">${bt.connected?'Teléfono · audio A2DP y manos libres':'Vincula un teléfono para llamadas y audio'}</div>
            </div>
            <div class="sw ${bt.on?'on':''}" id="btSw"></div>
          </div>
          <div style="display:flex;gap:9px;margin-top:16px;flex-wrap:wrap">
            <button class="btn primary" id="phDial">${ic('phone',16)} Marcar</button>
            <button class="btn" id="phContacts">${ic('users',16)} Contactos</button>
            <button class="btn" id="phHistory">${ic('history',16)} Historial</button>
            <button class="btn" id="phPair">${ic('bt-con',16)} Vincular dispositivo</button>
          </div>
        </div>
        <div class="card" style="flex:1;min-height:0;display:flex;flex-direction:column">
          <div class="cap" style="margin-bottom:8px">Llamadas recientes</div>
          <div style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:2px">
            ${CALLS.slice(0,4).map(c=>`
            <div class="row" data-call="${esc(c.name)}">
              <span class="r-ic" style="background:${c.type==='miss'?'var(--err-soft)':'var(--bg-raise)'};color:${c.type==='miss'?'var(--err)':'var(--tx-2)'}">${ic(c.type==='in'?'phone-in':c.type==='out'?'phone-out':'phone-miss',17)}</span>
              <div class="r-tt"><div class="t">${esc(c.name)}</div><div class="s">${esc(c.time)} · ${esc(c.dur)}</div></div>
              <div class="r-en">${ic('phone',16)}</div>
            </div>`).join('')}
          </div>
        </div>
      </div>
      <div class="nav-side">
        <div class="card">
          <div class="cap" style="margin-bottom:10px">Dispositivos conocidos</div>
          ${[['Ana — Galaxy A54','Teléfono · A2DP + HFP',true],['KW906','Adaptador OBD2 · SPP',false]].map(d=>`
          <div class="setrow" style="padding:8px 4px">
            <span class="sr-ic" style="width:36px;height:36px">${ic(d[1].includes('OBD2')?'gauge':'phone',16)}</span>
            <div class="sr-tt"><div class="t" style="font-size:13.5px">${d[0]}</div><div class="s">${d[1]}</div></div>
            <div class="sr-ctl">${d[2]?'<span class="badge ok"><span class="dot"></span>Activo</span>':'<span class="badge dim">Guardado</span>'}</div>
          </div>`).join('')}
        </div>
        <div class="card" style="display:flex;gap:12px;align-items:center">
          ${ic('signal',18)}
          <div class="tx2" style="font-size:12px;line-height:1.45">El audio del teléfono usa el DSP ADI-1701 y la radio NX6856 como fuente de sonido del vehículo.</div>
        </div>
      </div>
    </div>
  </div>`;
  $('#btSw',v).onclick=e=>{S.bt.on=!S.bt.on;e.currentTarget.classList.toggle('on',S.bt.on);
    toast({icon:'bluetooth',color:S.bt.on?'ok':'warn',title:S.bt.on?'Bluetooth activado':'Bluetooth desactivado'});
    renderBottombar&&renderBottombar();};
  $('#phDial',v).onclick=()=>dialDialog();
  $('#phContacts',v).onclick=()=>go('phone-contacts');
  $('#phHistory',v).onclick=()=>go('phone-history');
  $('#phPair',v).onclick=()=>go('phone-pair');
  $$('.row[data-call]',v).forEach(r=>r.onclick=()=>startCall(r.dataset.call,false));
}});

/* ---------------- MARCAR / CONTACTOS / HISTORIAL ---------------- */
function dialDialog(){
  dialog({icon:'phone',color:'acc',title:'Marcar número',body:`
    <input class="inp mono" id="dialInp" placeholder="Introduce el número…" style="font-size:22px;letter-spacing:.08em;text-align:center;height:56px">
    <div style="display:flex;gap:8px;justify-content:center;margin-top:12px;flex-wrap:wrap">
      ${CONTACTS.slice(0,3).map(c=>`<button class="chip" data-n="${esc(c.name)}">${esc(c.name)}</button>`).join('')}
    </div>`,
    actions:[{label:'Cancelar',cls:'ghost'},{label:ic('phone',15)+' Llamar',cls:'primary',onClick(){
      const n=$('#dialInp').value.trim();
      if(n) startCall(n,true);
    }}]});
  $$('.chip[data-n]',_dlg).forEach(c=>c.onclick=()=>{$('#dialInp').value=c.dataset.n;});
}
let _phTab='calls';
reg('phone-history',{title:'Historial y contactos',group:'Teléfono',render(v){
  v.innerHTML=`
  <div class="lib">
    <div class="mod-head">
      <button class="ibtn" onclick="go('phone')">${ic('arr-l',20)}</button>
      <div class="mh-ic">${ic('users',24)}</div>
      <div><div class="mh-t">Contactos e historial</div><div class="mh-s">${S.phonePerm?'Acceso a contactos concedido':'Se requiere permiso de contactos'}</div></div>
      <div class="mh-act">
        <div class="seg">
          <button class="sg ${_phTab==='calls'?'on c':''}" data-t="calls">Llamadas</button>
          <button class="sg ${_phTab==='contacts'?'on c':''}" data-t="contacts">Contactos</button>
        </div>
      </div>
    </div>
    <div class="lib-body">
      ${_phTab==='calls'?`
      <div style="display:flex;flex-direction:column;gap:2px">
        ${CALLS.map(c=>`
        <div class="row">
          <span class="r-ic" style="background:${c.type==='miss'?'var(--err-soft)':'var(--bg-raise)'};color:${c.type==='miss'?'var(--err)':'var(--tx-2)'}">${ic(c.type==='in'?'phone-in':c.type==='out'?'phone-out':'phone-miss',17)}</span>
          <div class="r-tt"><div class="t">${esc(c.name)}</div><div class="s">${c.type==='miss'?'Perdida':'Entrante/Saliente'} · ${esc(c.time)} · ${esc(c.dur)}</div></div>
          <button class="ibtn sm" data-call="${esc(c.name)}">${ic('phone',16)}</button>
        </div>`).join('')}
      </div>`:S.phonePerm?`
      <div style="display:flex;flex-direction:column;gap:2px">
        ${CONTACTS.map(c=>`
        <div class="row">
          <span class="artist-av" style="width:40px;height:40px;font-size:15px">${c.initials}</span>
          <div class="r-tt"><div class="t">${esc(c.name)}</div><div class="s mono" style="font-size:11.5px">${esc(c.tel)}</div></div>
          <button class="ibtn sm" data-call="${esc(c.name)}">${ic('phone',16)}</button>
        </div>`).join('')}
      </div>`:`
      <div class="state-blank">
        <div class="sb-ic">${ic('users',36)}</div>
        <div class="t">Contactos no disponibles</div>
        <div class="s">SanderOS EVO necesita el permiso de contactos de Android para mostrarlos. El historial de llamadas funciona sin él.</div>
        <button class="btn primary" id="grantBtn">${ic('key',16)} Conceder permiso de contactos</button>
      </div>`}
    </div>
  </div>`;
  $$('.sg',v).forEach(b=>b.onclick=()=>{_phTab=b.dataset.t;go('phone-history');});
  const gb=$('#grantBtn',v); if(gb) gb.onclick=()=>{S.phonePerm=true;go('phone-history');toast({icon:'check-c',color:'ok',title:'Permiso concedido',body:'(Simulado) 5 contactos disponibles.'});};
  $$('[data-call]',v).forEach(b=>b.onclick=()=>startCall(b.dataset.call,false));
}});

/* ---------------- VINCULAR DISPOSITIVO ---------------- */
reg('phone-pair',{title:'Vincular Bluetooth',group:'Teléfono',render(v){
  v.innerHTML=`
  <div class="lib">
    <div class="mod-head">
      <button class="ibtn" onclick="go('phone')">${ic('arr-l',20)}</button>
      <div class="mh-ic">${ic('bt-con',24)}</div>
      <div><div class="mh-t">Vincular dispositivo</div><div class="mh-s">Descubrimiento Bluetooth activo</div></div>
    </div>
    <div class="lib-body">
      <div class="obd-anim" style="margin:6px auto 10px">
        <span class="ring"></span><span class="ring" style="animation-delay:.66s"></span>
        <span style="width:64px;height:64px;border-radius:20px;background:var(--acc-soft);color:var(--acc-ink);display:grid;place-items:center;box-shadow:inset 0 0 0 1px var(--line-acc)">${ic('bluetooth',28)}</span>
      </div>
      <div class="tx2 t-s" style="text-align-center;margin-bottom:14px">Buscando dispositivos cercanos…</div>
      <div class="card" style="padding:6px 10px;max-width:720px;margin:0 auto">
        ${[['JBL Flip 6','Altavoz · A2DP'],['KW906 OBDII','Adaptador diagnóstico · SPP'],['Galaxy A34 de Marta','Teléfono · A2DP + HFP']].map((d,i)=>`
        <div class="setrow" data-pair="${esc(d[0])}">
          <span class="sr-ic" style="width:38px;height:38px">${ic(d[1].includes('OBD2')?'gauge':d[1].includes('Altavoz')?'volume':'phone',17)}</span>
          <div class="sr-tt"><div class="t">${d[0]}</div><div class="s">${d[1]}</div></div>
          <div class="sr-ctl"><button class="btn sm">${ic('bt-con',13)} Vincular</button></div>
        </div>`).join('')}
      </div>
      <div class="card" style="max-width:720px;margin:12px auto 0;display:flex;gap:12px;align-items:center">
        ${ic('info',17)}
        <div class="tx2" style="font-size:12px;line-height:1.45">SanderOS EVO accede al Bluetooth estándar de Android. Las funciones telefónicas dependen del perfil soportado por la radio NX6856 del vehículo.</div>
      </div>
    </div>
  </div>`;
  $$('[data-pair]',v).forEach(r=>r.onclick=()=>{
    const name=r.dataset.pair;
    dialog({icon:'bt-con',color:'acc',title:'Vincular «'+name+'»',body:'Se iniciará el emparejamiento Bluetooth estándar. Puede solicitar un código PIN en el otro dispositivo.',
      actions:[{label:'Cancelar',cls:'ghost'},{label:'Vincular',cls:'primary',onClick(){
        toast({icon:'check-c',color:'ok',title:'Vinculado',body:name+' (demo)'}); go('phone');
      }}]});
  });
}});

/* ---------------- LLAMADAS (capa fullscreen) ---------------- */
let _callTimer=null;
function startCall(name,outgoing){
  const c=$('#call');
  let secs=0;
  c.innerHTML=outgoing?`
  <div class="call-fs on">
    <div class="call-av">${name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
    <div class="call-name">${esc(name)}</div>
    <div class="call-sub">Llamando…</div>
    <div class="call-actions">
      <button class="call-btn err" id="cEnd">${ic('x',34)}</button>
    </div>
  </div>`:`
  <div class="call-fs on">
    <div style="position:relative"><div class="call-pulse"></div><div class="call-av">${name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div></div>
    <div class="call-name">${esc(name)}</div>
    <div class="call-sub">Llamada entrante · Bluetooth</div>
    <div class="call-actions">
      <button class="call-btn err" id="cRej">${ic('x',34)}</button>
      <button class="call-btn acc" id="cAcc">${ic('phone',34)}</button>
    </div>
  </div>`;
  c.classList.add('on');
  const active=()=>{
    c.innerHTML=`
    <div class="call-fs on">
      <div class="call-av">${name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
      <div class="call-name">${esc(name)}</div>
      <div class="call-sub mono" id="cDur">00:00</div>
      <div class="call-actions">
        <button class="call-btn" id="cMute" title="Silenciar micrófono">${ic('volume-x',30)}</button>
        <button class="call-btn err" id="cEnd">${ic('phone-miss',34)}</button>
        <button class="call-btn" title="Teclado">${ic('grid',30)}</button>
      </div>
      <div class="tx2 t-xs">Audio por manos libres · DSP ADI-1701</div>
    </div>`;
    $('#cEnd').onclick=endCall;
    $('#cMute').onclick=e=>{e.currentTarget.classList.toggle('on');toast({icon:'volume-x',color:'acc',title:'Micrófono',body:'(demo) alterna silencio'});};
    _callTimer=setInterval(()=>{secs++;const d=$('#cDur');if(d)d.textContent=`${pad(Math.floor(secs/60))}:${pad(secs%60)}`;},1000);
  };
  const endCall=()=>{ if(_callTimer){clearInterval(_callTimer);_callTimer=null;} c.classList.remove('on');
    toast({icon:'phone-miss',color:'warn',title:'Llamada finalizada',body:'Duración registrada en el historial (demo)'}); };
  if(outgoing){ setTimeout(active,2200); $('#cEnd').onclick=()=>{c.classList.remove('on');}; }
  else { $('#cRej').onclick=()=>{c.classList.remove('on');toast({icon:'phone-miss',color:'err',title:'Llamada rechazada'});}; $('#cAcc').onclick=active; }
}

/* ---------------- CENTRO DE APPS ---------------- */
reg('apps',{title:'Centro de Apps',group:'Sistema',render(v){
  const all=[...APPS.map(a=>({name:a.name,icon:a.icon,color:a.color})),{name:'Ajustes del sistema',icon:'settings',color:'#94A3B8'},{name:'Design System',icon:'palette',color:'#E879F9'}];
  v.innerHTML=`
  <div class="lib">
    <div class="mod-head">
      <div class="mh-ic">${ic('grid',24)}</div>
      <div><div class="mh-t">Centro de Apps</div><div class="mh-s">${all.length} aplicaciones compatibles instaladas</div></div>
      <div class="mh-act">
        <div class="search"><span class="s-ic">${ic('search',16)}</span><input class="inp" style="height:40px" placeholder="Buscar app…"></div>
        <button class="btn sm" onclick="go('dock-config')">${ic('layout',14)} Configurar dock</button>
      </div>
    </div>
    <div class="lib-body">
      <div class="grid g-auto-6" style="grid-template-columns:repeat(6,1fr)">
        ${all.map(a=>`
        <button class="app-tile" data-app="${esc(a.name)}">
          <span class="ai" style="background:${a.color}1E;color:${a.color};box-shadow:inset 0 0 0 1px ${a.color}55">${ic(a.icon,28)}</span>
          <span class="at">${esc(a.name)}</span>
          ${dockHasApp(a.name)?`<span class="in-dock">${ic('check',13)}</span>`:''}
        </button>`).join('')}
      </div>
      <div class="card" style="margin-top:14px;display:flex;gap:12px;align-items:center">
        ${ic('info',17)}
        <div class="tx2" style="font-size:12px;line-height:1.45">Cualquier aplicación Android instalada puede abrirse desde aquí. Las marcadas con el check ya están en el dock de SanderOS EVO.</div>
      </div>
    </div>
  </div>`;
  $$('[data-app]',v).forEach(b=>b.onclick=()=>{
    const name=b.dataset.app;
    const a=APPS.find(x=>x.name===name);
    dialog({icon:a?a.icon:'grid',color:'acc',title:name,body:`
      <div class="kv"><span class="k">Versión</span><span class="v">${a?a.ver:'1.0'}</span></div>
      <div class="kv"><span class="k">Tipo</span><span class="v">${a&&a.sys?'App del sistema':'App de usuario'}</span></div>
      <div class="kv"><span class="k">Compatible con dock</span><span class="v ok">Sí</span></div>`,
      actions:[
        {label:'Añadir al dock',cls:'',onClick(){ addAppToDock(name); }},
        {label:ic('ext',14)+' Abrir aplicación',cls:'primary',onClick(){ toast({icon:'ext',color:'acc',title:'Abriendo '+name,body:'(simulado en el prototipo)'}); }}]});
  });
}});
function dockHasApp(name){ return false; }
function addAppToDock(name){
  toast({icon:'check-c',color:'ok',title:'Acceso directo añadido',body:'«'+name+'» ya está disponible en el dock (página nueva en demo).' });
  S.dockPages[S.dockPage]=S.dockPages[S.dockPage]||[];
  save();
}

/* ---------------- CONFIGURACIÓN DEL DOCK ---------------- */
reg('dock-config',{title:'Configurar dock',group:'Sistema',render(v){
  const page=S.dockPage;
  const cur=S.dockPages[page]||[];
  const avail=Object.keys(MODULES).filter(m=>!S.dockPages.flat().includes(m));
  v.innerHTML=`
  <div class="lib">
    <div class="mod-head">
      <button class="ibtn" onclick="go('apps')">${ic('arr-l',20)}</button>
      <div class="mh-ic">${ic('layout',24)}</div>
      <div><div class="mh-t">Configurar dock</div><div class="mh-s">Ordena, añade o quita módulos · ${S.dockPages.length} página(s)</div></div>
      <div class="mh-act">
        <button class="btn sm" id="pgAdd">${ic('plus',14)} Añadir página</button>
        ${S.dockPages.length>1?`<button class="btn sm ghost" id="pgDel">${ic('trash',14)} Quitar página ${page+1}</button>`:''}
        <button class="btn sm ghost" id="dockReset">${ic('rotate-ccw',14)} Restablecer</button>
      </div>
    </div>
    <div class="lib-tools">
      ${S.dockPages.map((_,i)=>`<button class="chip ${i===page?'on':''}" data-pg="${i}">Página ${i+1} · ${S.dockPages[i].length} mód.</button>`).join('')}
    </div>
    <div class="lib-body" style="display:grid;grid-template-columns:1.2fr 1fr;gap:14px">
      <div>
        <div class="cap" style="margin:2px 4px 9px">Módulos en la página ${page+1} ${cur.length===0?'· vacía':''}</div>
        <div class="card" style="padding:6px 8px;min-height:120px">
          ${cur.length===0?`<div class="tx2" style="text-align:center;padding:26px 10px">${ic('layout',26)}<div style="margin-top:8px">Página vacía — añade módulos desde la derecha</div></div>`:
          cur.map(m=>{const M=MODULES[m];return `
          <div class="setrow" data-mod="${m}">
            <span class="sr-ic" style="background:var(--acc-soft);color:var(--acc-ink)">${ic(M.icon,17)}</span>
            <div class="sr-tt"><div class="t">${esc(M.label)}</div><div class="s">módulo del sistema</div></div>
            <div class="sr-ctl">
              <button class="ibtn sm" data-up="${m}" title="Subir">${ic('chev-u',16)}</button>
              <button class="ibtn sm" data-down="${m}" title="Bajar">${ic('chev-d',16)}</button>
              <button class="ibtn sm" data-rm="${m}" title="Quitar" style="color:var(--err)">${ic('x',16)}</button>
            </div>
          </div>`;}).join('')}
        </div>
      </div>
      <div>
        <div class="cap" style="margin:2px 4px 9px">Módulos disponibles</div>
        <div class="card" style="padding:6px 8px">
          ${avail.length===0?`<div class="tx2" style="text-align:center;padding:20px">${ic('check-c',24)}<div style="margin-top:8px">Todos los módulos están en uso</div></div>`:
          avail.map(m=>{const M=MODULES[m];return `
          <div class="setrow" data-add="${m}">
            <span class="sr-ic">${ic(M.icon,17)}</span>
            <div class="sr-tt"><div class="t">${esc(M.label)}</div></div>
            <div class="sr-ctl"><button class="btn xs">${ic('plus',12)} Añadir</button></div>
          </div>`;}).join('')}
        </div>
      </div>
    </div>
  </div>`;
  $$('.chip[data-pg]',v).forEach(c=>c.onclick=()=>{S.dockPage=+c.dataset.pg;save();go('dock-config');});
  $$('[data-up]',v).forEach(b=>b.onclick=()=>dockMove(b.dataset.up,-1));
  $$('[data-down]',v).forEach(b=>b.onclick=()=>dockMove(b.dataset.down,1));
  $$('[data-rm]',v).forEach(b=>b.onclick=()=>{
    const arr=S.dockPages[S.dockPage]; const i=arr.indexOf(b.dataset.rm);
    if(i>=0){arr.splice(i,1); save(); renderDock(); go('dock-config');}
  });
  $$('[data-add]',v).forEach(r=>r.onclick=()=>{
    S.dockPages[S.dockPage].push(r.dataset.add); save(); renderDock(); go('dock-config');
    toast({icon:'check-c',color:'ok',title:'Módulo añadido',body:MODULES[r.dataset.add].label});
  });
  $('#pgAdd',v).onclick=()=>{dockAddPage();go('dock-config');};
  const pd=$('#pgDel',v); if(pd) pd.onclick=()=>{dockRemovePage(S.dockPage);go('dock-config');};
  $('#dockReset',v).onclick=()=>confirmDlg({icon:'rotate-ccw',color:'warn',title:'¿Restablecer el dock?',
    body:'Se restaurará la configuración de fábrica: 7 módulos en una página.',onOk(){S.dockPages=[DOCK_DEFAULT.slice()];S.dockPage=0;save();renderDock();go('dock-config');}});
}});

/* ---------------- CENTRO DE NOTIFICACIONES ---------------- */
reg('notifs',{title:'Notificaciones',group:'Sistema',render(v){
  const types=[['all','Todas'],['obd','OBD2'],['gps','GPS'],['bt','Bluetooth'],['media','Multimedia'],['storage','Almacenamiento'],['system','Sistema']];
  const map={obd:'gauge',gps:'pin',bt:'bluetooth',media:'music',storage:'usb',system:'settings'};
  let list=S.notifs.slice();
  if(_nfFilter!=='all') list=list.filter(n=>n.icon===map[_nfFilter]);
  v.innerHTML=`
  <div class="lib">
    <div class="mod-head">
      <div class="mh-ic">${ic('bell',24)}</div>
      <div><div class="mh-t">Notificaciones</div><div class="mh-s">${S.notifs.filter(n=>n.active).length} activas · ${S.notifs.length} en total</div></div>
      <div class="mh-act">
        <button class="btn sm ghost" id="nfClear">${ic('trash',14)} Borrar antiguas</button>
      </div>
    </div>
    <div class="lib-tools">
      ${types.map(t=>`<button class="chip ${_nfFilter===t[0]?'on':''}" data-f="${t[0]}">${t[1]}</button>`).join('')}
    </div>
    <div class="lib-body">
      ${list.length===0?`<div class="state-blank"><div class="sb-ic">${ic('bell',32)}</div><div class="t">Sin notificaciones</div><div class="s">No hay avisos de este tipo.</div></div>`:
      `<div style="display:flex;flex-direction:column;gap:9px">
        ${list.map(n=>`
        <div class="notif-card">
          <span class="ni" style="background:var(--${n.color}-soft);color:var(--${n.color})">${ic(n.icon,21)}</span>
          <div class="nt"><div class="t">${esc(n.title)} ${n.active?'':'<span class="badge dim" style="height:20px;font-size:10px">leída</span>'}</div>
          <div class="s">${esc(n.body)}</div><div class="tm">${esc(n.time)}</div></div>
          ${n.active?`<button class="ibtn sm" data-dis="${n.id}">${ic('x',16)}</button>`:''}
        </div>`).join('')}
      </div>`}
      <div class="card" style="margin-top:12px;display:flex;gap:12px;align-items:center">
        ${ic('info',17)}
        <div class="tx2" style="font-size:12px;line-height:1.45">Estilo de aviso configurado: <b style="color:var(--tx-1)">sutil y no intrusivo</b> — sin superposiciones sobre la Vista de Conducción salvo críticos. Configurable en Ajustes → Seguridad.</div>
      </div>
    </div>
  </div>`;
  $$('.chip[data-f]',v).forEach(c=>c.onclick=()=>{_nfFilter=c.dataset.f;go('notifs');});
  $$('[data-dis]',v).forEach(b=>b.onclick=()=>{S.notifs=S.notifs.filter(n=>n.id!==+b.dataset.dis);renderDock();refreshBadge();go('notifs');});
  $('#nfClear',v).onclick=()=>{S.notifs=S.notifs.filter(n=>n.active);go('notifs');toast({icon:'trash',color:'ok',title:'Historial borrado'});};
}});
let _nfFilter='all';
