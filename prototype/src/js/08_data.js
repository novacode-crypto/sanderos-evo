/* SanderOS EVO — Datos de demostración (mixto realista):
   música/archivos/vídeo = demo; OBD2/GPS/telemetría = desconectado hasta conectar. */

/* ---- Módulos del sistema ---- */
const MODULES = {
  driving: {label:'Vista de Conducción', icon:'car-front', color:'var(--acc)'},
  nav:     {label:'Navegación',          icon:'compass',   color:'#4DD8FF'},
  audio:   {label:'Audio',               icon:'music',     color:'#B48CFF'},
  video:   {label:'Vídeo',               icon:'film',      color:'#FF9E64'},
  files:   {label:'Archivos',            icon:'folder',    color:'#5CE2A8'},
  vehicle: {label:'Mi Vehículo',         icon:'car',       color:'#8FD9F2'},
  apps:    {label:'Apps',                icon:'grid',      color:'#F5A623'},
  trip:    {label:'Viajes',              icon:'map',       color:'#7EE0FF'},
  phone:   {label:'Teléfono',            icon:'phone',     color:'#5CE2A8'},
  obd:     {label:'OBD2',                icon:'gauge',     color:'#FFD166'},
  notifs:  {label:'Notificaciones',      icon:'bell',      color:'#8FD9F2'},
  settings:{label:'Ajustes',             icon:'settings',  color:'#94A3B8'},
  design:  {label:'Design System',       icon:'palette',   color:'#E879F9'},
};
const DOCK_DEFAULT = ['driving','nav','audio','video','files','vehicle','apps'];

/* ---- Navegación (proveedores externos, sin mapas embebidos falsos) ---- */
const NAV_PROVIDERS = [
  {id:'karta',  name:'Karta GPS',  desc:'Navegación offline con mapas TomTom', installed:true,  def:true,  pkg:'com.kartagps.navigator'},
  {id:'mapsme', name:'MAPS.ME',    desc:'Mapas offline OpenStreetMap',          installed:true,  def:false, pkg:'com.mapswithme.maps.pro'},
  {id:'osmand', name:'OsmAnd',     desc:'Navegación OSM avanzada',              installed:true,  def:false, pkg:'net.osmand.plus'},
  {id:'gmaps',  name:'Google Maps',desc:'Navegación online de Google',          installed:false, def:false, pkg:'com.google.android.apps.maps'},
  {id:'other',  name:'Otra app…',  desc:'Elegir entre las apps instaladas',     installed:true,  def:false, pkg:null},
];
const NAV_DESTS = [
  {icon:'home',  label:'Casa',        addr:'Av. Libertador 2345, Córdoba'},
  {icon:'briefcase', label:'Trabajo', addr:'Parque Industrial, Calle 8 Nº 420'},
  {icon:'pin',   label:'Taller Renault', addr:'Concesionario Renault · Ruta 9 Km 12'},
];

/* ---- Biblioteca musical (demo) ---- */
const ARTISTS = [
  {id:'keane',  name:'Keane',      album:'Hopes and Fears',   year:2004, cover:'cover_piano',   genre:'Rock alternativo'},
  {id:'daft',   name:'Daft Punk',  album:'Random Access Memories', year:2013, cover:'cover_waves', genre:'Electrónica'},
  {id:'boniver',name:'Bon Iver',   album:'For Emma, Forever Ago', year:2008, cover:'cover_mountain', genre:'Indie folk'},
  {id:'nord',   name:'Nord von Süd', album:'Fernlicht',      year:2021, cover:'cover_waves',   genre:'Ambient'},
];
const TRACKS = [
  {id:1,  title:'Somewhere Only We Know', artist:'Keane',     album:'Hopes and Fears',        dur:237, cover:'cover_piano'},
  {id:2,  title:'Bend & Break',           artist:'Keane',     album:'Hopes and Fears',        dur:226, cover:'cover_piano'},
  {id:3,  title:'We Might as Well Be Strangers', artist:'Keane', album:'Hopes and Fears',     dur:231, cover:'cover_piano'},
  {id:4,  title:'Everybody\'s Changing',  artist:'Keane',     album:'Hopes and Fears',        dur:222, cover:'cover_piano'},
  {id:5,  title:'Get Lucky (feat. Pharrell Williams)', artist:'Daft Punk', album:'Random Access Memories', dur:369, cover:'cover_waves'},
  {id:6,  title:'Instant Crush',          artist:'Daft Punk', album:'Random Access Memories', dur:337, cover:'cover_waves'},
  {id:7,  title:'Give Life Back to Music',artist:'Daft Punk', album:'Random Access Memories', dur:271, cover:'cover_waves'},
  {id:8,  title:'Flume',                  artist:'Bon Iver',  album:'For Emma, Forever Ago',  dur:199, cover:'cover_mountain'},
  {id:9,  title:'Skinny Love',            artist:'Bon Iver',  album:'For Emma, Forever Ago',  dur:231, cover:'cover_mountain'},
  {id:10, title:'The Wolves (Act I and II)', artist:'Bon Iver', album:'For Emma, Forever Ago', dur:341, cover:'cover_mountain'},
  {id:11, title:'Fernlicht',              artist:'Nord von Süd', album:'Fernlicht',           dur:412, cover:'cover_waves'},
  {id:12, title:'Autobahn Nachts',        artist:'Nord von Süd', album:'Fernlicht',           dur:388, cover:'cover_waves'},
];
const PLAYLISTS = [
  {name:'Conducción nocturna', n:18, dur:'1 h 12 min', cover:'cover_waves'},
  {name:'Favoritos',            n:24, dur:'1 h 38 min', cover:'cover_piano'},
  {name:'Ruta costera',         n:12, dur:'48 min',     cover:'cover_mountain'},
];
const EQ_PRESETS = {
  'Plano':[0,0,0,0,0,0,0,0,0,0],
  'Rock':[5,4,2,-1,-2,1,3,4,5,5],
  'Pop':[-1,1,3,4,3,1,-1,-1,1,2],
  'Clásica':[4,3,1,0,-1,-1,0,2,3,4],
  'Voz':[-2,-1,0,2,4,4,3,1,0,-1],
  'Graves':[7,6,4,1,0,0,0,0,1,2],
};

/* ---- Vídeos (demo) ---- */
const VIDEOS = [
  {id:1, title:'Night Drive — Neon Rain', cat:'Música', dur:'4:32', size:'214 MB', res:'1080p', thumb:'thumb_nightdrive', date:'12 oct'},
  {id:2, title:'Ruta Costera al Atardecer', cat:'Viajes', dur:'12:08', size:'612 MB', res:'1080p', thumb:'thumb_coast', date:'28 sep'},
  {id:3, title:'Sandero — Review 2017 (ES)', cat:'Local', dur:'8:45', size:'420 MB', res:'720p', grad:['#14355E','#0A192F'], date:'2 sep'},
  {id:4, title:'Concierto — Pista 05', cat:'Música', dur:'5:12', size:'260 MB', res:'1080p', grad:['#3B2A6B','#14143B'], date:'15 ago'},
  {id:5, title:'Córdoba Time-lapse', cat:'Viajes', dur:'1:58', size:'98 MB', res:'1080p', grad:['#0E4A5A','#0A192F'], date:'4 ago'},
  {id:6, title:'Película — Copia local', cat:'Películas', dur:'1:52:30', size:'1.6 GB', res:'720p', grad:['#23364F','#0A192F'], date:'21 jul'},
];

/* ---- Sistema de archivos virtual (demo) ---- */
const FS = {
  '/': {name:'Almacenamiento interno', type:'root', children:[
    {name:'DCIM', type:'dir', children:[
      {name:'Camera', type:'dir', children:[
        {name:'IMG_20261012_1842.jpg', type:'img', size:'3.2 MB', date:'12 oct 2026', img:'thumb_coast'},
        {name:'IMG_20261012_1903.jpg', type:'img', size:'2.8 MB', date:'12 oct 2026', img:'thumb_nightdrive'},
        {name:'IMG_20260928_1121.jpg', type:'img', size:'4.1 MB', date:'28 sep 2026', img:'cover_mountain'},
        {name:'IMG_20260928_1124.jpg', type:'img', size:'3.7 MB', date:'28 sep 2026', img:'cover_piano'},
      ]},
    ]},
    {name:'Música', type:'dir', children:[
      {name:'Keane — Hopes and Fears', type:'dir', children:[
        {name:'01 Somewhere Only We Know.flac', type:'aud', size:'28.4 MB', date:'3 mar 2026'},
        {name:'02 Bend & Break.flac', type:'aud', size:'26.1 MB', date:'3 mar 2026'},
      ]},
      {name:'Daft Punk — RAM', type:'dir', children:[
        {name:'Get Lucky.flac', type:'aud', size:'41.2 MB', date:'3 mar 2026'},
        {name:'Instant Crush.flac', type:'aud', size:'38.7 MB', date:'3 mar 2026'},
      ]},
    ]},
    {name:'Vídeos', type:'dir', children:[
      {name:'Night Drive — Neon Rain.mp4', type:'vid', size:'214 MB', date:'12 oct 2026'},
      {name:'Ruta Costera al Atardecer.mp4', type:'vid', size:'612 MB', date:'28 sep 2026'},
    ]},
    {name:'Documentos', type:'dir', children:[
      {name:'Manual_Sandero_2017.pdf', type:'pdf', size:'12.8 MB', date:'14 ene 2026'},
      {name:'Seguro_2026.pdf', type:'pdf', size:'1.2 MB', date:'5 ene 2026'},
      {name:'notas_servicio.txt', type:'txt', size:'4 KB', date:'20 oct 2026'},
    ]},
    {name:'Descargas', type:'dir', children:[
      {name:'karta-gps-actualizacion.apk', type:'apk', size:'86.4 MB', date:'2 nov 2026'},
      {name:'mapas_backup.zip', type:'zip', size:'1.1 GB', date:'18 sep 2026'},
      {name:'factura_taller.pdf', type:'pdf', size:'420 KB', date:'2 nov 2026'},
    ]},
    {name:'Android', type:'dir', locked:true, children:[]},
    {name:'.config', type:'dir', hidden:true, children:[]},
  ]},
};
const RECENT_FILES = [
  {name:'IMG_20261012_1903.jpg', path:'/DCIM/Camera', type:'img', size:'2.8 MB', date:'hace 3 días', img:'thumb_nightdrive'},
  {name:'karta-gps-actualizacion.apk', path:'/Descargas', type:'apk', size:'86.4 MB', date:'hace 5 días'},
  {name:'notas_servicio.txt', path:'/Documentos', type:'txt', size:'4 KB', date:'hace 6 días'},
  {name:'Ruta Costera al Atardecer.mp4', path:'/Vídeos', type:'vid', size:'612 MB', date:'hace 12 días'},
];
const FAV_FOLDERS = [
  {name:'DCIM/Camera', path:'/DCIM/Camera', n:'4 archivos'},
  {name:'Música', path:'/Música', n:'2 álbumes'},
];
const FM_TYPE_META = {
  dir:{ic:'folder', c:'#F5C86B', t:'Carpeta'},
  img:{ic:'file-img', c:'#5CE2A8', t:'Imagen'},
  aud:{ic:'file-aud', c:'#B48CFF', t:'Audio'},
  vid:{ic:'file-vid', c:'#FF9E64', t:'Vídeo'},
  txt:{ic:'file-txt', c:'#8FD9F2', t:'Texto'},
  pdf:{ic:'file-txt', c:'#FF8080', t:'PDF'},
  zip:{ic:'file-zip', c:'#C9D6E8', t:'Archivo ZIP'},
  apk:{ic:'file-apk', c:'#5CE2A8', t:'APK Android'},
};

/* ---- Apps instaladas ---- */
const APPS = [
  {name:'Karta GPS', icon:'compass', color:'#4DD8FF', ver:'5.8.2', sys:false},
  {name:'MAPS.ME', icon:'map', color:'#7EE0FF', ver:'16.2.1', sys:false},
  {name:'OsmAnd', icon:'navigation', color:'#8FD9F2', ver:'4.6.9', sys:false},
  {name:'Radio FM', icon:'radio', color:'#F5A623', ver:'3.1.0', sys:true},
  {name:'Cámara', icon:'camera', color:'#8FD9F2', ver:'2.4.0', sys:true},
  {name:'Calculadora', icon:'grid', color:'#94A3B8', ver:'1.9.4', sys:true},
  {name:'Radio NX6856', icon:'signal', color:'#B48CFF', ver:'1.2.6', sys:true},
  {name:'Calculadora de combustible', icon:'droplet', color:'#5CE2A8', ver:'2.0.1', sys:false},
];
IC['radio']='<circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14"/>';
IC['briefcase']='<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>';

/* ---- Contactos e historial de llamadas (demo) ---- */
const CONTACTS = [
  {name:'Ana García', tel:'+54 351 555-0187', initials:'AG'},
  {name:'Carlos Méndez', tel:'+54 351 555-0243', initials:'CM'},
  {name:'Lucía Fernández', tel:'+54 351 555-0311', initials:'LF'},
  {name:'Taller Renault', tel:'+54 351 555-0998', initials:'TR'},
  {name:'Emergencias', tel:'112', initials:'EM'},
];
const CALLS = [
  {name:'Ana García', type:'in',  time:'Hoy 09:12', dur:'4 min 18 s'},
  {name:'Carlos Méndez', type:'out', time:'Ayer 18:40', dur:'12 min 02 s'},
  {name:'Taller Renault', type:'miss', time:'Ayer 11:05', dur:'—'},
  {name:'Lucía Fernández', type:'in', time:'Vie 20:15', dur:'22 min 44 s'},
  {name:'Carlos Méndez', type:'out', time:'Jue 08:30', dur:'1 min 10 s'},
];

/* ---- Viajes (historial de ejemplo) ---- */
const TRIPS = [
  {name:'Trayecto a casa', date:'Hoy', km:12.4, avg:41, max:68, dur:'21 min'},
  {name:'Trayecto al trabajo', date:'Ayer', km:11.8, avg:38, max:62, dur:'23 min'},
  {name:'Ruta costera del sábado', date:'Sáb 31 oct', km:86.2, avg:64, max:97, dur:'1 h 22 min'},
  {name:'Centro — Taller Renault', date:'Mié 28 oct', km:9.6, avg:29, max:54, dur:'27 min'},
];

/* ---- OBD2: PIDs soportados por KW906 en Sandero 2017 (CAN) ---- */
const OBD_PIDS = [
  {pid:'0C', name:'RPM del motor', short:'RPM',           unit:'rpm',  min:0,    max:8000,  warn:6500, demo:[820,1180]},
  {pid:'0D', name:'Velocidad del vehículo', short:'Velocidad',  unit:'km/h',min:0,    max:260,   warn:180,  demo:[64,72]},
  {pid:'05', name:'Temp. refrigerante', short:'Refrigerante',      unit:'°C',  min:-40,  max:140,   warn:105,  demo:[86,89]},
  {pid:'42', name:'Voltaje del módulo', short:'Voltaje',      unit:'V',   min:8,    max:16,    warn:14.8, demo:[13.9,14.1]},
  {pid:'04', name:'Carga calculada', short:'Carga motor',         unit:'%',   min:0,    max:100,   warn:85,   demo:[18,34]},
  {pid:'0F', name:'Temp. aire admisión', short:'Admisión',     unit:'°C',  min:-40,  max:120,   warn:70,   demo:[31,35]},
  {pid:'0B', name:'Presión colector', short:'Colector',        unit:'kPa', min:0,    max:255,   warn:100,  demo:[28,44]},
  {pid:'11', name:'Posición acelerador', short:'Acelerador',     unit:'%',   min:0,    max:100,   warn:95,   demo:[12,42]},
];
const DTC_DEMO = [
  {code:'P0300', title:'Fallo de encendido detectado (aleatorio)', status:'Pendiente', freeze:'RPM 1180 · Load 24% · Coolant 84°C', mil:false},
  {code:'P0420', title:'Rendimiento del sistema catalizador por debajo del umbral', status:'Confirmado', freeze:'RPM 2100 · Speed 64 km/h', mil:true},
];
const OBD_HISTORY = [
  {date:'Hoy 08:14', adapter:'KW906 · 00:1D:A5:xx', proto:'CAN 11-bit / 500 k', result:'Conectado', dur:'34 min'},
  {date:'Ayer 19:02', adapter:'KW906 · 00:1D:A5:xx', proto:'CAN 11-bit / 500 k', result:'Conectado', dur:'8 min'},
  {date:'Ayer 08:41', adapter:'KW906 · 00:1D:A5:xx', proto:'—', result:'Error de comunicación', dur:'0 min'},
];

/* ---- Notificaciones ---- */
const NOTIF_SEED = [
  {id:1, icon:'gauge', color:'warn', title:'OBD2 — Adaptador desconectado', body:'Conecta el adaptador Konnwei KW906 para ver datos en vivo del vehículo.', time:'08:02', active:true},
  {id:2, icon:'map', color:'acc', title:'Karta GPS — Mapa nuevo disponible', body:'Actualización de mapas de Argentina (84 MB). Toca para abrir los ajustes.', time:'Ayer', active:true},
  {id:3, icon:'usb', color:'warn', title:'Almacenamiento casi lleno', body:'Quedan 5.7 GB libres en el almacenamiento interno.', time:'Lun', active:false},
  {id:4, icon:'bluetooth', color:'acc', title:'Bluetooth conectado', body:'Se conectó «Ana — Galaxy A54».', time:'Lun', active:false},
];
