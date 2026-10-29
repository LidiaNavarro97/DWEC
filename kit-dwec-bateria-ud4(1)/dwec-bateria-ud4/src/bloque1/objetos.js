// Bloque 1 · Objetos literales, this, referencias y copias
// Explicación: web de DWEC → UD4 · 4.1 Batería de ejercicios → Bloque 1 (y los apartados 2–5 de la UD4).
// Comprueba con:  docker compose run --rm web npm run comprobar 1

// 👀 EJEMPLO RESUELTO ─────────────────────────────────────────────────────────
// Un libro como objeto literal. El método resumen() usa this: «el objeto con el que se llama».
export function crearLibro(titulo, autor, paginas) {
  return {
    titulo,
    autor,
    paginas,
    prestado: false,
    resumen() {
      return `${this.titulo} (${this.autor}), ${this.paginas} págs.`;
    },
  };
}

// 🪜 ESCALERA ──────────────────────────────────────────────────────────────────
// 🪜 1 · Devuelve el valor de la propiedad cuyo nombre está en `clave`.
//        leerPropiedad({ a: 1, "b c": 2 }, "b c") → 2      (pista: con punto no se puede; con corchetes, sí)
export function leerPropiedad(objeto, clave) {
  return objeto[clave];
}

// 🪜 2 · ¿Tiene el objeto esa propiedad COMO PROPIA (no heredada)?
//        tienePropia({ a: 1 }, "a") → true · tienePropia({ a: 1 }, "toString") → false
export function tienePropia(objeto, clave) {
  return objeto.hasOwnProperty(clave);
}

// ✍️ TU TURNO ─────────────────────────────────────────────────────────────────
// ✍️ 1 · Devuelve un libro NUEVO igual que el que te pasan, pero con prestado: true.
//        El original NO puede cambiar (el comprobador te lo pasa congelado).
export function marcarPrestado(libro) {
  return { ...libro, prestado: true };
}

// ✍️ 2 · Cuenta cuántos libros hay de cada autor.
//        contarPorAutor([{ autor: "Ende" }, { autor: "Tolkien" }, { autor: "Ende" }]) → { Ende: 2, Tolkien: 1 }
export function contarPorAutor(libros) {
  const autores = {};

  for (const libro of libros) {
    if (autores.hasOwnProperty(libro.autor)) {
      autores[libro.autor] += 1;
    } else {
      autores[libro.autor] = 1;
    }
  }
  return autores;
}

// ✍️ 3 · Copia un socio de forma que cambiar la COPIA no cambie nunca el ORIGINAL.
//        socio = { nombre: "Ana", direccion: { ciudad: "Cádiz" }, prestamos: ["111"] }
//        Cuidado: { ...socio } no basta. ¿Por qué? (predicción p3)
export function copiaProfunda(socio) {
  return {
    ...socio,
    direccion: { ...socio.direccion },
    prestamos: [...socio.prestamos],
  };
}

// ✍️ 4 · Una línea con todas las propiedades del libro que NO son funciones, separadas por « · ».
//        ficha(crearLibro("Momo", "Ende", 300)) → "titulo: Momo · autor: Ende · paginas: 300 · prestado: false"
//        (pista: Object.entries + filter + map + join)
export function ficha(libro) {
  const propiedades = Object.entries(libro);
  const filtrado = propiedades.filter(n => typeof n[1]!== "function");
  const recorrido = filtrado.map( n => n[0] + ": " + n[1]);
  const final = recorrido.join(" · ");

  return final;
}