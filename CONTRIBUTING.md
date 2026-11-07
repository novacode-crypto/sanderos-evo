# Cómo contribuir a SanderOS EVO

Gracias por tu interés. Este documento describe el flujo de trabajo para seguir
avanzando el proyecto de forma ordenada.

## Flujo básico

1. Crea una rama descriptiva desde `main`:

   ```bash
   git switch -c feature/ecualizador-visual
   # o bien: fix/desbaste-tabla-obd
   ```

2. Haz tus cambios **sobre las fuentes** (`prototype/src/`), nunca sobre
   `prototype/index.html` a mano.

3. Regenera el prototipo y commitea fuentes + build juntos:

   ```bash
   python3 prototype/build.py
   git add prototype/
   git commit -m "feat(audio): curva de graves ajustable en el ecualizador"
   ```

4. Abre un Pull Request hacia `main` describiendo el cambio y adjuntando una
   captura si afecta a lo visual.

## Convenciones de commits

Formato [Conventional Commits](https://www.conventionalcommits.org/es/):

```
<tipo>(<ámbito>): <descripción>
```

| Tipo | Uso |
|---|---|
| `feat` | Nuevas pantallas, componentes o funcionalidades |
| `fix` | Correcciones de comportamiento o visual |
| `docs` | Documentación, README, notas de versión |
| `style` | Tokens, tipografía, espaciado (sin lógica) |
| `refactor` | Reorganización de fuentes sin cambio visible |
| `chore` | CI, tooling, build |

Ámbitos habituales: `audio`, `video`, `phone`, `vehicle`, `obd`, `files`,
`settings`, `nav`, `driving`, `brand`, `build`.

## Reglas innegociables del producto

Antes de contribuir, revisa la sección «Reglas de marca y producto» del
[README](README.md). En particular: el vídeo bloqueado en marcha, la navegación
solo por intents, la no interferencia con la MCU y la política DEMO de datos
simulados son decisiones cerradas.

## Publicar una versión

Solo mantenedores. Ver «Publicación de versiones» en el [README](README.md):
tag SemVer + notas en `.github/release-notes/` + push de tags; la release se
genera automáticamente con el prototipo y la documentación adjuntos.
