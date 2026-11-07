package com.sanderos.evo.design

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ColorFilter
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import com.sanderos.evo.design.R

/**
 * Wordmark oficial — NUNCA en cursiva.
 * "Sander" (Sansation regular, color de texto) + "OS" (Sansation bold, cian)
 * comparten base; "EVO" (Designer) con degradado cian→azul y bold sintético.
 */

/** Marca del rombo de Renault con tinte dinámico según el tema. */
@Composable
fun RenaultMark(height: Dp, modifier: Modifier = Modifier) {
    val p = sanderosPalette()
    val tint = if (p.isLight) Color(0xFF231F20) else Color(0xFFF8FAFC)
    Image(
        painter = painterResource(R.drawable.renault_diamond),
        contentDescription = "Renault",
        modifier = modifier.height(height),
        colorFilter = ColorFilter.tint(tint)
    )
}

/** "EVO" — Designer con degradado discreto por letra y bold sintético
 *  (dos capas desplazadas 0.8dp: la fuente solo existe en peso regular). */
@Composable
fun EvoText(fontSize: TextUnit, modifier: Modifier = Modifier) {
    val p = sanderosPalette()
    val mid = lerp(p.acc, p.acc2, 0.5f)
    val evo = buildAnnotatedString {
        withStyle(SpanStyle(color = p.acc)) { append("E") }
        withStyle(SpanStyle(color = mid)) { append("V") }
        withStyle(SpanStyle(color = p.acc2)) { append("O") }
    }
    val style = TextStyle(
        fontFamily = Designer,
        fontSize = fontSize,
        letterSpacing = fontSize * 0.06f
    )
    Box(modifier) {
        Text(text = evo, style = style, maxLines = 1)
        Text(
            text = evo,
            style = style,
            maxLines = 1,
            modifier = Modifier.offset(x = 0.8.dp, y = 0.8.dp)
        )
    }
}

/** Composición completa: [rombo] SanderOS EVO — alineados por la base. */
@Composable
fun BrandWordmark(
    fontSize: TextUnit,
    modifier: Modifier = Modifier,
    markHeight: Dp = Dp.Unspecified,
    withMark: Boolean = true
) {
    val p = sanderosPalette()
    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (withMark) {
            if (markHeight != Dp.Unspecified) {
                RenaultMark(
                    height = markHeight,
                    modifier = Modifier.padding(end = fontSize.value.dp * 0.42f)
                )
            } else {
                RenaultMark(
                    height = fontSize.value.dp * 1.9f,
                    modifier = Modifier.padding(end = fontSize.value.dp * 0.42f)
                )
            }
        }
        Row(verticalAlignment = Alignment.Bottom) {
            Text(
                text = "Sander",
                style = TextStyle(fontFamily = Sansation, fontSize = fontSize, color = p.tx1),
                maxLines = 1
            )
            Text(
                text = "OS",
                style = TextStyle(
                    fontFamily = Sansation,
                    fontWeight = FontWeight.Bold,
                    fontSize = fontSize,
                    color = if (p.isLight) p.accInk else p.acc
                ),
                maxLines = 1
            )
            Spacer(Modifier.width(fontSize.value.dp * 0.26f))
            EvoText(fontSize = fontSize * 0.86f)
        }
    }
}
