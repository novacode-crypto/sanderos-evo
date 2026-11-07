/* ============================================================
   SanderOS EVO — Arranque: splash, primera configuración, init
   ============================================================ */
let _wlStep=0, _wlLang='es', _wlTheme='auto';

function renderSplash(){
  const sp=$('#splash');
  sp.innerHTML=`
  <div class="sp-road"></div>
  <div class="sp-mark">
    <div class="sp-word">Sander<span class="os">OS</span></div>
    <div class="sp-evo">EVO</div>
    <div class="sp-sub">Automotive Infotainment</div>
  </div>
  <div class="sp-load">
    <div class="sp-bar"><i id="spBar"></i></div>
    <div class="sp-status" id="spStatus">Inicializando interfaz…</div>
  </div>
  <div class="sp-ver">v2.4.1 · build 2609 · Android 11</div>`;
}
function bootSequence(done){
  renderSplash();
  const sp=$('#splash'); sp.classList.add('on');
  const steps=[['Inicializando interfaz…',16],['Cargando módulos del sistema…',38],['Vinculando CANBUS XinPu…',58],['Preparando servicios multimedia…',78],['Listo',100]];
  let i=0;
  const next=()=>{
    if(i<steps.length){
      $('#spBar').style.width=steps[i][1]+'%';
      $('#spStatus').textContent=steps[i][0];
      i++; setTimeout(next, 340+Math.random()*260);
    } else {
      setTimeout(()=>{ sp.classList.remove('on'); done(); }, 420);
    }
  };
  setTimeout(next,300);
  sp.onclick=()=>{ sp.classList.remove('on'); done(); };
}

function renderWelcome(){
  const wl=$('#welcome');
  const langOpts=[['es','Español','Interfaz completa en español',true],['en','English','Full interface in English',false],['pt','Português','Interface em português',false]];
  const themeOpts=[['midnight','Midnight','Nave profundo · cian eléctrico','moon'],['light','Light','Plata diáfano · navy','sun'],['auto','Automático','Según horario día/noche','sun-moon']];
  wl.innerHTML=`
  <div class="welcome">
    <div class="wl-top">
      <div class="wordmark" style="font-size:34px"><span class="w-mark"></span><span class="w-sander">Sander</span><span class="w-os">OS</span><span class="w-evo">EVO</span></div>
    </div>
    <div class="wl-body">
      <div class="wl-card">
        ${_wlStep===0?`
        <div class="wl-ic">${ic('car-front',44)}</div>
        <div class="wl-t">Bienvenido a tu cockpit</div>
        <div class="wl-s">Un entorno de infoentretenimiento diseñado exclusivamente para tu <b>Renault Sandero 2017</b>: conducción, navegación, música, vídeos, archivos y diagnóstico OBD2 en un solo sistema.</div>
        <div class="wl-opts">
          ${langOpts.map(o=>`<button class="wl-opt ${_wlLang===o[0]?'on':''}" data-lang="${o[0]}">
            <span class="oi">${ic('languages',24)}</span><span class="ot">${o[1]}</span><span class="os2">${o[2]}</span></button>`).join('')}
        </div>`:''}
        ${_wlStep===1?`
        <div class="wl-ic">${ic('palette',44)}</div>
        <div class="wl-t">Elige tu tema</div>
        <div class="wl-s">Ambos temas comparten la misma estructura y componentes. Puedes cambiarlo más tarde en Ajustes → Apariencia.</div>
        <div class="wl-opts">
          ${themeOpts.map(t=>`<button class="wl-opt ${_wlTheme===t[0]?'on':''}" data-theme="${t[0]}">
            <span class="oi">${ic(t[3],24)}</span><span class="ot">${t[1]}</span><span class="os2">${t[2]}</span></button>`).join('')}
        </div>`:''}
        ${_wlStep===2?`
        <div class="wl-ic">${ic('layout',44)}</div>
        <div class="wl-t">Tu dock personalizable</div>
        <div class="wl-s">Arranca siempre en la <b>Vista de Conducción</b>. Añade, quita y reordena módulos desde el Centro de Apps o Ajustes → Dashboard.</div>
        <div style="display:flex;gap:9px;justify-content:center;margin-top:6px">
          ${DOCK_DEFAULT.map(m=>`<div style="width:108px;padding:12px 6px;border-radius:14px;background:var(--bg-panel);box-shadow:inset 0 0 0 1px var(--line-soft);display:flex;flex-direction:column;align-items:center;gap:7px">
            <span style="color:var(--tx-2)">${ic(MODULES[m].icon,24)}</span>
            <span class="tx2" style="font-size:10px;font-weight:600;text-align:center;line-height:1.15">${MODULES[m].label}</span></div>`).join('')}
        </div>`:''}
      </div>
    </div>
    <div class="wl-foot">
      <button class="btn ghost" id="wlBack" ${_wlStep===0?'style="visibility:hidden"':''}>${ic('arr-l',16)} Atrás</button>
      <div class="wl-dots">${[0,1,2].map(i=>`<span class="d ${i===_wlStep?'on':''}"></span>`).join('')}</div>
      <button class="btn primary lg" id="wlNext">${_wlStep===2?ic('car-front',18)+' Empezar a conducir':'Siguiente '+ic('arr-r',16)}</button>
    </div>
  </div>`;
  $$('.wl-opt[data-lang]',wl).forEach(b=>b.onclick=()=>{_wlLang=b.dataset.lang;renderWelcome();});
  $$('.wl-opt[data-theme]',wl).forEach(b=>b.onclick=()=>{_wlTheme=b.dataset.theme;renderWelcome();});
  $('#wlBack',wl).onclick=()=>{_wlStep=Math.max(0,_wlStep-1);renderWelcome();};
  $('#wlNext',wl).onclick=()=>{
    if(_wlStep<2){ _wlStep++; renderWelcome(); return; }
    S.theme=_wlTheme; S.onboarded=true; save(); applyTheme();
    wl.classList.remove('on');
    go('driving');
    toast({icon:'check-c',color:'ok',title:'Configuración completada',body:'Tu SanderOS EVO está listo. Personaliza el dock cuando quieras.'});
  };
}

/* ---------------- Init ---------------- */
function init(){
  load();
  S.usb=!!S.usb;
  applyTheme(false);
  renderTopbar();
  renderDock();
  renderBottombar();
  buildToolbar();
  fitScale();
  bootSequence(()=>{
    if(!S.onboarded){ renderWelcome(); $('#welcome').classList.add('on'); }
    else go('driving');
  });
}
init();
