# Fuentes tipográficas del launcher

| Fuente | Uso | Archivo | Licencia |
|---|---|---|---|
| **Sansation** (Regular + Bold) | "Sander" y "OS" del wordmark, interfaz | `designlib/src/main/res/font/sansation_*.ttf` | SIL OFL 1.1 — Bernd Montag. Incluida desde el repo oficial google/fonts |
| **JetBrains Mono** (Medium) | Velocidad, reloj, datos técnicos | `designlib/src/main/res/font/jetbrains_mono_medium.ttf` | SIL OFL 1.1 — JetBrains |
| **DESIGNER** (Regular — única variante) | "EVO" del wordmark | `designlib/src/main/res/font/designer.otf` | **Gratuita solo para uso personal** — Belina Studio (vía FontMeme) |

## Notas

- **DESIGNER** se incluye por decisión explícita del propietario del
  proyecto (uso personal en su propio vehículo). Al existir solo en peso
  Regular, el "EVO" lleva un bold sintético (dos capas desplazadas 0.8dp).
  La "E" de esta fuente se dibuja como tres barras horizontales (Ξ) — es el
  carácter propio del diseño.
- Sansation y JetBrains Mono son OFL: libres para usar, modificar y
  redistribuir con la licencia acompañando. Licencias completas:
  - https://github.com/google/fonts/tree/main/ofl/sansation
  - https://github.com/JetBrains/JetBrainsMono
- Si algún día el proyecto se distribuyera comercialmente, sustituir
  DESIGNER por una alternativa OFL de estilo similar (Michroma, Audiowide,
  Orbitron).

## Uso web (prototipo y landing)

El prototipo (`prototype/`) y la landing pública (`landing/`) usan
exactamente estas mismas fuentes, embebidas en woff2 base64:

| Fuente web | Peso | Uso |
|---|---|---|
| Sansation | 400 / 700 | «Sander» / «OS», interfaz completa |
| Designer | 400 (+ bold sintético del navegador) | «EVO» |
| JetBrains Mono | 400 / 500 / 600 / 700 | datos técnicos y OBD2 |

El rombo de Renault se incluye como máscara CSS tintada por tema — el
homólogo web de `ColorFilter.tint` — con variantes negro (#231F20) y blanco
(#F8FAFC) en `assets/brand/`.
