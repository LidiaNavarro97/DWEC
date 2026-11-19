// app.js — Bloque B · ✍️ B4, B5 y B6. Conecta el modelo (el tablero) con la página: pinta, escucha y avisa.
// Usa tus piezas: crearTarjeta/pintarLista, leerFormulario/mostrarErrores y delegar.
// La estructura de la página (ids, data-*) está en index.html y NO se cambia: la usan los tests.
import { ErrorTablero } from "../modelo/errores.js";
import { delegar } from "./delegacion.js";
import { leerFormulario, mostrarErrores } from "./formulario.js";
import { pintarLista } from "./tarjeta.js";

/** Botones de cada tarjeta según su columna: [texto, data-accion] */
const ACCIONES = {
  "Por hacer": [["Empezar →", "empezar"]],
  "En curso": [
    ["← Volver", "volver"],
    ["✓ Completar", "completar"],
  ],
  Hecho: [],
};

// ✍️ B6 · validar(datos) → { campo: "mensaje" } con los errores (objeto vacío si todo está bien)
//   - titulo: obligatorio y como mucho 80 caracteres
//   - cadaDias (si viene): entero mayor que 0. Si es correcto pero no hay limite, el error va
//     en «limite»: una tarea que se repite necesita fecha límite
export function validar(datos) {
  throw new Error("Sin hacer");
}

/**
 * Arranca la interfaz dentro de raiz (el <main id="app">). Los listeners se ponen UNA vez aquí;
 * pintar() solo cambia nodos, así que repintar no los duplica.
 * opciones.hoy: fecha fija para los tests · opciones.alCambiar(tablero): tras cada cambio (UD6)
 */
export function iniciarApp(raiz, tablero, { hoy = null, alCambiar = () => {} } = {}) {
  const form = raiz.querySelector("#form-alta");
  const aviso = raiz.querySelector("#aviso");
  const columnas = raiz.querySelector("#columnas");
  const resumen = raiz.querySelector("#resumen");

  // ✍️ B4 · pintar(): deja la página igual que el modelo cada vez que se llama, y NO pone listeners
  //   - cada columna ([data-columna="…"]): sus tareas en el orden de ordenadas(), con pintarLista en su
  //     .lista, y en cada .tarjeta sus botones según ACCIONES: <button type="button" data-accion="…">
  //   - el .contador de cada columna: (n), o (n/límite) en la que tiene límite WIP
  //   - [data-dato="progreso"]: hechas ÷ total en %, redondeado (con el tablero vacío, 0 %)
  //   - [data-dato="vencidas"]: las vencidas de tablero.resumen(ahora)
  //   La fecha de hoy: const ahora = hoy ?? new Date();  (los tests pasan una fija)
  function pintar() {

    const ahora = hoy ?? new Date(); // la fecha de hoy fija de los tests o la de vd sino viene

    for (const columna of tablero.columnas){
      // busco su zona en el html con el nombre de la columna en el selector
      const zona = raiz.querySelector(`[data-columna="${columna.nombre}"]`);
      const lista = zona.querySelector(".lista");
      const contador = zona.querySelector(".contador");

      // Pintar las tarjetas en el orden de ordenadas
      pintarLista(lista, columna.ordenadas(), ahora);

      // A cada tarjeta le añado sus botones
      for (const tarjeta of lista.querySelectorAll(".tarjeta")) {
        
        for (const [texto, accion] of ACCIONES[columna.nombre]) {
          const boton = document.createElement("button"); // crea el <button>
          boton.type = "button"; // para que nunca envíe un formulario
          boton.dataset.accion = accion; // en el HTML data-accion
          boton.textContent = texto; // texto visible
          tarjeta.append(boton); // lo metemos dentro de la tarjeta
        }
      }

      // Contador de (n) o (n/limite) si la columna tiene limiteWip
      const cuantas = columna.tareas.length;
      contador.textContent = columna.limiteWip === null
          ? `(${cuantas})`
          : `(${cuantas}/${columna.limiteWip})`;

    }

    const datos = tablero.resumen(ahora); // { porHacer, enCurso, hecho, vencidas }
    const total = datos.porHacer + datos.enCurso + datos.hecho;

    // Si total es 0, 0 / 0 da NaN, así que lo evitamos con este if
    const progreso = total === 0 ? 0 : Math.round((datos.hecho / total) * 100);

    resumen.querySelector('[data-dato="progreso"]').textContent = `${progreso} %`;
    resumen.querySelector('[data-dato="vencidas"]').textContent = datos.vencidas;

  }

  // 👀 Resuelto: avisar("texto") enseña el aviso; avisar("") lo esconde
  function avisar(mensaje) {
    aviso.textContent = mensaje;
    aviso.hidden = mensaje === "";
  }

  // ✍️ B5 · UN listener, puesto UNA vez aquí (nunca dentro de pintar): clic en los botones de las
  //   tarjetas, con delegar sobre `columnas`. empezar → «En curso», volver → «Por hacer», completar.
  //   Tras cada cambio que sale bien: avisar(""), pintar() y alCambiar(tablero).
  //   Si el tablero lanza un ErrorTablero → avisar(error.message) y no se repinta.
  //   Cualquier otro error → se relanza (es un fallo del programa).
  //   Pista: una función cambiar(accion) con el try/catch te sirve también para el B6.

  // sirve pa todos los cambios (empezar, volver, completar)
  // el cambio no se hace al escribirla sino cuando cambiar la llama
  function cambiar(hacer) {
    try {
      hacer(); // aqui es donde se pide el cambio del tablero
    } catch (error) {
      if (error instanceof ErrorTablero) {
        // aviso al usuario de por ej columna llena...
        avisar(error.message);
        return; // se termina aqui
      }
      // cualquier otro error es del programa, lo volvemos a lanzar
      throw error;
    }

    //si llega hasta aqui va bien
    avisar(""); // esconde un aviso anterior
    pintar(); // deja la pagina igual q el modelo
    alCambiar(tablero); // avisa de q algo ha cambiado
 
  }

  // un solo listener en columnas puesot una vez fuera de pintar
  delegar(columnas, "click", "button[data-accion]", (boton) => {

    const accion = boton.dataset.accion;

    // dataset.id es texto "3", con Number lo convierto a numero
    const id = Number(boton.closest(".tarjeta").dataset.id);

    if (accion === "empezar") {
      cambiar(() => tablero.mover(id, "En curso"));
    } else if (accion === "volver") {
      cambiar(() => tablero.mover(id, "Por hacer"));
    } else if (accion === "completar") {
      cambiar(() => tablero.completar(id));
    }
    
  })


  // ✍️ B6 · submit de `form`: preventDefault, leerFormulario, validar y mostrarErrores. Si hay errores,
  //   no se crea nada. Si no, tablero.crearTarea(datos) (como un cambio más) y form.reset().

  pintar();
  return { pintar };
}


