package com.sanderos.evo.core

import androidx.compose.foundation.Canvas
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableDoubleStateOf
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.dp
import androidx.compose.runtime.withFrameNanos
import com.sanderos.evo.design.sanderosPalette
import kotlin.math.pow
import kotlin.math.sin

/**
 * Carretera pseudo-3D (técnica OutRun) — la animación se alimenta de la
 * velocidad (km/h). Cuando el módulo OBD2 esté activo usará datos reales;
 * hoy consume DemoSpeedEngine.
 */
@Composable
fun RoadCanvas(speedKmh: Float, modifier: Modifier = Modifier) {
    val p = sanderosPalette()
    var phase by remember { mutableFloatStateOf(0f) }
    var curveT by remember { mutableDoubleStateOf(0.0) }

    LaunchedEffect(Unit) {
        var last = 0L
        while (true) {
            withFrameNanos { t ->
                if (last != 0L) {
                    val dt = (t - last) / 1e9f
                    phase = (phase + speedKmh / 3.6f * dt * 0.045f) % 1f
                    curveT += dt
                }
                last = t
            }
        }
    }

    Canvas(modifier = modifier) {
        val w = size.width
        val h = size.height
        val horizon = h * 0.08f
        val cx = w / 2f

        // curva suave de la carretera (traza un amplio sinusoidal)
        val curve = sin(curveT * 0.32).toFloat() * w * 0.11f

        fun xc(t: Float): Float = cx + curve * (1f - t)
        fun half(t: Float): Float = w * (0.028f + 0.46f * t.pow(1.6f))
        fun y(t: Float): Float = horizon + (h - horizon) * t

        // cielo + estrellas (solo medianoche)
        drawRect(p.bgDeep, size = Size(w, horizon))
        if (!p.isLight) {
            var seed = 1
            repeat(42) { i ->
                seed = (seed * 1103515245 + 12345) and 0x7FFFFFFF
                val fx = (seed % 997) / 997f * w
                seed = (seed * 1103515245 + 12345) and 0x7FFFFFFF
                val fy = (seed % 883) / 883f * (horizon - 6f) + 2f
                val alpha = 0.06f + (i % 3) * 0.05f
                drawCircle(Color(0xFFBFD9FF), radius = 1.1f, center = Offset(fx, fy), alpha = alpha)
            }
        }

        // terreno
        drawRect(p.asphalt, topLeft = Offset(0f, horizon), size = Size(w, h - horizon))

        // resplandor del horizonte
        drawRect(
            brush = Brush.verticalGradient(
                colors = listOf(p.horizon, Color.Transparent),
                startY = horizon,
                endY = horizon + h * 0.22f
            ),
            topLeft = Offset(0f, horizon),
            size = Size(w, h * 0.22f)
        )

        // calzada (trapecio curvado)
        val steps = 26
        val road = Path()
        for (i in 0..steps) {
            val t = i.toFloat() / steps
            val px = xc(t) - half(t)
            if (i == 0) road.moveTo(px, y(t)) else road.lineTo(px, y(t))
        }
        for (i in steps downTo 0) {
            val t = i.toFloat() / steps
            road.lineTo(xc(t) + half(t), y(t))
        }
        road.close()
        val roadFill = if (p.isLight) Color(0xFFC6CFDC) else Color(0xFF0A1422)
        drawPath(road, roadFill)

        // bordes luminosos (cian)
        val edgeColor = if (p.isLight) p.accInk.copy(alpha = 0.55f) else p.acc.copy(alpha = 0.55f)
        for (side in listOf(-1f, 1f)) {
            val edge = Path()
            for (i in 0..steps) {
                val t = i.toFloat() / steps
                val px = xc(t) + side * half(t) * 0.95f
                if (i == 0) edge.moveTo(px, y(t)) else edge.lineTo(px, y(t))
            }
            drawPath(edge, edgeColor, style = Stroke(width = 2.5f))
        }

        // línea central discontinua en perspectiva, animada por la velocidad
        val markColor = if (p.isLight) Color(0xFF55647A) else Color(0xFFE2E8F0)
        val nDashes = 14
        for (i in 0 until nDashes) {
            val d = i - phase
            if (d < -0.85f) continue
            val t = 1f / (1f + d * 0.22f)
            if (t <= 0.02f) continue
            val py = y(t)
            val len = 30f * t.pow(1.8f) + 2f
            val sw = 4.5f * t + 1.2f
            drawLine(
                color = markColor,
                start = Offset(xc(t), py - len),
                end = Offset(xc(t), py),
                strokeWidth = sw,
                cap = StrokeCap.Round
            )
        }
    }
}
