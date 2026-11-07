#!/usr/bin/env bash
# =============================================================================
# SanderOS EVO — Publicación del repositorio en GitHub
# =============================================================================
# Requisitos:
#   - git (https://git-scm.com)
#   - GitHub CLI autenticado:  https://cli.github.com  →  gh auth login
#
# Uso:
#   ./push-to-github.sh [nombre-repo] [--public|--private]
#
# Por defecto crea el repo publico "sanderos-evo" en tu cuenta, sube la rama
# main con todo su historial, publica el tag v1.0.0 (que dispara la release
# automatica con artefactos) y activa GitHub Pages para la demo online.
# =============================================================================
set -euo pipefail

REPO="${1:-sanderos-evo}"
VISIBILITY="${2:---public}"
DESC="Cockpit digital para Renault Sandero 2017 · Android 11 · 1280×720 · OBD2"

# --- 0. Comprobaciones -------------------------------------------------------
command -v git >/dev/null || { echo "ERROR: instala git."; exit 1; }
command -v gh >/dev/null || { echo "ERROR: instala GitHub CLI (gh) y ejecuta 'gh auth login'."; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "ERROR: ejecuta antes: gh auth login"; exit 1; }

# --- 1. Identidad de los commits (EDITAR o exportar variables de entorno) ----
git config user.name  "${SANDEROS_GIT_NAME:-Tu Nombre}"
git config user.email "${SANDEROS_GIT_EMAIL:-tu@correo.com}"

# (Opcional) Reescribir la autoria de los commits ya existentes con tu
# identidad — descomenta estas dos lineas ANTES del paso 2:
# git rebase -r --root --exec 'git commit --amend --no-edit --reset-author'
# git tag -f v1.0.0

# --- 2. Crear el repositorio remoto y subir main ------------------------------
if git remote get-url origin >/dev/null 2>&1; then
  echo "El remoto 'origin' ya existe: $(git remote get-url origin)"
  git push -u origin main
else
  gh repo create "$REPO" $VISIBILITY --description "$DESC" --source . --remote origin --push
fi

# --- 3. Publicar tags (dispara la release automatica v1.0.0) ------------------
git push origin --tags

# --- 4. Activar GitHub Pages (demo online del prototipo) ----------------------
OWNER="$(gh api user -q .login)"
if gh api -X POST "repos/${OWNER}/${REPO}/pages" -f build_type=workflow >/dev/null 2>&1; then
  echo "GitHub Pages activado."
  gh workflow run "GitHub Pages" --repo "${OWNER}/${REPO}" 2>/dev/null || true
  echo "Demo (en unos minutos): https://${OWNER}.github.io/${REPO}/"
else
  echo "Activa Pages a mano: Settings -> Pages -> Source: GitHub Actions"
  echo "y ejecuta el workflow 'GitHub Pages' en la pestaña Actions."
fi

echo
echo "Repositorio: https://github.com/${OWNER}/${REPO}"
echo "Release v1.0.0 (automatica): se genera al procesarse el tag."
echo "Hecho."
