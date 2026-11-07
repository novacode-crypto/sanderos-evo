# Landing pública — SanderOS EVO

Página oficial del proyecto para **GitHub Pages**, autocontenida en un único
archivo (`index.html`, ~0,9 MB): fuentes, rombo de Renault e imágenes van
embebidos, no depende de ningún recurso externo salvo la GitHub API
(opcional, ver más abajo).

## Qué incluye

- **Fuentes oficiales del launcher** (las mismas que la app Android, ver
  [`../android-app/FONTS.md`](../android-app/FONTS.md)): Sansation
  Regular/Bold para «Sander»/«OS» y la interfaz, **Designer** (Belina Studio)
  para «EVO» con bold sintético, y JetBrains Mono para datos.
- **Rombo de Renault** como máscara CSS tintada (tema Midnight).
- **Pantallas completas**: cada sección ocupa el 100% de la vista
  (100 dvh + scroll-snap obligatorio) — hero, Android, prototipo,
  documentación, código, marca y cierre.
- Botones de descarga **realzados con la GitHub API**: si `api.github.com`
  responde, apuntan a los activos reales de la última release (APK,
  prototipo, PDF, DOCX) y muestran versión, tamaño y fecha. Si no responde
  (sin conexión o límite de peticiones), quedan los enlaces de respaldo a la
  página de releases.

## Despliegue

El workflow `.github/workflows/pages.yml` publica automáticamente:

- `/` → esta landing (`landing/index.html`)
- `/prototype/` → la demo del prototipo (`prototype/index.html`)

Requisito único (una vez): *Settings → Pages → Build and deployment →
Source: **GitHub Actions***.

## Mantenimiento

El archivo se genera desde el entorno de diseño con
`scripts/build_landing.py` (raíz del proyecto de diseño) a partir de las
fuentes del prototipo y los activos del repo. Si editas a mano, evita tocar
los bloques base64 de `<style>` y de los `src="data:..."`; el contenido
editable es el HTML del cuerpo y el `<script>` final.
