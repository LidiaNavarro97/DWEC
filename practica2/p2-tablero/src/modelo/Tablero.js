// Tablero.js — Bloque A · ✍️ A3 (el tablero) y A5 (reglas).
// En el bloque C volverás aquí para ✍️ C4 (toJSON y desdeJSON).
// El tablero TIENE tres columnas: es composición, no hereda de nadie.
import { Columna } from "./Columna.js";
import { ColumnaLlenaError, MovimientoNoPermitidoError } from "./errores.js";
import { Tarea } from "./Tarea.js";
import { TareaRecurrente } from "./TareaRecurrente.js";
import { aDatos, desdeDatos } from "./serializar.js";

export class Tablero {
  static COLUMNAS = Object.freeze(["Por hacer", "En curso", "Hecho"]);
  static VERSION_DATOS = 1; // (bloque C) si algún día cambia el formato guardado, se sube

  // Privado: #columnas, un Map nombre → Columna
  #columnas;


  // ✍️ A3 ──────────────────────────────────────────────────────────────────────
  constructor(limiteEnCurso = 3) {
    // Crea las tres columnas; solo «En curso» lleva límite WIP (limiteEnCurso)
    this.#columnas = new Map(); // map vacio donde guardare las columnas

    for(const nombre of Tablero.COLUMNAS){ // recorro los 3 nombres de la colum en orden

      //solo En curso lleva limite wip (limiteEnCurso)
      let limite;
      if (nombre === "En curso") {
        limite = limiteEnCurso;
      } else {
        limite = null;
      }
      
      // creo la columna y la guardo en el map, manteniendo el orden
      this.#columnas.set(nombre, new Columna(nombre, limite))
 
    }
  }

  // static desde(datos, limiteEnCurso): un Tablero con una tarea por cada objeto de datos
  //   (usa crearTarea)

  static desde(datos, limiteEnCurso){

    const tablero = new Tablero(limiteEnCurso); // creo un nuevo tablero

    // titulo, prioridad, limite, cadaDias
    for(const dato of datos){ // recorro cada objeto de datos
      tablero.crearTarea(dato); //crearTarea mira si es normal o recurrente y la deja en "Por hacer"
    }
    return tablero; // devuelvo el tablero ya relleno
  }

  // columna(nombre): la Columna, o un Error si no existe (que el mensaje lleve el nombre)
  // get columnas: array con las tres columnas, en orden
  columna(nombre){

    //busco la columna en el map, sino está devuelve Undefined
    const col = this.#columnas.get(nombre);

    // sino existe lanzo un error que lleve el nombre 
    if(!col) throw new Error(`No existe la columna ${nombre}`);

    // si existe, la devolvemos
    return col;
  }

  get columnas(){ //devuelve un array con las tres columnas en orden
    return [...this.#columnas.values()]; // .values da las clumnas del Map y con [...] la convierto en array
  }

  // crearTarea(datos): TareaRecurrente si datos trae cadaDias, Tarea si no → a «Por hacer»
  //   y la devuelve. datos es un objeto { titulo, prioridad, limite, cadaDias }: saca cada campo
  //   y pásaselo al constructor, en su orden (new Tarea(datos) NO vale: espera el título)

  crearTarea(datos){

    // DESTRUCTURING -> sacamos cada campo del objeto datos en su propia variable.
    const {titulo, prioridad, limite, cadaDias} = datos;

    // Si trae cadaDias es recurrente, si no, es una tarea normal
    // Pasamos los argumentos en el orden que espera cada constructor
    let tarea;
    if (cadaDias) {
      tarea = new TareaRecurrente(titulo, prioridad, limite, cadaDias);
    } else {
      tarea = new Tarea(titulo, prioridad, limite);
    }

    // añadir ya devuelve la tarea, asi devuelvo directamente su resultado
    return this.columna("Por hacer").añadir(tarea);

  }

  // buscar(id): la tarea, esté en la columna que esté, o null
  buscar(id){

    for(const col of this.columnas){ // recorro la columnas una por una

      const t = col.tareas.find(tarea => tarea.id === id ); // le pedimos a la columna que busque la tarea

      if(t){
        return t; // si la encuentra que la devuelva y termina
      }
    }

    return null; // si ninguna columna la tiene, devuelve null
  }

  // dondeEsta(id): la Columna donde está, o null
  dondeEsta(id){

    for(const col of this.columnas){

      if(col.tiene(id)){
        return col;
      }

    }
    return null;
  }

  // privado #trasladar, que lo usaran mover y completar

  #trasladar(id, destino){

    const origen = this.dondeEsta(id);

    if(origen === null){ // sino esta en ninguna columna no existe
      throw new Error(`No existe la tarea ${id}`);
    }

    // lanza el error sola si el nombre no existe
    const columna = this.columna(destino);

    if(origen.nombre === "Hecho"){ // de Hecho no se puede sacar nada
      throw new MovimientoNoPermitidoError(id, origen.nombre, destino);
    }

    if(origen === columna) { // no se puede mover a la columna en la que ya está
      throw new MovimientoNoPermitidoError(id, origen.nombre, destino);
    }

    if(columna.llena){ // destino lleno, pasandole la columna
      throw new ColumnaLlenaError(columna)
    }

    // ahora se toca algo cuando las comprobaciones han pasado
    const tarea = origen.quitar(id);
    return columna.añadir(tarea); // añadir devuelve la tarea

  }


  // mover(id, destino): Error si no existe la tarea · Error si la columna destino está llena
  //   (¡comprueba ANTES de quitarla de su columna, o se perdería!) · la mueve y la devuelve

  mover(id, destino){
    
    return this.#trasladar(id, destino)

  }

  // completar(id): la mueve a «Hecho» y añade a «Por hacer» lo que devuelva tarea.alCompletar()
  //   ⚠️ Sin preguntar si es recurrente: eso es el polimorfismo

  completar(id) {

  const tarea = this.#trasladar(id, "Hecho"); //muevo la tarea Hecho, utilizando mover que nos devuelve la tarea
  
  // no preguntamos el tipo -> polimorfismo.
  for (const siguiente of tarea.alCompletar()) { 
    // Cada nueva tarea va a "Por hacer".
    this.columna("Por hacer").añadir(siguiente);
  }
  // Devolvemos la tarea completada.
  return tarea;
}

  // resumen(hoy = new Date()): { porHacer, enCurso, hecho, vencidas }
  //   vencidas = las que estaVencida(hoy) y NO están en «Hecho»

  resumen(hoy = new Date()) {

  // juntamos las tareas de "Por hacer" y "En curso" , las de "Hecho" no cuentan
  const pendientes = [...this.columna("Por hacer").tareas,...this.columna("En curso").tareas];

  return {
    // Cantidad de tareas de cada columna
    porHacer: this.columna("Por hacer").tareas.length,
    enCurso: this.columna("En curso").tareas.length,
    hecho: this.columna("Hecho").tareas.length,
    vencidas: pendientes.filter((t) => t.estaVencida(hoy)).length,
    // Contamos las pendientes que están vencidas a fecha de hoy
  };
}

  // ✍️ A5 · Reglas (vuelves a mover y completar) ─────────────────────────────────
  //   - Columna llena → ColumnaLlenaError (en vez de un Error cualquiera) -> hecho
  //   - Sacar una tarea de «Hecho», o «moverla» a la columna en la que ya está → hecho
  //     MovimientoNoPermitidoError. Todo se comprueba ANTES de tocar nada. -> hecho
  //   Pista: mover y completar hacen casi lo mismo. Un método privado #trasladar(id, destino)
  //   con las comprobaciones evita escribirlas dos veces. -> hecho

  // ✍️ C4 (bloque C) ────────────────────────────────────────────────────────────
  // toJSON(): { version, limiteEnCurso, columnas: { "Por hacer": [datos…], … } }
  //   JSON.stringify(tablero) lo llama solo. Sin él sale "{}": los # no se ven. Usa aDatos.

  /** Lo contrario de toJSON: el MISMO tablero (columnas, ids y límite WIP). Lanza si no encaja. */
  static desdeJSON(datos) {
    throw new Error("Sin hacer");
  }
}

// Comprueba con:  docker compose run --rm web npm test bloque-a
(void Columna,
  ColumnaLlenaError,
  MovimientoNoPermitidoError,
  Tarea,
  TareaRecurrente,
  aDatos,
  desdeDatos); // (borra esta línea cuando los uses)
