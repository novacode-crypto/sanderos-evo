package com.sanderos.evo.core

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sanderos.evo.design.EmptyDockSlot
import com.sanderos.evo.design.Sansation
import com.sanderos.evo.design.sanderosPalette

/**
 * Dock inferior — 5 slots (geometría del prototipo). El slot 1 abre
 * Ajustes; los 4 restantes esperan módulos (Fases 1-3).
 */
@Composable
fun Dock(onSettings: () -> Unit, modifier: Modifier = Modifier) {
    val p = sanderosPalette()

    Row(
        modifier = modifier
            .fillMaxWidth()
            .height(88.dp)
            .padding(horizontal = 28.dp),
        horizontalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        DockSlot(
            icon = { tint ->
                Icon(
                    imageVector = Icons.Filled.Settings,
                    contentDescription = null,
                    tint = tint,
                    modifier = Modifier.size(26.dp)
                )
            },
            label = "Ajustes",
            active = true,
            onClick = onSettings,
            modifier = Modifier.weight(1f)
        )
        repeat(4) {
            EmptyDockSlot(modifier = Modifier.weight(1f))
        }
    }
}

@Composable
private fun DockSlot(
    icon: @Composable (tint: androidx.compose.ui.graphics.Color) -> Unit,
    label: String,
    active: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val p = sanderosPalette()
    val shape = RoundedCornerShape(14.dp)
    Column(
        modifier = modifier
            .height(88.dp)
            .background(
                color = if (active) p.bgPanel.copy(alpha = 0.88f) else p.bgSunk.copy(alpha = 0.6f),
                shape = shape
            )
            .border(
                width = 1.dp,
                color = if (active) p.lineAcc else p.line,
                shape = shape
            )
            .clickable(onClick = onClick),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        icon(if (active) p.acc else p.tx3)
        Spacer(Modifier.height(6.dp))
        Text(
            text = label,
            style = TextStyle(
                fontFamily = Sansation,
                fontSize = 12.sp,
                color = if (active) p.tx2 else p.tx3
            )
        )
    }
}
