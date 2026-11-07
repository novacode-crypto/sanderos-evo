package com.sanderos.evo

import android.os.Bundle
import android.view.WindowManager
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.remember
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.sanderos.evo.core.AppRoot
import com.sanderos.evo.core.ModuleRegistryImpl
import com.sanderos.evo.core.ThemeStore
import com.sanderos.evo.modules.obd.ObdStubModule
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob

/**
 * SanderOS EVO — launcher del cockpit (Renault Sandero 2017 · 1280×720).
 *
 * Fase 0: Vista de Conducción con marca protagonista, carretera animada
 * DEMO, Ajustes con Gestor de Módulos y placeholders para lo que viene.
 */
class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Pantalla siempre encendida e inmersiva (la autorradio no duermela UI)
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        WindowCompat.setDecorFitsSystemWindows(window, false)
        WindowInsetsControllerCompat(window, window.decorView).let { controller ->
            controller.hide(WindowInsetsCompat.Type.systemBars())
            controller.systemBarsBehavior =
                WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        }

        val appContext = applicationContext

        setContent {
            val registry = remember {
                ModuleRegistryImpl(
                    context = appContext,
                    scope = CoroutineScope(SupervisorJob() + Dispatchers.Default),
                    modules = listOf(ObdStubModule())
                )
            }
            val themeStore = remember { ThemeStore(appContext) }

            AppRoot(registry = registry, themeStore = themeStore)
        }
    }
}
