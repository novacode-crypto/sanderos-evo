package com.sanderos.evo.moduleapi

import kotlinx.coroutines.flow.StateFlow

/**
 * Capacidades del bus — el vocabulario tipado con el que los módulos se
 * comunican sin conocerse. Regla de oro: si un módulo necesita importar a
 * otro módulo, falta una capacidad aquí.
 */
interface Capability

interface SpeedCapability : Capability {
    /** km/h; null cuando no hay datos. */
    val speedKmh: StateFlow<Float?>
}

interface RpmCapability : Capability {
    val rpm: StateFlow<Int?>
}

interface MediaControllerCapability : Capability {
    val trackName: StateFlow<String?>
    fun playPause() {}
    fun next() {}
    fun previous() {}
}

interface TroubleCodesCapability : Capability {
    val pendingCount: StateFlow<Int?>
}

@JvmInline
value class CapabilityId<T : Capability>(val key: String) {
    override fun toString(): String = key
}

// --- Vocabulario global (declarar UNA sola vez) ---
val SPEED: CapabilityId<SpeedCapability> = CapabilityId("core.speed")
val RPM: CapabilityId<RpmCapability> = CapabilityId("core.rpm")
val MEDIA_CONTROLLER: CapabilityId<MediaControllerCapability> = CapabilityId("core.media")
val TROUBLE_CODES: CapabilityId<TroubleCodesCapability> = CapabilityId("core.dtc")
