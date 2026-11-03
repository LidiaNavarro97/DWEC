// 🧱 Bloque 6 · Integrador: una venta de RetroStock de principio a fin
// Comprueba con:  ./refuerzo.sh comprobar 6
// Aquí NO hay que inventar nada nuevo: hay que JUNTAR las funciones de los bloques anteriores.
// Es justo lo que tenía que hacer la opción «Registrar venta» de la práctica 1.
import { formatearEuros, formatearUnidades, redondear } from "../bloque1/tipos.js";
import { precioFinal } from "../bloque2/funciones.js";
import { buscarPorId, vender } from "../bloque5/arrays.js";

// ✍️ 6.1 · Registrar una venta
//    Devuelve SIEMPRE un objeto con el catálogo (nuevo si hay venta, el mismo si no) y:
//      · si va bien → venta: { titulo, unidades, precioUnitario, total }
//      · si no      → error: un texto que explique por qué
//
//    Los errores, en este orden:
//      unidades no es un número entero > 0  → "Cantidad no válida"        (pista: Number.isInteger)
//      no existe el id                      → "No existe el producto 99"
//      no hay stock suficiente              → "Stock insuficiente: quedan 2"
//
//    Caso 1 de la práctica 1 · Chrono Trigger, 45 €, usado-como-nuevo, stock 4 → vender 3:
//      venta = { titulo: "Chrono Trigger", unidades: 3, precioUnitario: 42.75, total: 128.25 }  y stock 1
//    Caso 2 · Streets of Rage 2, 60 €, nuevo-precintado, stock 10 → vender 4:
//      venta = { titulo: "Streets of Rage 2", unidades: 4, precioUnitario: 67.5, total: 270 }   y stock 6
//
//    El catálogo recibido NO se modifica (las pruebas usan uno congelado).
export function registrarVenta(catalogo, id, unidades) {
  throw new Error("Sin hacer");
}

// ✍️ 6.2 · El ticket de una venta, con DESTRUCTURING del objeto venta
//    ticket({ titulo: "Chrono Trigger", unidades: 3, precioUnitario: 42.75, total: 128.25 })
//      → "Chrono Trigger · 3 uds. × 42,75 € = 128,25 €"
//    ticket({ titulo: "Tetris", unidades: 1, precioUnitario: 20, total: 20 })
//      → "Tetris · 1 ud. × 20,00 € = 20,00 €"
export function ticket(venta) {
  throw new Error("Sin hacer");
}
