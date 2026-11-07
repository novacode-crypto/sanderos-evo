package com.sanderos.evo.core

import android.content.Context
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.core.stringSetPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.sanderos.evo.moduleapi.Capability
import com.sanderos.evo.moduleapi.CapabilityBus
import com.sanderos.evo.moduleapi.CapabilityId
import com.sanderos.evo.moduleapi.ModuleContext
import com.sanderos.evo.moduleapi.ModuleId
import com.sanderos.evo.moduleapi.ModuleRegistry
import com.sanderos.evo.moduleapi.ModuleSettingsStore
import com.sanderos.evo.moduleapi.Notifier
import com.sanderos.evo.moduleapi.SanderModule
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

private val Context.dataStore by preferencesDataStore("sanderos_settings")

enum class ThemeMode(val label: String) {
    MIDNIGHT("Midnight"),
    LIGHT("Light"),
    AUTO("Auto");

    companion object {
        fun from(name: String?): ThemeMode =
            entries.firstOrNull { it.name == name } ?: AUTO
    }
}

/** Tema persistido (Auto = Light de 7:00 a 19:00, como el prototipo). */
class ThemeStore(private val context: Context) {
    private val key = stringPreferencesKey("theme_mode")

    val mode: Flow<ThemeMode> = context.dataStore.data
        .map { prefs -> ThemeMode.from(prefs[key]) }

    suspend fun set(mode: ThemeMode) {
        context.dataStore.edit { it[key] = mode.name }
    }
}

/** Implementación en memoria del bus de capacidades. */
class MapBus(
    private val scope: CoroutineScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
) : CapabilityBus {

    private data class Entry(val provider: Capability, val priority: Int)

    private val map = MutableStateFlow<Map<String, List<Entry>>>(emptyMap())

    override fun <T : Capability> register(id: CapabilityId<T>, provider: T, priority: Int) {
        map.update { m ->
            m + (id.key to ((m[id.key] ?: emptyList()) + Entry(provider, priority)))
        }
    }

    override fun <T : Capability> unregister(id: CapabilityId<T>, provider: T) {
        map.update { m ->
            val remaining = (m[id.key] ?: emptyList()).filterNot { it.provider === provider }
            if (remaining.isEmpty()) m - id.key else m + (id.key to remaining)
        }
    }

    @Suppress("UNCHECKED_CAST")
    override fun <T : Capability> stream(id: CapabilityId<T>): StateFlow<T?> =
        map.map { m -> m[id.key]?.maxByOrNull { it.priority }?.provider as? T }
            .stateIn(scope, SharingStarted.Eagerly, null)

    @Suppress("UNCHECKED_CAST")
    override val available: StateFlow<Set<CapabilityId<*>>> =
        map.map { m ->
            m.keys.map { k -> CapabilityId<Capability>(k) }.toSet()
        }.stateIn(scope, SharingStarted.Eagerly, emptySet())
}

/**
 * Registro de módulos — activa/desactiva con persistencia en DataStore y
 * ejecuta el ciclo normativo initialize/activate/deactivate/release.
 */
class ModuleRegistryImpl(
    private val context: Context,
    private val scope: CoroutineScope = CoroutineScope(SupervisorJob() + Dispatchers.Default),
    override val modules: List<SanderModule>
) : ModuleRegistry {

    private val enabledKey = stringSetPreferencesKey("modules_enabled")
    private val bus = MapBus(scope)
    private val contexts = mutableMapOf<ModuleId, ModuleContext>()

    private val _enabled = MutableStateFlow<Set<ModuleId>>(emptySet())
    override val enabled: StateFlow<Set<ModuleId>> = _enabled.asStateFlow()

    init {
        scope.launch {
            context.dataStore.data
                .map { prefs: Preferences -> prefs[enabledKey] ?: emptySet() }
                .collect { ids -> _enabled.value = ids.map { ModuleId(it) }.toSet() }
        }
    }

    override suspend fun setEnabled(id: ModuleId, on: Boolean) {
        context.dataStore.edit { prefs ->
            val current = prefs[enabledKey] ?: emptySet()
            prefs[enabledKey] = if (on) current + id.value else current - id.value
        }
        val module = modules.firstOrNull { it.manifest.id == id } ?: return

        if (on) {
            val ctx = ModuleContext(
                bus = bus,
                scope = scope,
                store = object : ModuleSettingsStore {},
                notify = object : Notifier {}
            )
            module.initialize(ctx)
            module.activate(ctx)
            contexts[id] = ctx
        } else {
            module.deactivate()
            module.release()
            contexts.remove(id)
        }
    }

    override fun contextFor(id: ModuleId): ModuleContext? = contexts[id]
}
