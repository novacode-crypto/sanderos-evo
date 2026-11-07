package com.sanderos.evo.design

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

/**
 * Tokens de color — traducción directa de prototype/src/css/01_tokens.css.
 * Midnight es el tema por defecto; Light comparte geometría.
 */
data class SanderosPalette(
    val bgDeep: Color,
    val bgBase: Color,
    val bgPanel: Color,
    val bgRaise: Color,
    val bgSunk: Color,
    val line: Color,
    val lineAcc: Color,
    val tx1: Color,
    val tx2: Color,
    val tx3: Color,
    val acc: Color,       // Electric Cyan
    val accInk: Color,    // Cyan accesible para texto sobre claro
    val acc2: Color,      // Nova Blue
    val ok: Color,
    val warn: Color,
    val err: Color,
    val asphalt: Color,   // terreno de la carretera
    val asphaltLine: Color,
    val horizon: Color,
    val isLight: Boolean
)

val MidnightPalette = SanderosPalette(
    bgDeep = Color(0xFF071326),
    bgBase = Color(0xFF0A192F),
    bgPanel = Color(0xFF14243B),
    bgRaise = Color(0xFF1B2E4A),
    bgSunk = Color(0xFF0C1B31),
    line = Color(0x2994A3B8),
    lineAcc = Color(0x6100D2FF),
    tx1 = Color(0xFFF8FAFC),
    tx2 = Color(0xFF94A3B8),
    tx3 = Color(0xFF5F7089),
    acc = Color(0xFF00D2FF),
    accInk = Color(0xFF00D2FF),
    acc2 = Color(0xFF176BCE),
    ok = Color(0xFF16C784),
    warn = Color(0xFFF5A623),
    err = Color(0xFFEF4444),
    asphalt = Color(0xFF0B1526),
    asphaltLine = Color(0x3394A3B8),
    horizon = Color(0x1400D2FF),
    isLight = false
)

val LightPalette = SanderosPalette(
    bgDeep = Color(0xFFCBD5E3),
    bgBase = Color(0xFFE9EEF5),
    bgPanel = Color(0xFFFFFFFF),
    bgRaise = Color(0xFFF2F6FA),
    bgSunk = Color(0xFFE4EAF2),
    line = Color(0x1F0A192F),
    lineAcc = Color(0x6600B4E4),
    tx1 = Color(0xFF0A192F),
    tx2 = Color(0xFF51617A),
    tx3 = Color(0xFF8B99AE),
    acc = Color(0xFF00B4E4),
    accInk = Color(0xFF0276A6),
    acc2 = Color(0xFF176BCE),
    ok = Color(0xFF0E9E68),
    warn = Color(0xFFC77F11),
    err = Color(0xFFD83838),
    asphalt = Color(0xFFD7DEE9),
    asphaltLine = Color(0x33516174),
    horizon = Color(0x1A00B4E4),
    isLight = true
)

val LocalSanderosPalette = staticCompositionLocalOf { MidnightPalette }

@Composable
fun SanderosTheme(isLight: Boolean = false, content: @Composable () -> Unit) {
    val palette = if (isLight) LightPalette else MidnightPalette
    CompositionLocalProvider(LocalSanderosPalette provides palette) {
        MaterialTheme(
            colorScheme = if (isLight) {
                lightColorScheme(
                    primary = palette.acc,
                    background = palette.bgBase,
                    surface = palette.bgPanel,
                    onPrimary = Color(0xFF0A192F),
                    onBackground = palette.tx1,
                    onSurface = palette.tx1
                )
            } else {
                darkColorScheme(
                    primary = palette.acc,
                    background = palette.bgBase,
                    surface = palette.bgPanel,
                    onPrimary = Color(0xFF0A192F),
                    onBackground = palette.tx1,
                    onSurface = palette.tx1
                )
            },
            content = content
        )
    }
}

/** Acceso a los tokens desde cualquier composable. */
@Composable
fun sanderosPalette(): SanderosPalette = LocalSanderosPalette.current
