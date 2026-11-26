import { FaltaMaterialError } from "./errores.js";
import { Tarea } from "./Tarea.js";

export class TareaConMateriales extends Tarea {
    #materiales;

    // tarea con materiales extiende de tarea, pongo su constructor y el super
    constructor(titulo, prioridad, limite, materiales) {
        super(titulo, prioridad, limite);

        // creo el objeto nuevo con map y con las unidades a 0
        this.#materiales = materiales.map((nombre) => ({nombre, unidades: 0}));

    }

    // un array nuevo una copia
    get materiales(){
        return this.#materiales.map((m) => ({...m}));
    }


    contar(nombre, unidades) {
        //busco el material por su nombre
        const material = this.#materiales.find((m) => m.nombre === nombre);

        // compruebo todo antes de cambiar nada
        if (!material) {
            throw new RangeError(`Este nombre no está en la lista: ${nombre}`);
        }

        if (!Number.isInteger(unidades) || unidades < 0) {
            throw new RangeError (`Unidades no validas: ${unidades}`);
        }

        // si esta bien pues se sustituyr lo de antes
        material.unidades = unidades;
    }

    comprobarPaso(desde, hasta) {
        if (desde !== "Por hacer") return; // la regla es para EMPEZAR
        const faltan = this.#materiales.filter((m) => m.unidades === 0).map((m) => m.nombre);
        if (faltan.length > 0) throw new FaltaMaterialError(faltan);
    }


}