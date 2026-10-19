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

- **Síntoma:** sale 23 en lugar de salir 5. 
- **Breakpoint en:** `caja.js` la linea es 26 `export function sumarUnidades(actuales, textoDelUsuario)` `const nuevas = actuales + textoDelUsuario;`
- **Lo que vi:** veo que cge el texto del usuario como "3" y no como 3.
- **Por qué falla:** el problema es que texto del usuario lo coge como texto porque esta entre comillas y en vez de sumar lo concatena, y aparte el signo + con un texto al lado lo concatena en vez de sumanrlo y promt siempre devuelve texto aunq escruba un numero.
- **Arreglo:** ponerlo como un numero y no como un texto, cambiar la funcion que habia por ->

que es lo que hago:
1. convertir con Number antes de sumar
2. si el usuario cancela promt da null y devuelve actuales antes de convertir porque Number(null) da 0
3. si escribe hola da NaN y tmb se devuelve actuales (se detecta con Number.isNaN)

`if(textoDelUsuario === null) {
    return actuales;
  }
  
  const numero = Number(textoDelUsuario);

  if(Number.isNaN(numero)) {
    return actuales;
  }

  return actuales + numero;`

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
