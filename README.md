# SanderOS EVO

<p align="center">
  <img src="assets/vehicle/hero_dusk_rear.png" alt="SanderOS EVO — Cockpit digital para Renault Sandero 2017" width="820">
</p>

<p align="center">
  <strong>Cockpit digital a medida para Renault Sandero 2017</strong><br>
  Android 11 · 1280 × 720 · AC8257 dual-core · 2 GB RAM · OBD2 Konnwei KW906
</p>

<p align="center">
  <a href="releases"><img src="https://img.shields.io/badge/release-v1.1.0-22d3ee.svg" alt="Release v1.1.0"></a>
  <a href="https://novacode-crypto.github.io/sanderos-evo/"><img src="https://img.shields.io/badge/landing-GitHub_Pages-00D2FF.svg" alt="Landing en GitHub Pages"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/licencia-MIT-blue.svg" alt="Licencia MIT"></a>
  <img src="https://img.shields.io/badge/plataforma-Android%2011-3ddc84.svg" alt="Android 11">
  <img src="https://img.shields.io/badge/prototipo-49%20pantallas-a855f7.svg" alt="49 pantallas">
</p>

---

SanderOS EVO es un concepto completo de sistema de infoentretenimiento (IVI) para
una unidad head-unit aftermarket instalada en un **Renault Sandero 2017**. El
proyecto cubre todo el ciclo de diseño: identidad de marca, sistema de diseño
dual (Midnight / Light), un **prototipo HTML interactivo de 49 pantallas** y una
**guía de handoff** lista para el equipo de implementación en Android.

El prototipo y los datos de demostración están en **español** (interfaz del
vehículo).

## Probar el proyecto

**Opción A — App Android (launcher nativo, Fase 0):** descarga la APK de la
[última release](../../releases) (`SanderOS-EVO-vX.Y.Z-release.apk`) e
instálala en la autorradio o en un emulador (Android 10+). Incluye la Vista
de Conducción con la marca en el centro, carretera animada DEMO, temas
Midnight/Light/Auto y el Gestor de Módulos. Código en
[`android-app/`](android-app/README.md).

**Opción B — Prototipo HTML:** abre `prototype/index.html` en Chrome, Edge o
Firefox. El archivo es **autocontenido** (~2 MB): fuentes, imágenes e iconos
van embebidos, funciona sin conexión. También puedes probarlo online en
[`/prototype/`](https://novacode-crypto.github.io/sanderos-evo/prototype/).

**Opción C — Landing oficial:** la página pública del proyecto en GitHub
Pages, con las fuentes del launcher, el rombo de Renault, descargas de la
última release y la demo del prototipo:
**<https://novacode-crypto.github.io/sanderos-evo/>**

| Atajo | Acción |
|---|---|
| Barra superior (fuera del marco) | Saltar a cualquier pantalla y cambiar de tema |
| ← / → | Módulo anterior / siguiente |
| `Esc` | Cerrar diálogos |
| Barra **DEMO** (Vista de conducción) | Simular marcha, GPS, OBD2 y navegación |

## Galería

| Vista de conducción | Barra DEMO |
|---|---|
| ![Vista de conducción](assets/screenshots/vista-conduccion.jpg) | ![Simulación DEMO](assets/screenshots/simulacion-demo.jpg) |

| Reproducción de audio | OBD2 en tiempo real |
|---|---|
| ![Reproducción](assets/screenshots/audio-reproduccion.jpg) | ![OBD2](assets/screenshots/obd-tiempo-real.jpg) |

| Navegación | Ajustes (tema Light) |
|---|---|
| ![Navegación](assets/screenshots/navegacion.jpg) | ![Ajustes](assets/screenshots/ajustes-apariencia.jpg) |

## Objetivo técnico

| Parámetro | Valor |
|---|---|
| Vehículo | Renault Sandero 2017 |
| Plataforma | Android 11 (head unit aftermarket) |
| Pantalla | 1280 × 720 px, orientación horizontal |
| Procesador | AC8257 dual-core |
| Memoria | 2 GB RAM |
| Diagnóstico | Adaptador OBD2 Konnwei KW906 (ELM327 compatible, Bluetooth) |

## Módulos del prototipo

| Módulo | Pantallas incluidas |
|---|---|
| Arranque y bienvenida | Splash, asistente de configuración (idioma, tema, dock) |
| Conducción | Vista de conducción con animación de carretera, panel de notificaciones |
| Navegación | Pantalla de navegación (intents hacia apps externas, Karta GPS por defecto) |
| Audio | Biblioteca, reproducción, ecualizador, fuentes de audio |
| Vídeo | Galería y reproductor (bloqueado en marcha, solo audio) |
| Teléfono | Marcado, contactos, registro de llamadas |
| Vehículo | Estado del vehículo con renders de ángulos y colores |
| OBD2 | Conexión del adaptador, lectura en tiempo real, diagnóstico de fallos |
| Archivos | Explorador de archivos virtual, previsualización |
| Ajustes | Apariencia, dock, aplicaciones, información del sistema |

## Reglas de marca y producto

Estas decisiones son vinculantes para cualquier iteración futura:

- El wordmark se escribe **SanderOS** (nunca en cursiva): «Sander» en **Sansation
  regular** con color de texto, «OS» en **Sansation bold** y cian eléctrico,
  alineados en la base; el rombo de Renault los precede, tintado según el tema.
- **EVO** usa la fuente display **Designer** (Belina Studio) — única variante
  Regular, con bold sintético — a 0.86 em, tracking .06em y degradado
  cian→azul: reconocible sin dominar la interfaz. Mismas fuentes en el
  launcher Android, el prototipo web y la landing (ver
  [`android-app/FONTS.md`](android-app/FONTS.md)).
- El vídeo queda **forzosamente bloqueado durante la marcha** (sin opción de
  desactivar; solo continúa el audio).
- La navegación **no incrusta mapas**: lanza intents de Android hacia
  aplicaciones externas (Karta GPS por defecto).
- No se interfiere con la imagen de marcha atrás gestionada por la MCU original
  del vehículo.

## Política de datos de demostración

- Música, archivos y vídeo usan **datos de demostración** claramente ficticios.
- OBD2 y GPS arrancan en estado **«no conectado»**.
- Cualquier dato simulado en vivo lleva siempre la etiqueta **DEMO** visible:
  nunca se presenta telemetría inventada como si fuera real.

## Estructura del repositorio

```
sanderos-evo/
├── android-app/           # Launcher nativo Kotlin + Compose (Fase 0)
│   ├── app/               #   MainActivity · manifest HOME/LAUNCHER
│   ├── core/              #   Driving View, carretera, Ajustes, stores
│   ├── designlib/         #   tokens, tipografías, wordmark, placeholders
│   ├── moduleapi/         #   contrato SanderModule + bus de capacidades
│   └── modules/obd/       #   stub del módulo OBD2 (Fase 1)
├── landing/               # Landing pública autocontenida (GitHub Pages)
│   └── index.html         #   Fuentes + rombo embebidos · enlaces a releases
├── prototype/
│   ├── index.html          # Prototipo autocontenido (build v1.1.0)
│   ├── build.py            # Ensamblador: regenera index.html desde src/
│   └── src/                # Fuentes modulares (el orden 00–16 es significativo)
│       ├── css/            # Tokens, shell, componentes, módulos, animaciones
│       ├── html/           # Cuerpo del documento
│       ├── js/             # Iconos, datos, núcleo, pantallas, arranque
│       ├── fonts/          # Sansation · Designer · JetBrains Mono (7 woff2)
│       └── img/            # Renders y portadas embebidos en base64
├── docs/
│   ├── ARQUITECTURA-MODULOS.md           # Arquitectura fundacional del launcher
│   ├── SanderOS_EVO_Handoff_Android.docx # Guía de handoff (20 páginas)
│   ├── SanderOS_EVO_Handoff_Android.pdf
│   └── GUIA-GITHUB.md                    # Publicación y flujo de trabajo
├── assets/
│   ├── vehicle/            # 8 renders AI del Sandero (hero, ángulos, colores)
│   ├── brand/              # Logotipos SVG + rombo de Renault (claro/oscuro)
│   ├── media/              # Portadas y miniaturas de demo
│   └── screenshots/        # Capturas del prototipo para documentación
└── .github/
    ├── workflows/          # Release + APK + Pages (landing y demo)
    └── release-notes/      # Notas de versión por tag
```

## Compilación del prototipo

Requisitos: Python 3.8+ (sin dependencias externas).

```bash
python3 prototype/build.py
```

Regenera `prototype/index.html` desde las fuentes de `prototype/src/`. La
integración continua verifica en cada push que el build commiteado esté
actualizado respecto a sus fuentes, así que **tras editar cualquier fuente,
ejecuta el build y commitea ambos juntos**.

## Publicación de versiones

El flujo de releases está automatizado:

1. Edita fuentes y regenera el prototipo (`python3 prototype/build.py`).
2. Actualiza `CHANGELOG.md` y añade `.github/release-notes/vX.Y.Z.md`.
3. Commitea, etiqueta y sube:

   ```bash
   git tag -a v1.1.0 -m "v1.1.0"
   git push origin main --tags
   ```

4. El workflow de release publica la versión con el prototipo y la documentación
   adjuntos como artefactos.

El detalle del primer despliegue (crear el repositorio remoto, publicar el tag
inicial y activar la demo en GitHub Pages) está en
[`docs/GUIA-GITHUB.md`](docs/GUIA-GITHUB.md).

## Documentación

- [`ARQUITECTURA-MODULOS.md`](docs/ARQUITECTURA-MODULOS.md) — **documento
  fundacional del launcher nativo**: núcleo (Driving View + Settings) con
  módulos activables, contrato `SanderModule`, bus de capacidades, reglas de
  dependencia y fases de construcción.
- [`SanderOS_EVO_Handoff_Android.pdf`](docs/SanderOS_EVO_Handoff_Android.pdf) —
  especificación de entrega: tokens de diseño, inventario de las 49 pantallas,
  especificación por módulo, componentes y notas de implementación en Android.
- [`assets/README.txt`](assets/README.txt) — inventario de la biblioteca de
  activos.

## Hoja de ruta

- [x] v1.0.0 — Prototipo completo de 49 pantallas, sistema dual de temas,
      activos de marca y documentación de handoff.
- [x] v1.1.0 — Fuentes oficiales del launcher (Sansation + Designer) y rombo
      de Renault en el prototipo; landing pública en GitHub Pages; launcher
      nativo Fase 0 (APK v0.1.0) y arquitectura de módulos.
- [ ] v2.0 — Implementación nativa completa en Android como launcher modular
      (arquitectura definida en
      [`docs/ARQUITECTURA-MODULOS.md`](docs/ARQUITECTURA-MODULOS.md)).

## Licencia

Distribuido bajo la licencia [MIT](LICENSE).
