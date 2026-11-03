// 🧱 Bloque 3 · Closures: funciones que «recuerdan» (UD2)
// Comprueba con:  ./refuerzo.sh comprobar 3
// Idea: una función que devuelve funciones. Las variables de la de fuera siguen vivas
// para las de dentro, pero NADIE más puede tocarlas (son privadas).
import { redondear } from "../bloque1/tipos.js";

// 👀 EJEMPLO · El marcador de una partida, con estado privado
export function crearMarcador() {
  let puntos = 0; //             privada: solo la ven las funciones de abajo
  let jugadas = []; //           privada también
  return {
    anotar(cantidad) {
      puntos += cantidad;
      jugadas = [...jugadas, cantidad]; // array nuevo, sin push
    },
    puntos() {
      return puntos;
    },
    jugadas() {
      return [...jugadas]; //    una COPIA: si alguien la cambia, la nuestra no se entera
    },
  };
}

// 🪜 ESCALERA · De lo más simple a lo del ejemplo

// 🪜 3.a · Una función que devuelve UNA función (todavía sin estado que cambie)
//    const triplicar = crearMultiplicador(3);
//    triplicar(4) → 12       crearMultiplicador(10)(5) → 50
export function crearMultiplicador(factor) {
  return function (numero){
    return numero * factor;
  }
}

const triplicar = crearMultiplicador(3);
triplicar(4);

// 🪜 3.b · Un objeto con DOS funciones que comparten una variable privada que SÍ cambia
//    const ficha = crearPasos(2);       // avanza de 2 en 2
//    ficha.avanzar() → 2    ficha.avanzar() → 4    ficha.posicion() → 4
//    crearPasos().avanzar() → 1         (de 1 en 1 si no se dice nada)
export function crearPasos(paso) {
  
  let posicion = 0;

  return {
    avanzar() {
      posicion += paso;
      return posicion;
    },
    posicion() {
      return posicion;
    }
  }
}

const ficha = crearPasos(2);

ficha.avanzar();
ficha.avanzar();
ficha.posicion();
crearPasos().avanzar();

// ✍️ 3.1 · Una función que devuelve una función que calcula un descuento
//    const rebajas = crearDescuento(20);
//    rebajas(50) → 40     rebajas(19.99) → 15.99     crearDescuento(0)(10) → 10
export function crearDescuento(porcentaje) {
  return function (precio) {
    const descuento = precio * (1 - porcentaje / 100);
    return Math.round(descuento * 100) / 100;
  }
}

// ✍️ 3.2 · La lista de deseos de un cliente, privada (como el marcador del ejemplo)
//    const deseos = crearListaDeseos();
//    deseos.anadir("Tetris", "Zelda")  → 2      (cuántos ha añadido; usa un parámetro REST)
//    deseos.anadir("Tetris", "", 7)    → 0      (no se repiten, y solo valen textos no vacíos)
//    deseos.contiene("Zelda")          → true
//    deseos.quitar("Zelda")            → true    deseos.quitar("Sonic") → false (no estaba)
//    deseos.titulos()                  → ["Tetris"]   y es una COPIA (un push en ella no cambia la lista)
//    Dos listas distintas no se mezclan, y el objeto devuelto solo tiene funciones.
export function crearListaDeseos() {
  throw new Error("Sin hacer");
}

// ✍️ 3.3 · Generador de ids para productos nuevos
//    const siguienteId = crearGeneradorId(13);
//    siguienteId() → 13     siguienteId() → 14     siguienteId() → 15
//    crearGeneradorId()() → 1        (empieza en 1 si no se dice nada)
export function crearGeneradorId(inicial) {
  throw new Error("Sin hacer");
}
