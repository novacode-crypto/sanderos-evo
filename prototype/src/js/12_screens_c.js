/* ============================================================
   SanderOS EVO — Pantallas: Mi Vehículo, Monitor OBD2, Viajes
   ============================================================ */

/* ---------------- MI VEHÍCULO (vista 3D interactiva) ---------------- */
const VEH_ANGLES=[
  {id:'front', label:'Frontal 3/4', img:'car_front_grey'},
  {id:'side',  label:'Lateral',     img:'car_side_grey'},
  {id:'rear',  label:'Trasera 3/4', img:'car_rear_grey'},
];
const VEH_COLORS=[
  {id:'grey',  name:'Gris Nacarado', hex:'#8A94A0', img:'car_rear_grey'},
  {id:'white', name:'Blanco Glaciar',hex:'#E8ECF0', img:'car_rear_white'},
  {id:'black', name:'Negro Nardo',   hex:'#15181D', img:'car_rear_black'},
  {id:'red',   name:'Rojo Flare',    hex:'#B03028', img:'car_rear_red'},
  {id:'blue',  name:'Azul Iron',     hex:'#31435C', img:'car_rear_blue'},
];
let _veh={angle:'rear', color:'grey', zoom:1, tab:'ficha'};
function vehImg(){
  if(_veh.color!=='grey') return VEH_COLORS.find(c=>c.id===_veh.color).img;
  return VEH_ANGLES.find(a=>a.id===_veh.angle).img;
}
reg('vehicle',{title:'Mi Vehículo',group:'Vehículo',render(v){
  const conn=S.obd.state==='connected';
  const dtcN=S.obdDemoCodes?DTC_DEMO.length:0;
  v.innerHTML=`
  <div class="veh-mod">
    <div class="veh-stage" id="vehStage">
      <img src="${IMG[vehImg()]}" id="vehImg" alt="Renault Sandero 2017" style="transform:translate(-50%,-52%) scale(${_veh.zoom})">
      <div class="floor"></div>
      <div class="veh-hud">
        <span class="drv-state">${ic('car',13)} Renault Sandero 2017</span>
        <span class="drv-state" style="font-family:var(--f-mono)">${VEH_COLORS.find(c=>c.id===_veh.color).name}</span>
      </div>
      <div class="veh-tools">
        <button class="vt" id="vehRotL" title="Rotar a la izquierda">${ic('rotate-ccw',19)}</button>
        <button class="vt" id="vehRotR" title="Rotar a la derecha">${ic('rotate-cw',19)}</button>
        <button class="vt" id="vehZin" title="Acercar">${ic('zoom-in',19)}</button>
        <button class="vt" id="vehZout" title="Alejar">${ic('zoom-out',19)}</button>
        <button class="vt" id="vehReset" title="Restablecer vista">${ic('refresh',19)}</button>
      </div>
      <div class="veh-bottom">
        <div class="veh-angles">${VEH_ANGLES.map(a=>`<button class="va ${_veh.angle===a.id&&_veh.color==='grey'?'on':''}" data-a="${a.id}">${a.label}</button>`).join('')}</div>
        <div class="veh-colors">
          ${VEH_COLORS.map(c=>`<button class="vc2 ${_veh.color===c.id?'on':''}" data-c="${c.id}" title="${c.name}" style="background:${c.hex};color:${c.hex}"></button>`).join('')}
          <span class="tx2" style="font-size:11px;margin-left:4px">${VEH_COLORS.find(c=>c.id===_veh.color).name}</span>
        </div>
      </div>
    </div>
    <div class="veh-side">
      <div class="tabs" style="padding:0 4px">
        ${[['ficha','Ficha'],['estado','Estado'],['mant','Mantenimiento']].map(t=>`<button class="tab ${_veh.tab===t[0]?'on':''}" data-t="${t[0]}">${t[1]}</button>`).join('')}
      </div>
      <div style="flex:1;overflow-y:auto;padding:4px 2px;display:flex;flex-direction:column;gap:9px">
        ${_veh.tab==='ficha'?`
        <div class="card">
          <div class="cap" style="margin-bottom:8px">Ficha del vehículo</div>
          <div class="kv"><span class="k">Modelo</span><span class="v">Renault Sandero</span></div>
          <div class="kv"><span class="k">Año / Versión</span><span class="v">2017 · Hatchback 5p</span></div>
          <div class="kv"><span class="k">Configuración</span><span class="v">Conventional (no Stepway)</span></div>
          <div class="kv"><span class="k">Pintura configurada</span><span class="v">${VEH_COLORS.find(c=>c.id===_veh.color).name}</span></div>
          <div class="kv"><span class="k">VIN</span><span class="v tx3">${conn?'VF1…':'Requiere OBD2'}</span></div>
          <div class="kv"><span class="k">Kilometraje</span><span class="v tx3">${conn?'—':'Requiere OBD2'}</span></div>
        </div>
        <div class="card" style="display:flex;gap:12px;align-items:center">
          <span style="color:var(--acc-ink)">${ic('info',20)}</span>
          <div class="tx2" style="font-size:12px;line-height:1.45">La rotación y la pintura se simulan en este prototipo con renders multiángulo. En producción se usa un modelo 3D (GLB/glTF) reutilizable.</div>
        </div>`:''}
        ${_veh.tab==='estado'?`
        <div class="card" style="${conn?'':'box-shadow:inset 0 0 0 1px var(--line)'}">
          <div style="display:flex;align-items:center;gap:12px">
            <span class="bb-ic ${conn?'ok':'dim'}" style="width:44px;height:44px;border-radius:13px">${ic('gauge',21)}</span>
            <div style="flex:1"><div style="font-weight:700">Adaptador OBD2</div><div class="tx2" style="font-size:12px">Konnwei KW906 · ${conn?'CAN 11-bit · 500 k':'desconectado'}</div></div>
            <span class="badge ${conn?'ok':'dim'}"><span class="dot"></span>${conn?'Conectado':'Sin conexión'}</span>
          </div>
          <div style="margin-top:12px;display:flex;gap:8px">
            ${conn?`<button class="btn sm danger" id="vehObdOff">${ic('x',14)} Desconectar</button>`:`<button class="btn sm primary" id="vehObdOn">${ic('bluetooth',14)} Conectar KW906</button>`}
            <button class="btn sm" id="vehObdLive">${ic('activity',14)} Datos en vivo</button>
          </div>
        </div>
        <div class="card">
          <div class="cap" style="margin-bottom:8px">Códigos de falla (DTC)</div>
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-family:var(--f-mono);font-weight:700;font-size:26px;color:${dtcN?'var(--err)':'var(--ok)'}">${dtcN}</span>
            <div class="tx2" style="font-size:12.5px">${dtcN?'códigos almacenados — revisar':'Sin códigos almacenados'}</div>
            <button class="btn sm" style="margin-left:auto" id="vehDiag">${ic('wrench',14)} Diagnóstico</button>
          </div>
        </div>
        <div class="card">
          <div class="cap" style="margin-bottom:8px">Sensores disponibles</div>
          <div class="tx2" style="font-size:12.5px;line-height:1.5">Al conectar el KW906 se exponen ${OBD_PIDS.length} PIDs del Sandero: RPM, velocidad, refrigerante, voltaje, carga, admisión, colector y acelerador.</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px">${OBD_PIDS.slice(0,6).map(p=>`<span class="chip" style="height:28px;cursor:default">${esc(p.name)}</span>`).join('')}</div>
        </div>`:''}
        ${_veh.tab==='mant'?`
        <div class="card">
          <div class="cap" style="margin-bottom:10px">Próximo mantenimiento <span class="demo-chip" style="margin-left:6px">Plan demo</span></div>
          ${[['Cambio de aceite y filtro','cada 10 000 km'],['Filtro de aire','cada 20 000 km'],['Bujías','cada 30 000 km'],['Correa de distribución','cada 90 000 km']].map(m=>`
          <div class="setrow" style="padding:8px 0"><span class="sr-ic" style="width:34px;height:34px">${ic('wrench',16)}</span>
          <div class="sr-tt"><div class="t" style="font-size:13.5px">${m[0]}</div><div class="s">${m[1]}</div></div>
          <div class="sr-ctl mono tx3" style="font-size:11px">— km</div></div>`).join('')}
          <div class="tx2" style="font-size:11.5px;display:flex;gap:8px;margin-top:8px">${ic('info',13)} Los intervalos se calculan con el kilometraje real cuando el OBD2 está conectado.</div>
        </div>`:''}
      </div>
    </div>
  </div>`;
  const rot=dir=>{ const i=VEH_ANGLES.findIndex(a=>a.id===_veh.angle); _veh.angle=VEH_ANGLES[(i+dir+3)%3].id; if(_veh.color!=='grey'){_veh.color='grey';} go('vehicle'); };
  $('#vehRotL',v).onclick=()=>rot(-1);
  $('#vehRotR',v).onclick=()=>rot(1);
  $('#vehZin',v).onclick=()=>{_veh.zoom=Math.min(1.35,_veh.zoom+.15); $('#vehImg',v).style.transform=`translate(-50%,-52%) scale(${_veh.zoom})`;};
  $('#vehZout',v).onclick=()=>{_veh.zoom=Math.max(.75,_veh.zoom-.15); $('#vehImg',v).style.transform=`translate(-50%,-52%) scale(${_veh.zoom})`;};
  $('#vehReset',v).onclick=()=>{_veh.zoom=1;_veh.angle='rear';_veh.color='grey';go('vehicle');};
  $$('.va',v).forEach(b=>b.onclick=()=>{_veh.angle=b.dataset.a;_veh.color='grey';go('vehicle');});
  $$('.vc2',v).forEach(b=>b.onclick=()=>{
    _veh.color=b.dataset.c;
    if(_veh.color!=='grey'&&_veh.angle!=='rear'){ _veh.angle='rear'; toast({icon:'palette',color:'acc',title:'Vista de pintura trasera',body:'Las variantes de color se muestran en el ángulo trasero 3/4.'}); }
    go('vehicle');
  });
  $$('.tab',v).forEach(t=>t.onclick=()=>{_veh.tab=t.dataset.t;go('vehicle');});
  const on=($('#vehObdOn',v)); if(on) on.onclick=()=>go('obd-conn');
  const off=($('#vehObdOff',v)); if(off) off.onclick=obdDisconnect;
  const vl=$('#vehObdLive',v); if(vl) vl.onclick=()=>go('obd-live');
  const vd=$('#vehDiag',v); if(vd) vd.onclick=()=>go('obd-diag');
}});

/* ---------------- OBD2: PANEL PRINCIPAL ---------------- */
reg('obd',{title:'Monitor OBD2',group:'Vehículo',render(v){
  const conn=S.obd.state==='connected';
  v.innerHTML=`
  <div class="lib">
    <div class="mod-head">
      <div class="mh-ic">${ic('gauge',24)}</div>
      <div><div class="mh-t">Monitor OBD2</div><div class="mh-s">Adaptador Konnwei KW906 · datos reales del vehículo</div></div>
      <div class="mh-act">
        ${conn?`<span class="badge ok"><span class="dot"></span>Conectado</span><button class="btn sm danger" id="obdOff">${ic('x',14)} Desconectar</button>`
        :`<span class="badge dim"><span class="dot"></span>Desconectado</span><button class="btn sm primary" id="obdOn">${ic('bluetooth',14)} Conectar</button>`}
      </div>
    </div>
    <div class="obd-grid" style="padding-top:6px">
      ${conn?OBD_PIDS.slice(0,4).map(p=>gaugeHTML(p)).join(''):`
      <div class="state-blank" style="grid-column:1/-1">
        <div class="sb-ic">${ic('plug',36)}</div>
        <div class="t">OBD2 sin conectar</div>
        <div class="s">Conecta el adaptador Konnwei KW906 al puerto de diagnóstico del Sandero y vincúlalo por Bluetooth para ver datos en vivo del motor.</div>
        <div style="display:flex;gap:10px;margin-top:6px">
          <button class="btn primary" id="obdOn2">${ic('bluetooth',16)} Conectar adaptador</button>
          <button class="btn" onclick="go('obd-history')">${ic('history',16)} Historial</button>
        </div>
      </div>`}
      ${conn?`
      <div class="card" style="grid-column:1/-1;display:flex;align-items:center;gap:16px;padding:14px 18px">
        <span class="demo-chip">Datos de demostración</span>
        <div class="tx2" style="font-size:12.5px;flex:1">En el dispositivo real, los valores provienen del adaptador KW906. Este prototipo muestra datos simulados etiquetados.</div>
        <button class="btn sm" onclick="go('obd-live')">${ic('activity',14)} Ver los 8 PIDs</button>
        <button class="btn sm" onclick="go('obd-diag')">${ic('wrench',14)} DTC</button>
      </div>`:''}
    </div>
  </div>`;
  const on=$('#obdOn',v)||$('#obdOn2',v); if(on) on.onclick=()=>go('obd-conn');
  const off=$('#obdOff',v); if(off) off.onclick=obdDisconnect;
  if(conn) updateGauges();
}});
function gaugeHTML(p,variant=''){
  return `<div class="gauge ${variant}" data-gauge="${p.pid}">
    <div class="g-wrap"><svg viewBox="0 0 200 200">
      <circle class="g-track" cx="100" cy="100" r="84" stroke-dasharray="${2*Math.PI*84*.75}"/>
      <circle class="g-val" cx="100" cy="100" r="84" stroke-dasharray="${2*Math.PI*84*.75}" stroke-dashoffset="${2*Math.PI*84*.75}"/>
    </svg>
    <div class="g-num"><span class="n">— —</span><span class="u">${p.unit.toUpperCase()}</span></div></div>
    <div class="g-lb">${ic('activity',13)} ${esc(p.short||p.name)}</div>
    <div class="g-sub">PID ${p.pid} · ${p.min}–${p.max} ${p.unit}</div>
  </div>`;
}

/* ---------------- OBD2: CONEXIÓN ---------------- */
reg('obd-conn',{title:'Conexión OBD2',group:'Vehículo',render(v){
  const st=S.obd.state;
  v.innerHTML=`
  <div class="lib">
    <div class="mod-head">
      <button class="ibtn" onclick="go('obd')">${ic('arr-l',20)}</button>
      <div class="mh-ic">${ic('bluetooth',24)}</div>
      <div><div class="mh-t">Conexión del adaptador</div><div class="mh-s">Konnwei KW906 · puerto OBD2 bajo el volante</div></div>
    </div>
    <div class="obd-conn">
      <div class="obd-anim">
        <span class="ring"></span><span class="ring"></span><span class="ring"></span>
        <span style="width:74px;height:74px;border-radius:22px;background:var(--acc-soft);color:var(--acc-ink);display:grid;place-items:center;box-shadow:inset 0 0 0 1px var(--line-acc),var(--glow-soft)">${ic('gauge',34)}</span>
      </div>
      <div style="font-family:var(--f-brand);font-weight:800;font-size:22px">${st==='connected'?'Conectado al vehículo':st==='connecting'?'Conectando…':'Adaptador no vinculado'}</div>
      <div class="tx2" style="max-width:520px;line-height:1.5">${st==='connected'
        ?'La comunicación con el ECU del Sandero está activa (ISO 15765-4, CAN 11-bit, 500 kbaud). Los datos en vivo están disponibles.'
        :'Asegúrate de que el adaptador KW906 está enchufado y encendido (luz azul intermitente). La conexión es directa por Bluetooth SPP, sin pasar por la app de sistema.'}</div>
      ${st==='off'?`<button class="btn primary lg" id="cGo">${ic('bluetooth',18)} Buscar y conectar</button>`:''}
      ${st==='connecting'?`<div class="spin"></div>`:''}
      ${st==='connected'?`
      <div style="display:flex;gap:10px">
        <button class="btn primary" onclick="go('obd-live')">${ic('activity',16)} Datos en vivo</button>
        <button class="btn danger" id="cOff">${ic('x',16)} Desconectar</button>
      </div>`:''}
      <div class="obd-log" id="obdLog">
        ${S.obd.log.length?S.obd.log.map(l=>`<div class="ln"><span class="ok">✓</span><span class="tx">${esc(l)}</span></div>`).join('')
        :`<div class="ln"><span class="tx3">·</span><span>Registro de conexión vacío — inicia una conexión.</span></div>`}
      </div>
      <div class="tx2 t-xs" style="display:flex;align-items:center;gap:8px">${ic('shield',14)} SanderOS EVO solo lee datos. No expone comandos de escritura al ECU.</div>
    </div>
  </div>`;
  const c=$('#cGo',v); if(c) c.onclick=obdConnect;
  const off=$('#cOff',v); if(off) off.onclick=obdDisconnect;
}});

/* ---------------- OBD2: DATOS EN VIVO ---------------- */
reg('obd-live',{title:'Datos en vivo OBD2',group:'Vehículo',render(v){
  const conn=S.obd.state==='connected';
  if(!conn){
    v.innerHTML=`<div class="lib"><div class="mod-head"><button class="ibtn" onclick="go('obd')">${ic('arr-l',20)}</button>
      <div class="mh-ic">${ic('activity',24)}</div><div><div class="mh-t">Datos en vivo</div><div class="mh-s">Requiere conexión activa</div></div></div>
      <div class="state-blank" style="margin-top:30px">
      <div class="sb-ic">${ic('activity',34)}</div><div class="t">Sin datos disponibles</div>
      <div class="s">Los sensores aparecen al conectar el adaptador KW906. No se muestra ningún valor sin una fuente real conectada.</div>
      <button class="btn primary" onclick="go('obd-conn')">${ic('bluetooth',16)} Conectar adaptador</button></div></div>`;
    return;
  }
  v.innerHTML=`
  <div class="lib">
    <div class="mod-head">
      <button class="ibtn" onclick="go('obd')">${ic('arr-l',20)}</button>
      <div class="mh-ic">${ic('activity',24)}</div>
      <div><div class="mh-t">Datos en vivo</div><div class="mh-s">8 PIDs · CAN 11-bit · actualización 1 Hz</div></div>
      <div class="mh-act"><span class="demo-chip">${ic('gauge',11)} Valores simulados</span>
      <button class="btn sm" onclick="go('obd-settings')">${ic('settings',14)} Ajustes</button></div>
    </div>
    <div style="flex:1;display:grid;grid-template-columns:1fr 300px;gap:12px;padding:0 var(--s5) var(--s4);min-height:0">
      <div class="obd-grid" style="padding:0;grid-template-columns:repeat(4,1fr);align-content:start;overflow-y:auto">
        ${OBD_PIDS.map(p=>gaugeHTML(p,'sm')).join('')}
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;min-height:0;overflow-y:auto">
        <div class="card" style="padding:14px 16px;display:flex;flex-direction:column;gap:8px">
          <div class="cap">RPM · últimos 60 s</div>
          <svg class="spark" viewBox="0 0 600 64" preserveAspectRatio="none" style="height:64px">
            <defs><linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(0,210,255,.28)"/><stop offset="1" stop-color="rgba(0,210,255,0)"/></linearGradient></defs>
            <polygon class="fill" points="0,50 40,46 80,48 120,40 160,44 200,38 240,42 280,34 320,40 360,30 400,36 440,26 480,34 520,28 560,32 600,38 600,64 0,64"/>
            <polyline points="0,50 40,46 80,48 120,40 160,44 200,38 240,42 280,34 320,40 360,30 400,36 440,26 480,34 520,28 560,32 600,38"/>
          </svg>
          <div class="mono tx3" style="font-size:10.5px">Gráfica ilustrativa del prototipo</div>
        </div>
        <div class="card" style="padding:13px 16px;display:flex;flex-direction:column;gap:8px">
          <div class="cap">Fuentes de velocidad</div>
          <div class="kv"><span class="k">OBD2 (ECU)</span><span class="v">${S.obd.state==='connected'?Math.round(obdVal(OBD_PIDS[1])||0)+' km/h':'—'}</span></div>
          <div class="kv"><span class="k">GPS (satélites)</span><span class="v">${S.gps.on||S.drive.demo?Math.round(S.drive.speed)+' km/h':'sin señal'}</span></div>
          <div class="tx2" style="font-size:11px;line-height:1.4">${ic('info',12)} Ambas pueden diferir levemente; el indicador principal usa el GPS.</div>
        </div>
        <div class="card" style="padding:12px 16px;display:flex;align-items:center;gap:10px">
          ${ic('shield',16)}
          <div class="tx2" style="font-size:11px;line-height:1.4">Solo lectura del bus CAN. Sin comandos al ECU.</div>
        </div>
      </div>
    </div>
  </div>`;
  updateGauges();
}});

/* ---------------- OBD2: DIAGNÓSTICO (DTC) ---------------- */
reg('obd-diag',{title:'Diagnóstico OBD2',group:'Vehículo',render(v){
  const conn=S.obd.state==='connected';
  const codes=S.obdDemoCodes?DTC_DEMO:[];
  v.innerHTML=`
  <div class="lib">
    <div class="mod-head">
      <button class="ibtn" onclick="go('obd')">${ic('arr-l',20)}</button>
      <div class="mh-ic">${ic('wrench',24)}</div>
      <div><div class="mh-t">Códigos de falla</div><div class="mh-s">${conn?'Lectura del ECU completada':'Se requiere conexión OBD2'}</div></div>
      <div class="mh-act">
        ${conn?`<span class="badge ${codes.length?'err':'ok'}">${codes.length?codes.length+' DTC':'Sin códigos'}</span>
        ${codes.length?`<button class="btn sm danger" id="dtcClear">${ic('trash',14)} Borrar códigos</button>`:''}`:
        `<span class="badge dim">Desconectado</span>`}
      </div>
    </div>
    <div class="lib-body">
      ${!conn?`<div class="state-blank"><div class="sb-ic">${ic('plug',34)}</div><div class="t">Sin diagnóstico disponible</div>
        <div class="s">Conecta el adaptador KW906 para leer la memoria de fallas del ECU.</div>
        <button class="btn primary" onclick="go('obd-conn')">${ic('bluetooth',16)} Conectar</button></div>`:
      codes.length===0?`
      <div class="state-blank"><div class="sb-ic" style="background:var(--ok-soft);color:var(--ok)">${ic('check-c',36)}</div>
        <div class="t">Sin códigos de falla almacenados</div>
        <div class="s">La memoria de DTC del ECU está limpia. Luz MIL apagada.</div>
        <div class="card" style="margin-top:8px;max-width:560px;display:flex;gap:12px;align-items:center;text-align:left">
          ${ic('info',18)}<div class="tx2" style="font-size:12px;line-height:1.45">Puedes activar <b style="color:var(--tx-1)">códigos de ejemplo</b> en Ajustes OBD2 para ver cómo se muestran las fallas en pantalla.</div>
          <button class="btn sm" onclick="go('obd-settings')">Ir a Ajustes</button>
        </div></div>`:`
      <div style="display:flex;flex-direction:column;gap:9px">
        ${codes.map(c=>`
        <div class="notif-card" style="cursor:pointer" data-dtc="${c.code}">
          <span class="ni" style="background:var(--err-soft);color:var(--err)">${ic('alert',21)}</span>
          <div class="nt"><div class="t"><span class="dtc-code">${c.code}</span> ${esc(c.title)}</div>
          <div class="s">${c.mil?'Luz MIL encendida · ':''}Estado: ${c.status} · Congelado: ${esc(c.freeze)}</div></div>
          <div class="r-en">${ic('chev-r',18)}</div>
        </div>`).join('')}
        <div class="card" style="display:flex;align-items:center;gap:12px">
          <span class="demo-chip">Ejemplo</span>
          <div class="tx2" style="font-size:12px">Estos códigos son datos de ejemplo activados en Ajustes OBD2 — no provienen del vehículo.</div>
        </div>
      </div>`}
    </div>
  </div>`;
  const cl=$('#dtcClear',v); if(cl) cl.onclick=()=>confirmDlg({
    icon:'alert',color:'err',title:'¿Borrar los códigos de falla?',
    body:'Se enviará el comando <span class="kbd">Mode 04 — Clear DTC</span> al ECU. Esto apaga la luz MIL y borra la memoria de fallas y los fotogramas congelados. <b>Esta acción no se puede deshacer.</b><br><span class="demo-chip" style="margin-top:8px">Modo demo: solo simulación</span>',
    onOk(){ S.obdDemoCodes=false; toast({icon:'check-c',color:'ok',title:'Códigos borrados',body:'(Simulado) Memoria DTC limpia · MIL apagada'}); go('obd-diag'); }});
  $$('[data-dtc]',v).forEach(c=>c.onclick=()=>{
    const d=DTC_DEMO.find(x=>x.code===c.dataset.dtc);
    dialog({icon:'alert',color:'err',title:d.code+' — Detalle',lg:true,body:`
      <div style="display:flex;flex-direction:column;gap:4px">
        <div class="kv"><span class="k">Descripción</span><span class="v" style="font-family:var(--f-ui);font-size:13px">${esc(d.title)}</span></div>
        <div class="kv"><span class="k">Estado</span><span class="v ${d.mil?'err':'warn'}">${d.status}${d.mil?' · MIL ON':''}</span></div>
        <div class="kv"><span class="k">Fotograma congelado</span><span class="v">${esc(d.freeze)}</span></div>
        <div class="kv"><span class="k">Protocolo</span><span class="v">ISO 15031-6 / SAE J2012</span></div>
      </div>
      <div style="margin-top:10px" class="tx2 t-xs">${ic('info',13)} Descripción estándar del código. La causa real requiere inspección del taller.</div>`,
      actions:[{label:'Cerrar',cls:'ghost'},{label:ic('search',14)+' Buscar solución',cls:''},{label:ic('trash',14)+' Borrar DTC',cls:'danger',onClick(){S.obdDemoCodes=false;go('obd-diag');toast({icon:'check-c',color:'ok',title:'DTC '+d.code+' borrado',body:'(Simulado)'});}}]});
  });
}});

/* ---------------- OBD2: HISTORIAL Y AJUSTES ---------------- */
reg('obd-history',{title:'Historial OBD2',group:'Vehículo',render(v){
  v.innerHTML=`
  <div class="lib">
    <div class="mod-head">
      <button class="ibtn" onclick="go('obd')">${ic('arr-l',20)}</button>
      <div class="mh-ic">${ic('history',24)}</div>
      <div><div class="mh-t">Historial de conexiones</div><div class="mh-s">Últimas sesiones con el adaptador</div></div>
    </div>
    <div class="lib-body">
      <div class="card" style="padding:6px 10px">
        ${OBD_HISTORY.map(h=>`
        <div class="setrow" style="cursor:default">
          <span class="sr-ic" style="background:${h.result==='Conectado'?'var(--ok-soft)':'var(--err-soft)'};color:${h.result==='Conectado'?'var(--ok)':'var(--err)'}">${ic(h.result==='Conectado'?'check-c':'x',17)}</span>
          <div class="sr-tt"><div class="t mono" style="font-size:13px">${h.date}</div><div class="s">${h.adapter} · ${h.proto}</div></div>
          <div class="sr-ctl mono tx2" style="font-size:11.5px">${h.dur}</div>
        </div>`).join('')}
      </div>
      <div class="tx2 t-xs" style="margin:10px 4px;display:flex;gap:8px;align-items:center">${ic('info',13)} Datos de ejemplo del prototipo. El historial real se registra en cada sesión OBD2.</div>
    </div>
  </div>`;
}});
reg('obd-settings',{title:'Ajustes OBD2',group:'Vehículo',render(v){
  v.innerHTML=`
  <div class="lib">
    <div class="mod-head">
      <button class="ibtn" onclick="go('obd')">${ic('arr-l',20)}</button>
      <div class="mh-ic">${ic('settings',24)}</div>
      <div><div class="mh-t">Ajustes OBD2</div><div class="mh-s">Conexión, unidades y datos de demostración</div></div>
    </div>
    <div class="lib-body" style="max-width:860px">
      <div class="set-list" style="padding:0">
        <div class="setrow"><span class="sr-ic">${ic('zap',18)}</span><div class="sr-tt"><div class="t">Conectar automáticamente al arrancar</div><div class="s">Busca el KW906 al iniciar SanderOS EVO</div></div><div class="sr-ctl"><div class="sw"></div></div></div>
        <div class="setrow"><span class="sr-ic">${ic('activity',18)}</span><div class="sr-tt"><div class="t">Frecuencia de sondeo</div><div class="s">Equilibrio entre fluidez y carga del bus CAN</div></div>
        <div class="sr-ctl"><div class="sel sm"><select><option>1 Hz (recomendado)</option><option>2 Hz</option><option>0,5 Hz</option></select></div></div></div>
        <div class="setrow"><span class="sr-ic">${ic('gauge',18)}</span><div class="sr-tt"><div class="t">Unidad de temperatura</div><div class="s">Afecta a refrigerante y admisión</div></div>
        <div class="sr-ctl"><div class="sel sm"><select><option>°C</option><option>°F</option></select></div></div></div>
        <div class="setrow"><span class="sr-ic">${ic('alert',18)}</span><div class="sr-tt"><div class="t">Avisos de valores fuera de rango</div><div class="s">Notifica si un PID supera su umbral</div></div><div class="sr-ctl"><div class="sw on"></div></div></div>
        <div class="setrow"><span class="sr-ic">${ic('wrench',18)}</span><div class="sr-tt"><div class="t">Códigos DTC de ejemplo</div><div class="s">Muestra fallas ficticias para revisar la interfaz</div></div>
        <div class="sr-ctl"><div class="sw ${S.obdDemoCodes?'on':''}" id="swDemoCodes"></div></div></div>
      </div>
      <div class="card" style="margin-top:12px;display:flex;gap:12px;align-items:center">
        ${ic('shield',18)}<div class="tx2" style="font-size:12px;line-height:1.45">El monitor no ofrece comandos de escritura al ECU (ni borrado forzado ni pruebas activas): solo lectura de PIDs y borrado estándar de DTC.</div>
      </div>
    </div>
  </div>`;
  $$('.sw',v).forEach(sw=>{ if(sw.id!=='swDemoCodes') sw.onclick=()=>sw.classList.toggle('on'); });
  $('#swDemoCodes',v).onclick=e=>{ S.obdDemoCodes=!S.obdDemoCodes; e.currentTarget.classList.toggle('on',S.obdDemoCodes);
    toast({icon:'wrench',color:'warn',title:S.obdDemoCodes?'Códigos de ejemplo activados':'Códigos de ejemplo desactivados',body:'Los DTC mostrados son ficticios y están etiquetados.'}); };
}});

/* ---------------- COMPUTADORA DE VIAJES ---------------- */
let _tripTab='current';
reg('trip',{title:'Viajes',group:'Vehículo',render(v){
  v.innerHTML=`
  <div class="lib">
    <div class="mod-head">
      <div class="mh-ic">${ic('map',24)}</div>
      <div><div class="mh-t">Computadora de viajes</div><div class="mh-s">Estadísticas de conducción del vehículo</div></div>
      <div class="mh-act">
        <div class="seg">
          <button class="sg ${_tripTab==='current'?'on c':''}" data-t="current">Viaje actual</button>
          <button class="sg ${_tripTab==='hist'?'on c':''}" data-t="hist">Historial</button>
        </div>
      </div>
    </div>
    <div class="lib-body">
    ${_tripTab==='current'?`
      <div class="trip-stats">
        <div class="trip-stat"><div class="k">${ic('map-pin',13)} Distancia</div><div class="v">12.4<span class="u">km</span></div></div>
        <div class="trip-stat"><div class="k">${ic('gauge',13)} Vel. media</div><div class="v">41<span class="u">km/h</span></div></div>
        <div class="trip-stat acc"><div class="k">${ic('zap',13)} Vel. máxima</div><div class="v">68<span class="u">km/h</span></div></div>
        <div class="trip-stat"><div class="k">${ic('clock',13)} Duración</div><div class="v">21<span class="u">min</span></div></div>
      </div>
      <div class="card" style="margin-top:12px;padding:16px 18px">
        <div class="cap" style="margin-bottom:10px">Perfil de velocidad del viaje <span class="demo-chip" style="margin-left:8px">DEMO</span></div>
        <svg class="spark" viewBox="0 0 600 64" preserveAspectRatio="none">
          <polygon class="fill" points="0,58 60,52 120,50 180,38 240,30 300,26 360,34 420,22 480,28 540,20 600,26 600,64 0,64"/>
          <polyline points="0,58 60,52 120,50 180,38 240,30 300,26 360,34 420,22 480,28 540,20 600,26"/>
        </svg>
      </div>
      <div style="display:flex;gap:10px;margin-top:12px;align-items:center">
        <button class="btn danger" id="tripReset">${ic('rotate-ccw',15)} Reiniciar viaje</button>
        <div class="tx2 t-xs">${ic('info',13)} El viaje actual usa datos del GPS; los totales se guardan localmente.</div>
      </div>
      <div class="card" style="margin-top:12px;display:flex;gap:14px;align-items:center">
        <span style="color:var(--tx-3)">${ic('droplet',19)}</span>
        <div class="tx2" style="font-size:12.5px;line-height:1.45"><b style="color:var(--tx-1)">Consumo de combustible: no disponible.</b> El KW906 no expone PIDs de consumo/volumen en el Sandero 2017. Si el vehículo los soportara, aparecerían aquí automáticamente.</div>
      </div>`:`
      <div style="display:flex;flex-direction:column;gap:8px">
        <div class="cap" style="margin:2px 0 4px">Viajes registrados <span class="demo-chip" style="margin-left:8px">Datos de ejemplo</span></div>
        ${TRIPS.map(t=>`
        <div class="card" style="display:flex;align-items:center;gap:18px;padding:13px 18px">
          <span class="sr-ic" style="width:42px;height:42px">${ic('map',18)}</span>
          <div style="flex:1;min-width:0"><div style="font-weight:700">${esc(t.name)}</div><div class="tx2" style="font-size:12px">${esc(t.date)}</div></div>
          <div class="mono" style="text-align:center"><div style="font-weight:700;font-size:16px">${t.km}<span class="tx2" style="font-size:10px"> km</span></div><div class="tx2" style="font-size:10px">distancia</div></div>
          <div class="mono" style="text-align:center"><div style="font-weight:700;font-size:16px">${t.avg}<span class="tx2" style="font-size:10px"> km/h</span></div><div class="tx2" style="font-size:10px">media</div></div>
          <div class="mono" style="text-align:center"><div style="font-weight:700;font-size:16px">${t.max}<span class="tx2" style="font-size:10px"> km/h</span></div><div class="tx2" style="font-size:10px">máxima</div></div>
          <div class="mono tx2" style="font-size:12px">${t.dur}</div>
        </div>`).join('')}
      </div>`}
    </div>
  </div>`;
  $$('.sg',v).forEach(b=>b.onclick=()=>{_tripTab=b.dataset.t;go('trip');});
  const rs=$('#tripReset',v); if(rs) rs.onclick=()=>confirmDlg({icon:'rotate-ccw',color:'warn',title:'¿Reiniciar viaje actual?',
    body:'Se borrarán la distancia, velocidad media, máxima y duración del viaje en curso. El historial se conserva.',
    ok:'Reiniciar',onOk(){ toast({icon:'check-c',color:'ok',title:'Viaje reiniciado',body:'Contadores a cero.'}); }});
}});
