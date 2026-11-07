/* ============================================================
   SanderOS EVO — Pantallas: Audio (dashboard, Now Playing,
   biblioteca, ajustes, ecualizador) y Vídeo (biblioteca,
   reproductor fullscreen, seguridad de conducción)
   ============================================================ */

/* ---------------- AUDIO DASHBOARD ---------------- */
reg('audio',{title:'Audio',group:'Audio',render(v){
  const t=curTrack();
  v.innerHTML=`
  <div class="au-dash">
    <div class="au-now">
      <div class="au-cover-lg">
        <img src="${IMG[t.cover]}" alt="">
        <button class="pl" id="dashCoverPlay"><span style="width:58px;height:58px;border-radius:50%;background:rgba(0,210,255,.92);color:#04202E;display:grid;place-items:center;box-shadow:0 0 30px rgba(0,210,255,.55)">${ic('play',26)}</span></button>
      </div>
      <div>
        <div style="font-family:var(--f-brand);font-weight:800;font-size:20px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(t.title)}</div>
        <div class="tx2 t-s">${esc(t.artist)} · ${esc(t.album)}</div>
      </div>
      <div class="au-prog"><span id="dashPos">${fmtDur(S.media.pos)}</span><div class="prog thin"><i id="dashBar" style="width:${S.media.pos/t.dur*100}%"></i></div><span>${fmtDur(t.dur)}</span></div>
      <div class="au-ctrls">
        <button class="c" id="dShuf" title="Aleatorio" style="color:${S.media.shuffle?'var(--acc-ink)':'inherit'}">${ic('shuffle',19)}</button>
        <button class="c" id="dPrev">${ic('skip-b',21)}</button>
        <button class="c main" id="dPlay">${ic(S.media.playing?'pause':'play',26)}</button>
        <button class="c" id="dNext">${ic('skip-f',21)}</button>
        <button class="c" id="dRep" title="Repetir" style="color:${S.media.repeat!=='off'?'var(--acc-ink)':'inherit'}">${ic(S.media.repeat==='one'?'repeat-1':'repeat',19)}</button>
      </div>
      <div class="au-vol">${ic('volume-1',18)}<input type="range" class="sld" min="0" max="100" value="${S.media.vol}" style="--p:${S.media.vol}%" id="dVol">${ic('volume',18)}</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;min-width:0;overflow:hidden">
      <div class="lib-tools" style="padding:0 0 2px">
        <button class="chip on">${ic('history',14)} Recientes</button>
        <button class="chip" id="goLib">${ic('list-music',14)} Toda la biblioteca</button>
        <button class="chip" id="goEq">${ic('sliders',14)} Ecualizador</button>
        <button class="chip" id="goASet">${ic('settings',14)} Ajustes</button>
      </div>
      <div class="card" style="flex:0 0 auto;padding:12px 14px">
        <div class="cap" style="margin-bottom:8px">Reproduciendo ahora · cola</div>
        <div style="display:flex;flex-direction:column;gap:2px;max-height:168px;overflow-y:auto">
          ${S.media.queue.slice(0,7).map((id,i)=>{const tr=TRACKS.find(x=>x.id===id);const cur=tr.id===t.id;return `
          <div class="row ${cur?'playing on':''}" data-t="${tr.id}">
            <span class="r-ic" style="width:34px;height:34px;border-radius:8px;overflow:hidden"><img src="${IMG[tr.cover]}" style="width:100%;height:100%;object-fit:cover"></span>
            <div class="r-tt"><div class="t">${cur?ic('volume',12)+' ':''}${esc(tr.title)}</div><div class="s">${esc(tr.artist)}</div></div>
            <div class="r-en mono" style="font-size:11px">${fmtDur(tr.dur)}</div>
          </div>`;}).join('')}
        </div>
      </div>
      <div class="grid g-auto-4" style="grid-template-columns:repeat(4,1fr);flex:1;align-content:start">
        ${PLAYLISTS.map((p,i)=>`
        <button class="card click" style="display:flex;gap:12px;align-items:center;padding:12px;text-align:left" data-pl="${i}">
          <img src="${IMG[p.cover]}" style="width:52px;height:52px;border-radius:10px;object-fit:cover">
          <div style="min-width:0"><div style="font-weight:700;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(p.name)}</div><div class="tx2" style="font-size:11.5px">${p.n} pistas · ${p.dur}</div></div>
        </button>`).join('')}
      </div>
    </div>
  </div>`;
  $('#dPlay',v).onclick=mediaToggle; $('#dPrev',v).onclick=()=>mediaNext(-1); $('#dNext',v).onclick=()=>mediaNext(1);
  $('#dShuf',v).onclick=e=>{S.media.shuffle=!S.media.shuffle; e.currentTarget.style.color=S.media.shuffle?'var(--acc-ink)':'inherit';};
  $('#dRep',v).onclick=e=>{S.media.repeat=S.media.repeat==='off'?'all':S.media.repeat==='all'?'one':'off'; e.currentTarget.innerHTML=ic(S.media.repeat==='one'?'repeat-1':'repeat',19); e.currentTarget.style.color=S.media.repeat!=='off'?'var(--acc-ink)':'inherit';};
  $('#dVol',v).oninput=e=>{S.media.vol=+e.target.value;e.target.style.setProperty('--p',S.media.vol+'%');save();};
  $('#dashCoverPlay',v).onclick=()=>go('nowplaying');
  $$('.row[data-t]',v).forEach(r=>r.onclick=()=>{S.media.idx=TRACKS.findIndex(x=>x.id===+r.dataset.t);S.media.pos=0;S.media.playing=true;renderBottombar();go('audio');});
  $$('button[data-pl]',v).forEach(b=>b.onclick=()=>go('library'));
  $('#goLib',v).onclick=()=>go('library');
  $('#goEq',v).onclick=()=>go('equalizer');
  $('#goASet',v).onclick=()=>go('audio-settings');
}});

/* ---------------- NOW PLAYING ---------------- */
reg('nowplaying',{title:'Reproduciendo',group:'Audio',render(v){
  const t=curTrack();
  v.innerHTML=`
  <div class="np">
    <div class="np-left">
      <div class="np-cover"><img src="${IMG[t.cover]}" alt=""><span class="np-tag demo-chip">Contenido demo</span></div>
    </div>
    <div class="np-right">
      <div class="np-title">${esc(t.title)}</div>
      <div class="np-artist">${[t.artist,t.album,t.year].filter(Boolean).map(esc).join(' · ')}</div>
      <div class="au-prog" style="margin-top:2px"><span id="npPos">${fmtDur(S.media.pos)}</span><div class="prog thin"><i id="npBar" style="width:${S.media.pos/t.dur*100}%"></i></div><span>${fmtDur(t.dur)}</span></div>
      <div class="au-ctrls">
        <button class="c" id="nShuf" style="color:${S.media.shuffle?'var(--acc-ink)':'inherit'}">${ic('shuffle',20)}</button>
        <button class="c" id="nPrev">${ic('skip-b',22)}</button>
        <button class="c main" id="nPlay">${ic(S.media.playing?'pause':'play',28)}</button>
        <button class="c" id="nNext">${ic('skip-f',22)}</button>
        <button class="c" id="nRep" style="color:${S.media.repeat!=='off'?'var(--acc-ink)':'inherit'}">${ic(S.media.repeat==='one'?'repeat-1':'repeat',20)}</button>
        <button class="c" id="nFav" style="margin-left:8px;color:${'var(--warn)'}">${ic('heart',20)}</button>
      </div>
      <div class="au-vol">${ic('volume-1',18)}<input type="range" class="sld" min="0" max="100" value="${S.media.vol}" style="--p:${S.media.vol}%" id="nVol">${ic('volume',18)}</div>
      <div class="card" style="flex:1;min-height:0;padding:10px 12px;display:flex;flex-direction:column;overflow:hidden">
        <div class="cap" style="margin:2px 4px 6px">Cola de reproducción · ${S.media.queue.length} pistas</div>
        <div class="np-queue">
          ${S.media.queue.map(id=>{const tr=TRACKS.find(x=>x.id===id);const cur=tr.id===t.id;return `
          <div class="row ${cur?'playing on':''}" data-t="${tr.id}" style="padding:6px 8px;min-height:42px">
            <span class="r-ic" style="width:30px;height:30px;border-radius:7px;overflow:hidden"><img src="${IMG[tr.cover]}" style="width:100%;height:100%;object-fit:cover"></span>
            <div class="r-tt"><div class="t" style="font-size:13px">${esc(tr.title)}</div><div class="s" style="font-size:11px">${esc(tr.artist)}</div></div>
            <div class="r-en mono" style="font-size:10.5px">${fmtDur(tr.dur)}</div>
          </div>`;}).join('')}
        </div>
      </div>
    </div>
  </div>`;
  $('#nPlay',v).onclick=mediaToggle; $('#nPrev',v).onclick=()=>mediaNext(-1); $('#nNext',v).onclick=()=>mediaNext(1);
  $('#nShuf',v).onclick=e=>{S.media.shuffle=!S.media.shuffle;e.currentTarget.style.color=S.media.shuffle?'var(--acc-ink)':'inherit';};
  $('#nRep',v).onclick=e=>{S.media.repeat=S.media.repeat==='off'?'all':S.media.repeat==='all'?'one':'off';e.currentTarget.innerHTML=ic(S.media.repeat==='one'?'repeat-1':'repeat',20);e.currentTarget.style.color=S.media.repeat!=='off'?'var(--acc-ink)':'inherit';};
  $('#nVol',v).oninput=e=>{S.media.vol=+e.target.value;e.target.style.setProperty('--p',S.media.vol+'%');save();};
  $$('.row[data-t]',v).forEach(r=>r.onclick=()=>{S.media.idx=TRACKS.findIndex(x=>x.id===+r.dataset.t);S.media.pos=0;renderBottombar();go('nowplaying');});
}});

/* ---------------- BIBLIOTECA MUSICAL ---------------- */
let _libTab='songs';
reg('library',{title:'Biblioteca musical',group:'Audio',render(v){
  const tabs=[['songs','Canciones'],['artists','Artistas'],['albums','Álbumes'],['genres','Géneros'],['lists','Listas'],['favs','Favoritos'],['recent','Recientes'],['folders','Carpetas']];
  v.innerHTML=`
  <div class="lib">
    <div class="mod-head">
      <button class="ibtn" id="back">${ic('arr-l',20)}</button>
      <div class="mh-ic">${ic('music',24)}</div>
      <div><div class="mh-t">Biblioteca</div><div class="mh-s">${TRACKS.length} pistas · ${ARTISTS.length} artistas · compatibilidad Media3</div></div>
      <div class="mh-act">
        <div class="search"><span class="s-ic">${ic('search',16)}</span><input class="inp" style="height:40px" placeholder="Buscar en la biblioteca…"></div>
        <button class="ibtn solid sm" title="Orden">${ic('sort',18)}</button>
      </div>
    </div>
    <div class="tabs" style="padding:0 var(--s5)">
      ${tabs.map(t=>`<button class="tab ${_libTab===t[0]?'on':''}" data-tab="${t[0]}">${t[1]}</button>`).join('')}
    </div>
    <div class="lib-body" id="libBody"></div>
  </div>`;
  $('#back',v).onclick=()=>go('audio');
  $$('.tab',v).forEach(t=>t.onclick=()=>{_libTab=t.dataset.tab;go('library');});
  const body=$('#libBody',v);
  const trackRow=tr=>{const cur=tr.id===curTrack().id;return `
    <div class="row ${cur?'playing':''}" data-t="${tr.id}">
      <span class="r-ic img"><img src="${IMG[tr.cover]}"></span>
      <div class="r-tt"><div class="t">${esc(tr.title)}</div><div class="s">${esc(tr.artist)} · ${esc(tr.album)}</div></div>
      <div class="r-en">${cur?`<span class="eq-viz ${S.media.playing?'':'off'}" style="height:14px;width:22px"><i style="animation-delay:0s"></i><i style="animation-delay:.2s"></i><i style="animation-delay:.4s"></i></span>`:ic('play',16)}<span class="mono" style="font-size:11px">${fmtDur(tr.dur)}</span></div>
    </div>`;};
  if(_libTab==='songs') body.innerHTML=`<div style="display:flex;flex-direction:column;gap:2px">${TRACKS.map(trackRow).join('')}</div>`;
  if(_libTab==='artists') body.innerHTML=`<div style="display:flex;flex-direction:column;gap:2px">${ARTISTS.map(a=>`
    <div class="row" data-ar="${a.id}">
      <span class="artist-av">${a.name[0]}</span>
      <div class="r-tt"><div class="t">${esc(a.name)}</div><div class="s">${TRACKS.filter(t=>t.artist===a.name).length} pistas · ${a.genre}</div></div>
      <div class="r-en">${ic('chev-r',18)}</div>
    </div>`).join('')}</div>`;
  if(_libTab==='albums') body.innerHTML=`<div class="grid" style="grid-template-columns:repeat(4,1fr)">${ARTISTS.map(a=>`
    <div class="album-card" data-al="${a.id}">
      <div class="ac-img"><img src="${IMG[a.cover]}"><span class="ac-play">${ic('play',18)}</span></div>
      <div class="ac-t"><div class="t">${esc(a.album)}</div><div class="s">${esc(a.name)} · ${a.year}</div></div>
    </div>`).join('')}</div>`;
  if(_libTab==='genres') body.innerHTML=`<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">${[...new Set(ARTISTS.map(a=>a.genre))].map(g=>`<button class="chip on">${esc(g)}</button>`).join('')}</div>
    <div style="display:flex;flex-direction:column;gap:2px">${ARTISTS.map(a=>`
    <div class="row"><span class="r-ic" style="background:var(--acc-soft);color:var(--acc-ink)">${ic('disc',17)}</span>
    <div class="r-tt"><div class="t">${esc(a.genre)}</div><div class="s">${esc(a.name)} · ${esc(a.album)}</div></div>
    <div class="r-en mono" style="font-size:11px">${TRACKS.filter(t=>t.artist===a.name).length} pistas</div></div>`).join('')}</div>`;
  if(_libTab==='lists') body.innerHTML=`<div class="grid" style="grid-template-columns:repeat(3,1fr)">${PLAYLISTS.map(p=>`
    <div class="album-card" style="display:flex;gap:14px;padding:14px;align-items:center">
      <img src="${IMG[p.cover]}" style="width:74px;height:74px;border-radius:12px;object-fit:cover">
      <div><div style="font-weight:700;font-size:15px">${esc(p.name)}</div><div class="tx2" style="font-size:12px;margin-top:3px">${p.n} pistas · ${p.dur}</div>
      <div style="margin-top:8px;display:flex;gap:6px"><button class="btn xs primary">${ic('play',12)} Reproducir</button><button class="btn xs ghost">${ic('shuffle',12)}</button></div></div>
    </div>`).join('')}</div>`;
  if(_libTab==='favs') body.innerHTML=`<div style="display:flex;flex-direction:column;gap:2px">${TRACKS.slice(0,5).map(tr=>`
    <div class="row" data-t="${tr.id}"><span class="r-ic img"><img src="${IMG[tr.cover]}"></span>
    <div class="r-tt"><div class="t">${esc(tr.title)}</div><div class="s">${esc(tr.artist)}</div></div>
    <div class="r-en" style="color:var(--warn)">${ic('heart',16)}<span class="mono" style="font-size:11px">${fmtDur(tr.dur)}</span></div></div>`).join('')}</div>`;
  if(_libTab==='recent') body.innerHTML=`<div style="display:flex;flex-direction:column;gap:2px">${TRACKS.slice().reverse().slice(0,6).map(tr=>`
    <div class="row" data-t="${tr.id}"><span class="r-ic img"><img src="${IMG[tr.cover]}"></span>
    <div class="r-tt"><div class="t">${esc(tr.title)}</div><div class="s">Escuchada recientemente · ${esc(tr.artist)}</div></div>
    <div class="r-en">${ic('history',15)}<span class="mono" style="font-size:11px">${fmtDur(tr.dur)}</span></div></div>`).join('')}</div>`;
  if(_libTab==='folders') body.innerHTML=`
    <div class="crumbs" style="margin-bottom:10px"><span class="cr on">Almacenamiento interno</span><span class="cs">${ic('chev-r',12)}</span><span class="cr">Música</span></div>
    ${['Keane — Hopes and Fears','Daft Punk — RAM'].map(f=>`
    <div class="row" style="margin-bottom:2px"><span class="r-ic" style="background:var(--acc-soft);color:var(--acc-ink)">${ic('folder',18)}</span>
    <div class="r-tt"><div class="t">${f}</div><div class="s">2 pistas · FLAC</div></div><div class="r-en">${ic('play',16)}</div></div>`).join('')}`;
  $$('.row[data-t]',v).forEach(r=>r.onclick=()=>{S.media.idx=TRACKS.findIndex(x=>x.id===+r.dataset.t);S.media.pos=0;S.media.playing=true;renderBottombar();go('nowplaying');});
}});

/* ---------------- AJUSTES DE AUDIO ---------------- */
reg('audio-settings',{title:'Ajustes de audio',group:'Audio',render(v){
  v.innerHTML=`
  <div class="lib">
    <div class="mod-head">
      <button class="ibtn" id="back">${ic('arr-l',20)}</button>
      <div class="mh-ic">${ic('volume',24)}</div>
      <div><div class="mh-t">Ajustes de audio</div><div class="mh-s">Comportamiento del reproductor multimedia</div></div>
    </div>
    <div class="lib-body" style="max-width:860px">
      <div class="cap" style="margin:4px 0 8px">Volumen</div>
      <div class="card" style="padding:16px 18px;display:flex;flex-direction:column;gap:14px">
        <div style="display:flex;align-items:center;gap:14px">${ic('volume-1',19)}<input type="range" class="sld" min="0" max="100" value="${S.media.vol}" style="--p:${S.media.vol}%" id="asVol"><span class="mono tx2" style="width:38px;text-align:right">${S.media.vol}%</span></div>
        <div class="setrow" style="padding:6px 0"><div class="sr-tt"><div class="t" style="font-size:14px">Volumen máximo</div><div class="s">Limita el volumen máximo del sistema</div></div>
        <div class="sr-ctl"><div class="sel sm"><select><option>100%</option><option>80%</option><option>60%</option></select></div></div></div>
        <div class="setrow" style="padding:6px 0"><div class="sr-tt"><div class="t" style="font-size:14px">Restaurar volumen al arrancar</div><div class="s">Vuelve al último nivel usado</div></div><div class="sr-ctl"><div class="sw on"></div></div></div>
      </div>
      <div class="cap" style="margin:16px 0 8px">Comportamiento</div>
      <div class="set-list" style="padding:0">
        <div class="setrow"><span class="sr-ic">${ic('bluetooth',18)}</span><div class="sr-tt"><div class="t">Pausar al desconectar Bluetooth</div><div class="s">Detiene la música al perder el audio BT</div></div><div class="sr-ctl"><div class="sw on"></div></div></div>
        <div class="setrow"><span class="sr-ic">${ic('car-front',18)}</span><div class="sr-tt"><div class="t">Silenciar multimedia en marcha atrás</div><div class="s">Gestionado también en Ajustes → Cámara de retroceso</div></div><div class="sr-ctl"><div class="sw on"></div></div></div>
        <div class="setrow"><span class="sr-ic">${ic('sliders',18)}</span><div class="sr-tt"><div class="t">Ecualizador</div><div class="s">10 bandas · DSP ADI-1701</div></div><div class="sr-ctl"><button class="btn sm" id="goEq">${ic('sliders',14)} Abrir</button></div></div>
        <div class="setrow"><span class="sr-ic">${ic('grid',18)}</span><div class="sr-tt"><div class="t">Controles en barra inferior</div><div class="s">Muestra controles de reproducción permanentes</div></div><div class="sr-ctl"><div class="sw on"></div></div></div>
      </div>
    </div>
  </div>`;
  $('#back',v).onclick=()=>go('audio');
  $('#goEq',v).onclick=()=>go('equalizer');
  $('#asVol',v).oninput=e=>{S.media.vol=+e.target.value;e.target.style.setProperty('--p',S.media.vol+'%');renderBottombar();save();};
  $$('.sw',v).forEach(sw=>sw.onclick=()=>sw.classList.toggle('on'));
}});

/* ---------------- ECUALIZADOR ---------------- */
reg('equalizer',{title:'Ecualizador',group:'Audio',render(v){
  const HZ=['31','62','125','250','500','1K','2K','4K','8K','16K'];
  v.innerHTML=`
  <div class="lib">
    <div class="mod-head">
      <button class="ibtn" id="back">${ic('arr-l',20)}</button>
      <div class="mh-ic">${ic('sliders',24)}</div>
      <div><div class="mh-t">Ecualizador</div><div class="mh-s">10 bandas · DSP ADI-1701 · ajuste por arrastre</div></div>
      <div class="mh-act">
        <div class="seg" id="eqOnSeg">
          <button class="sg ${S.eq.on?'on c':''}" data-v="1">Activado</button>
          <button class="sg ${!S.eq.on?'on':''}" data-v="0">Desactivado</button>
        </div>
      </div>
    </div>
    <div class="eq-wrap">
      <div class="eq-panel">
        <div class="card" style="flex:1;display:flex;flex-direction:column;gap:10px;padding:18px 20px">
          <div style="display:flex;align-items:center;gap:10px">
            <span class="cap">Presets</span>
            <div class="seg" style="flex-wrap:wrap" id="eqPresets">
              ${Object.keys(EQ_PRESETS).map(p=>`<button class="sg ${S.eq.preset===p?'on c':''}" data-p="${p}">${p}</button>`).join('')}
            </div>
          </div>
          <div class="eq-bands" id="eqBands">
            ${HZ.map((h,i)=>`
            <div class="eq-band">
              <span class="vl" data-vl="${i}">${S.eq.gains[i]>0?'+':''}${S.eq.gains[i]}</span>
              <div class="sl"><input type="range" class="sld eq" min="-12" max="12" value="${S.eq.gains[i]}" data-b="${i}" style="--p:${(S.eq.gains[i]+12)/24*100}%"></div>
              <span class="hz">${h}</span>
            </div>`).join('')}
          </div>
        </div>
      </div>
      <div class="eq-side">
        <div class="card" style="display:flex;align-items:center;justify-content:space-between">
          <div><div style="font-weight:700">Salida DSP</div><div class="tx2" style="font-size:12px">ADI-1701 · 4 canales</div></div>
          <span class="badge ${S.eq.on?'ok':'dim'}">${S.eq.on?'Activo':'En espera'}</span>
        </div>
        <div class="card">
          <div class="cap" style="margin-bottom:10px">Vista previa</div>
          <div class="eq-viz ${S.eq.on?'':'off'}" id="eqViz">
            ${Array.from({length:24}).map((_,i)=>`<i style="animation-delay:${(i*.07).toFixed(2)}s;height:${30+Math.random()*60}%"></i>`).join('')}
          </div>
          <div class="tx2" style="font-size:11.5px;margin-top:10px;display:flex;align-items:center;gap:7px">${ic('info',13)} Aplicación en tiempo real sobre el DSP de la unidad.</div>
        </div>
        <button class="btn ghost" id="eqReset">${ic('rotate-ccw',15)} Restablecer plano</button>
      </div>
    </div>
  </div>`;
  $('#back',v).onclick=()=>go('audio-settings');
  $$('#eqOnSeg .sg',v).forEach(b=>b.onclick=()=>{S.eq.on=b.dataset.v==='1';save();go('equalizer');});
  $$('#eqPresets .sg',v).forEach(b=>b.onclick=()=>{S.eq.preset=b.dataset.p;S.eq.gains=[...EQ_PRESETS[b.dataset.p]];save();go('equalizer');});
  $$('.sld.eq',v).forEach(sl=>sl.oninput=e=>{
    const i=+e.target.dataset.b, val=+e.target.value;
    S.eq.gains[i]=val; S.eq.preset='Personalizado';
    e.target.style.setProperty('--p',(val+12)/24*100+'%');
    v.querySelector(`[data-vl="${i}"]`).textContent=(val>0?'+':'')+val;
    save();
  });
  $('#eqReset',v).onclick=()=>{S.eq.preset='Plano';S.eq.gains=[...EQ_PRESETS['Plano']];save();go('equalizer');};
}});

/* ---------------- VÍDEO: BIBLIOTECA ---------------- */
let _vidTab='all';
reg('video',{title:'Vídeo',group:'Vídeo',render(v){
  const cats=[['all','Todo'],['music','Música'],['movies','Películas'],['local','Local'],['lists','Listas']];
  const catsMap={music:'Música',movies:'Películas',local:'Local',lists:'Listas'};
  let vids=VIDEOS.filter(x=>_vidTab==='all'||x.cat===catsMap[_vidTab]);
  if(_vidTab==='lists') vids=VIDEOS;
  v.innerHTML=`
  <div class="lib">
    <div class="mod-head">
      <div class="mh-ic">${ic('film',24)}</div>
      <div><div class="mh-t">Vídeo</div><div class="mh-s">${VIDEOS.length} vídeos locales · reproducción bloqueada en marcha</div></div>
      <div class="mh-act">
        <div class="search"><span class="s-ic">${ic('search',16)}</span><input class="inp" style="height:40px" placeholder="Buscar vídeo…"></div>
        <button class="ibtn solid sm" id="vidSet" title="Ajustes">${ic('settings',18)}</button>
      </div>
    </div>
    <div class="lib-tools">
      ${cats.map(c=>`<button class="chip ${_vidTab===c[0]?'on':''}" data-c="${c[0]}">${c[1]}</button>`).join('')}
      <span style="flex:1"></span>
      <button class="chip" id="vidHist">${ic('history',14)} Historial</button>
    </div>
    <div class="lib-body">
      ${_vidTab==='hist'?`
      <div class="cap" style="margin:2px 0 10px">Vistos recientemente</div>
      <div style="display:flex;flex-direction:column;gap:2px">
        ${VIDEOS.slice(0,4).map(x=>`
        <div class="row"><span class="r-ic img" style="width:64px;height:38px;border-radius:8px">${x.thumb?`<img src="${IMG[x.thumb]}">`:''}</span>
        <div class="r-tt"><div class="t">${esc(x.title)}</div><div class="s">Visto ${x.date} · ${x.res}</div></div>
        <div class="r-en mono" style="font-size:11px">${x.dur}</div></div>`).join('')}
      </div>`:_vidTab==='lists'?`
      <div class="cap" style="margin:2px 0 10px">Listas de reproducción</div>
      <div style="display:flex;flex-direction:column;gap:2px">
        <div class="row"><span class="r-ic" style="background:var(--acc-soft);color:var(--acc-ink)">${ic('list-music',18)}</span><div class="r-tt"><div class="t">Videoclips favoritos</div><div class="s">8 vídeos · 42 min</div></div><div class="r-en">${ic('chev-r',18)}</div></div>
        <div class="row"><span class="r-ic" style="background:var(--acc-soft);color:var(--acc-ink)">${ic('list-music',18)}</span><div class="r-tt"><div class="t">Películes para el viaje</div><div class="s">3 vídeos · 4 h 10 min</div></div><div class="r-en">${ic('chev-r',18)}</div></div>
      </div>`:`
      <div class="vid-grid">
        ${vids.map(x=>{
          const thumb=x.thumb?`<img src="${IMG[x.thumb]}" alt="">`:`<div style="position:absolute;inset:0;background:linear-gradient(135deg,${x.grad[0]},${x.grad[1]})"></div><div class="vc-grad">${ic('film',30)}</div>`;
          return `
        <div class="vid-card" data-v="${x.id}">
          <div class="vc-img">${thumb}<span class="vc-dur">${x.dur}</span>
            <div class="vc-play"><span class="pv">${ic('play',24)}</span></div></div>
          <div class="vc-t"><div class="t">${esc(x.title)}</div><div class="s">${x.cat} · ${x.res} · ${x.size}</div></div>
        </div>`;}).join('')}
      </div>
      ${vids.length===0?`<div class="state-blank"><div class="sb-ic">${ic('film',34)}</div><div class="t">Sin vídeos en esta categoría</div><div class="s">Copia archivos de vídeo al almacenamiento o conecta una memoria USB.</div></div>`:''}`}
    </div>
  </div>`;
  $$('.chip[data-c]',v).forEach(c=>c.onclick=()=>{_vidTab=c.dataset.c;go('video');});
  $('#vidHist',v).onclick=()=>{_vidTab='hist';go('video');};
  $('#vidSet',v).onclick=()=>go('video-settings');
  $$('.vid-card',v).forEach(c=>c.onclick=()=>{
    const x=VIDEOS.find(z=>z.id===+c.dataset.v);
    dialog({icon:'film',color:'acc',title:x.title,lg:true,
      body:`<div style="display:flex;gap:18px">
        <div style="width:300px;aspect-ratio:16/9;border-radius:12px;overflow:hidden;position:relative;background:linear-gradient(135deg,#0E2039,#071326)">
          ${x.thumb?`<img src="${IMG[x.thumb]}" style="width:100%;height:100%;object-fit:cover">`:''}
          <span style="position:absolute;right:8px;bottom:8px" class="vc-dur mono">${x.dur}</span></div>
        <div style="flex:1;display:flex;flex-direction:column;gap:4px">
          <div class="kv"><span class="k">Categoría</span><span class="v">${x.cat}</span></div>
          <div class="kv"><span class="k">Resolución</span><span class="v">${x.res}</span></div>
          <div class="kv"><span class="k">Tamaño</span><span class="v">${x.size}</span></div>
          <div class="kv"><span class="k">Añadido</span><span class="v">${x.date}</span></div>
          <div class="kv"><span class="k">Subtítulos</span><span class="v">ES · auto</span></div>
          <div style="margin-top:8px" class="tx2 t-xs">${ic('alert',13)} La imagen se bloquea automáticamente cuando el vehículo está en movimiento.</div>
        </div></div>`,
      actions:[{label:'Cerrar',cls:'ghost'},{label:'Ver detalles del archivo',cls:'',onClick:()=>go('files')},{label:ic('play',15)+' Reproducir',cls:'primary',onClick:()=>openVPlayer(x.id)}]});
  });
}});

/* ---------------- REPRODUCTOR DE VÍDEO (fullscreen) ---------------- */
let _vpTimer=null;
function openVPlayer(id){
  const x=VIDEOS.find(z=>z.id===id);
  S.video.cur=id; S.video.pos=0; S.video.playing=false;
  const vp=$('#vplayer');
  const blocked=S.drive.demo;
  vp.innerHTML=`
  <div class="vp-stage">
    ${x.thumb?`<img src="${IMG[x.thumb]}" alt="">`:`<div style="position:absolute;inset:0;background:linear-gradient(135deg,${x.grad[0]},${x.grad[1]})"></div>`}
    <div class="vp-shade"></div>
    <div class="vp-block ${blocked?'on':''}" id="vpBlock">
      <div class="bi">${ic('alert',44)}</div>
      <div style="font-family:var(--f-brand);font-weight:800;font-size:24px">Reproducción de vídeo bloqueada</div>
      <div class="tx2" style="max-width:480px;line-height:1.5">El vehículo está en movimiento. Por seguridad, la imagen de vídeo no se muestra durante la conducción. <b style="color:var(--tx-1)">El audio continúa reproduciéndose.</b></div>
      <div class="demo-chip">${ic('car-front',11)} MARCHA SIMULADA · DEMO</div>
      <button class="btn" id="vpAudioOnly">${ic('volume',16)} Continuar solo con audio</button>
    </div>
  </div>
  <div class="vp-ctrls">
    <div class="vp-row">
      <div style="flex:1;min-width:0">
        <div class="vp-title">${esc(x.title)}</div>
        <div class="tx2" style="font-size:12.5px;margin-top:2px">${x.cat} · ${x.res} · audio DSP ADI-1701</div>
      </div>
      <button class="c" id="vpSub" title="Subtítulos">${ic('cc',22)}</button>
      <button class="c" id="vpFs" title="Pantalla completa">${ic('maximize',21)}</button>
      <button class="c" id="vpClose" title="Salir">${ic('x',24)}</button>
    </div>
    <div class="prog"><i id="vpBar" style="width:0%"></i></div>
    <div class="vp-row" style="justify-content:center">
      <button class="c" id="vpBack">${ic('skip-b',24)}</button>
      <button class="c main" id="vpPlay">${ic('play',28)}</button>
      <button class="c" id="vpFwd">${ic('skip-f',24)}</button>
      <span style="flex:1"></span>
      <div class="au-vol" style="color:#8FD9F2">${ic('volume-1',18)}<input type="range" class="sld" min="0" max="100" value="${S.media.vol}" style="--p:${S.media.vol}%;max-width:180px" id="vpVol">${ic('volume',18)}</div>
    </div>
  </div>`;
  vp.classList.add('on');
  $('#vpClose').onclick=closeVPlayer;
  $('#vpPlay').onclick=e=>{
    if(S.drive.demo){ $('#vpBlock').classList.add('on'); toast({icon:'shield',color:'warn',title:'Bloqueado en marcha',body:'La imagen de vídeo se desactiva con el vehículo en movimiento.'}); return; }
    S.video.playing=!S.video.playing; e.currentTarget.innerHTML=ic(S.video.playing?'pause':'play',28);
  };
  $('#vpAudioOnly').onclick=()=>{ $('#vpBlock').classList.remove('on'); toast({icon:'volume',color:'ok',title:'Modo solo audio',body:'El vídeo continúa sin imagen mientras conduces.'}); };
  $('#vpSub').onclick=subsDialog;
  $('#vpFs').onclick=()=>toast({icon:'maximize',color:'acc',title:'Pantalla completa',body:'Ya estás en la vista a pantalla completa (1280×720).'});
  $('#vpVol').oninput=e=>{S.media.vol=+e.target.value;e.target.style.setProperty('--p',S.media.vol+'%');save();};
  if(_vpTimer) clearInterval(_vpTimer);
  _vpTimer=setInterval(()=>{
    if(!S.video.playing) return;
    S.video.pos=(S.video.pos+1)%300;
    const bar=$('#vpBar'); if(bar) bar.style.width=(S.video.pos/300*100)+'%';
    if(S.drive.demo){ const b=$('#vpBlock'); if(b&&!b.classList.contains('on')){b.classList.add('on');} }
  },1000);
}
function closeVPlayer(){ const vp=$('#vplayer'); vp.classList.remove('on'); if(_vpTimer){clearInterval(_vpTimer);_vpTimer=null;} S.video.playing=false; }
function subsDialog(){
  dialog({icon:'cc',color:'acc',title:'Subtítulos',body:`
    <div style="display:flex;flex-direction:column;gap:4px">
      ${[['es','Español','Automático · SRT'],['en','English','Externo · .srt'],['off','Desactivados','—']].map(o=>`
      <label class="setrow" style="cursor:pointer"><span class="sr-ic">${ic('cc',17)}</span>
      <div class="sr-tt"><div class="t">${o[1]}</div><div class="s">${o[2]}</div></div>
      <div class="sr-ctl"><div class="chk ${S.video.subs===o[0]?'on':''}" data-s="${o[0]}">${ic('check',13)}</div></div></label>`).join('')}
      <div class="setrow"><div class="sr-tt"><div class="t">Tamaño de texto</div><div class="s">Grande para lectura a distancia</div></div>
      <div class="sr-ctl"><div class="sel sm"><select><option>Grande</option><option>Mediano</option><option>Pequeño</option></select></div></div></div>
    </div>`,
    actions:[{label:'Cancelar',cls:'ghost'},{label:'Aplicar',cls:'primary',onClick(){$$('.chk[data-s]').forEach(c=>{if(c.classList.contains('on'))S.video.subs=c.dataset.s;});}}]});
  $$('.chk[data-s]').forEach(c=>c.onclick=()=>{$$('.chk[data-s]').forEach(x=>x.classList.remove('on'));c.classList.add('on');});
}

/* ---------------- AJUSTES DE VÍDEO ---------------- */
reg('video-settings',{title:'Ajustes de vídeo',group:'Vídeo',render(v){
  v.innerHTML=`
  <div class="lib">
    <div class="mod-head">
      <button class="ibtn" id="back">${ic('arr-l',20)}</button>
      <div class="mh-ic">${ic('film',24)}</div>
      <div><div class="mh-t">Ajustes de vídeo</div><div class="mh-s">Reproducción y seguridad</div></div>
    </div>
    <div class="lib-body" style="max-width:860px">
      <div class="cap" style="margin:4px 0 8px">Seguridad de conducción</div>
      <div class="card acc" style="display:flex;gap:14px;align-items:flex-start;padding:16px 18px;margin-bottom:6px">
        <span style="color:var(--warn);flex:0 0 auto;margin-top:2px">${ic('shield',22)}</span>
        <div style="flex:1"><div style="font-weight:700">Bloqueo de imagen en movimiento</div>
        <div class="tx2" style="font-size:12.5px;line-height:1.45;margin-top:3px">La reproducción visual se bloquea automáticamente cuando el vehículo está en marcha. El audio continúa disponible. Esta restricción <b>no puede desactivarse</b> — es una medida de seguridad fija del sistema.</div></div>
        <span class="badge warn"><span class="dot"></span>Siempre activo</span>
      </div>
      <div class="cap" style="margin:14px 0 8px">Reproducción</div>
      <div class="set-list" style="padding:0">
        <div class="setrow"><span class="sr-ic">${ic('play',18)}</span><div class="sr-tt"><div class="t">Reanudar desde donde se dejó</div><div class="s">Guarda la posición de cada vídeo</div></div><div class="sr-ctl"><div class="sw on"></div></div></div>
        <div class="setrow"><span class="sr-ic">${ic('cc',18)}</span><div class="sr-tt"><div class="t">Idioma de subtítulos preferido</div><div class="s">Se usa si el archivo los incluye</div></div><div class="sr-ctl"><div class="sel sm"><select><option>Español</option><option>English</option></select></div></div></div>
        <div class="setrow"><span class="sr-ic">${ic('zap',18)}</span><div class="sr-tt"><div class="t">Decodificación por hardware</div><div class="s">Aceleración del AC8257 (recomendado)</div></div><div class="sr-ctl"><div class="sw on"></div></div></div>
        <div class="setrow"><span class="sr-ic">${ic('grid',18)}</span><div class="sr-tt"><div class="t">Miniaturas de la biblioteca</div><div class="s">Genera vistas previas (ocupan espacio)</div></div><div class="sr-ctl"><div class="sw on"></div></div></div>
      </div>
    </div>
  </div>`;
  $('#back',v).onclick=()=>go('video');
  $$('.sw',v).forEach(sw=>sw.onclick=()=>sw.classList.toggle('on'));
}});
