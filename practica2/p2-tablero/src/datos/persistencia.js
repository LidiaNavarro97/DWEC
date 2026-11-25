// persistencia.js — Bloque C · ✍️ C5 y C6. Guardar el tablero tras cada cambio y recuperarlo al abrir la página.
// Usa guardar, cargar y borrar (almacen.js, resuelto), tu obtenerJSON (red.js) y Tablero.desdeJSON.
import { Tablero } from "../modelo/Tablero.js";
import { borrar, cargar, guardar } from "./almacen.js";
import { obtenerJSON } from "./red.js";

export const CLAVE = "dwec-p2-tablero";

// ✍️ C5 · guardarTablero(tablero, storage = localStorage): guarda el tablero en CLAVE
export function guardarTablero(tablero, storage = localStorage) {
  guardar(CLAVE, tablero, storage);
}

// ✍️ C6 · async arrancar({ storage = localStorage, fetchFn = fetch, url = "/tareas-iniciales.json",
//                  limiteEnCurso = 3 } = {}) → { tablero, origen, error? }
//   Los tres casos («guardado», «inicial» y «vacio») están en el enunciado (bloque C).
export async function arrancar({
  storage = localStorage,
  fetchFn = fetch,
  url = "/tareas-iniciales.json",
  limiteEnCurso = 3,
} = {}) {
  
  //sino hay algo guardado, cargar devuelve null sino hay nada o esta roto
  const guardado = cargar(CLAVE, null, storage);

  if (guardado !== null) {
    try { //si desde JSON lo acepta, lo recuperamos y no tocamos la red
      return { 
        tablero: Tablero.desdeJSON(guardado), 
        origen: "guardado"}
    } catch { //es JSON pero no sirve, por ej otra version, lo borramos y seguimos hacia abajo
      borrar(CLAVE, storage);
    }
  }

  //descargar las tareas iniciales
  try {
    //el await va dentro del try, si la promesa se rechaza lo recoge el catch
    const datos = await obtenerJSON(url, fetchFn);

    return {
      tablero: Tablero.desde(datos, limiteEnCurso),
      origen: "inicial"}
    } catch (error) {
      // tampoco se pudo descargar: tablero vacio y el motivo
      return {
        tablero: new Tablero(limiteEnCurso),
        origen: "vacio",
        error: error.message,
      }
  }
}
