package com.sanderos.evo.design

import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import com.sanderos.evo.design.R

/** Identidad tipográfica oficial del wordmark (elección del usuario, 2026-11). */
val Sansation: FontFamily = FontFamily(
    Font(R.font.sansation_regular, FontWeight.Normal),
    Font(R.font.sansation_bold, FontWeight.Bold)
)

/** Fuente display "Designer" (Belina Studio) — solo para EVO. */
val Designer: FontFamily = FontFamily(
    Font(R.font.designer, FontWeight.Normal)
)

/** Datos técnicos (velocidad, reloj, OBD2). */
val JetBrainsMono: FontFamily = FontFamily(
    Font(R.font.jetbrains_mono_medium, FontWeight.Medium)
)
