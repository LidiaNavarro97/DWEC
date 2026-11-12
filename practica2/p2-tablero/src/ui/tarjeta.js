// tarjeta.js — Bloque B · 👀 EJEMPLO RESUELTO (crearTarjeta) y ✍️ B1 (pintarLista).
import { formatear } from "../modelo/fechas.js";

/** Tarea → <article class="tarjeta tarjeta--alta" data-id="3"> con su título y su límite */
export function crearTarjeta(tarea, hoy = new Date()) {
  const tarjeta = document.createElement("article"); // crea la etiqueta <article>
  tarjeta.classList.add("tarjeta", `tarjeta--${tarea.prioridad}`); //añade esas clases
  tarjeta.classList.toggle("tarjeta--vencida", tarea.estaVencida(hoy)); // true pone la clase, flase la quita
  tarjeta.dataset.id = tarea.id; // en el HTML: data-id="3" (siempre texto)

  const titulo = document.createElement("h3");
  // pone texto plano sin interpretar html
  titulo.textContent = tarea.titulo; // textContent, NUNCA innerHTML con lo que escribe el usuario
  tarjeta.append(titulo);

  if (tarea.limite) {
    const limite = document.createElement("p");
    limite.className = "tarjeta__limite";
    limite.textContent = `Límite: ${formatear(tarea.limite)}`;
    tarjeta.append(limite);
  }
  return tarjeta;
}

// ✍️ B1 · pintarLista(contenedor, tareas, hoy = new Date())
//   - Vacía el contenedor y pone una tarjeta por tarea (usa crearTarjeta), en el mismo orden.
//   - Pintar dos veces NO puede duplicar: primero vacía. Pista: contenedor.replaceChildren(...)
//   - Sin tareas: deja SOLO un <p class="vacia">Sin tareas</p>
export function pintarLista(contenedor, tareas, hoy = new Date()) {
  //sino hay tareas dejo solo el mensaje de "Sin tareas"
  if(tareas.length === 0){
    const vacia = document.createElement("p"); //creo la etiqueta <p>
    vacia.className = "vacia"; // le pongo class="vacia"
    vacia.textContent = "Sin tareas"; //texto plano
    contenedor.replaceChildren(vacia); //vacia el contenedor y mete solo <p>
    return;
  }

  //si si hay tareas -> una tarjeta por tarae, en el mismo orden
  const tarjetas = tareas.map((tarea) => crearTarjeta(tarea, hoy));

  //pintar dos veces no duplica
  //replaceChildren vacio primero y luego pone las tarjetas
  contenedor.replaceChildren(...tarjetas);
}
