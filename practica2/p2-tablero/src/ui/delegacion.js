// delegacion.js — Bloque B · ✍️ B3 (delegar).

// ✍️ B3 · delegar(contenedor, tipo, selector, manejador)
//   - UN solo addEventListener, en el contenedor (no en cada botón)
//   - Dentro: el elemento que encaja es evento.target.closest(selector). Si lo hay y está DENTRO
//     del contenedor (contenedor.contains(...)), llama a manejador(elemento, evento)
//   - Devuelve una función que quita el listener (removeEventListener con la MISMA función)
export function delegar(contenedor, tipo, selector, manejador) {
    //guardo la funcion de escucha en una constante
  const escuchar = (evento) => {
    // closest empieza en el elemnto pulsado (tatget) y sube hasta encontrar el primero q encaje con el selector
    //  sino ecnuentra ninguno, devuleve null
    const elemento = evento.target.closest(selector);

    //solo sigo si hay elemtno y esta dentro del contenedor
    if(elemento && contenedor.contains(elemento)) {
        //llamo al manejador con el elemento que encaje, el boton, y el evento
        manejador(elemento, evento);
    }
  }

  // un solo listener puesto en el contenedor, no en cada boton
  contenedor.addEventListener(tipo, escuchar);
  // devolvemos una funcion q quita ese listener usando la misma funcion escuchar
  return() => {
    contenedor.removeEventListener(tipo, escuchar);
  }
}
