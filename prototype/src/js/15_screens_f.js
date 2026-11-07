/* ============================================================
   SanderOS EVO — Ajustes (10 categorías + subpáginas),
   Acerca de y pantalla Design System
   ============================================================ */
function setHead(v,title,icon,sub,backTo){
  return `<div class="mod-head">
    <button class="ibtn" onclick="go('${backTo||'settings'}')">${ic('arr-l',20)}</button>
    <div class="mh-ic">${ic(icon,24)}</div>
    <div><div class="mh-t">${title}</div><div class="mh-s">${sub}</div></div>
  </div>`;
}
function sw(id,on){return `<div class="sw ${on?'on':''}" id="${id}"></div>`;}

/* ---------------- AJUSTES: HOME ---------------- */
reg('settings',{title:'Ajustes',group:'Sistema',render(v){
  const cats=[
    ['general','General','globe','Idioma, fecha y hora, arranque'],
    ['appearance','Apariencia','palette','Temas Midnight y Light, acento, fondo'],
    ['dashboard','Dashboard','layout','Módulos, dock y barra inferior'],
    ['nav','Navegación','compass','Proveedor, apps instaladas'],
    ['audio','Audio','volume','Volumen, comportamiento, ecualizador'],
    ['reverse','Cámara de retroceso','camera','Comportamiento y audio al dar marcha atrás'],
    ['vehicle','Vehículo','car','Modelo, color, OBD2 y GPS'],
    ['files','Gestor de archivos','folder','Modo de exploración y almacenamiento'],
    ['safety','Seguridad','shield','Restricciones de vídeo y conducción'],
    ['system','Sistema','cpu','Versión, diagnóstico, copia de seguridad'],
  ];
  v.innerHTML=`
  <div class="lib">
    <div class="mod-head">
      <div class="mh-ic">${ic('settings',24)}</div>
      <div><div class="mh-t">Ajustes</div><div class="mh-s">Configuración completa de SanderOS EVO</div></div>
      <div class="mh-act"><button class="btn sm ghost" onclick="go('about')">${ic('info',14)} Acerca de</button></div>
    </div>
    <div class="set-grid">
      ${cats.map(c=>`
      <button class="set-cat" data-go="settings-${c[0]}">
        <span class="si" style="background:var(--acc-soft);color:var(--acc-ink)">${ic(c[2],22)}</span>
        <span class="st"><span class="t">${c[1]}</span><span class="s">${c[3]}</span></span>
        <span class="chev">${ic('chev-r',20)}</span>
      </button>`).join('')}
    </div>
  </div>`;
  $$('.set-cat',v).forEach(b=>b.onclick=()=>go(b.dataset.go));
}});

/* ---------------- GENERAL ---------------- */
reg('settings-general',{title:'Ajustes generales',group:'Sistema',render(v){
  v.innerHTML=`<div class="lib">${setHead(v,'General','globe','Idioma y comportamiento del sistema')}
  <div class="lib-body" style="max-width:860px">
    <div class="cap" style="margin:4px 0 8px">Idioma y región</div>
    <div class="set-list" style="padding:0">
      <div class="setrow"><span class="sr-ic">${ic('languages',18)}</span><div class="sr-tt"><div class="t">Idioma de la interfaz</div><div class="s">Se aplica al reiniciar la app</div></div>
      <div class="sr-ctl"><div class="sel sm"><select><option selected>Español</option><option>English</option><option>Português</option></select></div></div></div>
      <div class="setrow"><span class="sr-ic">${ic('globe',18)}</span><div class="sr-tt"><div class="t">Formato de fecha</div></div>
      <div class="sr-ctl"><div class="sel sm"><select><option>Sáb. 26 Abr. (corto)</option><option>Sábado 26 de abril</option></select></div></div></div>
      <div class="setrow"><span class="sr-ic">${ic('clock',18)}</span><div class="sr-tt"><div class="t">Formato 24 horas</div></div><div class="sr-ctl">${sw('gT24',S.settings.time24)}</div></div>
      <div class="setrow"><span class="sr-ic">${ic('zap',18)}</span><div class="sr-tt"><div class="t">Unidades del sistema</div><div class="s">Velocidad, temperatura, distancia</div></div>
      <div class="sr-ctl"><div class="sel sm"><select><option>Métrico (km/h · °C)</option><option>Imperial (mph · °F)</option></select></div></div></div>
    </div>
    <div class="cap" style="margin:16px 0 8px">Arranque</div>
    <div class="set-list" style="padding:0">
      <div class="setrow"><span class="sr-ic">${ic('power',18)}</span><div class="sr-tt"><div class="t">Comportamiento al arrancar</div><div class="s">Qué hace SanderOS EVO al encender la unidad</div></div>
      <div class="sr-ctl"><div class="sel sm"><select><option>Último módulo usado</option><option selected>Vista de Conducción</option></select></div></div></div>
      <div class="setrow"><span class="sr-ic">${ic('car-front',18)}</span><div class="sr-tt"><div class="t">Módulo inicial</div></div>
      <div class="sr-ctl"><div class="sel sm"><select><option selected>Vista de Conducción</option><option>Navegación</option><option>Audio</option></select></div></div></div>
    </div>
  </div></div>`;
  $('#gT24',v).onclick=e=>{S.settings.time24=!S.settings.time24;e.currentTarget.classList.toggle('on');tickClock();};
}});

/* ---------------- APARIENCIA ---------------- */
reg('settings-appearance',{title:'Apariencia',group:'Sistema',render(v){
  v.innerHTML=`<div class="lib">${setHead(v,'Apariencia','palette','Temas, color de acento y fondo')}
  <div class="lib-body" style="max-width:900px">
    <div class="cap" style="margin:4px 0 8px">Tema</div>
    <div class="card" style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">
      <div class="seg" id="apTheme">
        <button class="sg ${S.theme==='midnight'?'on c':''}" data-t="midnight">${ic('moon',15)} Midnight</button>
        <button class="sg ${S.theme==='light'?'on c':''}" data-t="light">${ic('sun',15)} Light</button>
        <button class="sg ${S.theme==='auto'?'on c':''}" data-t="auto">${ic('sun-moon',15)} Automático</button>
      </div>
      <div class="tx2 t-xs">${S.theme==='auto'?'Tema según horario: Light 07:00–19:00 · Midnight de noche. Se recuerda tu elección.':'Se recuerda la última selección.'}</div>
    </div>
    <div class="cap" style="margin:16px 0 8px">Color de acento</div>
    <div class="card"><div class="swatches">
      ${Object.entries(ACCENTS).map(([k,a])=>`<button class="swatch ${S.accent===k?'on':''}" data-acc="${k}" title="${a.name}" style="background:${a.mid};color:${a.mid}"></button>`).join('')}
      <span class="tx2" style="font-size:12.5px;margin-left:8px">${ACCENTS[S.accent].name}</span>
    </div></div>
    <div class="cap" style="margin:16px 0 8px">Fondo de pantalla</div>
    <div class="card"><div style="display:flex;gap:14px;flex-wrap:wrap">
      ${[['solid','Navy sólido','linear-gradient(160deg,#0F2039,#071326)'],['mesh','Malla técnica','linear-gradient(160deg,#0E1E36,#0A192F)'],['grad','Resplandor profundo','radial-gradient(700px 400px at 30% 110%,#14355E,#0A192F 70%)']].map(w=>`
      <button class="wall-opt ${S.wallpaper===w[0]?'on':''}" data-w="${w[0]}" title="${w[1]}"><span style="position:absolute;inset:0;background:${w[2]}"></span>
      <span style="position:absolute;bottom:7px;left:10px;font-size:11px;font-weight:700;color:#F8FAFC;text-shadow:0 1px 4px rgba(0,0,0,.6)">${w[1]}</span></button>`).join('')}
    </div></div>
    <div class="cap" style="margin:16px 0 8px">Animaciones</div>
    <div class="set-list" style="padding:0">
      <div class="setrow"><span class="sr-ic">${ic('zap',18)}</span><div class="sr-tt"><div class="t">Animaciones de interfaz</div><div class="s">Transiciones de módulos y elementos · desactiva para máximo rendimiento</div></div><div class="sr-ctl">${sw('apAnim',S.anims)}</div></div>
    </div>
  </div></div>`;
  $$('#apTheme .sg',v).forEach(b=>b.onclick=()=>{setTheme(b.dataset.t);go('settings-appearance');});
  $$('.swatch',v).forEach(s=>s.onclick=()=>{S.accent=s.dataset.acc;applyTheme();save();go('settings-appearance');});
  $$('.wall-opt',v).forEach(w=>w.onclick=()=>{S.wallpaper=w.dataset.w;applyTheme();save();go('settings-appearance');});
  $('#apAnim',v).onclick=e=>{S.anims=!S.anims;e.currentTarget.classList.toggle('on',S.anims);save();applyTheme(false);};
}});

/* ---------------- DASHBOARD ---------------- */
reg('settings-dashboard',{title:'Ajustes del dashboard',group:'Sistema',render(v){
  v.innerHTML=`<div class="lib">${setHead(v,'Dashboard','layout','Módulos, dock y barras')}
  <div class="lib-body" style="max-width:860px">
    <div class="cap" style="margin:4px 0 8px">Dock y módulos</div>
    <div class="set-list" style="padding:0">
      <div class="setrow" onclick="go('dock-config')"><span class="sr-ic">${ic('layout',18)}</span><div class="sr-tt"><div class="t">Configurar dock</div><div class="s">${S.dockPages.length} página(s) · ${S.dockPages.flat().length} módulos</div></div><div class="sr-ctl">${ic('chev-r',18)}</div></div>
      <div class="setrow"><span class="sr-ic">${ic('plus',18)}</span><div class="sr-tt"><div class="t">Añadir módulos al dock</div><div class="s">Disponibles: Viajes, Teléfono, OBD2…</div></div><div class="sr-ctl">${ic('chev-r',18)}</div></div>
      <div class="setrow"><span class="sr-ic">${ic('car-front',18)}</span><div class="sr-tt"><div class="t">Módulo inicial</div><div class="s">Vista de Conducción (siempre disponible)</div></div>
      <div class="sr-ctl"><div class="sel sm"><select><option selected>Vista de Conducción</option><option>Último usado</option></select></div></div></div>
    </div>
    <div class="cap" style="margin:16px 0 8px">Barra inferior de información</div>
    <div class="set-list" style="padding:0">
      <div class="setrow"><span class="sr-ic">${ic('sun',18)}</span><div class="sr-tt"><div class="t">Mostrar clima</div></div><div class="sr-ctl">${sw('dbWx',true)}</div></div>
      <div class="setrow"><span class="sr-ic">${ic('gauge',18)}</span><div class="sr-tt"><div class="t">Indicador OBD2</div><div class="s">Estado de conexión siempre visible</div></div><div class="sr-ctl">${sw('dbObd',true)}</div></div>
      <div class="setrow"><span class="sr-ic">${ic('pin',18)}</span><div class="sr-tt"><div class="t">Velocidad GPS</div></div><div class="sr-ctl">${sw('dbGps',true)}</div></div>
      <div class="setrow"><span class="sr-ic">${ic('music',18)}</span><div class="sr-tt"><div class="t">Información de música</div><div class="s">Título, artista y controles</div></div><div class="sr-ctl">${sw('dbMus',true)}</div></div>
    </div>
  </div></div>`;
  $$('.sw[id^="db"]',v).forEach(s=>s.onclick=()=>s.classList.toggle('on'));
}});

/* ---------------- NAVEGACIÓN ---------------- */
reg('settings-nav',{title:'Ajustes de navegación',group:'Sistema',render(v){
  v.innerHTML=`<div class="lib">${setHead(v,'Navegación','compass','Proveedor externo y preferencias')}
  <div class="lib-body" style="max-width:860px">
    <div class="cap" style="margin:4px 0 8px">Aplicación de navegación</div>
    <div class="card" style="padding:6px 10px">
      ${NAV_PROVIDERS.map(p=>`
      <div class="setrow ${p.id===S.nav.provider?'on':''}" data-prov="${p.id}" style="${p.installed?'':'opacity:.6'}">
        <span class="sr-ic" style="background:var(--acc-soft);color:var(--acc-ink)">${ic('compass',17)}</span>
        <div class="sr-tt"><div class="t">${p.name}</div><div class="s">${p.installed?p.desc:'No instalada'}</div></div>
        <div class="sr-ctl">${p.id===S.nav.provider?'<span class="badge acc">Predeterminada</span>':ic('chev-r',18)}</div>
      </div>`).join('')}
    </div>
    <div class="cap" style="margin:16px 0 8px">Preferencias</div>
    <div class="set-list" style="padding:0">
      <div class="setrow"><span class="sr-ic">${ic('pin',18)}</span><div class="sr-tt"><div class="t">Destinos rápidos</div><div class="s">Casa, Trabajo y Taller Renault</div></div><div class="sr-ctl">${ic('chev-r',18)}</div></div>
      <div class="setrow"><span class="sr-ic">${ic('history',18)}</span><div class="sr-tt"><div class="t">Recordar último proveedor</div></div><div class="sr-ctl">${sw('nvMem',true)}</div></div>
      <div class="setrow"><span class="sr-ic">${ic('map',18)}</span><div class="sr-tt"><div class="t">Unidades de distancia</div></div>
      <div class="sr-ctl"><div class="sel sm"><select><option>Kilómetros</option><option>Millas</option></select></div></div></div>
    </div>
    <div class="card" style="margin-top:12px;display:flex;gap:12px;align-items:center">
      ${ic('info',17)}<div class="tx2" style="font-size:12px;line-height:1.45">SanderOS EVO no incrusta mapas de terceros. La navegación ocurre siempre en la aplicación externa elegida, con el destino transferido por intent.</div>
    </div>
  </div></div>`;
  $$('[data-prov]',v).forEach(r=>r.onclick=()=>{ if(r.dataset.prov!=='other'){S.nav.provider=r.dataset.prov;save();go('settings-nav');} });
  $$('.sw[id^="nv"]',v).forEach(s=>s.onclick=()=>s.classList.toggle('on'));
}});

/* ---------------- CÁMARA DE RETROCESO ---------------- */
reg('settings-reverse',{title:'Cámara de retroceso',group:'Sistema',render(v){
  v.innerHTML=`<div class="lib">${setHead(v,'Cámara de retroceso','camera','El sistema original de la unidad manda la imagen al meter marcha atrás')}
  <div class="lib-body" style="max-width:860px">
    <div class="card acc" style="display:flex;gap:14px;align-items:flex-start">
      <span style="color:var(--acc-ink);margin-top:2px">${ic('camera',22)}</span>
      <div><div style="font-weight:700">La cámara la controla el MCU original</div>
      <div class="tx2" style="font-size:12.5px;line-height:1.5;margin-top:3px">La unidad central muestra automáticamente el vídeo de la cámara al engranar la marcha atrás. SanderOS EVO <b style="color:var(--tx-1)">nunca interfiere</b> con esa activación ni sustituye la señal de la cámara.</div></div>
    </div>
    <div class="cap" style="margin:16px 0 8px">Audio multimedia durante la marcha atrás</div>
    <div class="set-list" style="padding:0">
      ${[['mute','Silenciar multimedia','Se calla la música hasta salir de marcha atrás'],['reduce','Reducir volumen','Baja al 20% durante la maniobra'],['keep','Mantener volumen','El audio continúa igual']].map(o=>`
      <div class="setrow" data-ra="${o[0]}">
        <span class="sr-ic">${ic(o[0]==='mute'?'volume-x':o[0]==='reduce'?'volume-1':'volume',18)}</span>
        <div class="sr-tt"><div class="t">${o[1]}</div><div class="s">${o[2]}</div></div>
        <div class="sr-ctl"><div class="chk ${S.settings.reverseAudio===o[0]?'on':''}">${ic('check',13)}</div></div>
      </div>`).join('')}
      <div class="setrow"><span class="sr-ic">${ic('rotate-ccw',18)}</span><div class="sr-tt"><div class="t">Restaurar volumen anterior</div><div class="s">Vuelve al nivel previo a la maniobra</div></div><div class="sr-ctl">${sw('rvRestore',true)}</div></div>
    </div>
    <div class="cap" style="margin:16px 0 8px">Pantalla</div>
    <div class="set-list" style="padding:0">
      <div class="setrow"><span class="sr-ic">${ic('layout',18)}</span><div class="sr-tt"><div class="t">Volver a la pantalla anterior</div><div class="s">Restaura el módulo activo al salir de marcha atrás (si el MCU lo permite)</div></div><div class="sr-ctl">${sw('rvBack',true)}</div></div>
      <div class="setrow" style="opacity:.6"><span class="sr-ic">${ic('gauge',18)}</span><div class="sr-tt"><div class="t">Indicador de evento de marcha atrás</div><div class="s">Estado — no disponible con esta configuración CANBUS</div></div><div class="sr-ctl"><span class="badge dim">N/D</span></div></div>
    </div>
  </div></div>`;
  $$('[data-ra]',v).forEach(r=>r.onclick=()=>{S.settings.reverseAudio=r.dataset.ra;go('settings-reverse');});
  $$('.sw[id^="rv"]',v).forEach(s=>s.onclick=()=>s.classList.toggle('on'));
}});

/* ---------------- VEHÍCULO ---------------- */
reg('settings-vehicle',{title:'Ajustes del vehículo',group:'Sistema',render(v){
  v.innerHTML=`<div class="lib">${setHead(v,'Vehículo','car','Renault Sandero 2017 · adaptador KW906')}
  <div class="lib-body" style="max-width:860px">
    <div class="cap" style="margin:4px 0 8px">Identificación</div>
    <div class="card" style="padding:6px 10px">
      <div class="setrow" onclick="go('vehicle')"><span class="sr-ic">${ic('car',18)}</span><div class="sr-tt"><div class="t">Modelo del vehículo</div><div class="s">Renault Sandero 2017 · Hatchback 5p · convencional</div></div><div class="sr-ctl">${ic('chev-r',18)}</div></div>
      <div class="setrow" onclick="go('vehicle')"><span class="sr-ic">${ic('palette',18)}</span><div class="sr-tt"><div class="t">Color del vehículo</div><div class="s">${VEH_COLORS.find(c=>c.id===_veh.color).name} · se usa en Mi Vehículo</div></div><div class="sr-ctl">${ic('chev-r',18)}</div></div>
    </div>
    <div class="cap" style="margin:16px 0 8px">OBD2</div>
    <div class="card" style="padding:6px 10px">
      <div class="setrow" onclick="go('obd-settings')"><span class="sr-ic">${ic('gauge',18)}</span><div class="sr-tt"><div class="t">Ajustes del monitor OBD2</div><div class="s">Autoconexión, sondeo, unidades, DTC demo</div></div><div class="sr-ctl">${ic('chev-r',18)}</div></div>
      <div class="setrow" onclick="go('obd-history')"><span class="sr-ic">${ic('history',18)}</span><div class="sr-tt"><div class="t">Historial de conexiones</div></div><div class="sr-ctl">${ic('chev-r',18)}</div></div>
    </div>
    <div class="cap" style="margin:16px 0 8px">GPS</div>
    <div class="set-list" style="padding:0">
      <div class="setrow"><span class="sr-ic">${ic('pin',18)}</span><div class="sr-tt"><div class="t">GPS integrado</div><div class="s">Velocidad por satélites independiente del OBD2</div></div><div class="sr-ctl">${sw('veGps',S.gps.on)}</div></div>
      <div class="setrow"><span class="sr-ic">${ic('activity',18)}</span><div class="sr-tt"><div class="t">Precisión requerida</div></div>
      <div class="sr-ctl"><div class="sel sm"><select><option>Estándar (5 m)</option><option>Alta (1 m)</option></select></div></div></div>
    </div>
  </div></div>`;
  $('#veGps',v).onclick=e=>{S.gps.on=!S.gps.on;e.currentTarget.classList.toggle('on',S.gps.on);renderBottombar();};
}});

/* ---------------- ARCHIVOS Y SEGURIDAD ---------------- */
reg('settings-files',{title:'Ajustes del gestor de archivos',group:'Sistema',render(v){
  v.innerHTML=`<div class="lib">${setHead(v,'Gestor de archivos','folder','Exploración y almacenamiento')}
  <div class="lib-body" style="max-width:860px">
    <div class="cap" style="margin:4px 0 8px">Exploración</div>
    <div class="set-list" style="padding:0">
      <div class="setrow"><span class="sr-ic">${ic('layout',18)}</span><div class="sr-tt"><div class="t">Modo de exploración</div></div>
      <div class="sr-ctl"><div class="sel sm"><select id="sfMode"><option ${S.files.mode==='single'?'selected':''}>Panel simple</option><option ${S.files.mode==='dual'?'selected':''}>Panel doble</option></select></div></div></div>
      <div class="setrow"><span class="sr-ic">${ic('home',18)}</span><div class="sr-tt"><div class="t">Pantalla de inicio</div></div>
      <div class="sr-ctl"><div class="sel sm"><select><option selected>Inicio con categorías</option><option>Última carpeta</option></select></div></div></div>
      <div class="setrow"><span class="sr-ic">${ic('eye',18)}</span><div class="sr-tt"><div class="t">Archivos ocultos</div></div><div class="sr-ctl">${sw('sfHidden',S.files.hidden)}</div></div>
      <div class="setrow"><span class="sr-ic">${ic('trash',18)}</span><div class="sr-tt"><div class="t">Confirmar antes de eliminar</div></div><div class="sr-ctl">${sw('sfConfirm',S.files.confirmDel)}</div></div>
    </div>
    <div class="cap" style="margin:16px 0 8px">Almacenamiento</div>
    <div class="card" style="padding:6px 10px">
      <div class="setrow"><span class="sr-ic">${ic('hard-drive',18)}</span><div class="sr-tt"><div class="t">Interno · 32 GB</div><div class="s">26,4 GB usados · 82%</div></div><div class="sr-ctl"><div class="prog thin" style="width:110px"><i style="width:82%"></i></div></div></div>
      <div class="setrow"><span class="sr-ic">${ic('usb',18)}</span><div class="sr-tt"><div class="t">Memoria USB</div><div class="s">${S.usb?'Kingston 64 GB conectada':'Sin conectar'}</div></div><div class="sr-ctl"><span class="badge ${S.usb?'ok':'dim'}">${S.usb?'Montada':'Vacío'}</span></div></div>
    </div>
  </div></div>`;
  $('#sfMode',v).onchange=e=>{S.files.mode=e.target.value;save();};
  $('#sfHidden',v).onclick=e=>{S.files.hidden=!S.files.hidden;e.currentTarget.classList.toggle('on');save();};
  $('#sfConfirm',v).onclick=e=>{S.files.confirmDel=!S.files.confirmDel;e.currentTarget.classList.toggle('on');save();};
}});
reg('settings-safety',{title:'Seguridad',group:'Sistema',render(v){
  v.innerHTML=`<div class="lib">${setHead(v,'Seguridad','shield','Restricciones y comportamiento en conducción')}
  <div class="lib-body" style="max-width:860px">
    <div class="card acc" style="display:flex;gap:14px;align-items:flex-start;margin-bottom:6px">
      <span style="color:var(--warn);margin-top:2px">${ic('shield',22)}</span>
      <div><div style="font-weight:700">Bloqueo de vídeo en movimiento</div>
      <div class="tx2" style="font-size:12.5px;line-height:1.5;margin-top:3px">La reproducción visual se bloquea con el vehículo en marcha. Medida fija: <b style="color:var(--tx-1)">no existe opción para desactivarla</b>.</div></div>
      <span class="badge warn" style="margin-left:auto"><span class="dot"></span>Siempre activo</span>
    </div>
    <div class="cap" style="margin:14px 0 8px">Modo conducción</div>
    <div class="set-list" style="padding:0">
      <div class="setrow"><span class="sr-ic">${ic('car-front',18)}</span><div class="sr-tt"><div class="t">Detección de movimiento</div><div class="s">GPS u OBD2 (&gt;5 km/h) · activa restricciones</div></div><div class="sr-ctl">${sw('sfDrive',S.settings.driveMode)}</div></div>
      <div class="setrow"><span class="sr-ic">${ic('bell',18)}</span><div class="sr-tt"><div class="t">Notificaciones en conducción</div></div>
      <div class="sr-ctl"><div class="sel sm"><select><option>Solo críticas</option><option selected>Sutiles (sin sonido)</option><option>Normales</option></select></div></div></div>
      <div class="setrow"><span class="sr-ic">${ic('zap',18)}</span><div class="sr-tt"><div class="t">Áreas táctiles ampliadas</div><div class="s">Mínimo 44 dp en controles de conducción</div></div><div class="sr-ctl">${sw('sfTouch',true)}</div></div>
    </div>
  </div></div>`;
  $$('.sw[id^="sf"]',v).forEach(s=>s.onclick=()=>s.classList.toggle('on'));
}});

/* ---------------- SISTEMA ---------------- */
reg('settings-system',{title:'Sistema',group:'Sistema',render(v){
  v.innerHTML=`<div class="lib">${setHead(v,'Sistema','cpu','Información, diagnóstico y mantenimiento')}
  <div class="lib-body" style="max-width:860px">
    <div class="cap" style="margin:4px 0 8px">Dispositivo</div>
    <div class="card">
      <div class="kv"><span class="k">Unidad principal</span><span class="v">Android Automotive · Android 11</span></div>
      <div class="kv"><span class="k">Plataforma</span><span class="v">AC8257 · 8 núcleos (4+4) hasta 2.0 GHz</span></div>
      <div class="kv"><span class="k">Memoria</span><span class="v">2 GB RAM · 32 GB almacenamiento</span></div>
      <div class="kv"><span class="k">Radio / DSP</span><span class="v">NX6856 · ADI-1701</span></div>
      <div class="kv"><span class="k">CANBUS</span><span class="v">XinPu · Renault Sandero</span></div>
    </div>
    <div class="cap" style="margin:16px 0 8px">Mantenimiento</div>
    <div class="card" style="padding:6px 10px">
      <div class="setrow" onclick="go('about')"><span class="sr-ic">${ic('info',18)}</span><div class="sr-tt"><div class="t">Acerca de SanderOS EVO</div><div class="s">Versión, créditos y marca</div></div><div class="sr-ctl">${ic('chev-r',18)}</div></div>
      <div class="setrow" id="sysDiag"><span class="sr-ic">${ic('activity',18)}</span><div class="sr-tt"><div class="t">Diagnóstico del sistema</div><div class="s">Comprobación de subsistemas</div></div><div class="sr-ctl">${ic('chev-r',18)}</div></div>
      <div class="setrow" id="sysLogs"><span class="sr-ic">${ic('file-log',18)}</span><div class="sr-tt"><div class="t">Registros (logs)</div><div class="s">Últimas entradas del sistema</div></div><div class="sr-ctl">${ic('chev-r',18)}</div></div>
      <div class="setrow" id="sysPerms"><span class="sr-ic">${ic('key',18)}</span><div class="sr-tt"><div class="t">Permisos de Android</div><div class="s">Contactos, almacenamiento, ubicación</div></div><div class="sr-ctl">${ic('chev-r',18)}</div></div>
    </div>
    <div class="cap" style="margin:16px 0 8px">Datos</div>
    <div class="card" style="padding:6px 10px">
      <div class="setrow" id="sysBackup"><span class="sr-ic">${ic('save',18)}</span><div class="sr-tt"><div class="t">Copia de seguridad de ajustes</div><div class="s">Exporta la configuración a un archivo</div></div><div class="sr-ctl"><button class="btn sm">Exportar</button></div></div>
      <div class="setrow" id="sysRestore"><span class="sr-ic">${ic('upload',18)}</span><div class="sr-tt"><div class="t">Restaurar ajustes</div><div class="s">Importa una copia previa</div></div><div class="sr-ctl"><button class="btn sm ghost">Importar</button></div></div>
      <div class="setrow danger" id="sysReset"><span class="sr-ic">${ic('rotate-ccw',18)}</span><div class="sr-tt"><div class="t">Restablecer de fábrica</div><div class="s">Borra dock, ajustes y preferencias</div></div><div class="sr-ctl"><button class="btn sm danger">Restablecer</button></div></div>
    </div>
    <div style="display:flex;gap:10px;margin-top:14px">
      <button class="btn" id="sysRestart">${ic('power',16)} Reiniciar aplicación</button>
    </div>
  </div></div>`;
  $('#sysDiag',v).onclick=()=>sysDiag();
  $('#sysLogs',v).onclick=()=>sysLogs();
  $('#sysPerms',v).onclick=()=>sysPerms();
  $('#sysBackup',v).querySelector('button').onclick=()=>toast({icon:'save',color:'ok',title:'Ajustes exportados',body:'/Descargas/sanderosevo_backup.json (demo)'});
  $('#sysRestore',v).querySelector('button').onclick=()=>toast({icon:'upload',color:'acc',title:'Importar copia',body:'Selecciona un archivo .json (demo)'});
  $('#sysReset',v).querySelector('button').onclick=()=>confirmDlg({icon:'rotate-ccw',color:'err',title:'¿Restablecer de fábrica?',
    body:'Se borrarán: dock personalizado, tema, atajos y preferencias. Los archivos personales no se tocan.',onOk(){
      localStorage.removeItem('sanderosevo'); toast({icon:'check-c',color:'ok',title:'Ajustes restablecidos',body:'Reinicia la app para aplicar (demo).'}); }});
  $('#sysRestart',v).onclick=()=>confirmDlg({icon:'power',color:'warn',title:'¿Reiniciar SanderOS EVO?',
    body:'La aplicación se cerrará y volverá a la pantalla de arranque.',ok:'Reiniciar',cls:'primary',onOk(){ location.reload(); }});
}});
function sysDiag(){
  dialog({icon:'activity',color:'ok',title:'Diagnóstico del sistema',lg:true,body:`
  <div style="display:flex;flex-direction:column;gap:3px">
    ${[['Interfaz gráfica','ok','60 fps'],['Audio DSP ADI-1701','ok','Perfil activo'],['Bluetooth','ok','Activo'],['GPS','ok' ,'Fijado (demo)'],['Almacenamiento','warn','82% usado'],['OBD2',S.obd.state==='connected'?'ok':'dim',S.obd.state==='connected'?'Conectado':'Sin conectar'],['CANBUS','ok','XinPu · respondiendo']].map(d=>`
    <div class="setrow" style="cursor:default;pointer-events:none">
      <span class="sr-ic" style="background:var(--${d[1]==='ok'?'ok':d[1]==='warn'?'warn':'acc'}-soft);color:var(--${d[1]==='ok'?'ok':d[1]==='warn'?'warn':'tx-2'})">${ic(d[1]==='ok'?'check-c':d[1]==='warn'?'alert':'info',16)}</span>
      <div class="sr-tt"><div class="t">${d[0]}</div></div><div class="sr-ctl tx2" style="font-size:12px">${d[2]}</div>
    </div>`).join('')}
  </div>`,actions:[{label:'Listo',cls:'primary'}]});
}
function sysLogs(){
  dialog({icon:'file-log',color:'acc',title:'Registros del sistema',lg:true,body:`
  <div class="mono" style="font-size:11.5px;line-height:1.75;color:var(--tx-2);background:var(--bg-sunk);border-radius:10px;padding:14px 18px;box-shadow:inset 0 0 0 1px var(--line)">
    <div><span style="color:var(--tx-3)">08:02:11</span> <span style="color:var(--acc-ink)">UI</span> SanderOS EVO v2.4.1 iniciado (cold boot)</div>
    <div><span style="color:var(--tx-3)">08:02:12</span> <span style="color:var(--acc-ink)">BT</span> NX6856 vinculado · perfil A2DP activo</div>
    <div><span style="color:var(--tx-3)">08:02:14</span> <span style="color:var(--acc-ink)">CAN</span> XinPu handshake OK · keys 14</div>
    <div><span style="color:var(--tx-3)">08:02:15</span> <span style="color:var(--warn)">OBD</span> Adaptador KW906 no encontrado</div>
    <div><span style="color:var(--tx-3)">08:14:02</span> <span style="color:var(--ok)">OBD</span> KW906 conectado · CAN 11-bit 500k</div>
    <div><span style="color:var(--tx-3)">19:41:58</span> <span style="color:var(--acc-ink)">NAV</span> Intent → com.kartagps.navigator (geo:)</div>
  </div><div class="tx2" style="font-size:11px;margin-top:10px">${ic('info',12)} Últimas 6 entradas (demo). Registro completo en /Android/data/…/logs/</div>`,
  actions:[{label:'Copiar',cls:''},{label:'Cerrar',cls:'primary'}]});
}
function sysPerms(){
  dialog({icon:'key',color:'acc',title:'Permisos de Android',body:`
  <div style="display:flex;flex-direction:column;gap:3px">
    ${[['Contactos',S.phonePerm],['Ubicación (GPS)',S.gps.on],['Almacenamiento',true],['Bluetooth',true],['Teléfono',false]].map(p=>`
    <div class="setrow" style="cursor:default;pointer-events:none">
      <span class="sr-ic">${ic('key',16)}</span>
      <div class="sr-tt"><div class="t">${p[0]}</div></div>
      <div class="sr-ctl"><span class="badge ${p[1]?'ok':'dim'}">${p[1]?'Concedido':'No concedido'}</span></div>
    </div>`).join('')}
  </div>`,actions:[{label:'Cerrar',cls:'primary'}]});
}

/* ---------------- ACERCA DE ---------------- */
reg('about',{title:'Acerca de SanderOS EVO',group:'Sistema',render(v){
  v.innerHTML=`
  <div class="lib">
    ${setHead(v,'Acerca de','info','Identidad del producto')}
    <div class="lib-body" style="display:flex;gap:18px;align-items:flex-start">
      <div style="flex:0 0 300px;display:flex;flex-direction:column;gap:14px">
        <div class="card pad" style="text-align:center;padding:28px 20px">
          <div style="width:64px;height:64px;border-radius:19px;margin:0 auto 14px;display:grid;place-items:center;background:var(--bg-raise);box-shadow:inset 0 0 0 1px var(--line-acc),var(--glow-soft)"><span class="w-mark" style="height:42px"></span></div>
          <div class="wordmark" style="font-size:30px"><span class="w-sander">Sander</span><span class="w-os">OS</span><span class="w-evo">EVO</span></div>
          <div class="mono tx3" style="font-size:11px;letter-spacing:.28em;margin-top:8px">COCKPIT DIGITAL</div>
          <div class="tx2" style="font-size:12px;margin-top:14px;line-height:1.5">Entorno de infoentretenimiento personalizado<br>para Renault Sandero 2017</div>
        </div>
        <div class="card">
          <div class="kv"><span class="k">Versión</span><span class="v">2.4.1 · build 2609</span></div>
          <div class="kv"><span class="k">Android</span><span class="v">11 (API 30)</span></div>
          <div class="kv"><span class="k">Resolución</span><span class="v">1280 × 720 · landscape</span></div>
          <div class="kv"><span class="k">Densidad</span><span class="v">mdpi · 1×</span></div>
        </div>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;gap:12px">
        <div class="card">
          <div class="cap" style="margin-bottom:9px">Reglas de la marca</div>
          <div class="tx2" style="font-size:12.5px;line-height:1.6">
            <b style="color:var(--tx-1)">SanderOS</b> se escribe exactamente así — <b style="color:var(--tx-1)">nunca en cursiva</b>. «Sander» (Sansation regular) usa el color primario (plata claro en Midnight) y «<b style="color:var(--acc-ink)">OS</b>» (Sansation bold) el acento cian, con línea base común; el rombo de Renault va tintado según el tema.<br>
            <b class="wordmark" style="font-size:13.5px"><span class="w-sander">Sander</span><span class="w-os">OS</span><span class="w-evo">EVO</span></b> — «EVO» usa la fuente display <b style="color:var(--tx-1)">Designer</b> (Belina Studio) en bold sintético con gradiente cian→azul, distinguible sin competir con el wordmark principal.
          </div>
        </div>
        <div class="card">
          <div class="cap" style="margin-bottom:9px">Agradecimientos</div>
          <div class="tx2" style="font-size:12.5px;line-height:1.7">
            Tipografías: <b style="color:var(--tx-1)">Sansation</b> (wordmark e interfaz) y <b style="color:var(--tx-1)">JetBrains Mono</b> (datos) — Google Fonts, licencia SIL OFL; <b style="color:var(--tx-1)">Designer</b> (Belina Studio) para «EVO» — gratuita para uso personal.<br>
            Rombo de Renault: imagen oficial del propietario, tintada por tema.<br>
            Iconografía: sistema propio de trazo 1.8 inspirado en el estilo Lucide.<br>
            Renders del vehículo: visualizaciones originales generadas para este proyecto.
          </div>
        </div>
        <div class="card" style="display:flex;gap:12px;align-items:center">
          ${ic('info',18)}
          <div class="tx2" style="font-size:12px;line-height:1.5">SanderOS EVO es un proyecto personal de la comunidad. Renault y Sandero son marcas de sus respectivos propietarios; este proyecto no está afiliado ni respaldado por ellos.</div>
        </div>
      </div>
    </div>
  </div>`;
}});

/* ---------------- DESIGN SYSTEM ---------------- */
let _dsTab='tokens';
reg('design',{title:'Design System',group:'Sistema',render(v){
  const tabs=[['tokens','Tokens'],['type','Tipografía'],['space','Espaciado'],['comp','Componentes'],['icons','Iconografía'],['states','Estados']];
  const swatch=(n,h,varName)=>`<div class="tok"><div class="tsw" style="background:${h}"></div><div class="tt"><div class="n">${n}</div><div class="h">${h}</div><div class="h tx3">var(--${varName})</div></div></div>`;
  v.innerHTML=`
  <div class="lib">
    <div class="mod-head">
      <div class="mh-ic">${ic('palette',24)}</div>
      <div><div class="mh-t">Design System</div><div class="mh-s">Sistema de diseño Midnight Futuristic Cockpit · tema activo: ${resolvedTheme()==='light'?'Light':'Midnight'}</div></div>
    </div>
    <div class="tabs" style="padding:0 var(--s5)">
      ${tabs.map(t=>`<button class="tab ${_dsTab===t[0]?'on':''}" data-t="${t[0]}">${t[1]}</button>`).join('')}
    </div>
    <div class="ds-body">
    ${_dsTab==='tokens'?`
      <div>
        <div class="ds-sec-title">Color · Midnight</div>
        <div class="tok-grid" style="margin-top:12px">
          ${swatch('Midnight Navy','#0A192F','bg-base')}${swatch('Deep Navy','#071326','bg-deep')}${swatch('Panel Blue','#14243B','bg-panel')}${swatch('Electric Cyan','#00D2FF','acc')}${swatch('Nova Blue','#176BCE','acc-2')}${swatch('Light Silver','#F8FAFC','tx-1')}${swatch('Slate','#94A3B8','tx-2')}${swatch('Success Green','#16C784','ok')}${swatch('Warning Amber','#F5A623','warn')}${swatch('Alert Red','#EF4444','err')}
        </div>
      </div>
      <div>
        <div class="ds-sec-title">Color · Light</div>
        <div class="tok-grid" style="margin-top:12px">
          ${swatch('Soft Silver','#E9EEF5','bg-base')}${swatch('White','#FFFFFF','bg-panel')}${swatch('Cyan 700','#0276A6','acc-ink')}${swatch('Midnight Navy','#0A192F','tx-1')}${swatch('Slate 600','#51617A','tx-2')}
        </div>
        <div class="card" style="margin-top:12px;display:flex;gap:12px;align-items:center">${ic('info',17)}
        <div class="tx2" style="font-size:12px;line-height:1.45">El tema Light mantiene la misma estructura, geometría y componentes; solo cambian los tokens de color y sombras (sombras neutras suaves en lugar de glow).</div></div>
      </div>
      <div>
        <div class="ds-sec-title">Movimiento</div>
        <div class="tok-grid" style="margin-top:12px">
          <div class="tok"><div class="tt" style="padding:12px"><div class="n">--t-fast</div><div class="h">160 ms · cubic-bezier(.4,0,.2,1)</div><div class="h tx3" style="margin-top:6px">hover, press</div></div></div>
          <div class="tok"><div class="tt" style="padding:12px"><div class="n">--t-med</div><div class="h">280 ms · cubic-bezier(.22,.8,.24,1)</div><div class="h tx3" style="margin-top:6px">módulos, diálogos</div></div></div>
          <div class="tok"><div class="tt" style="padding:12px"><div class="n">--t-slow</div><div class="h">500 ms · ease-out largo</div><div class="h tx3" style="margin-top:6px">temas</div></div></div>
        </div>
      </div>`:''}
    ${_dsTab==='type'?`
      <div>
        <div class="ds-sec-title">Sansation — marca e interfaz</div>
        <div class="card" style="margin-top:12px;padding:20px 24px">
          <div class="wordmark" style="font-size:34px"><span class="w-mark"></span><span class="w-sander">Sander</span><span class="w-os">OS</span><span class="w-evo">EVO</span></div>
          <div class="brand-f" style="font-size:19px;font-weight:700;margin-top:10px">Titular de módulo · 19px/700</div>
          <div class="type-row"><span class="spec">brand/ui · 400–700<br>wordmark, H1 de módulos, interfaz</span><span class="brand-f bold" style="font-size:24px">Aa Bb 0123</span></div>
        </div>
      </div>
      <div>
        <div class="ds-sec-title">Designer — «EVO»</div>
        <div class="card" style="margin-top:12px;padding:20px 24px">
          <div style="font-family:var(--f-evo);font-weight:700;font-size:44px;letter-spacing:.06em;background:linear-gradient(115deg,#00D2FF 20%,#176BCE 90%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent">EVO</div>
          <div class="type-row"><span class="spec">display · solo «EVO»<br>bold sintético + gradiente</span><span class="tx2" style="font-size:12px;line-height:1.5">Belina Studio · la «E» se dibuja<br>como tres barras (Ξ), carácter propio</span></div>
        </div>
      </div>
      <div>
        <div class="ds-sec-title">JetBrains Mono — datos técnicos</div>
        <div class="card" style="margin-top:12px;padding:8px 24px">
          <div class="type-row"><span class="spec">mono/data · 16/600</span><span class="mono" style="font-size:16px;font-weight:600">72 km/h · 19:42 · 13.9 V</span></div>
          <div class="type-row"><span class="spec">mono/big · 56/700</span><span class="mono" style="font-size:56px;font-weight:700;line-height:1">72</span></div>
          <div class="type-row"><span class="spec">mono/code · 11.5/400</span><span class="mono tx2" style="font-size:11.5px">PID 0C · ISO 15765-4 · CAN 11-bit 500k</span></div>
        </div>
      </div>`:''}
    ${_dsTab==='space'?`
      <div>
        <div class="ds-sec-title">Escala de espaciado (base 4)</div>
        <div class="card" style="margin-top:12px;padding:20px 24px;display:flex;flex-direction:column;gap:10px">
          ${[['--s1','4','3'],['--s2','8','5'],['--s3','12','8'],['--s4','16','12'],['--s5','24','18'],['--s6','32','24'],['--s7','48','38']].map(s=>`
          <div style="display:flex;align-items:center;gap:16px">
            <span class="mono tx2" style="width:52px;font-size:12px">${s[0]}</span>
            <div style="height:${s[1]}px;width:${+s[1]*7}px;background:linear-gradient(90deg,var(--acc-2),var(--acc));border-radius:3px"></div>
            <span class="mono tx3" style="font-size:11px">${s[1]} px @1×</span>
            <span class="tx2" style="font-size:11.5px">${['icon gap','compact','chips','component padding','card padding','sections','screens'][['--s1','--s2','--s3','--s4','--s5','--s6','--s7'].indexOf(s[0])]}</span>
          </div>`).join('')}
        </div>
      </div>
      <div>
        <div class="ds-sec-title">Radios y rejilla</div>
        <div class="card" style="margin-top:12px;padding:20px 24px;display:flex;gap:22px;flex-wrap:wrap;align-items:center">
          ${[['--r-s','8'],['--r-m','12'],['--r-l','16'],['--r-xl','24']].map(r=>`
          <div style="text-align:center"><div style="width:74px;height:74px;background:var(--acc-soft);border:1.5px solid var(--line-acc);border-radius:${r[1]}px"></div><div class="mono tx2" style="font-size:11px;margin-top:7px">${r[0]} · ${r[1]}</div></div>`).join('')}
          <div style="flex:1;min-width:200px" class="tx2 t-xs">
            <div style="margin-bottom:6px"><b style="color:var(--tx-1)">Rejilla:</b> 1280 × 720 · márgenes laterales 32 px · columna central elástica</div>
            <div><b style="color:var(--tx-1)">Dock:</b> 7 tiles fluidos de ~160 × 96 px + indicador de páginas</div>
            <div><b style="color:var(--tx-1)">Touch:</b> objetivos ≥ 44 px, separación ≥ 8 px</div>
          </div>
        </div>
      </div>`:''}
    ${_dsTab==='comp'?`
      <div>
        <div class="ds-sec-title">Botones</div>
        <div class="card comp-demo" style="margin-top:12px">
          <button class="btn">Predeterminado</button>
          <button class="btn primary">Primario</button>
          <button class="btn danger">Peligro</button>
          <button class="btn ghost">Fantasma</button>
          <button class="btn" disabled>Deshabilitado</button>
          <button class="btn sm">Pequeño</button>
          <button class="btn lg primary">Grande</button>
          <button class="btn"><span class="sp"></span>Cargando…</button>
          <button class="ibtn solid">${ic('settings',19)}</button>
          <button class="ibtn acc">${ic('play',19)}</button>
        </div>
      </div>
      <div>
        <div class="ds-sec-title">Controles</div>
        <div class="card comp-demo" style="margin-top:12px">
          <div style="display:flex;gap:18px;align-items:center">
            <div class="sw on" id="dsSw1"></div><div class="sw" id="dsSw2"></div>
            <span class="tx2" style="font-size:12px">activo / inactivo</span>
          </div>
          <div style="display:flex;gap:8px;align-items:center;width:340px">${ic('volume-1',17)}<input type="range" class="sld" min="0" max="100" value="62" style="--p:62%" oninput="this.style.setProperty('--p',this.value+'%')">${ic('volume',17)}</div>
          <div class="seg"><button class="sg">Off</button><button class="sg on c">On</button><button class="sg">Auto</button></div>
          <div class="search" style="max-width:300px"><span class="s-ic">${ic('search',15)}</span><input class="inp" style="height:40px" placeholder="Buscar…"></div>
          <div class="sel" style="width:200px"><select><option>Selector dropdown</option></select></div>
          <button class="btn" id="dsDlg">Abrir diálogo…</button>
          <button class="btn" id="dsToast">Probar toast</button>
        </div>
      </div>
      <div>
        <div class="ds-sec-title">Indicadores</div>
        <div class="card comp-demo" style="margin-top:12px">
          <span class="badge ok"><span class="dot"></span>Operativo</span>
          <span class="badge warn"><span class="dot"></span>Atención</span>
          <span class="badge err"><span class="dot"></span>Error</span>
          <span class="badge acc">Info</span>
          <span class="badge dim">Inactivo</span>
          <span class="demo-chip">Demo</span>
          <div class="prog" style="width:220px"><i style="width:64%"></i></div>
          <span class="drv-state ok">${ic('pin',13)} GPS activo</span>
          <span class="drv-state warn">${ic('alert',13)} Aviso</span>
          <span class="drv-state err">${ic('x',13)} Sin señal</span>
          <span class="dtc-code">P0300</span>
        </div>
      </div>
      <div>
        <div class="ds-sec-title">Filas y tarjetas</div>
        <div style="margin-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="card" style="padding:6px 8px">
            <div class="setrow" style="cursor:default"><span class="sr-ic">${ic('moon',17)}</span><div class="sr-tt"><div class="t">Fila de ajuste</div><div class="s">etiqueta + descripción + control</div></div><div class="sr-ctl"><div class="sw on"></div></div></div>
            <div class="row"><span class="r-ic img"><img src="${IMG.cover_piano}"></span><div class="r-tt"><div class="t">Fila multimedia</div><div class="s">portada · título · metadato</div></div><div class="r-en">${ic('play',16)}</div></div>
          </div>
          <div class="card" style="display:flex;flex-direction:column;gap:10px;align-items:center;justify-content:center">
            <div class="gauge" data-gauge="0C" style="padding:10px">
              <div class="g-wrap" style="width:104px;height:104px"><svg viewBox="0 0 200 200">
                <circle class="g-track" cx="100" cy="100" r="84" stroke-dasharray="${2*Math.PI*84*.75}"/>
                <circle class="g-val" cx="100" cy="100" r="84" stroke-dasharray="${2*Math.PI*84*.75}" stroke-dashoffset="${2*Math.PI*84*.75*.3}"/></svg>
                <div class="g-num"><span class="n" style="font-size:22px">1180</span><span class="u">RPM</span></div></div>
              <div class="g-lb">Gauge circular</div>
            </div>
          </div>
        </div>
      </div>`:''}
    ${_dsTab==='icons'?`
      <div>
        <div class="ds-sec-title">Sistema de iconos · trazo 1.8 · 24 px</div>
        <div class="icon-grid" style="margin-top:12px">
          ${['car-front','compass','music','film','folder','car','grid','gauge','phone','map','settings','bell','wifi','bluetooth','pin','play','pause','skip-f','skip-b','shuffle','repeat','heart','volume','search','check','x','plus','alert','info','shield','wrench','activity','zap','battery','thermo','engine','sun','moon','sun-moon','cloud','droplet','wind','hard-drive','usb','file-img','file-aud','file-vid','file-txt','file-zip','copy','trash','pencil','share','download','upload','home','clock','star','rows','sort','filter','eye','users','user','globe','palette','layout','camera','cpu','sliders','languages','history','image','rotate-cw','rotate-ccw','zoom-in','zoom-out','maximize','power','refresh','save','package','ext','disc','cc','key','cast'].map(n=>`
          <div class="icon-cell"><span class="in">${ic(n,26)}</span><span class="nm">${n}</span></div>`).join('')}
        </div>
      </div>`:''}
    ${_dsTab==='states'?`
      <div>
        <div class="ds-sec-title">Estados del sistema</div>
        <div class="state-demo" style="margin-top:12px">
          <div class="card"><div class="state-blank" style="padding:22px"><div class="sb-ic" style="width:56px;height:56px;border-radius:16px">${ic('folder',24)}</div><div class="t" style="font-size:15px">Vacío</div><div class="s" style="font-size:12px">Sin elementos todavía</div></div></div>
          <div class="card"><div class="state-blank err" style="padding:22px"><div class="sb-ic" style="width:56px;height:56px;border-radius:16px">${ic('alert',24)}</div><div class="t" style="font-size:15px">Error</div><div class="s" style="font-size:12px">No se pudo completar</div></div></div>
          <div class="card"><div class="state-blank warn" style="padding:22px"><div class="sb-ic" style="width:56px;height:56px;border-radius:16px">${ic('plug',24)}</div><div class="t" style="font-size:15px">Desconectado</div><div class="s" style="font-size:12px">Conecta el adaptador OBD2</div></div></div>
          <div class="card" style="display:grid;place-items:center;padding:22px"><div style="display:flex;flex-direction:column;align-items:center;gap:12px"><div class="spin"></div><span class="tx2" style="font-size:12px">Cargando…</span></div></div>
          <div class="card" style="display:grid;place-items:center;padding:22px"><div style="display:flex;flex-direction:column;align-items:center;gap:10px"><span class="badge warn"><span class="dot"></span>Conectando…</span><span class="tx2" style="font-size:12px">Búsqueda de KW906</span></div></div>
          <div class="card" style="display:grid;place-items:center;padding:22px"><div style="display:flex;flex-direction:column;align-items:center;gap:10px"><span class="badge dim">Parámetro no soportado</span><span class="tx2" style="font-size:12px">El PID no está expuesto</span></div></div>
        </div>
      </div>
      <div>
        <div class="ds-sec-title">Estados de componentes</div>
        <div class="card comp-demo" style="margin-top:12px">
          <button class="dock-tile on" style="width:130px;height:76px;flex:none"><span class="dt-ic">${ic('car-front',26)}</span><span class="dt-lb">Activo</span></button>
          <button class="dock-tile" style="width:130px;height:76px;flex:none"><span class="dt-ic">${ic('music',26)}</span><span class="dt-lb">Normal</span></button>
          <button class="dock-tile" style="width:130px;height:76px;flex:none;opacity:.45;pointer-events:none"><span class="dt-ic">${ic('film',26)}</span><span class="dt-lb">Deshabilitado</span></button>
          <div class="row on"><span class="r-ic">${ic('music',16)}</span><div class="r-tt"><div class="t">Fila seleccionada</div></div></div>
          <div class="row"><span class="r-ic">${ic('file-txt',16)}</span><div class="r-tt"><div class="t">Fila normal</div></div></div>
          <div class="row" style="opacity:.45;pointer-events:none"><span class="r-ic">${ic('file-zip',16)}</span><div class="r-tt"><div class="t">Fila deshabilitada</div></div></div>
        </div>
      </div>`:''}
    </div>
  </div>`;
  $$('.tab',v).forEach(t=>t.onclick=()=>{_dsTab=t.dataset.t;go('design');});
  const s1=$('#dsSw1',v); if(s1) s1.onclick=()=>s1.classList.toggle('on');
  const s2=$('#dsSw2',v); if(s2) s2.onclick=()=>s2.classList.toggle('on');
  const dg=$('#dsDlg',v); if(dg) dg.onclick=()=>dialog({icon:'info',color:'acc',title:'Diálogo de ejemplo',
    body:'Diálogo de confirmación estándar con <b>acciones a la derecha</b>. El fondo se atenúa y la tarjeta entra con fade + translateY.',
    actions:[{label:'Cancelar',cls:'ghost'},{label:'Confirmar',cls:'primary'}]});
  const tt=$('#dsToast',v); if(tt) tt.onclick=()=>toast({icon:'bell',color:'acc',title:'Notificación sutil',body:'Aparece 4 s sin bloquear la interfaz.'});
}});
