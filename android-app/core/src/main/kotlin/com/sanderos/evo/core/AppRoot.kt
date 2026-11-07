package com.sanderos.evo.core

import androidx.activity.compose.BackHandler
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.sanderos.evo.design.SanderosTheme
import com.sanderos.evo.moduleapi.ModuleId
import com.sanderos.evo.moduleapi.ModuleRegistry
import java.time.LocalTime
import kotlinx.coroutines.delay

/** Pantallas del shell (navegación mínima a medida — sin librería externa). */
sealed interface Screen {
    data object Driving : Screen
    data object Settings : Screen
    data class ModulePreview(val id: ModuleId) : Screen
}

/**
 * Raíz de la app — aplica el tema (Midnight/Light/Auto con persistencia),
 * enruta Driving ↔ Ajustes ↔ pantalla raíz de cada módulo activo.
 */
@Composable
fun AppRoot(registry: ModuleRegistry, themeStore: ThemeStore) {
    val mode by themeStore.mode.collectAsState(initial = ThemeMode.AUTO)
    var isLight by remember { mutableStateOf(false) }

    // Auto: Light de 7:00 a 19:00, Midnight el resto (como el prototipo)
    LaunchedEffect(mode) {
        while (true) {
            isLight = when (mode) {
                ThemeMode.LIGHT -> true
                ThemeMode.MIDNIGHT -> false
                ThemeMode.AUTO -> LocalTime.now().hour in 7..18
            }
            delay(30_000)
        }
    }

    SanderosTheme(isLight = isLight) {
        var screen by remember { mutableStateOf<Screen>(Screen.Driving) }

        BackHandler(enabled = screen != Screen.Driving) {
            screen = Screen.Driving
        }

        when (val current = screen) {
            Screen.Driving ->
                DrivingScreen(onOpenSettings = { screen = Screen.Settings })

            Screen.Settings ->
                SettingsScreen(
                    registry = registry,
                    themeStore = themeStore,
                    onBack = { screen = Screen.Driving },
                    onOpenModule = { id -> screen = Screen.ModulePreview(id) }
                )

            is Screen.ModulePreview -> {
                val module = registry.modules.firstOrNull { it.manifest.id == current.id }
                val ctx = registry.contextFor(current.id)
                if (module != null && ctx != null) {
                    module.Root(ctx)
                } else {
                    DrivingScreen(onOpenSettings = { screen = Screen.Settings })
                }
            }
        }
    }
}
