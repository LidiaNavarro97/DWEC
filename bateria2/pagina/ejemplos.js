// ejemplos.js — Qué enseña la página en cada bloque. No hace falta tocarlo.
//   modulos:  los ficheros del bloque. Todo lo que exportan queda en la consola (F12) con su nombre.
//   ejemplos: código que la página ejecuta con TUS funciones; «espera» es lo que debería salir.
//             Si espera es "💥", lo correcto es que lance un error.
// El comprobador (docker compose run --rm web npm run comprobar N) prueba muchos más casos: esto es para VER y DEPURAR.
const objetos = import.meta.glob("../src/bloque*/*.js");
const cargar = (ruta) => objetos[`../src/${ruta}`]();

export const BLOQUES = [
  {
    n: 1,
    titulo: "Objetos literales, this y copias",
    modulos: ["bloque1/objetos.js"],
    ejemplos: [
      { codigo: 'crearLibro("Momo", "Ende", 300).resumen()', espera: '"Momo (Ende), 300 págs."', tipo: "👀" },
      { codigo: 'leerPropiedad({ a: 1, "b c": 2 }, "b c")', espera: "2" },
      { codigo: 'tienePropia({ a: 1 }, "a")', espera: "true" },
      { codigo: 'tienePropia({ a: 1 }, "toString")', espera: "false" },
      {
        codigo: 'const original = crearLibro("Momo", "Ende", 300);\nconst copia = marcarPrestado(original);\n[original.prestado, copia.prestado]',
        espera: "[false, true]",
      },
      { codigo: 'contarPorAutor([{ autor: "Ende" }, { autor: "Tolkien" }, { autor: "Ende" }])', espera: "{ Ende: 2, Tolkien: 1 }" },
      {
        codigo:
          'const socio = { nombre: "Ana", direccion: { ciudad: "Cádiz" }, prestamos: ["111"] };\nconst copia = copiaProfunda(socio);\ncopia.direccion.ciudad = "Jerez";\ncopia.prestamos.push("222");\nsocio',
        espera: '{ nombre: "Ana", direccion: { ciudad: "Cádiz" }, prestamos: ["111"] }',
      },
      { codigo: 'ficha(crearLibro("Momo", "Ende", 300))', espera: '"titulo: Momo · autor: Ende · paginas: 300 · prestado: false"' },
    ],
  },
  {
    n: 2,
    titulo: "Prototipos",
    modulos: ["bloque2/prototipos.js"],
    ejemplos: [
      { codigo: 'new Lector("Ana").saludar()', espera: '"Hola, soy Ana"', tipo: "👀" },
      { codigo: 'esPropia(Object.create({ a: 1 }), "a")', espera: "false" },
      { codigo: 'estaEnLaCadena({}, "toString")', espera: "true" },
      { codigo: 'new Socio("Ana", "2º DAW").presentarse()', espera: '"Soy Ana, de 2º DAW"' },
      { codigo: 'Object.hasOwn(new Socio("Ana", "2º DAW"), "presentarse")', espera: "false" },
      { codigo: 'const base = { saludo() { return "Hola, " + this.nombre; } };\ncrearDesde(base, "Luis").saludo()', espera: '"Hola, Luis"' },
      { codigo: "[niveles({}), niveles(Object.create(null)), niveles(new Lector('x'))]", espera: "[1, 0, 2]" },
    ],
  },
  {
    n: 3,
    titulo: "Clases: privados, getters, static y this",
    modulos: ["bloque3/clases.js"],
    ejemplos: [
      { codigo: "new Contador().incrementar().incrementar().valor", espera: "2", tipo: "👀" },
      { codigo: "new Punto(3, 4).distanciaAlOrigen()", espera: "5" },
      { codigo: 'new Libro("  Momo ", "Ende", 300).resumen()', espera: '"Momo (Ende), 300 págs."' },
      { codigo: 'new Libro("", "Ende", 300)', espera: "💥" },
      { codigo: 'new Libro("Momo", "Ende", -5)', espera: "💥" },
      { codigo: 'const l = new Libro("Momo", "Ende", 300);\ntry { l.paginas = 0; } catch {}\nl.paginas', espera: "300" },
      { codigo: 'Libro.desde({ titulo: "Dune", autor: "Herbert", paginas: 600 }).esLargo', espera: "true" },
      { codigo: 'const antes = Libro.creados;\nnew Libro("A", "B", 1);\nLibro.creados - antes', espera: "1" },
      { codigo: 'const avisar = crearAvisador(new Libro("Momo", "Ende", 300));\navisar()', espera: '"Momo (Ende), 300 págs."' },
    ],
  },
  {
    n: 4,
    titulo: "Herencia y polimorfismo",
    modulos: ["bloque4/herencia.js"],
    ejemplos: [
      { codigo: 'new Publicacion("Momo", 1973).descripcion()', espera: '"Momo (1973)"', tipo: "👀" },
      { codigo: 'new Libro("Momo", 1973, "Ende").descripcion()', espera: '"Momo (1973) · Ende"' },
      { codigo: 'new Revista("Muy Interesante", 2026, 512).descripcion()', espera: '"Muy Interesante (2026) · nº 512"' },
      { codigo: 'new Revista("Muy Interesante", 2026, 512).diasPrestamo()', espera: "7" },
      { codigo: 'new Libro("Momo", 1973, "Ende") instanceof Publicacion', espera: "true" },
      {
        codigo: 'const lista = [new Libro("Momo", 1973, "Ende"), new Revista("Muy Interesante", 2026, 512)];\ncatalogo(lista)',
        espera: '["Momo (1973) · Ende", "Muy Interesante (2026) · nº 512"]',
      },
      {
        codigo:
          'diasTotales([new Libro("Momo", 1973, "Ende"), new Revista("A", 2026, 1), new Revista("B", 2026, 2)])',
        espera: "28",
      },
    ],
  },
  {
    n: 5,
    titulo: "Composición, Map, Date e Intl",
    modulos: ["bloque5/composicion.js"],
    ejemplos: [
      { codigo: 'const e = new PrestamoError("Ya lo tiene", "111");\n[e.name, e.isbn, e instanceof Error]', espera: '["PrestamoError", "111", true]', tipo: "👀" },
      { codigo: "formatoFecha(new Date(2026, 10, 3))", espera: '"03/11/2026"' },
      { codigo: "formatoFecha(fechaDevolucion(new Date(2026, 9, 20, 10), 14))", espera: '"03/11/2026"' },
      { codigo: "fechaDevolucion(new Date(2026, 9, 20, 10), 14).getHours()", espera: "10" },
      { codigo: "const hoy = new Date(2026, 9, 20);\nfechaDevolucion(hoy, 14);\nhoy.getDate()", espera: "20" },
      { codigo: 'const ana = new Socio("Ana", 2);\nana.prestar("111", new Date(2026, 9, 1));\nana.prestar("222", new Date(2026, 9, 1));\nana.numPrestamos', espera: "2" },
      { codigo: 'const ana = new Socio("Ana", 1);\nana.prestar("111", new Date(2026, 9, 1));\nana.prestar("222", new Date(2026, 9, 1))', espera: "💥" },
      { codigo: 'new Socio("Ana").devolver("999")', espera: "💥" },
      {
        codigo: 'const ana = new Socio("Ana");\nana.prestar("111", new Date(2026, 9, 1), 7);\nana.prestar("222", new Date(2026, 9, 1), 30);\nana.vencidos(new Date(2026, 9, 20))',
        espera: '["111"]',
      },
    ],
  },
  {
    n: 6,
    titulo: "Integrador: la biblioteca",
    modulos: ["bloque4/herencia.js", "bloque5/composicion.js", "bloque6/biblioteca.js"],
    ejemplos: [
      {
        codigo:
          'const b = new Biblioteca();\nb.alta("111", new Libro("Momo", 1973, "Ende"));\nb.alta("222", new Revista("Muy Interesante", 2026, 512));\nb.registrar("Ana", 2);\nb.prestar("222", "Ana", new Date(2026, 9, 1));\nb.disponibles()',
        espera: '["Momo (1973) · Ende"]',
      },
      {
        codigo:
          'const b = new Biblioteca();\nb.alta("111", new Libro("Momo", 1973, "Ende"));\nb.alta("222", new Revista("Muy Interesante", 2026, 512));\nb.registrar("Ana", 2);\nb.prestar("222", "Ana", new Date(2026, 9, 1));\nb.informeVencidos(new Date(2026, 9, 20))',
        espera: '[{ socio: "Ana", isbn: "222" }]',
      },
      { codigo: 'const b = new Biblioteca();\nb.alta("111", new Libro("Momo", 1973, "Ende"));\nb.alta("111", new Libro("Otro", 2000, "X"))', espera: "💥" },
      { codigo: 'const b = new Biblioteca();\nb.registrar("Ana");\nb.prestar("999", "Ana", new Date())', espera: "💥" },
    ],
  },
];

export async function cargarBloque(bloque) {
  const modulos = await Promise.all(bloque.modulos.map(cargar));
  return Object.assign({}, ...modulos);
}

// Las predicciones: el texto de predicciones.js (para leer las expresiones) y tus respuestas
const textos = import.meta.glob("../src/bloque*/predicciones.js", { query: "?raw", import: "default" });
export async function cargarPredicciones(n) {
  const ruta = `../src/bloque${n}/predicciones.js`;
  if (!textos[ruta]) return [];
  const [texto, modulo] = await Promise.all([textos[ruta](), objetos[ruta]()]);
  return [...texto.matchAll(/^\s*(p\d+):.*?\/\/\s*(.+)$/gm)].map(([, clave, expresion]) => ({
    clave,
    expresion: expresion.trim(),
    tuya: modulo.predicciones?.[clave],
  }));
}
