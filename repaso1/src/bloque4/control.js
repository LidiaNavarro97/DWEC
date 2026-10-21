// 🧱 Bloque 4 · Control de flujo: if, switch, bucles (UD3)
// Comprueba con:  ./refuerzo.sh comprobar 4
import { formatearUnidades } from "../bloque1/tipos.js";
import { descuentoVolumen } from "../bloque2/funciones.js";

// 👀 EJEMPLO · Un «menú» que no usa prompt: recibe lo que el usuario iría tecleando, en un array.
//    Así se puede probar. Es el MISMO esquema que el menú de la práctica 1: bucle + switch.
//    procesarSemaforo(["verde", "ámbar", "azul", "apagar", "rojo"])
//      → ["Pasa", "Frena", "Color raro: azul", "Semáforo apagado"]      (lo de después de «apagar» no se lee)
export function procesarSemaforo(colores) {
  const salida = [];
  let i = 0;
  let encendido = true;
  while (encendido && i < colores.length) {
    const color = colores[i];
    switch (color) {
      case "verde":
        salida.push("Pasa");
        break;
      case "ámbar":
      case "rojo": //  dos case seguidos sin break = el mismo código para los dos
        salida.push("Frena");
        break;
      case "apagar":
        salida.push("Semáforo apagado");
        encendido = false;
        break;
      default:
        salida.push(`Color raro: ${color}`);
    }
    i++;
  }
  return salida;
}

// 🪜 ESCALERA · Un escalón por herramienta

// 🪜 4.a · if / else if / else
//    signo(5) → "positivo"     signo(-3) → "negativo"     signo(0) → "cero"
export function signo(numero) {

  if(numero > 0){
    return "positivo";

  } else if(numero < 0) {
    return "negativo";

  } else {
    return "cero";
  }
  
}

// 🪜 4.b · Bucle for con acumulador: suma de 1 hasta n
//    sumarHasta(4) → 10   (1 + 2 + 3 + 4)       sumarHasta(1) → 1       sumarHasta(0) → 0
export function sumarHasta(n) {
  
  let suma = 0;

  for (let i = 1; i <= n; i++) {
    suma += i;
  }
  return suma;
}

// 🪜 4.c · for...of sobre un TEXTO (también se recorre letra a letra): cuenta las vocales a e i o u
//    contarVocales("Tetris") → 2     contarVocales("AEIOU") → 5 (también mayúsculas)    contarVocales("") → 0
//    Pista: "aeiou".includes(letra.toLowerCase())
export function contarVocales(texto) {
  
  let contador = 0;

  for(const letras of texto){
    if("aeiou".includes(letras.toLowerCase())){
      contador ++;
    }
  }
  return contador;
}

// ✍️ 4.1 · Clasificar el stock con if / else if / else
//    clasificarStock(0) → "agotado"     clasificarStock(2) → "stock bajo"    clasificarStock(3) → "disponible"
//    clasificarStock(-1) → "error"      clasificarStock("5") → "error"       (solo valen números >= 0)
export function clasificarStock(stock) {
  throw new Error("Sin hacer");
}

// ✍️ 4.2 · Nombre del estado con switch y default
//    "nuevo-precintado" → "Nuevo (precintado)"    "usado-como-nuevo" → "Usado (como nuevo)"
//    "usado-caja-danada" → "Usado (caja dañada)"  "solo-cartucho" → "Solo cartucho"
//    cualquier otra cosa → "Estado desconocido"
export function nombreEstado(estado) {
  throw new Error("Sin hacer");
}

// ✍️ 4.3 · El menú de RetroStock, como el ejemplo del semáforo (bucle + switch)
//    "1" → "Ver catálogo"   "2" → "Buscar producto"   "3" → "Registrar venta"
//    "6" → "¡Hasta pronto!" y TERMINA (lo que venga después no se procesa)
//    otra cosa → "Opción no válida: X"
//    Si se acaban las entradas sin un "6", se añade al final "Fin sin salir".
//    simularMenu(["1", "9", "3", "6", "2"]) → ["Ver catálogo", "Opción no válida: 9", "Registrar venta", "¡Hasta pronto!"]
//    simularMenu(["2"])                    → ["Buscar producto", "Fin sin salir"]
export function simularMenu(entradas) {
  throw new Error("Sin hacer");
}

// ✍️ 4.4 · Tabla de descuentos con un bucle for, usando descuentoVolumen (bloque 2, ya importada)
//    y formatearUnidades (bloque 1, ya importada).
//    tablaDescuentos(4) → ["1 ud. → 0 %", "2 uds. → 5 %", "3 uds. → 5 %", "4 uds. → 10 %"]
//    tablaDescuentos(0) → []
//    Pista: 0.05 × 100 da 5.000000000000001 en JavaScript: redondea con Math.round.
export function tablaDescuentos(maxUnidades) {
  throw new Error("Sin hacer");
}
