#!/usr/bin/env python3
"""SanderOS EVO — Build del prototipo autocontenido.

Regenera ``prototype/index.html`` a partir de las fuentes modulares de
``prototype/src/``. Las fuentes tipográficas (.woff2) y las imágenes (.jpg)
se embeben en base64 para que el resultado sea un único archivo que funciona
sin conexión y sin dependencias externas.

Uso:
    python3 prototype/build.py

El orden de carga de los archivos es significativo (los prefijos numéricos
01–16 indican la secuencia de ensamblado). No renombrar ni reordenar.
"""
import base64
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent        # prototype/
SRC = ROOT / "src"
OUT = ROOT / "index.html"

# --- Hoja de estilos (en orden de ensamblado) --------------------------------
CSS_FILES = [
    "css/01_tokens.css",        # tokens de diseño (dual Midnight/Light)
    "css/02_shell.css",         # marco del dispositivo, topbar, dock, statusbar
    "css/03_components.css",    # biblioteca de componentes
    "css/04_modules.css",       # estilos por módulo/pantalla
    "css/05_anim.css",          # animaciones
    "css/05b_extra.css",        # ajustes y extensiones de animación
]

# --- Cuerpo y lógica (en orden de ensamblado) --------------------------------
BODY_FILE = "html/06_body.html"
JS_FILES = [
    "js/07_icons.js",           # 84 iconos de línea (trazo 1.8, estilo Lucide)
    "js/08_data.js",            # datos de demo, sistema de archivos virtual, PIDs OBD
    "js/09_core.js",            # estado global, motor de temas, enrutador
    "js/10_screens_a.js",       # arranque + bienvenida
    "js/11_screens_b.js",       # conducción + navegación
    "js/12_screens_c.js",       # audio (biblioteca, reproducción, EQ)
    "js/13_screens_d.js",       # vídeo + teléfono
    "js/14_screens_e.js",       # vehículo + OBD2
    "js/15_screens_f.js",       # archivos + ajustes
    "js/16_boot.js",            # secuencia de arranque
]

# --- Fuentes tipográficas embebidas ------------------------------------------
# (archivo, familia, peso, estilo)
FONTS = [
    ("DMSans-400.woff2",        "DM Sans",        400, "normal"),
    ("DMSans-500.woff2",        "DM Sans",        500, "normal"),
    ("DMSans-600.woff2",        "DM Sans",        600, "normal"),
    ("DMSans-700.woff2",        "DM Sans",        700, "normal"),
    ("DMSans-400i.woff2",       "DM Sans",        400, "italic"),
    ("DMSans-500i.woff2",       "DM Sans",        500, "italic"),
    ("JetBrainsMono-400.woff2", "JetBrains Mono", 400, "normal"),
    ("JetBrainsMono-500.woff2", "JetBrains Mono", 500, "normal"),
    ("JetBrainsMono-600.woff2", "JetBrains Mono", 600, "normal"),
    ("JetBrainsMono-700.woff2", "JetBrains Mono", 700, "normal"),
    ("Syne-600.woff2",          "Syne",           600, "normal"),
    ("Syne-700.woff2",          "Syne",           700, "normal"),
    ("Syne-800.woff2",          "Syne",           800, "normal"),
]

IMG_DIR = "img"  # cada .jpg se embebe con su nombre de archivo como clave


def rd(rel: str) -> str:
    path = SRC / rel
    if not path.is_file():
        sys.exit(f"ERROR: falta el archivo fuente {path}")
    return path.read_text(encoding="utf-8")


def b64(path: Path) -> str:
    return base64.b64encode(path.read_bytes()).decode("ascii")


def build_fonts_css() -> str:
    """Genera el bloque @font-face con las 13 variantes embebidas."""
    rules = []
    for fname, family, weight, style in FONTS:
        payload = b64(SRC / "fonts" / fname)
        rules.append(
            "@font-face{font-family:'%s';font-style:%s;font-weight:%d;"
            "src:url(data:font/woff2;base64,%s) format('woff2');font-display:swap;}"
            % (family, style, weight, payload)
        )
    return "\n".join(rules)


def build_assets_js() -> str:
    """Genera el objeto IMG{} con las imágenes de demo embebidas."""
    entries = []
    for path in sorted((SRC / IMG_DIR).glob("*.jpg")):
        entries.append('"%s": "data:image/jpeg;base64,%s"' % (path.stem, b64(path)))
    if not entries:
        sys.exit("ERROR: no hay imágenes en %s" % (SRC / IMG_DIR))
    return "const IMG={\n" + ",\n".join(entries) + "\n};"


def main() -> None:
    css = "\n".join(rd(f) for f in CSS_FILES)
    fonts = build_fonts_css()
    body = rd(BODY_FILE)
    js = build_assets_js() + "\n" + "\n".join(rd(f) for f in JS_FILES)

    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="SanderOS EVO — Prototipo interactivo del cockpit digital para Renault Sandero 2017 (1280×720)">
<title>SanderOS EVO · Prototipo interactivo</title>
<style>
{fonts}
</style>
<style>
{css}
</style>
</head>
{body}
<script>
{js}
</script>
</body>
</html>
"""
    OUT.write_text(html, encoding="utf-8")
    print("OK -> %s  (%.2f MB, %d pantallas fuente)" % (
        OUT, os.path.getsize(OUT) / 1024 / 1024, len(JS_FILES)))


if __name__ == "__main__":
    main()
