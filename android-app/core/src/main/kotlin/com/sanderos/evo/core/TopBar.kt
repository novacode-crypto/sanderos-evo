package com.sanderos.evo.core

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bluetooth
import androidx.compose.material.icons.filled.BluetoothDisabled
import androidx.compose.material.icons.filled.Wifi
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sanderos.evo.design.DemoChip
import com.sanderos.evo.design.JetBrainsMono
import com.sanderos.evo.design.Sansation
import com.sanderos.evo.design.sanderosPalette
import java.time.LocalDateTime
import kotlinx.coroutines.delay

private val DIAS = listOf("lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo")
private val MESES = listOf("ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic")

/**
 * Barra superior del shell — estado a la izquierda, reloj centrado,
 * etiqueta DEMO a la derecha (geometría del prototipo).
 */
@Composable
fun TopBar(modifier: Modifier = Modifier) {
    val p = sanderosPalette()
    var now by remember { mutableStateOf(LocalDateTime.now()) }
    LaunchedEffect(Unit) {
        while (true) {
            delay(10_000)
            now = LocalDateTime.now()
        }
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .height(56.dp)
            .padding(horizontal = 28.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // estado del sistema (sin conexión por ahora — Fase 1 los hará reales)
        Icon(
            imageVector = Icons.Filled.BluetoothDisabled,
            contentDescription = "Bluetooth desconectado",
            tint = p.tx3,
            modifier = Modifier.size(18.dp)
        )
        Spacer(Modifier.width(10.dp))
        Icon(
            imageVector = Icons.Filled.Wifi,
            contentDescription = "Wi-Fi",
            tint = p.tx3,
            modifier = Modifier.size(18.dp)
        )

        Spacer(Modifier.weight(1f))

        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "%02d:%02d".format(now.hour, now.minute),
                style = TextStyle(
                    fontFamily = JetBrainsMono,
                    fontSize = 26.sp,
                    color = p.tx1
                )
            )
            Text(
                text = "${DIAS[now.dayOfWeek.value - 1]} ${now.dayOfMonth} ${MESES[now.monthValue - 1]}",
                style = TextStyle(
                    fontFamily = Sansation,
                    fontSize = 11.sp,
                    letterSpacing = 1.2.sp,
                    color = p.tx2
                )
            )
        }

        Spacer(Modifier.weight(1f))

        DemoChip()
    }
}
