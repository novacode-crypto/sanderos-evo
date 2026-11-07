# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y versionado [SemVer](https://semver.org/lang/es/).

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
