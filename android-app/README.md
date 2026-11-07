# SanderOS EVO — App Android (launcher)

Implementación nativa del launcher para la autorradio del Renault Sandero
2017 (Android 11 · 1280×720 · AC8257 · 2 GB RAM). Estado: **Fase 0** —
pantalla principal funcional con la arquitectura de módulos ya montada.

## Qué incluye la Fase 0

- **Vista de Conducción** como pantalla principal: marca protagonista en el
  centro (rombo de Renault tintado dinámicamente + wordmark con Sansation y
  Designer), carretera pseudo-3D animada, velocidad **DEMO** etiquetada,
  topbar con reloj y dock de 5 slots.
- **Tema dual Midnight/Light** con modo Auto (Light de 7:00 a 19:00),
  persistido — tokens traducidos de `prototype/src/css/01_tokens.css`.
- **Ajustes** con el **Gestor de Módulos**: activar/desactivar módulos con
  persistencia (DataStore) y estado visible. El módulo OBD2 está como stub
  que demuestra el ciclo completo del contrato.
- **Placeholders vacíos** en pantalla y dock: el camino preparado para los
  módulos de las Fases 1–3 (OBD2 real, audio, vehículo 3D, teléfono,
  archivos, vídeo).
- Registrada como **launcher (HOME)** — reversible desde Ajustes del
  sistema → Apps → App de inicio.

## Compilar

Requisitos: JDK 17 y Android SDK (platform 34 + build-tools 34.0.0), o
simplemente **Android Studio** (abre esta carpeta y listo).

```bash
# CLI
./gradlew assembleRelease
# → app/build/outputs/apk/release/app-release.apk

# con tu clave de firma (opcional):
#   copia keystore/keystore.properties + .jks dentro de android-app/keystore/
#   (ver download/sanderos-keystore/LEEME.txt del paquete de entrega)
```

La CI de GitHub (`.github/workflows/apk.yml`) compila la APK en cada push
que toque `android-app/` y la adjunta a las releases de tags `v*`.

## Estructura (ver docs/ARQUITECTURA-MODULOS.md)

```
android-app/
├── app/            # :app        — MainActivity + manifest (HOME/LAUNCHER)
├── core/           # :core       — DrivingScreen, RoadCanvas, Ajustes, stores
├── designlib/      # :design-lib — tokens, tipografías, wordmark, placeholders
├── moduleapi/      # :module-api — contrato SanderModule + bus de capacidades
└── modules/
    └── obd/        # :modules:obd — stub de la Fase 1 (KW906/ELM327)
```

Reglas de dependencia (enforcement manual por ahora):
`:module-api` no depende de nada · `:designlib` solo de Compose ·
`:core` → `:module-api` + `:designlib` · los módulos nunca entre sí.

## Fuentes tipográficas (ver FONTS.md)

- **Sansation** (Regular/Bold) — OFL, en `designlib/src/main/res/font/`
- **JetBrains Mono** (Medium) — OFL
- **DESIGNER** (Belina Studio) — gratuita para uso personal, incluida por
  decisión explícita del propietario (proyecto personal)

## Notas técnicas

- `minSdk 29` · `targetSdk 34` · pantalla `sensorLandscape` · `singleTask`
- APK universal (arm64-v8a, armeabi-v7a, x86, x86_64): instala en radio y
  en emulador
- `android.nonTransitiveRClass=true` — importa `R` explícito por módulo
- Nombres de módulos Gradle SIN guiones (limitación conocida de AGP)
