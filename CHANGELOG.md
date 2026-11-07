# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y versionado [SemVer](https://semver.org/lang/es/).

## [Sin publicar]

### Añadido

- **`android-app/` — launcher nativo Kotlin + Compose, Fase 0** (v0.1.0):
  - Vista de Conducción como pantalla principal: rombo de Renault con
    tinte dinámico por tema + wordmark **SanderOS EVO** con las nuevas
    fuentes (Sansation Regular/Bold + Designer con bold sintético),
    carretera pseudo-3D animada y velocidad DEMO etiquetada.
  - Tema dual Midnight/Light + Auto (7:00–19:00) persistido en DataStore.
  - Ajustes con **Gestor de Módulos** (activar/desactivar con persistencia
    y estado visible) según `docs/ARQUITECTURA-MODULOS.md`.
  - Estructura Gradle `:app` · `:core` · `:designlib` · `:moduleapi` ·
    `:modules:obd` (stub que demuestra el ciclo completo del contrato).
  - Registrada como launcher (HOME + LAUNCHER), apaisada, APK universal
    (arm64-v8a · armeabi-v7a · x86 · x86_64).
  - Workflow `apk.yml`: compila la APK en cada push a main y la adjunta a
    las releases de tags `v*`.
- `docs/ARQUITECTURA-MODULOS.md` — documento fundacional de la arquitectura
  del launcher nativo: núcleo (Driving View + Settings + dashboard/dock) con
  módulos activables desde Settings, contrato `SanderModule` en `module-api`,
  bus de capacidades tipado, ciclo de vida dormir/despertar, presupuesto de
  memoria, reglas de dependencia con enforcement en CI, camino futuro a
  plugins APK externos y 4 fases de construcción.

### Corregido

- Normalización de bits de permiso: 63 archivos que quedaron marcados como
  ejecutables (100755) vuelven a modo 644; sin cambios de contenido.

## [1.0.0] — 2026-11-07

Primera versión completa del paquete de diseño.

### Añadido

- Prototipo interactivo autocontenido (`prototype/index.html`, ~2 MB, sin
  dependencias externas) con **49 pantallas**:
  - Arranque: splash y asistente de bienvenida (idioma, tema, dock).
  - Conducción: vista principal con animación de carretera y panel de
    notificaciones.
  - Navegación mediante intents de Android hacia apps externas (Karta GPS por
    defecto), sin mapas incrustados.
  - Audio: biblioteca, reproducción, ecualizador y fuentes.
  - Vídeo: galería y reproductor, bloqueado durante la marcha (solo audio).
  - Teléfono: marcado, contactos y registro.
  - Vehículo: estado con renders por ángulo y variante de color.
  - OBD2: conexión del adaptador Konnwei KW906, lectura en tiempo real con
    gráficas y diagnóstico de fallos.
  - Archivos: explorador virtual y previsualización.
  - Ajustes: apariencia, dock, aplicaciones e información del sistema.
- Sistema de diseño **dual Midnight / Light** con conmutación automática por
  horario (Light de 7:00 a 19:00, Midnight el resto).
- Fuentes embebidas en base64: Syne (marca), DM Sans (interfaz) y JetBrains
  Mono (datos técnicos), 13 variantes en total.
- Biblioteca de 84 iconos de línea propios (trazo 1.8, estilo Lucide).
- 8 renderizados AI del vehículo: hero al anochecer, ángulos de estudio y 4
  variantes de color (gris, blanco glaciar, azul hierro, rojo, negro nardo).
- Identidad de marca vectorial: logotipo horizontal (claro y oscuro), versión
  compacta e icono de app.
- Documentación de handoff para el equipo Android (DOCX + PDF, 20 páginas):
  tokens, inventario de pantallas, especificaciones por módulo y notas de
  implementación.
- Build reproducible (`prototype/build.py`) desde fuentes modulares.
- CI: verificación de build, release automática al publicar tags y demo del
  prototipo en GitHub Pages.

[1.0.0]: ../../releases/tag/v1.0.0
