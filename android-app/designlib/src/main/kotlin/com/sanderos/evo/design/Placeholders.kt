package com.sanderos.evo.design

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.RoundRect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.draw.drawBehind

/** Borde discontinuo (para placeholders de módulos y slots vacíos). */
fun Modifier.dashedBorder(
    color: Color,
    corner: Dp = 12.dp,
    width: Dp = 1.5.dp
): Modifier = drawBehind {
    val stroke = width.toPx()
    val r = corner.toPx()
    val path = Path().apply {
        addRoundRect(
            RoundRect(
                rect = androidx.compose.ui.geometry.Rect(
                    offset = Offset(stroke, stroke),
                    size = Size(size.width - stroke * 2, size.height - stroke * 2)
                ),
                cornerRadius = CornerRadius(r, r)
            )
        )
    }
    drawPath(
        path,
        color,
        style = Stroke(
            width = stroke,
            pathEffect = PathEffect.dashPathEffect(floatArrayOf(12f, 9f))
        )
    )
}

/**
 * Placeholder vacío de módulo — el "camino preparado" de la Fase 0:
 * marca visualmente dónde vivirá cada módulo cuando se implemente.
 */
@Composable
fun DashedPlaceholder(
    title: String,
    subtitle: String,
    modifier: Modifier = Modifier
) {
    val p = sanderosPalette()
    Box(
        modifier = modifier
            .dashedBorder(color = p.line, corner = 12.dp)
            .padding(horizontal = 14.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = title,
                style = TextStyle(
                    fontFamily = Sansation,
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    color = p.tx2
                )
            )
            Text(
                text = subtitle,
                style = TextStyle(fontSize = 11.sp, color = p.tx3)
            )
        }
    }
}

/** Slot vacío del dock: módulo aún sin asignar. */
@Composable
fun EmptyDockSlot(modifier: Modifier = Modifier) {
    val p = sanderosPalette()
    Box(
        modifier = modifier.dashedBorder(color = p.line, corner = 14.dp),
        contentAlignment = Alignment.Center
    ) {
        Icon(
            imageVector = Icons.Filled.Add,
            contentDescription = "Módulo sin asignar",
            tint = p.tx3,
            modifier = Modifier.size(22.dp)
        )
    }
}

/**
 * Etiqueta DEMO — regla de producto: cualquier dato simulado en vivo lleva
 * SIEMPRE esta etiqueta visible; nunca se presenta telemetría inventada
 * como real.
 */
@Composable
fun DemoChip(modifier: Modifier = Modifier) {
    val p = sanderosPalette()
    Text(
        text = "DEMO",
        style = TextStyle(
            fontFamily = JetBrainsMono,
            fontSize = 10.sp,
            fontWeight = FontWeight.Medium,
            letterSpacing = 1.4.sp,
            color = p.warn
        ),
        modifier = modifier
            .dashedBorder(color = p.warn.copy(alpha = 0.35f), corner = 6.dp, width = 1.dp)
            .padding(horizontal = 7.dp, vertical = 2.dp)
    )
}

/** Chip estático de capacidad (pantallas de módulo). */
@Composable
fun CapabilityChip(text: String, modifier: Modifier = Modifier) {
    val p = sanderosPalette()
    Text(
        text = text,
        style = TextStyle(
            fontFamily = JetBrainsMono,
            fontSize = 11.sp,
            color = p.tx2
        ),
        modifier = modifier
            .dashedBorder(color = p.line, corner = 6.dp, width = 1.dp)
            .padding(horizontal = 8.dp, vertical = 3.dp)
    )
}
