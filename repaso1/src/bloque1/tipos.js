// 🧱 Bloque 1 · Tipos, conversiones y operadores (UD2)
// Comprueba con:  ./refuerzo.sh comprobar 1

// 👀 EJEMPLO 1 · Redondear a 2 decimales (lo usarás en los demás bloques)
//    toFixed devuelve un TEXTO ("42.75"); esto devuelve un NÚMERO (42.75)
export function redondear(numero) {
  return Math.round(numero * 100) / 100;
}

// 👀 EJEMPLO 2 · Texto de unidades con el ternario
//    formatearUnidades(1) → "1 ud."      formatearUnidades(3) → "3 uds."
export function formatearUnidades(unidades) {
  return unidades === 1 ? "1 ud." : `${unidades} uds.`;
}

// 🪜 ESCALERA · Tres escalones cortos antes de los ejercicios. Hazlos en orden.

// 🪜 1.a · ¿Es un texto? Usa typeof.
//    esTexto("3") → true     esTexto(3) → false     esTexto(null) → false
export function esTexto(valor) {
  return typeof valor === "string";  
}

// 🪜 1.b · Sumar dos números que llegan como TEXTO (como los de un prompt)
//    sumarTextos("3", "4") → 7       (no "34": mira la predicción p1)
//    sumarTextos("2.5", "1") → 3.5
export function sumarTextos(a, b) {
  return Number(a) + Number(b);
}

// 🪜 1.c · Un valor, o uno por defecto si NO viene (null o undefined). El 0 y el "" SÍ son valores.
//    valorODefecto(0, 10) → 0      valorODefecto(undefined, 10) → 10
//    valorODefecto(null, "x") → "x"    valorODefecto("", "x") → ""
export function valorODefecto(valor, defecto) {
  return valor ?? defecto;
}

// ✍️ 1.1 · Formatear un precio en euros, con 2 decimales y coma
//    formatearEuros(42.75) → "42,75 €"     formatearEuros(5) → "5,00 €"     formatearEuros(0) → "0,00 €"
//    Pista: toFixed(2) y replace. Mira cómo usa el ejemplo 2 la plantilla `${...}`.
export function formatearEuros(numero) {
  throw new Error("Sin hacer");
}

// ✍️ 1.2 · Convertir lo que escribe el usuario en un prompt en un número
//    prompt SIEMPRE devuelve un texto, o null si el usuario pulsa Cancelar.
//    aNumero("3") → 3        aNumero(" 12,5 ") → 12.5   (acepta la coma decimal y espacios)
//    aNumero("") → null      aNumero("hola") → null      aNumero(null) → null
//    Pistas: trim(), replace(",", "."), Number() y Number.isNaN(). Mira las predicciones p7 y p8.
export function aNumero(texto) {
  throw new Error("Sin hacer");
}

// ✍️ 1.3 · El stock de un producto, que puede no venir
//    stockVisible({ titulo: "Tetris", stock: 5 }) → 5
//    stockVisible({ titulo: "Sonic", stock: 0 })  → 0            ⚠️ el 0 es un dato válido
//    stockVisible({ titulo: "Pokémon" })          → "sin datos"
//    stockVisible(undefined)                      → "sin datos"   (el producto no existe)
//    Pista: ?. y ¿|| o ??? Mira el escalón 1.c y la predicción p10.
export function stockVisible(producto) {
  throw new Error("Sin hacer");
}

// ✍️ 1.4 · Nombre corto de un producto:  "Tetris (GAME BOY)"
//    Si el título está vacío ("") o no viene → "Sin título (GAME BOY)"
//    Si no viene la plataforma             → "Tetris (?)"
//    Aquí un título vacío NO vale como título: ¿qué operador conviene para cada caso? Mira p6.
export function nombreCorto(producto) {
  throw new Error("Sin hacer");
}
