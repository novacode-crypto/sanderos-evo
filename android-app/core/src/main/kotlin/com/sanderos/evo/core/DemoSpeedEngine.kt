package com.sanderos.evo.core

import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

/**
 * Motor de velocidad DEMO — perfil de conducción simulada.
 *
 * Regla de producto: los datos simulados en vivo van SIEMPRE etiquetados
 * con DEMO (ver DemoChip); nunca se presentan como telemetría real.
 * En la Fase 1 lo sustituye SpeedCapability del módulo OBD2.
 */
class DemoSpeedEngine {

    private val _speed = MutableStateFlow(0f)
    val speed: StateFlow<Float> = _speed

    private var t = 0.0

    /** Bucle de simulación: detenido → urbano → zona lenta → carretera. */
    suspend fun run() {
        while (true) {
            t += 0.05
            val phase = t % 120.0
            val target = when {
                phase < 18.0 -> 0f    // detenido (semáforo)
                phase < 50.0 -> 92f   // crucero urbano
                phase < 80.0 -> 55f   // zona lenta
                else -> 118f          // carretera
            }
            // aceleración suave hacia el objetivo
            _speed.value += (target - _speed.value) * 0.06f
            if (kotlin.math.abs(_speed.value - target) < 0.4f) _speed.value = target
            delay(50)
        }
    }
}
