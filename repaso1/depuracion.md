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
- **Breakpoint en:** `caja.js:26` la linea es 26 `export function sumarUnidades(actuales, textoDelUsuario)` `const nuevas = actuales + textoDelUsuario;`
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

- **Síntoma:** aparecia "sin datos" cuanado debia dar 0
- **Breakpoint en:** `caja.js:41` en la linea 41 (`const stock = producto.stock || "sin datos";`)
- **Lo que vi:** el producto tiene stock 0 pero la linea lo convierte en sin datos
- **Por qué falla:** los || se queda con el valor de la derecha si el de la izquierda es falsy y el 0 lo es por eso da sin datos.
- **Arreglo:** ponemos ?? en vez de ||, porque ?? se queda con el valor de la derecha si el de la izquierda es null o undefined, y el 0 cuenta como un dato asi que daria 0. ->
`const stock = producto.stock ?? "sin datos";`

## Bug 3 · Ordenar por precio

- **Síntoma:** se ordenan bien pero se modificaba la lista original
- **Breakpoint en:** `caja.js:47` en la linea 47
- **Lo que vi:** `productos.sort`ordenaba de menor a mayor pero cambiaba la lista original
- **Por qué falla:** porque nos pide q no se modifique la lista original
- **Arreglo:** crear una copia de la lista con `[...productos].sort`

## Bug 4 · Descuento por volumen

- **Síntoma:** al comprar 4 unidades se descontaba un 5% en lugar de un 10%
- **Breakpoint en:**`caja.js:55`  la linea 55
- **Lo que vi:** con unidades === 4 la condicion de 4>4 es falsa asi q salta al else if y coge un 5%
- **Por qué falla:** porque con esa condicion no coge exactamente el 4 sino mas mayor
- **Arreglo:** cambiar esa linea a -> `unidades = >= 4`
