package com.sanderos.evo.moduleapi

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.StateFlow

/**
 * Bus de capacidades: nadie importa a nadie; todos hablan este vocabulario.
 * Varios módulos pueden publicar la misma capacidad: gana el de mayor
 * prioridad (reordenable por el usuario en Ajustes → Módulos).
 */
interface CapabilityBus {
    fun <T : Capability> register(id: CapabilityId<T>, provider: T, priority: Int = 0)
    fun <T : Capability> unregister(id: CapabilityId<T>, provider: T)

    /** Proveedor activo para la capacidad, o null si nadie publica. */
    fun <T : Capability> stream(id: CapabilityId<T>): StateFlow<T?>

    /** Capacidades disponibles ahora — para diagnóstico en Ajustes. */
    val available: StateFlow<Set<CapabilityId<*>>>
}

/** Ajustes persistentes con namespace por módulo (stub por ahora). */
interface ModuleSettingsStore

/** Panel de notificaciones del core (stub por ahora). */
interface Notifier

class ModuleContext(
    val bus: CapabilityBus,
    val scope: CoroutineScope,
    val store: ModuleSettingsStore = object : ModuleSettingsStore {},
    val notify: Notifier = object : Notifier {}
)

/** Registro y persistencia del estado activado/desactivado de los módulos. */
interface ModuleRegistry {
    val modules: List<SanderModule>
    val enabled: StateFlow<Set<ModuleId>>

    suspend fun setEnabled(id: ModuleId, on: Boolean)

    /** Contexto vivo del módulo si está activo (para abrir su Root). */
    fun contextFor(id: ModuleId): ModuleContext?
}
