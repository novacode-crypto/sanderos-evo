# Guía de publicación en GitHub

Cómo poner en marcha este repositorio en GitHub, guardar el progreso y
publicar versiones. Elige el camino A (recomendado, con GitHub CLI) o el B
(solo navegador + git).

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

## Resultado esperado

| Elemento | URL |
|---|---|
| Repositorio | `https://github.com/TU_USUARIO/sanderos-evo` |
| Releases | `…/sanderos-evo/releases` (v1.0.0 con artefactos) |
| Demo online | `https://TU_USUARIO.github.io/sanderos-evo/` |

## Problemas frecuentes

- **«gh auth status» falla** → ejecuta `gh auth login` y sigue el asistente.
- **La release no se crea** → comprueba la pestaña *Actions*; el workflow
  *Release* solo se dispara con tags que empiecen por `v` (`v1.1.0`, no
  `1.1.0`).
- **Pages devuelve 404** → verifica que *Source* esté en *GitHub Actions* y
  ejecuta el workflow manualmente una vez.
- **La CI falla en «Comprobar que el build está actualizado»** → olvidaste
  ejecutar `python3 prototype/build.py` tras editar fuentes.
