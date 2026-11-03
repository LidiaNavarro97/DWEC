// TareaRecurrente.js — Bloque A · ✍️ A1: herencia.
// Una tarea recurrente ES UNA Tarea que se repite cada N días (sacar la basura, la copia de
// seguridad…). Cuando se completa, aparece otra igual con el límite N días más tarde.
import { Tarea } from "./Tarea.js";

// 1 · Haz que herede de Tarea (una palabra antes de la llave)
export class TareaRecurrente extends Tarea {
  // new TareaRecurrente("Sacar la basura", "media", "2026-10-23", 7): lo mismo que una Tarea + cadaDias
  // (Bloque C · ✍️ C3: añadirás un quinto parámetro, id = null, y se lo pasarás también al super)
  constructor(titulo, prioridad, limite, cadaDias) {
    // 2 · Llama al constructor del padre (super) con lo que es de Tarea, ANTES de usar this.
    super(titulo, prioridad, limite); // desp del constructor y antes del this
    // 3 · cadaDias tiene que ser un entero ≥ 1 → si no, RangeError.
    //     Pista: Number.isInteger
    if(!Number.isInteger(cadaDias) || cadaDias < 1 ) { // comprueba q el valor no sea un entero o sea menor q 1
      throw new RangeError("Los días deben ser un entero mayor o igual a 1");
    }
    // 4 · Una recurrente sin límite no tiene sentido → si this.limite es null, TypeError.
    if(this.limite === null) {
      throw new TypeError("Necesita una fecha límite. ")
    }
    // 5 · Guarda this.cadaDias.
    this.cadaDias = cadaDias;
  }

  // 6 · siguiente(): devuelve una TareaRecurrente NUEVA con el mismo título, prioridad y cadaDias,
  //     y el límite cadaDias días después. ⚠️ Sin tocar this.limite: copia la fecha primero.
  //     Pista: const limite = new Date(this.limite); limite.setDate(limite.getDate() + …)
  siguiente() {

    const limite = new Date(this.limite); // crea una copia de la fecha actual
    // para no modificar la fecha limite de la tarea original
    
    //aqui obtengo el dia actual y le sumo los dias de repeticion
    limite.setDate(limite.getDate() + this.cadaDias);
    
    // creo y devuelvo otra tarea recurrente con los mismos datos pero con fecha limite nueva
    return new TareaRecurrente(
      this.titulo,
      this.prioridad,
      limite,
      this.cadaDias
    );
  }

  // 7 · Sobrescribe alCompletar(): en vez de [], devuelve [la siguiente].
  alCompletar() {
    return [this.siguiente()];
    //ahora cuanado se completa una tarea recurrente, aparece otra tarea nueva
    // this.siguiente es para crear la siguiente tarea
  }

  // 8 · Sobrescribe toString(): lo del padre + " · 🔁 cada N días".
  toString() {
    // super.toString -> llama al metodo toString de la clase padre Tarea
    // this.cadaDias hace referencia a esa propiedad del objeto actual
    return `${super.toString()} · 🔁 cada ${this.cadaDias} días`;
  }
}

// Comprueba con:  docker compose run --rm web npm test 2-recurrente
