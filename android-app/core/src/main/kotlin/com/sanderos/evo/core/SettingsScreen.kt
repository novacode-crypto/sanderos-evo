package com.sanderos.evo.core

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.LightMode
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sanderos.evo.design.BrandWordmark
import com.sanderos.evo.design.CapabilityChip
import com.sanderos.evo.design.Sansation
import com.sanderos.evo.design.sanderosPalette
import com.sanderos.evo.moduleapi.ModuleId
import com.sanderos.evo.moduleapi.ModuleRegistry
import com.sanderos.evo.moduleapi.SanderModuleState
import kotlinx.coroutines.launch

/**
 * Ajustes — apariencia (tema), Gestor de Módulos (activar/desactivar con
 * persistencia) y Acerca de. Es la puerta de entrada a los módulos.
 */
@Composable
fun SettingsScreen(
    registry: ModuleRegistry,
    themeStore: ThemeStore,
    onBack: () -> Unit,
    onOpenModule: (ModuleId) -> Unit
) {
    val p = sanderosPalette()
    val mode by themeStore.mode.collectAsState(initial = ThemeMode.AUTO)
    val enabled by registry.enabled.collectAsState()
    val scope = rememberCoroutineScope()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(p.bgBase)
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 36.dp, vertical = 20.dp)
    ) {
        // Cabecera
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = "Volver",
                    tint = p.tx2
                )
            }
            Spacer(Modifier.width(8.dp))
            Text(
                text = "Ajustes",
                style = TextStyle(
                    fontFamily = Sansation,
                    fontWeight = FontWeight.Bold,
                    fontSize = 24.sp,
                    color = p.tx1
                )
            )
        }

        Spacer(Modifier.height(22.dp))

        SectionTitle("Apariencia")
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            ThemeOption(
                selected = mode == ThemeMode.MIDNIGHT,
                label = "Midnight",
                icon = Icons.Filled.DarkMode,
                onClick = { scope.launch { themeStore.set(ThemeMode.MIDNIGHT) } },
                modifier = Modifier.weight(1f)
            )
            ThemeOption(
                selected = mode == ThemeMode.LIGHT,
                label = "Light",
                icon = Icons.Filled.LightMode,
                onClick = { scope.launch { themeStore.set(ThemeMode.LIGHT) } },
                modifier = Modifier.weight(1f)
            )
            ThemeOption(
                selected = mode == ThemeMode.AUTO,
                label = "Auto (7–19)",
                icon = Icons.Filled.Schedule,
                onClick = { scope.launch { themeStore.set(ThemeMode.AUTO) } },
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(Modifier.height(26.dp))

        // ---- Gestor de Módulos ----
        SectionTitle("Módulos")

        registry.modules.forEach { module ->
            val m = module.manifest
            val isOn = m.id in enabled
            val state by module.state.collectAsState()
            val shape = RoundedCornerShape(14.dp)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 6.dp)
                    .background(if (isOn) p.bgPanel else p.bgSunk, shape)
                    .border(1.dp, if (isOn) p.lineAcc else p.line, shape)
                    .clickable(enabled = isOn) { onOpenModule(m.id) }
                    .padding(horizontal = 18.dp, vertical = 14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Inicial del módulo en pastilla circular
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .background(p.bgRaise, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = m.id.value.take(2).uppercase(),
                        style = TextStyle(
                            fontFamily = Sansation,
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp,
                            color = if (isOn) p.acc else p.tx3
                        )
                    )
                }
                Spacer(Modifier.width(14.dp))
                Column(Modifier.weight(1f)) {
                    Text(
                        text = m.name,
                        style = TextStyle(
                            fontFamily = Sansation,
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp,
                            color = if (isOn) p.tx1 else p.tx2
                        )
                    )
                    Text(
                        text = "v${m.version} · ${m.memoryClass.label} · ${
                            when (state) {
                                SanderModuleState.ACTIVE -> "activo"
                                SanderModuleState.DEGRADED -> "activo (sin datos)"
                                SanderModuleState.INITIALIZING -> "iniciando"
                                SanderModuleState.ERROR -> "error"
                                SanderModuleState.RELEASED -> "liberado"
                                else -> "desactivado"
                            }
                        }",
                        style = TextStyle(fontSize = 12.sp, color = p.tx3)
                    )
                }
                Spacer(Modifier.width(10.dp))
                Switch(
                    checked = isOn,
                    onCheckedChange = { on ->
                        scope.launch { registry.setEnabled(m.id, on) }
                    },
                    colors = SwitchDefaults.colors(
                        checkedTrackColor = p.acc,
                        checkedThumbColor = p.bgDeep
                    )
                )
            }
        }

        Text(
            text = "Los módulos desactivados no consumen memoria ni servicios. " +
                "Cada módulo nuevo se instala aquí sin tocar el núcleo.",
            style = TextStyle(fontSize = 12.sp, color = p.tx3),
            modifier = Modifier.padding(vertical = 8.dp)
        )

        Spacer(Modifier.height(26.dp))

        // ---- Acerca de ----
        SectionTitle("Acerca de")
        val aboutShape = RoundedCornerShape(14.dp)
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(p.bgPanel, aboutShape)
                .border(1.dp, p.line, aboutShape)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            BrandWordmark(fontSize = 26.sp, markHeight = 58.dp)
            Spacer(Modifier.height(12.dp))
            Text(
                text = "v0.1.0 · Fase 0 (launcher)",
                style = TextStyle(fontSize = 12.sp, color = p.tx2)
            )
            Text(
                text = "Renault Sandero 2017 · Android 11 · 1280 × 720 · AC8257",
                style = TextStyle(fontSize = 12.sp, color = p.tx3)
            )
            Spacer(Modifier.height(14.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                CapabilityChip("SanderOS")
                CapabilityChip("EVO")
            }
        }

        Spacer(Modifier.height(28.dp))
    }
}

@Composable
private fun SectionTitle(text: String) {
    val p = sanderosPalette()
    Text(
        text = text.uppercase(),
        style = TextStyle(
            fontFamily = Sansation,
            fontWeight = FontWeight.Bold,
            fontSize = 11.sp,
            letterSpacing = 1.6.sp,
            color = p.tx3
        ),
        modifier = Modifier.padding(bottom = 10.dp)
    )
}

@Composable
private fun ThemeOption(
    selected: Boolean,
    label: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val p = sanderosPalette()
    val shape = RoundedCornerShape(12.dp)
    Column(
        modifier = modifier
            .height(76.dp)
            .background(if (selected) p.bgPanel else p.bgSunk, shape)
            .border(
                1.dp,
                if (selected) p.lineAcc else p.line,
                shape
            )
            .clickable(onClick = onClick),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = if (selected) p.acc else p.tx3,
            modifier = Modifier.size(22.dp)
        )
        Spacer(Modifier.height(6.dp))
        Text(
            text = label,
            style = TextStyle(
                fontFamily = Sansation,
                fontSize = 12.sp,
                color = if (selected) p.tx1 else p.tx2
            )
        )
    }
}
