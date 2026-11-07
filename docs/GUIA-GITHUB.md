# Guía de publicación en GitHub

Cómo poner en marcha este repositorio en GitHub, guardar el progreso y
publicar versiones. Elige el camino A (recomendado, con GitHub CLI) o el B
(solo navegador + git).

> **Estado actual del repositorio remoto:** `novacode-crypto/sanderos-evo`
> está publicado en el estado de la v1.0.0. Este paquete añade por delante la
> v1.1.0 (fuentes oficiales, rombo de Renault, landing pública y launcher
> nativo Fase 0). Para actualizarlo, ve directamente a la sección
> [«Actualizar tu GitHub a v1.1.0»](#actualizar-tu-github-a-v11-desde-v10).

## A. Primer despliegue con GitHub CLI

Requisitos: [git](https://git-scm.com) y [GitHub CLI](https://cli.github.com)
autenticado (`gh auth login`).

```bash
cd sanderos-evo

# Opcional: tu identidad para los commits nuevos
git config user.name  "Tu Nombre"
git config user.email "tu@correo.com"

# Opcional: reescribir la autoría de los commits ya existentes
# git rebase -r --root --exec 'git commit --amend --no-edit --reset-author'
# git tag -f v1.0.0

# Crear el repo remoto, subir main + tags y activar Pages
gh repo create sanderos-evo --public \
  --description "Cockpit digital para Renault Sandero 2017 · Android 11 · 1280×720 · OBD2" \
  --source . --remote origin --push
git push origin --tags
gh api -X POST repos/{owner}/sanderos-evo/pages -f build_type=workflow
```

O simplemente ejecuta el script incluido, que hace todo lo anterior:

```bash
./push-to-github.sh sanderos-evo --public
```

Al subir el tag `v1.0.0`, el workflow **Release** se dispara solo y publica la
release con el prototipo y la documentación adjuntos como artefactos
descargables. Puedes ver el progreso en la pestaña *Actions*.

## B. Primer despliegue solo con navegador + git

1. Entra en [github.com/new](https://github.com/new) y crea el repositorio
   `sanderos-evo`. **Importante:** no marques «Add a README», «.gitignore» ni
   «license» (este paquete ya los trae, y añadirlos provocaría un conflicto al
   subir).

2. Desde la carpeta del repositorio:

   ```bash
   git config user.name  "Tu Nombre"
   git config user.email "tu@correo.com"
   git remote add origin https://github.com/TU_USUARIO/sanderos-evo.git
   git push -u origin main --tags
   ```

3. El push del tag `v1.0.0` dispara la release automática.

4. Para la demo online: *Settings* → *Pages* → *Build and deployment* →
   *Source: **GitHub Actions***, y ejecuta el workflow «GitHub Pages» desde la
   pestaña *Actions* (botón *Run workflow*).

## Actualizar tu GitHub a v1.1.0 (desde v1.0.0)

El remoto ya existe, así que basta con subir la rama y los tags. Desde la
carpeta del repositorio:

```bash
git remote -v
# origin  https://github.com/novacode-crypto/sanderos-evo.git

git push origin main --tags
```

Ese único comando sube:

1. Los commits pendientes de main (launcher nativo Fase 0, fuentes oficiales,
   rombo de Renault y landing pública).
2. El tag `v1.1.0`, que dispara automáticamente:
   - el workflow **Release** — publica la release v1.1.0 con el prototipo y la
     documentación adjuntos;
   - el workflow **APK Android** — compila el launcher y adjunta
     `SanderOS-EVO-v1.1.0-release.apk` a esa misma release.

Después, activa GitHub Pages (solo la primera vez):

- **Settings → Pages → Build and deployment → Source: GitHub Actions**, y
  ejecuta el workflow «GitHub Pages» desde la pestaña *Actions*.

En 1–2 minutos queda publicado:

| Elemento | URL |
|---|---|
| Landing pública | `https://novacode-crypto.github.io/sanderos-evo/` |
| Demo del prototipo | `https://novacode-crypto.github.io/sanderos-evo/prototype/` |
| Release v1.1.0 | `https://github.com/novacode-crypto/sanderos-evo/releases/tag/v1.1.0` |

La landing se realza sola con la GitHub API: sus botones apuntan a los
activos reales de la última release (APK, prototipo, PDF, DOCX).

## Guardar el progreso día a día

El historial ya viene preparado con 8 commits que reflejan las fases del
proyecto. Para tus avances:

```bash
git switch -c feature/nombre-de-la-mejora     # rama para el cambio
# ...edita prototype/src/... (nunca index.html a mano)
python3 prototype/build.py                    # regenera el prototipo
git add -A
git commit -m "feat(audio): descripción del cambio"
git push origin feature/nombre-de-la-mejora   # y abre un Pull Request
```

La CI fallará si commiteas fuentes sin regenerar `prototype/index.html`: es
intencional, garantiza que el build publicado siempre coincida con las
fuentes.

## Publicar una nueva versión

1. Actualiza `CHANGELOG.md` con la nueva sección `[X.Y.Z]`.
2. Escribe `.github/release-notes/vX.Y.Z.md` con las notas de la versión.
3. Etiqueta y sube:

   ```bash
   git switch main
   git merge feature/...        # si trabajaste en rama
   git tag -a vX.Y.Z -m "vX.Y.Z"
   git push origin main --tags
   ```

4. El workflow **Release** verifica el build y publica la versión con
   artefactos:
   - `SanderOS_EVO_Prototipo_vX.Y.Z.html` (prototipo autocontenido)
   - `SanderOS_EVO_Handoff_Android.pdf` / `.docx`
   - `SanderOS-EVO-vX.Y.Z-release.apk` (la compila y adjunta `apk.yml`)

   Además, el workflow **GitHub Pages** republica la landing y la demo si ha
   cambiado `landing/index.html` o `prototype/index.html`.

## Resultado esperado

| Elemento | URL |
|---|---|
| Repositorio | `https://github.com/novacode-crypto/sanderos-evo` |
| Landing pública | `https://novacode-crypto.github.io/sanderos-evo/` |
| Demo del prototipo | `https://novacode-crypto.github.io/sanderos-evo/prototype/` |
| Releases | `…/sanderos-evo/releases` (v1.1.0 con APK, prototipo y docs) |

## Problemas frecuentes

- **«gh auth status» falla** → ejecuta `gh auth login` y sigue el asistente.
- **La release no se crea** → comprueba la pestaña *Actions*; el workflow
  *Release* solo se dispara con tags que empiecen por `v` (`v1.1.0`, no
  `1.1.0`).
- **Pages devuelve 404** → verifica que *Source* esté en *GitHub Actions* y
  ejecuta el workflow manualmente una vez. La landing queda en `/` y la demo
  del prototipo en `/prototype/`.
- **La CI falla en «Comprobar que el build está actualizado»** → olvidaste
  ejecutar `python3 prototype/build.py` tras editar fuentes.
