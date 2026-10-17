# 🐞 Bloque D · Mi informe de depuración

Rellena una ficha por bug. Sustituye cada `____` por lo que hayas visto TÚ en las DevTools.
Ejemplo de cómo se escribe una variable vista en el panel «Ámbito» (Scope): `i = 1`, `texto = "3"`.

## 👀 Ejemplo (ya resuelto) · Total del ticket

- **Síntoma:** sale 85 € y debería salir 105 €.
- **Breakpoint en:** `caja.js:17` (la línea `const linea = lineas[i];`)
- **Lo que vi:** en la primera parada `i = 1` y `linea` es el Zelda: el Tetris (posición 0) no se suma nunca.
- **Por qué falla:** el bucle empieza en 1 y los arrays empiezan en 0.
- **Arreglo:** `for (let i = 0; ...)`.

## Bug 1 · Añadir unidades

- **Síntoma:** ____
- **Breakpoint en:** ____
- **Lo que vi:** ____
- **Por qué falla:** ____
- **Arreglo:** ____

## Bug 2 · Stock de cada producto

- **Síntoma:** ____
- **Breakpoint en:** ____
- **Lo que vi:** ____
- **Por qué falla:** ____
- **Arreglo:** ____

## Bug 3 · Ordenar por precio

- **Síntoma:** ____
- **Breakpoint en:** ____
- **Lo que vi:** ____
- **Por qué falla:** ____
- **Arreglo:** ____

## Bug 4 · Descuento por volumen

- **Síntoma:** ____
- **Breakpoint en:** ____ *(prueba un breakpoint condicional: `unidades === 4`)*
- **Lo que vi:** ____
- **Por qué falla:** ____
- **Arreglo:** ____
