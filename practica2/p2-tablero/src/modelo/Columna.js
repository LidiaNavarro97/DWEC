// Columna.js — Bloque A · ✍️ A2: una columna del tablero («Por hacer», «En curso», «Hecho»).
// En kanban, una columna puede tener un límite WIP (Work In Progress): «En curso» no admite más
// de 3 tareas a la vez, para no empezar mil cosas y no acabar ninguna.
import { Tarea } from "./Tarea.js";

export class Columna {
  // Privado: #tareas, un array
  #tareas = [];

  constructor(nombre, limiteWip = null) {
    // 1 · nombre: texto no vacío (sin espacios a los lados) → si no, TypeError
    if(typeof nombre !== "string" || nombre.trim() === ""){
      throw new TypeError("El nombre no puede tener espacios. ")
    }
    // limiteWip: null (sin límite) o un entero ≥ 1 → si no, RangeError
    if(limiteWip !== null && (!Number.isInteger(limiteWip) || limiteWip <= 1)){
      throw new RangeError("El limite debe ser un entero mayor o igual a 1. ")
    }

    // guardamos los valores en el objeto
    this.nombre = nombre.trim();
    this.limiteWip = limiteWip;
  }

  // 2 · get llena: true si hay límite y ya hay tantas tareas como el límite
  get llena(){
    return this.limiteWip !== null && this.#tareas.length >= this.limiteWip;
  }

  // 3 · get tareas: una COPIA del array (que nadie pueda tocar el tuyo desde fuera)
  get tareas(){
    return [...this.#tareas];
  }

  // 4 · añadir(tarea): TypeError si no es instanceof Tarea · Error («… está llena …») si está
  //     llena · si no, la guarda y la devuelve
  añadir(tarea){

    if(!(tarea instanceof Tarea)){ // comprueba si tarea es una instancia de la clase Tarea
      throw new TypeError("Tarea invalida.")
    }

    if(this.llena){ // comprobamos si la columna esta llena
      throw new TypeError("Está llena.")
    }

    this.#tareas.push(tarea); //añado la tarea al final del array

    return tarea; // devuelvo la tarea que acabo de añadir
  }

  // 5 · quitar(id): la saca del array y la devuelve · Error («… no está …») si no la encuentra
  //     Pista: findIndex + splice
  // splice -> cambia el contenido de un array eliminando elementos existentes y/o agregando nuevos
  // findIndex -> devuelve el indice del primer elemento de un array que cumpla con la funcion sino devuelve -1

  quitar(id){
    // busca el indice de un elemento que cumpla la condicion
    // busca la tarea cuyo id coincida con el que hemos recibido
    const indice = this.#tareas.findIndex(tarea => tarea.id === id);

    //sino lo encuentra da -1
    if(indice === -1){ // si no lo encuentra da ese error
      throw new TypeError("La tarea no está.")
    } 
    
    // splice modifica el array original
    // indice es la posicion que queremos eliminar
    // y 1 es la cantidad de elementos que queremos eliminar
    return this.#tareas.splice(indice,1)[0]; 
    // [0] -> queremos devolver la tarea y no un array, ponemos [0] para acceder al primer elemento
    
  }
  // 6 · tiene(id): true / false. Pista: some
  // some -> comprueba si al menos un elemento del array cumple con la condicion implementada por la funcion proporcionada
  // este metodo devuelve false para cualquier condicion puesta en un array vacio

  tiene(id){
    return this.#tareas.some(tarea => tarea.id === id)
  }

  // 7 · ordenadas(): un array NUEVO ordenado: primero prioridad alta (usa t.peso), y a igual
  //     prioridad, el límite más cercano; las que no tienen límite, al final.
  //     Pista: [...this.#tareas].sort((a, b) => …) — ¿por qué la copia?

    //   negativo -> a va antes que b
    //   positivo -> b va antes que a
    //   0        -> da igual, se quedan como están

  ordenadas(){
    
    return [...this.#tareas].sort((a, b) => { //sort() reordena la copia y no toca el array original #tareas.
    
      if (a.peso !== b.peso) {
      // Si los pesos son distintos, decide la prioridad y no miramos nada más.
      // b.peso - a.peso => el peso mayor va primero, primero prioridad alta
        return b.peso - a.peso;
      }

      if (!a.limite && !b.limite) { // empate de prioridad, ninguna tiene limite
        return 0; // el 0 es empate, se dejan como están
      }

      if (!a.limite) {
        // Solo a no tiene límite: positivo => a se va detrás de b, al final
        return 1; //positivo -> a antes que b
      }
      if (!b.limite) {
        // Solo b no tiene límite: negativo => a se queda delante, antes que b
        return -1; //negativo -> b antes que a
      }

      // Las dos tienen límite, resto las fechas.
      return a.limite - b.limite; //la fecha más cercana (más pequeña) sale primero.
      
      // Date -> contiene un Number que representa milisegundos transcurridos 
      // Comparar dos Date con === compara objetos, no fechas, dos fechas iguales dan false
  });
  }




}

// Comprueba con:  docker compose run --rm web npm test 3-columna
