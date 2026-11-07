package com.sanderos.evo.modules.obd

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bluetooth
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sanderos.evo.design.CapabilityChip
import com.sanderos.evo.design.DashedPlaceholder
import com.sanderos.evo.design.Sansation
import com.sanderos.evo.design.sanderosPalette
import com.sanderos.evo.moduleapi.CapabilityId
import com.sanderos.evo.moduleapi.MemoryClass
import com.sanderos.evo.moduleapi.MODULE_PROTOCOL_VERSION
import com.sanderos.evo.moduleapi.MIN_CORE_VERSION
import com.sanderos.evo.moduleapi.ModuleContext
import com.sanderos.evo.moduleapi.ModuleId
import com.sanderos.evo.moduleapi.ModulePermission
import com.sanderos.evo.moduleapi.RPM
import com.sanderos.evo.moduleapi.SanderModule
import com.sanderos.evo.moduleapi.SanderModuleManifest
import com.sanderos.evo.moduleapi.SanderModuleState
import com.sanderos.evo.moduleapi.SPEED
import com.sanderos.evo.moduleapi.TROUBLE_CODES
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Módulo OBD2 — STUB de la Fase 0.
 *
 * Demuestra el ciclo completo del contrato (activar/desactivar desde
 * Ajustes con persistencia y estado visible). La implementación real
 * (ELM327/KW906 por Bluetooth SPP, PIDs en vivo) llega en la Fase 1
 * del plan: docs/ARQUITECTURA-MODULOS.md § 14.
 */
class ObdStubModule : SanderModule {

    override val manifest = SanderModuleManifest(
        id = ModuleId("obd"),
        name = "OBD2 · Konnwei KW906",
        version = "0.1.0-stub",
        minCoreVersion = MIN_CORE_VERSION,
        protocolVersion = MODULE_PROTOCOL_VERSION,
        permissions = listOf(ModulePermission.BLUETOOTH_CONNECT),
        provides = setOf<CapabilityId<*>>(SPEED, RPM, TROUBLE_CODES),
        memoryClass = MemoryClass.LIGHT
    )

    private val _state = MutableStateFlow(SanderModuleState.DISABLED)
    override val state: StateFlow<SanderModuleState> = _state.asStateFlow()

    override suspend fun initialize(ctx: ModuleContext) {
        _state.value = SanderModuleState.INITIALIZING
    }

    override suspend fun activate(ctx: ModuleContext) {
        // Stub: activo pero sin datos (adaptador no implementado aún)
        _state.value = SanderModuleState.DEGRADED
    }

    override suspend fun deactivate() {
        _state.value = SanderModuleState.DISABLED
    }

    override suspend fun release() {
        _state.value = SanderModuleState.RELEASED
    }

    @Composable
    override fun Root(ctx: ModuleContext) {
        ObdStubScreen()
    }
}

@Composable
private fun ObdStubScreen() {
    val p = sanderosPalette()
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(p.bgBase)
            .padding(48.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = Icons.Filled.Bluetooth,
                contentDescription = null,
                tint = p.tx3,
                modifier = Modifier.size(44.dp)
            )
            Spacer(Modifier.height(18.dp))
            Text(
                text = "Módulo OBD2 en construcción",
                style = TextStyle(
                    fontFamily = Sansation,
                    fontWeight = FontWeight.Bold,
                    fontSize = 22.sp,
                    color = p.tx1
                )
            )
            Spacer(Modifier.height(8.dp))
            Text(
                text = "La conexión real al adaptador Konnwei KW906 (ELM327 · Bluetooth)\n" +
                    "y la lectura de PIDs en vivo llegan en la Fase 1.",
                style = TextStyle(fontSize = 14.sp, color = p.tx2),
                modifier = Modifier.padding(horizontal = 24.dp)
            )
            Spacer(Modifier.height(22.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                CapabilityChip("SPEED")
                CapabilityChip("RPM")
                CapabilityChip("DTC")
            }
            Spacer(Modifier.height(18.dp))
            DashedPlaceholder(
                title = "Lectura en tiempo real",
                subtitle = "Fase 1 · próximamente",
                modifier = Modifier
                    .fillMaxWidth(0.45f)
                    .height(64.dp)
            )
        }
    }
}
