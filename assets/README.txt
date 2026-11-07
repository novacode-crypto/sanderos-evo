SanderOS EVO — Biblioteca de activos originales
=================================================

Todos los activos fueron generados para este proyecto y comparten el
lenguaje visual Midnight Futuristic Cockpit (navy #0A192F / cian #00D2FF).

vehicle/  — Renders del Renault Sandero 2017 (hatchback convencional, NO Stepway)
  hero_dusk_rear.png            1344×768  (16:9)   Hero de la Vista de Conducción:
                                                     trasera 3/4 al anochecer, carretera
                                                     con estelas y atardecer azul-violeta.
  studio_front_grey.png         1152×864  (4:3)    Mi Vehículo · ángulo frontal 3/4.
  studio_side_grey.png          1152×864  (4:3)    Mi Vehículo · perfil lateral.
  studio_rear_grey.png          1152×864  (4:3)    Mi Vehículo · trasera 3/4 (Gris Nacarado).
  studio_rear_glacier_white.png 1152×864  (4:3)    Pintura Blanco Glaciar (trasera 3/4).
  studio_rear_nardo_black.png   1152×864  (4:3)    Pintura Negro Nardo (trasera 3/4).
  studio_rear_flare_red.png     1152×864  (4:3)    Pintura Rojo Flare (trasera 3/4).
  studio_rear_iron_blue.png     1152×864  (4:3)    Pintura Azul Iron (trasera 3/4).

  Recomendación de producción: sustituir los renders multiángulo por un único
  modelo 3D (GLB/glTF) del Sandero con la pintura como material paramétrico.

media/    — Contenido de demostración (etiquetado DEMO en el prototipo)
  cover_piano.png      1024×1024  Portada de álbum (demo) — piano y cielo estrellado.
  cover_waves.png      1024×1024  Portada de álbum (demo) — ondas geométricas.
  cover_mountain.png   1024×1024  Portada de álbum (demo) — montañas al anochecer.
  thumb_nightdrive.png 1344×768   Miniatura de vídeo (demo) — conducción nocturna con lluvia.
  thumb_coast.png      1344×768   Miniatura de vídeo (demo) — ruta costera al atardecer.

brand/    — Identidad vectorial y rombo de Renault
  logo_horizontal_dark.svg   440×84   Wordmark para fondos oscuros.
  logo_horizontal_light.svg  440×84   Wordmark para fondos claros.
  logo_compact.svg           220×60   Marca compacta (icono + EVO).
  app_icon.svg               192×192  Icono de lanzador (exportar a mipmap PNG).
  renault_diamond_black.png  500×658  Rombo de Renault (#231F20) sobre fondo
                                      transparente — tinte del tema Light y
                                      versión de partida del usuario.
  renault_diamond_white.png  500×658  Rombo de Renault (#F8FAFC) — tinte del
                                      tema Midnight. En web se usa como máscara
                                      CSS (solo importa el alfa).

Reglas de marca invariables
  · El wordmark se escribe «SanderOS» — nunca en cursiva, nunca separado.
  · «Sander» usa Sansation regular y el color primario de texto; «OS» usa
    Sansation bold y siempre el acento cian, con la misma línea base.
  · El rombo de Renault precede al wordmark, tintado según el tema
    (negro #231F20 en Light, blanco #F8FAFC en Midnight).
  · «EVO» usa la fuente display Designer (Belina Studio) — bold sintético
    porque solo existe en Regular — a 0.86em, mayúsculas, tracking .06em y
    degradado cian→azul Nova; distinguible sin competir con el wordmark.
