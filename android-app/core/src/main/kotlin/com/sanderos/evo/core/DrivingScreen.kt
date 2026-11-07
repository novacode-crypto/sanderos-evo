package com.sanderos.evo.core

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
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sanderos.evo.design.BrandWordmark
import com.sanderos.evo.design.DashedPlaceholder
import com.sanderos.evo.design.DemoChip
import com.sanderos.evo.design.JetBrainsMono
import com.sanderos.evo.design.Sansation
import com.sanderos.evo.design.sanderosPalette
import kotlin.math.roundToInt

/**
 * Vista de Conducción — la pantalla principal del launcher.
 *
 * Fase 0: marca protagonista en el centro, carretera animada con velocidad
 * DEMO etiquetada y placeholders vacíos donde vivirán los módulos.
 */
@Composable
fun DrivingScreen(onOpenSettings: () -> Unit) {
    val p = sanderosPalette()
    val engine = remember { DemoSpeedEngine() }
    LaunchedEffect(Unit) { engine.run() }
    val speed by engine.speed.collectAsState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(p.bgDeep, p.bgBase, p.bgDeep)
                )
            )
    ) {
        // Carretera animada — consume la velocidad (DEMO hoy, OBD2 en Fase 1)
        RoadCanvas(
            speedKmh = speed,
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .height(330.dp)
        )

        // Viñeta cinematográfica (token hero-vignette del prototipo)
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        0f to Color.Black.copy(alpha = 0.22f),
                        0.22f to Color.Transparent,
                        0.62f to Color.Transparent,
                        1f to Color.Black.copy(alpha = 0.30f)
                    )
                )
        )

        Column(modifier = Modifier.fillMaxSize()) {
            TopBar()

            Spacer(Modifier.weight(0.55f))

            // Marca protagonista — centro de la pantalla
            BrandWordmark(
                fontSize = 40.sp,
                markHeight = 92.dp,
                modifier = Modifier.align(Alignment.CenterHorizontally)
            )

            Spacer(Modifier.height(20.dp))

            // Velocidad (DEMO etiquetada — regla de producto)
            Row(
                modifier = Modifier.align(Alignment.CenterHorizontally),
                verticalAlignment = Alignment.Bottom,
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Text(
                    text = "${speed.roundToInt()}",
                    style = TextStyle(
                        fontFamily = JetBrainsMono,
                        fontWeight = FontWeight.Medium,
                        fontSize = 72.sp,
                        color = p.tx1
                    )
                )
                Column {
                    Text(
                        text = "km/h",
                        style = TextStyle(
                            fontFamily = Sansation,
                            fontSize = 15.sp,
                            color = p.tx2
                        )
                    )
                    Spacer(Modifier.height(4.dp))
                    DemoChip()
                }
            }

            Spacer(Modifier.weight(0.45f))

            // Placeholders vacíos — el camino preparado para los módulos
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 32.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                DashedPlaceholder(
                    title = "OBD2",
                    subtitle = "Módulo · próximamente",
                    modifier = Modifier
                        .weight(1f)
                        .height(78.dp)
                )
                DashedPlaceholder(
                    title = "Vehículo 3D",
                    subtitle = "Render · próximamente",
                    modifier = Modifier
                        .weight(1f)
                        .height(78.dp)
                )
                DashedPlaceholder(
                    title = "Media",
                    subtitle = "Módulo · próximamente",
                    modifier = Modifier
                        .weight(1f)
                        .height(78.dp)
                )
            }

            Spacer(Modifier.height(14.dp))
            Dock(onSettings = onOpenSettings)
            Spacer(Modifier.height(12.dp))
        }
    }
}
