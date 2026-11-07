/* ============================================================
   SanderOS EVO — Pantallas: Vista de Conducción + Navegación
   ============================================================ */

/* ---------------- VISTA DE CONDUCCIÓN ---------------- */
reg('driving',{title:'Vista de Conducción',group:'Conducción',render(v){
  const sp=speedSource();
  const moving=S.drive.demo;
  const navDemo=S.nav.active==='demo', navExt=S.nav.active==='external';
  const prov=NAV_PROVIDERS.find(p=>p.id===S.nav.provider);
  v.innerHTML=`
  <div class="drv ${moving?'road-on':'hero-still'}" style="--road-t:${Math.max(.32,1.05-S.drive.speed/110)}s">
    <div class="drv-hero"><img src="${IMG.hero}" alt="Renault Sandero 2017 en carretera al anochecer"></div>
    <div class="drv-road"><div class="rpaint"></div><div class="rcenter"></div><div class="rside l"></div><div class="rside r"></div></div>
    <div class="drv-shade"></div>

    <div class="drv-speed ${sp==null?'':''}">
      <svg viewBox="0 0 200 200">
        <defs><linearGradient id="gaugeGrad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stop-color="#176BCE"/><stop offset="1" stop-color="#00D2FF"/></linearGradient></defs>
        <circle class="g-track" cx="100" cy="100" r="84" stroke-dasharray="${2*Math.PI*84*.75}" stroke-dashoffset="0"/>
        <circle class="g-val" id="dvArc" cx="100" cy="100" r="84" stroke-dasharray="${2*Math.PI*84*.75}" stroke-dashoffset="${2*Math.PI*84*.75*(1-Math.min(.999,(sp&&sp.v||0)/220))}"/>
      </svg>
      <div class="g-num">
        <div class="n" id="dvSpeed">${sp&&sp.v!=null?Math.round(sp.v):'<span class="dim">—</span>'}</div>
        <div class="u">KM/H</div>
        <div class="src ${sp==null?'err':''}">${ic(sp?'pin':'pin',11)} ${sp? (sp.demo?'GPS · DEMO':'GPS') : 'SIN FUENTE'}</div>
      </div>
    </div>

    ${navDemo?`
    <div class="drv-nav">
      <div class="n-ic">${ic('arr-r',30)}</div>
      <div class="n-tt">
        <div class="d"><span class="k">2.8</span><span class="u">km</span></div>
        <div class="st">Av. Libertador</div>
        <div class="n-prov">${ic('compass',12)} ${esc(prov.name)} · <span class="demo-chip" style="padding:1px 6px;font-size:9px">DEMO</span></div>
      </div>
    </div>`:navExt?`
    <div class="drv-nav inactive">
      <div class="n-ic">${ic('ext',20)}</div>
      <div class="n-tt"><div class="d"><span class="k">${esc(prov.name)}</span></div>
      <div class="st">Navegación externa en curso</div></div>
    </div>`:`
    <div class="drv-nav inactive">
      <div class="n-ic">${ic('compass',20)}</div>
      <div class="n-tt"><div class="d"><span class="k">Navegación inactiva</span></div>
      <div class="st">Abre un destino desde el módulo Navegación</div></div>
    </div>`}

    <div class="drv-states">
      <span class="drv-state ${S.gps.on||S.drive.demo?'ok':''}">${ic(S.gps.on||S.drive.demo?'pin':'pin',13)} GPS ${S.gps.on?'activo':S.drive.demo?'demo':'sin señal'}</span>
      <span class="drv-state ${S.obd.state==='connected'?'ok':S.obd.state==='connecting'?'warn':''}">${ic('gauge',13)} OBD2 ${S.obd.state==='connected'?'conectado':S.obd.state==='connecting'?'conectando':'desconectado'}</span>
      ${moving?`<span class="drv-state warn">${ic('alert',13)} Datos de demostración</span>`:''}
    </div>

    <div class="drv-demo">
      <span class="lb">DEMO</span>
      <button class="dbtn play ${moving?'on':''}" id="dmDrive">${moving?ic('pause',13)+' Detener':ic('play',13)+' Simular marcha'}</button>
      <button class="dbtn ${S.gps.on?'on':''}" id="dmGps">${ic('pin',13)} GPS</button>
      <button class="dbtn ${S.obd.state==='connected'?'on':''}" id="dmObd">${ic('gauge',13)} OBD2</button>
      <button class="dbtn ${navDemo?'on':''}" id="dmNav">${ic('compass',13)} Nav</button>
    </div>

    ${!sp&&!moving?`<div class="drv-banner on">${ic('alert',15)} Vehículo detenido · sin fuente de velocidad válida</div>`:''}
  </div>`;
  v.querySelector('#dmDrive').onclick=()=>setDrive(!S.drive.demo);
  v.querySelector('#dmGps').onclick=()=>{ S.gps.on=!S.gps.on; go('driving'); renderBottombar();
    if(S.gps.on) toast({icon:'pin',color:'acc',title:'GPS activado',body:'Señal adquirida (simulada · DEMO)'}); };
  v.querySelector('#dmObd').onclick=()=>{ if(S.obd.state==='connected') obdDisconnect(); else obdConnect(); };
  v.querySelector('#dmNav').onclick=()=>{ S.nav.active=S.nav.active==='demo'?null:'demo'; go('driving'); };
}});

/* ---------------- NAVEGACIÓN (módulo) ---------------- */
reg('nav',{title:'Navegación',group:'Navegación',render(v){
  const prov=NAV_PROVIDERS.find(p=>p.id===S.nav.provider);
  const installed=NAV_PROVIDERS.filter(p=>p.installed&&p.id!=='other');
  v.innerHTML=`
  <div class="lib">
    <div class="mod-head">
      <div class="mh-ic">${ic('compass',24)}</div>
      <div><div class="mh-t">Navegación</div><div class="mh-s">Proveedor externo · ${esc(prov.name)} es tu app predeterminada</div></div>
      <div class="mh-act"><button class="btn sm" id="navSel">${ic('chev-r',14)} Cambiar proveedor</button></div>
    </div>
    <div class="nav-mod">
      <div class="nav-main">
        <div class="nav-hero">
          <div class="nav-prov-big">
            <div class="pi">${ic('compass',32)}</div>
            <div>
              <div style="font-family:var(--f-brand);font-weight:800;font-size:22px">${esc(prov.name)}</div>
              <div class="tx2 t-s">${esc(prov.desc)}</div>
              <div style="margin-top:7px;display:flex;gap:8px">
                <span class="badge ok"><span class="dot"></span>Instalada</span>
                <span class="badge dim">v5.8.2</span>
              </div>
            </div>
            <button class="btn primary lg" style="margin-left:auto" id="navOpen">${ic('ext',18)} Abrir navegación</button>
          </div>
          <div class="nav-dest">
            <div class="search" style="max-width:none;flex:1">
              <span class="s-ic">${ic('search',17)}</span>
              <input class="inp" id="navDest" placeholder="¿A dónde vas? Escribe un destino…" value="">
            </div>
            <button class="btn primary" id="navSend">${ic('arr-r',16)} Enviar destino</button>
          </div>
          <div style="display:flex;align-items:center;gap:10px;margin-top:12px" class="tx2 t-xs">
            ${ic('info',14)} El destino se transfiere mediante intents de Android (geo:/deeplink). La navegación ocurre en la app externa.
          </div>
        </div>
        <div class="nav-quick">
          ${NAV_DESTS.map(d=>`<button class="q"><span class="qi">${ic(d.icon,18)}</span><span class="qt">${esc(d.label)}</span><span class="tx2" style="font-size:11px">${esc(d.addr)}</span></button>`).join('')}
        </div>
      </div>
      <div class="nav-side">
        <div class="card" style="flex:0 0 auto">
          <div class="cap" style="margin-bottom:9px">Apps de navegación instaladas</div>
          ${installed.map(p=>`
          <div class="setrow" data-prov="${p.id}" style="padding:9px 10px;min-height:48px">
            <span class="sr-ic" style="width:34px;height:34px;background:var(--acc-soft);color:var(--acc-ink)">${ic('compass',17)}</span>
            <div class="sr-tt"><div class="t" style="font-size:13.5px">${esc(p.name)}</div><div class="s">${p.def?'Predeterminada':'Instalada'}</div></div>
            <div class="sr-ctl">${p.id===S.nav.provider?`<span style="color:var(--acc-ink)">${ic('check-c',20)}</span>`:ic('chev-r',18)}</div>
          </div>`).join('')}
          <div class="setrow" style="padding:9px 10px;min-height:48px;opacity:.55">
            <span class="sr-ic" style="width:34px;height:34px">${ic('map',17)}</span>
            <div class="sr-tt"><div class="t" style="font-size:13.5px">Google Maps</div><div class="s">No instalada</div></div>
            <div class="sr-ctl">${ic('download',18)}</div>
          </div>
        </div>
        <button class="card click" id="navPrefs" style="display:flex;align-items:center;gap:12px">
          <span class="sr-ic" style="width:40px;height:40px;border-radius:11px;background:var(--bg-raise);color:var(--tx-2);display:grid;place-items:center">${ic('sliders',19)}</span>
          <div style="flex:1"><div style="font-weight:700;font-size:14px">Preferencias de navegación</div><div class="tx2" style="font-size:12px">Unidades, avisos, comportamiento</div></div>
          ${ic('chev-r',18)}
        </button>
      </div>
    </div>
  </div>`;
  $$('.setrow[data-prov]',v).forEach(r=>r.onclick=()=>{ S.nav.provider=r.dataset.prov; save(); go('nav'); });
  $('#navOpen',v).onclick=()=>{
    S.nav.active='external'; go('nav');
    toast({icon:'ext',color:'acc',title:'Abriendo '+prov.name,body:'Cambio de aplicación… (simulado en el prototipo)'});
    setTimeout(()=>{ if(S.screen==='nav') go('driving'); },900);
  };
  $('#navSend',v).onclick=()=>{
    const dest=$('#navDest',v).value.trim();
    if(!dest){ dialog({icon:'alert',color:'warn',title:'Escribe un destino',body:'Introduce una dirección o lugar para transferirlo a <b>'+esc(prov.name)+'</b>.',actions:[{label:'Entendido',cls:'primary'}]}); return; }
    dialog({icon:'ext',color:'acc',title:'Enviar a '+prov.name,body:`Se abrirá <b>${esc(prov.name)}</b> con el destino:<br><span class="kbd">${esc(dest)}</span><br><br>La navegación continuará en la aplicación externa.`,
      actions:[{label:'Cancelar',cls:'ghost'},{label:'Abrir navegación',cls:'primary',onClick(){
        S.nav.active='external';
        toast({icon:'ext',color:'acc',title:'Destino transferido',body:esc(dest)+' · '+prov.name});
        setTimeout(()=>go('driving'),600);
      }}]});
  };
  $$('.q',v).forEach((q,i)=>q.onclick=()=>{
    const d=NAV_DESTS[i];
    dialog({icon:d.icon,color:'acc',title:'Navegar a '+d.label,body:`Destino: <b>${esc(d.addr)}</b><br>Proveedor: <b>${esc(prov.name)}</b>`,actions:[{label:'Cancelar',cls:'ghost'},{label:'Abrir navegación',cls:'primary',onClick(){ S.nav.active='external'; setTimeout(()=>go('driving'),400); toast({icon:'ext',color:'acc',title:'Navegando a '+d.label,body:prov.name+' · destino transferido'}); }}]});
  });
  $('#navSel',v).onclick=()=>go('nav-select');
  $('#navPrefs',v).onclick=()=>go('settings-nav');
}});

/* ---------------- SELECTOR DE PROVEEDORES ---------------- */
reg('nav-select',{title:'Proveedor de navegación',group:'Navegación',render(v){
  v.innerHTML=`
  <div class="lib">
    <div class="mod-head">
      <button class="ibtn" id="back">${ic('arr-l',20)}</button>
      <div class="mh-ic">${ic('compass',24)}</div>
      <div><div class="mh-t">Aplicación de navegación</div><div class="mh-s">Selecciona la app que se abrirá de forma predeterminada</div></div>
    </div>
    <div class="lib-body" style="display:flex;flex-direction:column;gap:6px">
      ${NAV_PROVIDERS.map(p=>`
      <div class="setrow ${p.id===S.nav.provider?'on':''}" data-p="${p.id}" style="${p.installed?'':'opacity:.6'}">
        <span class="sr-ic" style="background:var(--acc-soft);color:var(--acc-ink)">${ic(p.id==='other'?'grid':'compass',19)}</span>
        <div class="sr-tt"><div class="t">${esc(p.name)}</div><div class="s">${p.installed?esc(p.desc):'No instalada en este dispositivo'}</div></div>
        <div class="sr-ctl">${p.id===S.nav.provider?`<span class="badge acc">Predeterminada</span>`:p.installed?ic('chev-r',18):`<span class="badge dim">No instalada</span>`}</div>
      </div>`).join('')}
      <div class="card" style="margin-top:10px;display:flex;gap:12px;align-items:center">
        <span style="color:var(--warn);flex:0 0 auto">${ic('info',20)}</span>
        <div class="tx2 t-xs" style="line-height:1.5">SanderOS EVO no incrusta mapas: detecta las apps instaladas y les transfiere el destino mediante intents de Android. Ninguna vista de mapa falsa se muestra como propia.</div>
      </div>
    </div>
  </div>`;
  $('#back',v).onclick=()=>go('nav');
  $$('.setrow[data-p]',v).forEach(r=>r.onclick=()=>{
    const p=NAV_PROVIDERS.find(x=>x.id===r.dataset.p);
    if(!p.installed){
      dialog({icon:'download',color:'warn',title:p.name+' no está instalada',body:'Instálala desde la tienda de aplicaciones del sistema y volverá a aparecer aquí automáticamente.',actions:[{label:'Cerrar',cls:'ghost'}]});
      return;
    }
    S.nav.provider=p.id; save(); go('nav-select');
    toast({icon:'check-c',color:'ok',title:p.name+' es ahora tu proveedor',body:'Se recordará tu elección.'});
  });
}});
