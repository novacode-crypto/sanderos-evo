# Arquitectura de Módulos — SanderOS EVO

> **Documento fundacional.** Define cómo el launcher nativo Android se
> estructura en un **núcleo (core)** con la Vista de Conducción y los Ajustes,
> y cómo el resto de funcionalidades se construye como **módulos independientes
> activables desde Ajustes**, apareciendo (o no) en el dashboard según
> selección del usuario.

| | |
|---|---|
| **Estado** | Aprobado — normativo para la Fase 1 |
| **Versión del documento** | 1.0 (2026-11-07) |
| **Ámbito** | `android-app/` (aún no creado; se crea en la Fase 1) |
| **Deriva de** | Prototipo HTML v1.0.0 (49 pantallas) · `docs/SanderOS_EVO_Handoff_Android.pdf` |
| **Cambios** | Toda modificación de este documento bumpa su versión y se registra en `CHANGELOG.md` |

---

## 1. Resumen ejecutivo

1. El launcher tiene un **core mínimo siempre activo**: Driving View, Dashboard
   con dock, Settings (incluido el Gestor de Módulos), bus de capacidades y tema.
2. **Todo lo demás son módulos** (OBD2, audio, vídeo, teléfono, vehículo,
   archivos, navegación): unidades independientes que se activan/desactivan
   desde Settings, con ciclo de vida propio y presupuesto de memoria.
3. La columna vertebral es el **bus de capacidades tipado**: los módulos nunca
   se referencian entre sí; publican y consumen capacidades.
4. **Nivel A ahora** (módulos integrados por Gradle, activables en runtime),
   con el **contrato diseñado como Nivel B** (plugins en APKs externos) para
   poder migrar sin rediseño.
5. Construcción en **4 fases** con criterios de salida verificables.

---

## 2. Motivación

| Razón | Detalle |
|---|---|
| **RAM** | 2 GB compartidos con el sistema y los servicios de la MCU. Módulo desactivado = 0 MB de memoria y 0 servicios; un monolito no puede competir con eso. |
| **Desarrollo iterativo** | El core sale primero y funciona como launcher diario; cada módulo llega después sin recompilar el universo conceptual del proyecto. |
| **Aislamiento de fallos** | Un módulo con bug entra en estado `ERROR` sin arrastrar al launcher. |
| **Continuidad de diseño** | El prototipo ya es modular: dock configurable de 5 slots, rejilla de apps, pestañas condicionales. Este diseño es su traducción nativa. |

---

## 3. Decisión de diseño: dos niveles de modularidad

| Nivel | Qué es | Pros | Contras |
|---|---|---|---|
| **A. Módulos integrados** — Gradle modules dentro del APK, activables en runtime | Todo vive en la app; Settings activa/desactiva e inicializa o no cada módulo | Robusto total, Compose puro, sin problemas de compatibilidad | Nueva función = recompilar y reinstalar (aceptable: sideload propio) |
| **B. Plugins externos** — APKs separados que el launcher descubre e integra | Instalables desde Settings sin tocar el core; base para terceros | Actualización independiente | Android no permite inyectar UI de otro proceso: el plugin abre pantalla propia; la continuidad visual exige librería de diseño compartida |

**DECISIÓN (D1): empezar en Nivel A con el contrato de Nivel B.** La
arquitectura interna usa desde el día 1 un protocolo de módulos (interfaces,
manifiesto declarativo, versiones de protocolo) idéntico al que necesitarían
los plugins externos. Migrar un módulo integrado a plugin externo será un
cambio de empaquetado, no de diseño.

**Descartes registrados:**

- `DexClassLoader` / carga dinámica de código: frágil entre versiones de
  Kotlin/Compose y ART; fuente constante de dolores de mantenimiento.
- Dynamic Feature Modules de Google: atadas a Play Store y su infraestructura
  de entrega; este proyecto se distribuye por sideload.

---

## 4. Diagrama de arquitectura

```
┌─────────────────────────── SanderOS EVO · APK core ────────────────────────────┐
│                                                                                 │
│  ┌──────── CORE (siempre activo) ────────┐     ┌──── REGISTRO DE MÓDULOS ────┐ │
│  │ · Driving View (carretera Canvas)     │     │ · Manifiesto declarativo    │ │
│  │ · Dashboard + Dock (5 slots)          │◄────┤ · Estado persistido         │ │
│  │ · Settings · Gestor de Módulos        │     │   (DataStore)               │ │
│  │ · Bus de capacidades                  │     │ · Ciclo: enabled → init/act │ │
│  │ · Tema (tokens del diseño → Compose)  │     │   disabled → release        │ │
│  └───────────────┬───────────────────────┘     │ · Prioridades de proveedor  │ │
│                  │ consume                     └──────────┬──────────────────┘ │
│                  │                                        │ descubre e integra  │
│  ┌─── MÓDULOS INTEGRADOS (Gradle, activables desde Settings) ─▼─────────────┐  │
│  │                                                                          │  │
│  │  :modules:obd     publica →  SPEED · RPM · FUEL · DTC                   │  │
│  │  :modules:audio   publica →  MEDIA_CONTROLLER                           │  │
│  │  :modules:vehicle publica →  ODOMETER · VIN                             │  │
│  │  :modules:phone · :modules:files · :modules:video · :modules:nav         │  │
│  │                                                                          │  │
│  │  Cada módulo implementa el contrato SanderModule:                        │  │
│  │   · dashboardCard() → tarjeta en el dashboard si está activo             │  │
│  │   · dockIcon()      → candidato a slot del dock (decide el usuario)      │  │
│  │   · Root()          → su pantalla raíz Compose, estilo :design-lib       │  │
│  │   · provides/consumes → capacidades del bus, nunca referencias directas  │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
      ▲ Futuro (Nivel B): APKs plugin descubiertos vía PackageManager,
        validados por protocolVersion e integrados con el mismo contrato.
```

---

## 5. Estructura de proyecto Gradle

```
sanderos-evo/android-app/
├── app/            # :app        — ensambla el APK del launcher (:app depende de :core)
├── core/           # :core       — shell, Driving View, Settings, dashboard/dock, registro
├── module-api/     # :module-api — el contrato público (SIN dependencias del core)
├── design-lib/     # :design-lib — tokens Compose + componentes base compartidos
└── modules/
    ├── obd/        # :modules:obd · audio · vehicle · phone · files · video · nav
    └── ...
```

`:design-lib` existe para que los módulos (y en el Nivel B, los plugins)
compartan la identidad visual **sin depender de las entrañas del core**: los
tokens del diseño (`01_tokens.css` del prototipo) se traducen aquí a un
`MaterialTheme`/sistema propio Compose con las dos variantes Midnight/Light.

---

## 6. El contrato: `module-api`

`module-api` es Kotlin puro (más Compose solo para `Root()`), **sin
dependencias**. Es lo más difícil de cambiar después de empezar: cualquier
cambio rompe todos los módulos, así que se versiona (`MODULE_PROTOCOL_VERSION`).

### 6.1 Capacidades

```kotlin
// module-api — el vocabulario común del bus

/** Clave tipada de una capacidad publicada en el bus. */
@JvmInline
value class CapabilityId<T : Capability>(val key: String) {
    override fun toString(): String = key
}

/** Marcador raíz de toda capacidad. */
interface Capability

// --- Vocabulario: cada capacidad se declara UNA vez aquí -------------------

interface SpeedCapability : Capability {
    /** km/h; null cuando no hay datos. */
    val speedKmh: StateFlow<Float?>
}

interface MediaControllerCapability : Capability {
    val track: StateFlow<Track?>
    fun playPause(); fun next(); fun previous()
}

val SPEED:           CapabilityId<SpeedCapability>           = CapabilityId("core.speed")
val MEDIA_CONTROLLER: CapabilityId<MediaControllerCapability> = CapabilityId("core.media")
// … RPM, FUEL_LEVEL, TROUBLE_CODES, ODOMETER, VIN, LOCATION, CALLS …
```

### 6.2 Interfaz del módulo

```kotlin
enum class SanderModuleState {
    DISABLED,     // registrado, sin inicializar — 0 MB, sin servicios
    INITIALIZING, // arranque en frío o conectando recursos
    ACTIVE,       // operativo: capacidades publicadas
    DEGRADED,     // activo pero sin datos (p. ej. adaptador OBD desconectado)
    ERROR,        // fallo irrecuperable; se muestra en Settings
    RELEASED      // liberado tras desactivar
}

interface SanderModule {
    val manifest: SanderModuleManifest
    val state: StateFlow<SanderModuleState>

    /** Arranque en frío (una vez, tras activar). Los permisos NO se piden
     *  aquí: se explican y conceden desde Settings antes de activar. */
    suspend fun initialize(ctx: ModuleContext)

    /** Servicios arriba + registro de capacidades. También se llama al
     *  DESPERTAR la unidad (reconexión Bluetooth, etc.). */
    suspend fun activate(ctx: ModuleContext)

    /** Servicios abajo + capacidades retiradas. También se llama al
     *  DORMIR la unidad: las autorradios suspenden y reanudan a diario. */
    suspend fun deactivate()

    /** Liberación total: solo al desactivar el módulo o apagar. */
    suspend fun release()

    /** Tarjeta condicional para el Dashboard. null = sin tarjeta. */
    fun dashboardCard(): ModuleCard? = null

    /** Candidato a slot del dock (visibilidad y orden decide el usuario). */
    fun dockIcon(): DockIcon? = null

    /** Pantalla raíz del módulo, con el estilo de :design-lib. */
    @Composable
    fun Root(ctx: ModuleContext)
}
```

### 6.3 Manifiesto y contexto

```kotlin
enum class MemoryClass(val budgetMb: Int) {
    LIGHT(15), MEDIUM(40), HEAVY(80)
}

data class SanderModuleManifest(
    val id: ModuleId,               // p. ej. "obd"
    val name: String,               // localizado (es)
    val icon: ImageVector,          // del set de 84 iconos del prototipo
    val version: String,            // SemVer del módulo
    val minCoreVersion: String,     // handshake con el core
    val protocolVersion: Int,       // = MODULE_PROTOCOL_VERSION (handshake Nivel B)
    val permissions: List<ModulePermission>,  // se explican ANTES de activar
    val provides: Set<CapabilityId<*>>,
    val consumes: Set<CapabilityId<*>>,
    val memoryClass: MemoryClass,   // presupuesto declarado; visible en Settings
    val hasOwnSettings: Boolean = false,
)

class ModuleContext(
    val bus: CapabilityBus,
    val scope: CoroutineScope,          // cancelado en release()
    val store: ModuleSettingsStore,     // namespace propio en DataStore
    val notify: Notifier,               // panel de notificaciones del core
)
```

---

## 7. El bus de capacidades

Es la pieza que hace que los módulos sean **de verdad** independientes: nadie
importa a nadie; todos hablan el vocabulario de `module-api`.

```kotlin
interface CapabilityBus {
    /** Varios módulos pueden publicar la misma capacidad: el bus resuelve
     *  por prioridad (configurable en Settings → Módulos → Prioridades). */
    fun <T : Capability> register(id: CapabilityId<T>, provider: T, priority: Int = 0)
    fun <T : Capability> unregister(id: CapabilityId<T>, provider: T)

    /** Flujo del proveedor activo (null si nadie publica). */
    fun <T : Capability> stream(id: CapabilityId<T>): StateFlow<T?>

    /** Capacidades disponibles ahora — para diagnóstico en Settings. */
    val available: StateFlow<Set<CapabilityId<*>>>
}
```

### 7.1 El ejemplo canónico

El módulo OBD **publica** velocidad; la Driving View del core **consume** sin
saber quién la provee:

```kotlin
// :modules:obd — publica
class ObdModule : SanderModule {
    override val manifest = SanderModuleManifest(
        id = ModuleId("obd"),
        provides = setOf(SPEED, RPM, FUEL_LEVEL, TROUBLE_CODES),
        permissions = listOf(ModulePermission.BLUETOOTH_CONNECT),
        memoryClass = MemoryClass.LIGHT,
        // …
    )

    override suspend fun activate(ctx: ModuleContext) {
        adapter.connect()                       // KW906 / ELM327 por SPP
        ctx.bus.register(SPEED, adapter.speed, priority = 10)
    }
}

// :core — consume: la carretera animada se alimenta de SPEED,
// y NO sabe que es OBD. Desactiva OBD → cae a GPS; sin GPS → estática.
class DrivingViewModel(bus: CapabilityBus) : ViewModel() {
    val roadSpeedKmh: StateFlow<Float> =
        bus.stream(SPEED)                        // OBD prioridad 10, GPS prioridad 5
            .map { it?.speedKmh ?: 0f }
            .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), 0f)
}
```

**Regla de oro:** si un módulo necesita el import de otro módulo, el diseño
está mal: falta una capacidad en `module-api`.

**Prioridades:** cuando dos módulos publican la misma capacidad (OBD y GPS con
`SPEED`), el bus entrega el de mayor prioridad. El orden por defecto viene en
el manifiesto; el usuario puede reordenarlo en Settings.

---

## 8. Registro de módulos y persistencia

```kotlin
interface ModuleRegistry {
    val modules: StateFlow<List<RegisteredModule>>
    val enabled: Flow<Set<ModuleId>>      // persistido: DataStore «modules.enabled»
    suspend fun setEnabled(id: ModuleId, on: Boolean)
    suspend fun wake()                    // re-activa los módulos al despertar la unidad
    suspend fun sleep()                   // deactivate() de todos al dormir la unidad
}
```

**Arranque en frío:**

1. La app arranca como HOME → lee `modules.enabled` de DataStore.
2. Por cada módulo activo: `initialize()` (solo la primera vez) + `activate()`.
3. El dashboard renderiza las tarjetas de los módulos en estado `ACTIVE`.
4. Los desactivados no se instancian: fila apagada en Settings, 0 MB.

**Dormir / despertar** (el asesino silencioso de launchers): la unidad
suspende el proceso; al despertar, el registro ejecuta `sleep()`/`wake()` —
los módulos re-conectan sus recursos (Bluetooth OBD, MediaSession) sin
reconstruir su estado interno.

---

## 9. Sección «Módulos» en Settings — especificación UX

1. **Lista de módulos**: icono, nombre, versión, clase de memoria declarada
   (p. ej. «~15 MB») y estado (`ACTIVE` / `DEGRADED` / `ERROR` / apagado).
2. **Al activar**: ficha que explica los permisos que necesita (OBD →
   Bluetooth; audio → almacenamiento) antes de confirmar; luego se solicitan.
3. **Orden y visibilidad**: arrastrar para fijar prioridad en el dashboard;
   toggle «mostrar en el dock» por módulo (respeta los 5 slots del dock).
4. **Prioridades de capacidades**: subsección donde se reordena qué proveedor
   gana cuando varios publican la misma capacidad.
5. **Futuro (Nivel B)**: «Instalar desde APK» — descubre plugins externos,
   valida `protocolVersion` y muestra la misma ficha antes de integrarlos.

Todo persistido: al reiniciar la radio, el arranque solo inicializa los
activos. El look & feel es el de la pestaña de ajustes del prototipo.

---

## 10. Presupuesto de memoria

| Componente | Estado | RAM estimada |
|---|---|---|
| `:core` (shell + driving + settings + tema) | siempre activo | 100–140 MB |
| `:modules:obd` | activo | 15–25 MB |
| `:modules:obd` | **desactivado** | **0 MB** |
| `:modules:audio` | activo | 30–50 MB (MediaSession) |
| `:modules:vehicle` | activo | 10–15 MB (GLB del coche en memoria) |
| `:modules:phone` / `:files` / `:modules:video` | activo | 10–30 MB c/u |

**Techo de la app: ~300 MB típicos, 512 MB absoluto** — el resto de los 2 GB
lo necesita el sistema y la MCU. El `memoryClass` del manifiesto se muestra en
Settings para que el usuario entienda el coste de cada activación.

---

## 11. Reglas de dependencia (enforcement en CI)

| Módulo Gradle | Puede depender de | Prohibido |
|---|---|---|
| `:module-api` | (nada externo relevante) | todo lo demás |
| `:design-lib` | Compose, recursos propios | `:core`, `:modules:*` |
| `:core` | `:module-api`, `:design-lib` | `:modules:*` (los descubre por el registro) |
| `:modules:*` | `:module-api`, `:design-lib`, sus propias librerías | `:core`, otros módulos |

La CI ejecuta una tarea `checkModuleBoundaries` que falla el build si alguna
regla se viola — la disciplina de dependencias no depende de la memoria de
quien programa.

---

## 12. Camino futuro — Nivel B (plugins externos)

1. **Descubrimiento**: `PackageManager` consulta APKs con
   `<meta-data android:name="com.sanderos.MODULE" …/>`.
2. **Handshake**: `protocolVersion` del manifiesto del plugin ≤
   `MODULE_PROTOCOL_VERSION` del core; si no, se rechaza con explicación.
3. **Continuidad visual**: el plugin depende de `:design-lib` (publicada como
   librería) para heredar tokens, tipografía y componentes.
4. **Instalación**: Settings → Módulos → «Instalar desde APK» → instalador de
   paquetes de Android → ficha de validación (id, versión, permisos,
   capacidades) → activar.
5. **Confianza** (opcional): verificación de firma compartida core/plugin.

La UI del plugin corre en su propio proceso a pantalla completa, con
transiciones del launcher que disimulan el cambio de proceso. El contrato
(`SanderModule`, manifiesto, capacidades) es idéntico; solo cambia el
empaquetado.

---

## 13. Reglas de producto que vinculan a los módulos

Las reglas del README son **normativas también para cada módulo**:

- Wordmark **SanderOS** (nunca cursiva) y tratamiento de **EVO** — en
  cualquier pantalla de módulo, sin excepción.
- **Vídeo bloqueado en marcha** sin opción de desactivar (el módulo vídeo
  consulta `SPEED`; sin proveedor de velocidad asume bloqueo por defecto).
- **Navegación solo por intents** a apps externas (Karta GPS por defecto) —
  nunca mapas incrustados.
- **No interferir con la MCU** (marcha atrás, iluminación del vehículo).
- **Política DEMO**: datos simulados siempre etiquetados; OBD2/GPS arrancan
  «no conectado». Un módulo nunca presenta telemetría inventada como real.

---

## 14. Fases de construcción

| Fase | Contenido | Criterio de salida |
|---|---|---|
| **1** | `:app` + `:module-api` + `:core` (Driving View con carretera Canvas, Settings con Módulos, dashboard/dock, tema dual) + `:modules:obd` | La carretera se anima con `SPEED` del módulo OBD; desactivar OBD en Settings la deja estática y libera su RAM; dormir/despertar la unidad re-conecta el adaptador |
| **2** | `:modules:audio` + `:modules:vehicle` | Tarjetas now-playing y estado del vehículo en el dashboard; slots del dock desde `dockIcon()`; `MEDIA_CONTROLLER` consumido por la Driving View |
| **3** | `:modules:phone` + `:modules:files` + `:modules:video` + `:modules:nav` | Las pantallas core + módulos opcionales conviven; el bloqueo de vídeo en marcha se valida con `SPEED` |
| **4** | Protocolo Nivel B + «Instalar desde APK» | Un APK plugin de prueba se descubre, valida por `protocolVersion` y activa con el mismo contrato |

---

## 15. Correspondencia con el prototipo

| Módulo nativo | Pantallas del prototipo (ver handoff) | Capacidades típicas |
|---|---|---|
| `:core` | Splash, bienvenida, conducción, panel de notificaciones, ajustes base, dock, rejilla de apps | — (consume) |
| `:modules:obd` | Conexión OBD2, lectura en tiempo real, diagnóstico de fallos | `SPEED`, `RPM`, `FUEL_LEVEL`, `TROUBLE_CODES` |
| `:modules:vehicle` | Estado del vehículo (renders por ángulo y color) | `ODOMETER`, `VIN` |
| `:modules:audio` | Biblioteca, reproducción, ecualizador, fuentes | `MEDIA_CONTROLLER` |
| `:modules:video` | Galería, reproductor (bloqueado en marcha) | — |
| `:modules:phone` | Marcado, contactos, registro de llamadas | `CALLS` |
| `:modules:files` | Explorador virtual, previsualización | — |
| `:modules:nav` | Pantalla de navegación (intents externos) | `LOCATION` |

El prototipo HTML y su demo en GitHub Pages siguen siendo la **referencia
visual normativa**: cada pantalla nativa se valida contra su equivalente.

---

## 16. Registro de decisiones

| ID | Decisión | Motivo |
|---|---|---|
| D1 | Nivel A con contrato de Nivel B | Robustez ahora, migración sin rediseño después |
| D2 | Bus de capacidades tipado (`CapabilityId<T>`) | Sin strings mágicos ni casts inseguros; vocabulario único en `module-api` |
| D3 | `:design-lib` separada del core | Continuidad visual sin acoplar módulos a entrañas del core; base para plugins |
| D4 | No `DexClassLoader`, no Dynamic Feature Modules | Fragilidad ART/Kotlin; atadura a Play Store |
| D5 | Ciclo `initialize/activate/deactivate/release` con `sleep()/wake()` | El ciclo dormir/despertar de la autorradio es el caso de uso #1 |
| D6 | Prioridades de proveedor configurables | Módulos que compiten por la misma capacidad se resuelven por el usuario |
