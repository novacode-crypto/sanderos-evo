package com.sanderos.evo.moduleapi

import androidx.compose.runtime.Composable
import kotlinx.coroutines.flow.StateFlow

/**
 * Contrato público de los módulos de SanderOS EVO.
 *
 * Este paquete NO depende del core ni de ningún módulo: es el vocabulario
 * común (ver docs/ARQUITECTURA-MODULOS.md). Cualquier cambio aquí rompe
 * todos los módulos, por lo que se versiona con [MODULE_PROTOCOL_VERSION].
 */
const val MODULE_PROTOCOL_VERSION: Int = 1
const val MIN_CORE_VERSION: String = "0.1.0"

/** Identificador estable de un módulo (p. ej. "obd"). */
@JvmInline
value class ModuleId(val value: String) {
    override fun toString(): String = value
}

enum class SanderModuleState {
    DISABLED,     // registrado, sin inicializar — 0 MB, sin servicios
    INITIALIZING, // arranque en frío
    ACTIVE,       // operativo: capacidades publicadas
    DEGRADED,     // activo pero sin datos (p. ej. adaptador desconectado)
    ERROR,        // fallo irrecuperable; se muestra en Ajustes
    RELEASED      // liberado tras desactivar
}

enum class MemoryClass(val budgetMb: Int, val label: String) {
    LIGHT(15, "~15 MB"),
    MEDIUM(40, "~40 MB"),
    HEAVY(80, "~80 MB")
}

enum class ModulePermission(val label: String) {
    BLUETOOTH_CONNECT("Bluetooth — conexión con el adaptador OBD2"),
    LOCATION("Ubicación — GPS del vehículo"),
    STORAGE("Almacenamiento — biblioteca multimedia")
}

data class SanderModuleManifest(
    val id: ModuleId,
    val name: String,
    val version: String,
    val minCoreVersion: String = MIN_CORE_VERSION,
    val protocolVersion: Int = MODULE_PROTOCOL_VERSION,
    val permissions: List<ModulePermission> = emptyList(),
    val provides: Set<CapabilityId<*>> = emptySet(),
    val consumes: Set<CapabilityId<*>> = emptySet(),
    val memoryClass: MemoryClass = MemoryClass.LIGHT,
    val hasOwnSettings: Boolean = false
)

/**
 * Unidad funcional activable desde Ajustes → Módulos.
 *
 * Ciclo (normativo):
 *  - Activar:   initialize() una vez + activate() (también al DESPERTAR la unidad)
 *  - Desactivar: deactivate() + release() (libera memoria y servicios)
 */
interface SanderModule {
    val manifest: SanderModuleManifest
    val state: StateFlow<SanderModuleState>

    suspend fun initialize(ctx: ModuleContext) {}
    suspend fun activate(ctx: ModuleContext) {}
    suspend fun deactivate() {}
    suspend fun release() {}

    /** Pantalla raíz del módulo, con el estilo de :design-lib. */
    @Composable
    fun Root(ctx: ModuleContext) {}
}
