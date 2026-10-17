// 🧱 Bloque 2 · Funciones (UD2): las 3 formas, parámetros por defecto, rest y HOF
// Comprueba con:  ./refuerzo.sh comprobar 2
import { redondear } from "../bloque1/tipos.js";

// Tabla A de la práctica 1: ajuste sobre el precio base según el estado
export const AJUSTE_ESTADO = {
  "nuevo-precintado": 0.25,
  "usado-como-nuevo": 0,
  "usado-caja-danada": -0.15,
  "solo-cartucho": -0.3,
};

// 👀 EJEMPLO 1 · Función DECLARADA con parámetro por defecto
//    precioConEstado(60, "nuevo-precintado") → 75      precioConEstado(45) → 45
export function precioConEstado(base, estado = "usado-como-nuevo") {
  return redondear(base * (1 + AJUSTE_ESTADO[estado]));
}

// 👀 EJEMPLO 2 · Higher-Order Function: recibe una FUNCIÓN (condicion) y la llama con cada elemento.
//    Cuenta cuántos la cumplen, sin .filter(). Así ves lo que hacen los métodos de array por dentro.
//    contarSi([5, 8, 12], (n) => n > 6) → 2        contarSi([], (n) => n > 6) → 0
export function contarSi(lista, condicion) {
  let cuantos = 0;
  for (const elemento of lista) {
    if (condicion(elemento)) {
      cuantos++;
    }
  }
  return cuantos;
}

// 🪜 ESCALERA · Las tres formas de escribir una función, de una en una.

// 🪜 2.a · Función DECLARADA:   function triple(n) { ... }
//    triple(4) → 12      triple(0) → 0
export function triple(n) {
  throw new Error("Sin hacer");
}

// 🪜 2.b · ARROW FUNCTION de una línea (sin llaves ni return):   export const esPar = (n) => ...
//    esPar(4) → true     esPar(7) → false     esPar(0) → true       Pista: el resto de dividir, %
export const esPar = (n) => {
  throw new Error("Sin hacer");
};

// 🪜 2.c · Parámetro POR DEFECTO
//    saludar("Ana") → "Hola, Ana"       saludar() → "Hola, invitado"
export function saludar(nombre) {
  throw new Error("Sin hacer");
}

// ✍️ 2.1 · Tabla B (descuento por volumen) como FUNCIÓN DECLARADA (function nombre() {})
//    descuentoVolumen(1) → 0     descuentoVolumen(2) → 0.05    descuentoVolumen(3) → 0.05
//    descuentoVolumen(4) → 0.1   descuentoVolumen(10) → 0.1
//    ⚠️ Fíjate bien en los límites (el 4): es el bug 4 del bloque D.
export function descuentoVolumen(unidades) {
  throw new Error("Sin hacer");
}

// ✍️ 2.2 · Precio unitario final = Tabla A y después Tabla B, redondeado.
//    Escríbela como EXPRESIÓN DE FUNCIÓN:  export const precioFinal = function (...) { ... };
//    «unidades» vale 1 si no se pasa.
//    precioFinal(45, "usado-como-nuevo", 3) → 42.75    (caso 1 de la práctica 1)
//    precioFinal(60, "nuevo-precintado", 4) → 67.5     (caso 2)
//    precioFinal(20, "solo-cartucho")       → 14
//    Pista: usa precioConEstado y descuentoVolumen; no repitas las tablas.
export const precioFinal = function (base, estado, unidades) {
  throw new Error("Sin hacer");
};

// ✍️ 2.3 · ARROW FUNCTION que devuelve un objeto producto. El stock vale 0 si no se pasa.
//    crearProducto(1, "Tetris", 20, 5) → { id: 1, titulo: "Tetris", precio: 20, stock: 5 }
//    crearProducto(2, "Sonic", 15)     → { id: 2, titulo: "Sonic", precio: 15, stock: 0 }
//    ⚠️ Mira la predicción p6: una arrow que devuelve un objeto necesita algo más.
export const crearProducto = (id, titulo, precio, stock) => {
  throw new Error("Sin hacer");
};

// ✍️ 2.4 · Parámetro REST: suma todos los importes que le pases, los que sean.
//    sumarImportes(10, 20.5, 4) → 34.5      sumarImportes() → 0
//    Hazlo con for...of (el reduce es del bloque 5). Ahora mismo el parámetro NO es rest: cámbialo.
export function sumarImportes(importes) {
  throw new Error("Sin hacer");
}

// ✍️ 2.5 · HOF: tu propio .find() SIN usar .find(). Mira el ejemplo 2 (contarSi) y haz lo análogo:
//    devuelve el PRIMER elemento que cumple la condición, o null si ninguno.
//    buscarCon([5, 8, 12], (n) => n > 6)  → 8
//    buscarCon([1, 2], (n) => n > 5)      → null
//    buscarCon([{ id: 1 }, { id: 2 }], (p) => p.id === 2) → { id: 2 }
export function buscarCon(lista, condicion) {
  throw new Error("Sin hacer");
}
