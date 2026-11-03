// 🧱 Bloque 5 · Métodos de array, destructuring e inmutabilidad (UD3)
// Comprueba con:  ./refuerzo.sh comprobar 5
// Las pruebas usan el CATALOGO de datos.js (está congelado: si lo mutas, salta un TypeError).
// Regla de oro: NUNCA se modifica el array recibido. Se devuelve uno NUEVO.
import { redondear, formatearUnidades } from "../bloque1/tipos.js";

// 👀 EJEMPLO 1 · map: un array del MISMO tamaño, transformado
//    titulos(CATALOGO) → ["Tetris", "Zelda: A Link to the Past", ...]
export const titulos = (catalogo) =>
   catalogo.map((producto) => producto.titulo);

// 👀 EJEMPLO 2 · filter: los que cumplen la condición (puede devolver [] si ninguno)
//    deCategoria(CATALOGO, "RPG") → [ {id: 2 ...}, {id: 7 ...} ]
export const deCategoria = (catalogo, categoria) =>
  catalogo.filter((producto) => producto.categoria === categoria);

// 👀 EJEMPLO 3 · Inmutabilidad: cambiar UN producto devolviendo un array nuevo (map + spread)
//    reponer(CATALOGO, 3, 10) → array nuevo donde Sonic 2 tiene stock 10; CATALOGO no cambia
export const reponer = (catalogo, id, unidades) =>
  catalogo.map((producto) =>
    producto.id === id ? 
        { ...producto, stock: producto.stock + unidades } : producto,
  );

// 🪜 ESCALERA · Un método cada vez, con arrays de números (las pruebas usan arrays congelados)

// 🪜 5.a · map: cada número multiplicado por 2
//    dobles([1, 5, 10]) → [2, 10, 20]       dobles([]) → []
export const dobles = (numeros) => {
  const multiplicados = numeros.map((n) => n * 2);
  return multiplicados;
};

// 🪜 5.b · filter: los mayores que un límite
//    mayoresQue([3, 8, 1, 12], 5) → [8, 12]       mayoresQue([1, 2], 5) → []
export const mayoresQue = (numeros, limite) => {
  const mayores = numeros.filter((n) => n > limite );
  return mayores;
};

// 🪜 5.c · reduce: la suma de todos (0 si está vacío)
//    sumaTotal([3, 8, 1]) → 12      sumaTotal([]) → 0
export const sumaTotal = (numeros) => {
  const suma = numeros.reduce((acc, elemento) => acc + elemento, 0);
  return suma;
};

// 🪜 5.d · Añadir al final SIN modificar la lista (nada de push): spread
//    anadirAlFinal(["a", "b"], "c") → ["a", "b", "c"]   y la lista original sigue con 2
export const anadirAlFinal = (lista, elemento) => {
     const list = [...lista, elemento];
     return list;
};

// ✍️ 5.1 · find: el producto con ese id, o null si no existe (nunca undefined)
//    buscarPorId(CATALOGO, 4) → { id: 4, titulo: "Crash Bandicoot", ... }     buscarPorId(CATALOGO, 99) → null
export function buscarPorId(catalogo, id) {
  const elemento = catalogo.find((producto) => producto.id === id);
  return elemento ?? null;
};

// ✍️ 5.2 · filter: los productos cuyo título CONTIENE el texto, sin distinguir mayúsculas
//    buscarPorTitulo(CATALOGO, "mario") → [Super Mario 64, Dr. Mario]     buscarPorTitulo(CATALOGO, "xyz") → []
export function buscarPorTitulo(catalogo, texto) {
  
}

// ✍️ 5.3 · reduce: valor del stock = suma de precio × stock, redondeado
//    valorStock(CATALOGO) → 750       valorStock([]) → 0
//    ⚠️ Con reduce, no con un for. Y no olvides el valor inicial (prueba [].reduce((a, n) => a + n) en la consola).
export function valorStock(catalogo) {
  const valor = catalogo.reduce((acc , elemento) => {
    return elemento.precio * elemento.stock + acc;
  }, 0)

  return Math.round(valor * 100) / 100;
};

// ✍️ 5.4 · sort con comparador, SIN tocar el original: de más barato a más caro
//    ordenarPorPrecio(CATALOGO).map((p) => p.precio) → [10, 15, 20, 25, 30, 35, 40, 60]
//    Si te sale «TypeError: Cannot assign to read only property»: estás ordenando el original (bug 3 del bloque D).
export function ordenarPorPrecio(catalogo) {
  throw new Error("Sin hacer");
}

// ✍️ 5.5 · some: ¿hay algún producto con stock por debajo de 3?
//    hayStockBajo(CATALOGO) → true      hayStockBajo([{ stock: 5 }, { stock: 3 }]) → false
export function hayStockBajo(catalogo) {
  throw new Error("Sin hacer");
}

// ✍️ 5.6 · filter + map encadenados, con DESTRUCTURING en el parámetro del map
//    Solo los productos con stock > 0, con este formato (formatearUnidades está importada):
//      "Tetris · GAME BOY · 5 uds."
//      "Zelda: A Link to the Past · SNES · 2 uds. ⚠️ Stock bajo"      (stock < 3)
//    lineasCatalogo(CATALOGO).length → 7   (Sonic 2 no sale: stock 0)
//    Pista: .map(({ titulo, plataforma, stock }) => ...)
export function lineasCatalogo(catalogo) {
  throw new Error("Sin hacer");
}

// ✍️ 5.7 · Inmutabilidad: vender. Como el ejemplo 3 (reponer), pero restando. 1 unidad por defecto.
//    vender(CATALOGO, 1, 2) → array nuevo con Tetris a stock 3; CATALOGO sigue con 5
//    Si el producto no existe o no hay stock suficiente → devuelve el MISMO catálogo, sin cambios.
//    vender(CATALOGO, 3) → el mismo CATALOGO (Sonic 2 tiene 0)
export function vender(catalogo, id, unidades) {
  throw new Error("Sin hacer");
}

// ✍️ 5.8 · reduce + destructuring: resumen de las ventas de la sesión
//    const ventas = [
//      { titulo: "Tetris", unidades: 2, total: 40 },
//      { titulo: "Crash Bandicoot", unidades: 4, total: 85 },
//      { titulo: "Dr. Mario", unidades: 1, total: 7 },
//    ];
//    resumenVentas(ventas) → { totalFacturado: 132, masVendido: "Crash Bandicoot" }   (la venta con más unidades)
//    resumenVentas([])     → { totalFacturado: 0, masVendido: null }
export function resumenVentas(ventas) {
  throw new Error("Sin hacer");
}
