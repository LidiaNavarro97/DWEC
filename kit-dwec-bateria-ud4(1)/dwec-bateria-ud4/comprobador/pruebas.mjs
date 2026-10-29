// pruebas.mjs — Las pruebas de cada bloque de la batería de la UD4. Puedes leerlas: dicen QUÉ se espera, no CÓMO hacerlo.
// Cada prueba devuelve: true (bien) · "pendiente" · un texto (lo que falla) · { aviso: "..." } · { bien|mal, info }
import { inspect } from "node:util";

// ───────────────────────── utilidades ─────────────────────────
const muestra = (v) => inspect(v, { depth: 4, breakLength: Infinity, compact: true });

function igual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => igual(a[k], b[k]));
}

// Prueba una función con varios casos y explica el primero que falla
function casos(fn, nombre, lista) {
  for (const [argumentos, esperado] of lista) {
    const obtenido = fn(...argumentos);
    if (!igual(obtenido, esperado)) {
      return `${nombre}(${argumentos.map(muestra).join(", ")}) debería dar ${muestra(esperado)} y da ${muestra(obtenido)}${pistaDe(obtenido, esperado)}`;
    }
  }
  return true;
}

// Lo que suele estar detrás de un resultado raro
function pistaDe(obtenido, esperado) {
  if (obtenido === undefined && esperado !== undefined) return " → ¿te falta el return? (ojo: forEach no devuelve nada; map, filter y reduce sí)";
  const hayNaN = (v) => Number.isNaN(v) || (v !== null && typeof v === "object" && Object.values(v).some((x) => Number.isNaN(x)));
  if (hayNaN(obtenido)) return " → sale NaN: estás sumando a algo que todavía es undefined. Empieza en 0: (algo ?? 0) + 1";
  return "";
}

// ¿Lanza un error de esta clase? Devuelve null si sí, o el texto de lo que ha pasado
function lanza(fn, Clase = Error) {
  try {
    fn();
  } catch (e) {
    if (e?.message === "Sin hacer") throw e;
    return e instanceof Clase ? null : `lanza un ${e?.name ?? typeof e}, no un ${Clase.name}`;
  }
  return "no lanza ningún error";
}

// Predicciones: no se dice cuál es la buena. Al acertar, se explica POR QUÉ; al fallar, una pista.
// datos = { p1: [expresión, valor correcto, por qué, pista], ... }
function predicciones(datos) {
  return ({ pred }) => {
    const p = pred.predicciones ?? {};
    const claves = Object.keys(datos);
    const sinContestar = claves.filter((k) => p[k] === undefined);
    if (sinContestar.length === claves.length) return "pendiente";
    if (sinContestar.length > 0) return `Te faltan: ${sinContestar.join(", ")}`;
    const falladas = claves.filter((k) => !igual(p[k], datos[k][1]));
    const info = claves.map((k) => {
      const [expresion, valor, porque, pista] = datos[k];
      return falladas.includes(k)
        ? `✘ ${k} · ${expresion}  → no es ${muestra(p[k])}. Pista: ${pista}`
        : `✔ ${k} · ${expresion}  → ${muestra(valor)}: ${porque}`;
    });
    if (falladas.length > 0) {
      return { mal: `${claves.length - falladas.length}/${claves.length} bien. Revisa: ${falladas.join(", ")} → pruébalas con docker compose run --rm web npm run probar`, info };
    }
    return { bien: true, info };
  };
}

const d = (a, m, dia, h = 10) => new Date(a, m - 1, dia, h, 0); // fecha local: d(2026, 10, 20) = 20/10/2026 10:00

// ───────────────────────── bloques ─────────────────────────
export const BLOQUES = [
  {
    id: "1",
    titulo: "Bloque 1 · Objetos, this, referencias y copias",
    modulos: { m: "src/bloque1/objetos.js", pred: "src/bloque1/predicciones.js" },
    pruebas: [
      {
        id: "1.p",
        texto: "Predicciones",
        fn: predicciones({
          p1: ["const a = { n: 1 }; const b = a; b.n = 2; a.n", 2, "b no es una copia: a y b son DOS nombres del MISMO objeto", "¿= copia el objeto o solo la referencia?"],
          p2: ["const a = { n: 1 }; const b = { ...a }; b.n = 2; a.n", 1, "el spread crea un objeto NUEVO con las mismas propiedades", "¿{ ...a } es el mismo objeto que a?"],
          p3: ["const a = { x: { n: 1 } }; const b = { ...a }; b.x.n = 2; a.x.n", 2, "el spread es una copia SUPERFICIAL: b.x y a.x siguen siendo el mismo objeto", "el spread copia el primer nivel… ¿y lo que hay dentro de x?"],
          p4: ["Object.keys({ a: 1, b: 2 }).length", 2, "keys devuelve un array con los nombres de las propiedades propias", "¿qué devuelve Object.keys, y cuántas claves hay?"],
          p5: ["typeof { saludo() { return 'hola'; } }.saludo", "function", "un método es una propiedad cuyo valor es una función", "¿qué es saludo sin los paréntesis?"],
        }),
      },
      {
        id: "1.E",
        texto: "👀 Ejemplo: crearLibro con un método que usa this",
        fn: ({ m }) => {
          const l = m.crearLibro("Dune", "Herbert", 600);
          if (l.resumen() !== "Dune (Herbert), 600 págs.") return `resumen() da ${muestra(l.resumen())}`;
          l.titulo = "Dune II";
          return l.resumen().startsWith("Dune II") || "resumen() no usa this.titulo: al cambiar el título no cambia";
        },
      },
      {
        id: "1.e1",
        texto: "🪜 leerPropiedad (corchetes)",
        fn: ({ m }) => {
          if (m.leerPropiedad({ clave: "¡ojo!", a: 1 }, "a") === "¡ojo!") return "usas objeto.clave: eso busca una propiedad que se llama «clave». El nombre está DENTRO de la variable: objeto[clave]";
          return casos(m.leerPropiedad, "leerPropiedad", [[[{ a: 1, "b c": 2 }, "b c"], 2], [[{ a: 1 }, "a"], 1], [[{ a: 1 }, "z"], undefined]]);
        },
      },
      {
        id: "1.e2",
        texto: "🪜 tienePropia (propia, no heredada)",
        fn: ({ m }) => {
          if (m.tienePropia({ a: 1 }, "toString") === true) return "tienePropia({ a: 1 }, \"toString\") da true: «in» mira también lo HEREDADO. Lo propio se pregunta con Object.hasOwn(objeto, clave)";
          if (m.tienePropia({ a: undefined }, "a") === false) return "{ a: undefined } SÍ tiene la propiedad a (aunque valga undefined): no mires el valor, pregunta con Object.hasOwn";
          return casos(m.tienePropia, "tienePropia", [[[{ a: 1 }, "a"], true], [[{ a: 1 }, "toString"], false], [[{ a: undefined }, "a"], true]]);
        },
      },
      {
        id: "1.1",
        texto: "✍️ marcarPrestado devuelve un objeto NUEVO",
        fn: ({ m }) => {
          const original = Object.freeze({ titulo: "Dune", prestado: false });
          let r;
          try {
            r = m.marcarPrestado(original);
          } catch (e) {
            if (e instanceof TypeError) return "Estás MODIFICANDO el libro original. Devuelve uno nuevo con { ...libro, … }";
            throw e;
          }
          if (r === original) return "devuelves el MISMO objeto: crea uno nuevo";
          if (r?.prestado !== true || r?.titulo !== "Dune") return `devuelve ${muestra(r)}`;
          return original.prestado === false || "has cambiado el original";
        },
      },
      {
        id: "1.2",
        texto: "✍️ contarPorAutor",
        fn: ({ m }) =>
          casos(m.contarPorAutor, "contarPorAutor", [
            [[[{ autor: "Ende" }, { autor: "Tolkien" }, { autor: "Ende" }]], { Ende: 2, Tolkien: 1 }],
            [[[]], {}],
          ]),
      },
      {
        id: "1.3",
        texto: "✍️ copiaProfunda: los cambios en la copia no tocan el original",
        fn: ({ m }) => {
          const original = { nombre: "Ana", direccion: { ciudad: "Cádiz" }, prestamos: ["111"] };
          const c = m.copiaProfunda(original);
          if (!igual(c, original)) return `la copia no tiene lo mismo: ${muestra(c)}`;
          c.direccion.ciudad = "Jerez";
          c.prestamos.push("222");
          if (original.direccion.ciudad !== "Cádiz") return "al cambiar la ciudad de la copia cambia la del original: direccion sigue siendo el mismo objeto. Cópiala también: direccion: { ...socio.direccion }";
          if (original.prestamos.length !== 1) return "al añadir un préstamo a la copia se añade al original: prestamos sigue siendo el mismo array. Un array se copia con [...array]";
          return true;
        },
      },
      {
        id: "1.4",
        texto: "✍️ ficha (Object.entries, sin los métodos)",
        fn: ({ m }) => {
          const l = { titulo: "Momo", autor: "Ende", paginas: 300, prestado: false, resumen() {} };
          const r = m.ficha(l);
          if (typeof r === "string" && r.includes("resumen")) return `da ${muestra(r)}: sale el método resumen. Quédate solo con los pares cuyo valor NO es una función (filter + typeof)`;
          if (Array.isArray(r)) return "devuelves un array: únelo en un texto con .join(\" · \")";
          return casos(m.ficha, "ficha", [[[l], "titulo: Momo · autor: Ende · paginas: 300 · prestado: false"]]);
        },
      },
    ],
  },
  {
    id: "2",
    titulo: "Bloque 2 · Prototipos",
    modulos: { m: "src/bloque2/prototipos.js", pred: "src/bloque2/predicciones.js" },
    pruebas: [
      {
        id: "2.p",
        texto: "Predicciones",
        fn: predicciones({
          p1: ["function F() {}; Object.getPrototypeOf(new F()) === F.prototype", true, "new enlaza el objeto nuevo con F.prototype", "¿qué hace new con el prototype de la función?"],
          p2: ["const o = {}; o.toString === Object.prototype.toString", true, "o no tiene toString: lo encuentra subiendo por la cadena hasta Object.prototype", "¿o tiene un toString propio? ¿dónde lo busca entonces?"],
          p3: ["class A {}; typeof A", "function", "class es azúcar sintáctico: por debajo, una clase es una función constructora", "repasa el apartado 6.7 de la UD4: ¿qué hay debajo de class?"],
          p4: ["const base = { x: 1 }; const h = Object.create(base); Object.hasOwn(h, 'x')", false, "x está en el prototipo de h, no en h", "Object.create no copia: enlaza"],
          p5: ["const base = { x: 1 }; const h = Object.create(base); h.x", 1, "h no tiene x, pero la encuentra en su prototipo (base)", "¿qué hace JavaScript cuando no encuentra la propiedad en el objeto?"],
        }),
      },
      {
        id: "2.E",
        texto: "👀 Ejemplo: Lector con el método en el prototipo",
        fn: ({ m }) => {
          const a = new m.Lector("Ana");
          return a.saludar() === "Hola, soy Ana" || `saludar() da ${muestra(a.saludar())}`;
        },
      },
      { id: "2.e1", texto: "🪜 esPropia", fn: ({ m }) => m.esPropia(Object.create({ a: 1 }), "a") === true ? "da true con una propiedad HEREDADA: «in» y objeto[clave] miran toda la cadena. Usa Object.hasOwn" : casos(m.esPropia, "esPropia", [[[{ a: 1 }, "a"], true], [[Object.create({ a: 1 }), "a"], false]]) },
      { id: "2.e2", texto: "🪜 estaEnLaCadena", fn: ({ m }) => m.estaEnLaCadena({}, "toString") === false ? "{} no tiene toString PROPIO, pero lo hereda: aquí no vale Object.hasOwn. Usa el operador in: clave in objeto" : casos(m.estaEnLaCadena, "estaEnLaCadena", [[[{}, "toString"], true], [[Object.create({ a: 1 }), "a"], true], [[{}, "zzz"], false]]) },
      {
        id: "2.1",
        texto: "✍️ Socio: función constructora con el método en el prototipo",
        fn: ({ m }) => {
          const a = new m.Socio("Ana", "2º DAW");
          const b = new m.Socio("Luis", "1º DAW");
          if (!(a instanceof m.Socio)) return "new Socio(…) no da un Socio: no hagas return de un objeto; guarda los datos en this (this.nombre = nombre)";
          if (a.nombre !== "Ana" || a.curso !== "2º DAW") return `el socio no guarda sus datos: ${muestra({ ...a })}. Dentro de la función: this.nombre = nombre; this.curso = curso`;
          if (typeof a.presentarse !== "function") return "no existe presentarse: añádelo FUERA de la función, con Socio.prototype.presentarse = function () { … }";
          const flecha = "¿lo has escrito con una flecha? Las flechas no tienen su propio this: usa Socio.prototype.presentarse = function () { … }";
          try {
            a.presentarse();
          } catch (e) {
            if (e instanceof TypeError) return `💥 presentarse() falla (${e.message}): ${flecha}`;
            throw e;
          }
          if (/undefined/.test(String(a.presentarse()))) return `presentarse() da ${muestra(a.presentarse())}: ¿lo has escrito con una flecha? Las flechas no tienen su propio this: usa function () { … }`;
          if (a.presentarse?.() !== "Soy Ana, de 2º DAW") return `presentarse() da ${muestra(a.presentarse?.())}`;
          if (Object.hasOwn(a, "presentarse")) return "presentarse está DENTRO de cada socio: ponlo en Socio.prototype (una sola vez para todos)";
          return a.presentarse === b.presentarse || "cada socio tiene su propia copia de presentarse";
        },
      },
      {
        id: "2.2",
        texto: "✍️ crearDesde: Object.create",
        fn: ({ m }) => {
          const base = { tipo: "socio", saludo() { return `soy ${this.nombre}`; } };
          const s = m.crearDesde(base, "Ana");
          if (Object.getPrototypeOf(s) !== base) return "el prototipo del objeto nuevo no es base: usa Object.create(base)";
          if (!Object.hasOwn(s, "nombre") || s.nombre !== "Ana") return "falta la propiedad propia nombre";
          if (Object.hasOwn(s, "tipo")) return "has copiado tipo dentro: no hace falta, se hereda";
          return s.saludo() === "soy Ana" || `s.saludo() da ${muestra(s.saludo())}`;
        },
      },
      {
        id: "2.3",
        texto: "✍️ niveles de la cadena de prototipos",
        fn: ({ m }) => {
          let r;
          try {
            r = m.niveles({});
          } catch (e) {
            if (e instanceof TypeError) return `💥 ${e.message}: has llegado a null y aún pides su prototipo. Para el bucle cuando actual sea null: while (actual !== null)`;
            throw e;
          }
          if (r === 2) return "niveles({}) da 2 y es 1: estás contando también el null del final. Cuenta solo mientras el prototipo NO sea null";
          if (r === 0) return "niveles({}) da 0 y es 1 (Object.prototype): ¿cuentas antes de subir? Empieza con el prototipo del objeto y cuenta cada uno hasta llegar a null";
          return casos(m.niveles, "niveles", [[[{}], 1], [[Object.create(null)], 0], [[new m.Lector("x")], 2], [[[]], 2]]);
        },
      },
    ],
  },
  {
    id: "3",
    titulo: "Bloque 3 · Clases, getters/setters, privados, static y el this perdido",
    modulos: { m: "src/bloque3/clases.js", pred: "src/bloque3/predicciones.js" },
    pruebas: [
      {
        id: "3.p",
        texto: "Predicciones",
        fn: predicciones({
          p1: ["class C { #x = 1; get x() { return this.#x; } }; new C().x", 1, "el getter da acceso de lectura al campo privado", "un get se usa como una propiedad, sin paréntesis"],
          p2: ["class C { #x = 1; }; Object.keys(new C()).length", 0, "los campos # no son propiedades normales: no salen en keys", "¿Object.keys ve los campos #?"],
          p3: ["class D { static n = 3; }; 'n' in new D()", false, "static pertenece a la CLASE (D.n), no a cada objeto", "¿dónde vive una propiedad static?"],
          p4: ["class L { resumen() {} }; typeof L.prototype.resumen", "function", "los métodos de una clase viven en su prototype, una sola vez", "repasa el apartado 6.5 de la UD4"],
        }),
      },
      {
        id: "3.E",
        texto: "👀 Ejemplo: Contador con un campo privado",
        fn: ({ m }) => {
          const c = new m.Contador();
          c.incrementar().incrementar();
          return c.valor === 2 || `valor es ${c.valor}`;
        },
      },
      {
        id: "3.e1",
        texto: "🪜 Punto",
        fn: ({ m }) => {
          const p = new m.Punto(3, 4);
          if (p.x !== 3 || p.y !== 4) return "el punto no guarda x e y: en el constructor, this.x = x; this.y = y";
          if (typeof p.distanciaAlOrigen !== "function") return "falta el método distanciaAlOrigen() (dentro de la clase, fuera del constructor)";
          const r = p.distanciaAlOrigen();
          return r === 5 || `new Punto(3, 4).distanciaAlOrigen() debería dar 5 y da ${muestra(r)}${Number.isNaN(r) ? ": ¿usas this.x y this.y dentro del método?" : ""}`;
        },
      },
      {
        id: "3.1",
        texto: "✍️ Libro: el constructor valida y las páginas van por setter",
        fn: ({ m }) => {
          let l;
          try {
            l = new m.Libro("  Momo ", "Ende", 300);
          } catch (e) {
            if (e instanceof RangeError) return "💥 el setter se llama a sí mismo sin fin: dentro de set paginas guarda en this.#paginas, no en this.paginas";
            if (e?.message !== "Sin hacer" && !(e instanceof TypeError)) return `new Libro("  Momo ", "Ende", 300) lanza «${e.message}»: con esos datos SÍ se tiene que crear. ¿Validas antes de quitar los espacios (trim)?`;
            throw e;
          }
          if (l.titulo !== "Momo") return `el título debería quedar sin espacios: ${muestra(l.titulo)}`;
          if (l.paginas !== 300) return `l.paginas da ${muestra(l.paginas)}: hace falta un get paginas() que devuelva this.#paginas`;
          let f = lanza(() => new m.Libro("   ", "Ende", 300));
          if (f) return `new Libro("   ", …) ${f}: un título vacío no vale`;
          for (const malo of [0, -3, 2.5, "300"]) {
            f = lanza(() => { l.paginas = malo; });
            if (f) return `l.paginas = ${muestra(malo)} ${f}`;
          }
          if (l.paginas !== 300) return "tras un valor no válido, las páginas han cambiado: valida ANTES de guardar";
          f = lanza(() => new m.Libro("Momo", "Ende", 0));
          if (f) return `new Libro("Momo", "Ende", 0) ${f}: el constructor debe usar el setter`;
          if (Object.keys(l).includes("paginas")) return "paginas es una propiedad pública: guárdala en un campo privado #paginas";
          if (new m.Libro("Dune", "Herbert", 600).esLargo !== true || l.esLargo !== false) return "esLargo debería ser true a partir de 400 páginas";
          return l.resumen() === "Momo (Ende), 300 págs." || `resumen() da ${muestra(l.resumen())}`;
        },
      },
      {
        id: "3.2",
        texto: "✍️ static: Libro.desde y Libro.creados",
        fn: ({ m }) => {
          const antes = m.Libro.creados;
          if (typeof antes !== "number") return "Libro.creados debería ser un número: un static #creados = 0 que sumas en el constructor (Libro.#creados++) y un static get creados()";
          const l = m.Libro.desde({ titulo: "Dune", autor: "Herbert", paginas: 600 });
          if (!(l instanceof m.Libro)) return "Libro.desde no devuelve un Libro: dentro, return new Libro(…) con los datos del objeto";
          if (m.Libro.creados !== antes + 1) return `al crear un libro, creados pasa de ${antes} a ${m.Libro.creados} (debería sumar 1)`;
          return !("creados" in l) || "creados es de la clase, no de cada libro: hazlo static";
        },
      },
      {
        id: "3.3",
        texto: "✍️ crearAvisador: que no se pierda this",
        fn: ({ m }) => {
          const l = new m.Libro("Momo", "Ende", 300);
          const avisar = m.crearAvisador(l);
          if (typeof avisar !== "function") return "crearAvisador debe devolver una función";
          let r;
          try {
            r = avisar();
          } catch (e) {
            return `💥 al llamarla suelta: ${e.message} → se ha perdido this. Devuelve una flecha que llame a libro.resumen() con el libro delante, o usa bind (apartado 7.7 de la UD4)`;
          }
          return r === l.resumen() || `avisar() da ${muestra(r)}`;
        },
      },
    ],
  },
  {
    id: "4",
    titulo: "Bloque 4 · Herencia y polimorfismo",
    modulos: { m: "src/bloque4/herencia.js", pred: "src/bloque4/predicciones.js" },
    pruebas: [
      {
        id: "4.p",
        texto: "Predicciones",
        fn: predicciones({
          p1: ["class A { hola() { return 'A'; } } class B extends A { hola() { return 'B' + super.hola(); } }; new B().hola()", "BA", "B sobrescribe hola y con super llama a la de A", "¿qué hace super.hola() dentro de B?"],
          p2: ["(mismas clases) new B() instanceof A", true, "un B es también un A: instanceof mira toda la cadena", "¿B hereda de A?"],
          p3: ["(mismas clases) Object.getPrototypeOf(B) === A", true, "extends también enlaza las clases entre sí (para los static)", "repasa el apartado 8.4 de la UD4"],
          p4: ["class X { constructor() { this.n = 1; } } class Y extends X { constructor() { super(); this.n++; } }; new Y().n", 2, "super() ejecuta el constructor de X (n = 1) y luego Y suma 1", "¿qué se ejecuta primero?"],
        }),
      },
      { id: "4.E", texto: "👀 Ejemplo: Publicacion", fn: ({ m }) => new m.Publicacion("Momo", 1973).descripcion() === "Momo (1973)" || "descripcion() de Publicacion no da «Momo (1973)»" },
      {
        id: "4.1",
        texto: "✍️ Libro extends Publicacion (con super)",
        fn: ({ m }) => {
          const l = new m.Libro("Momo", 1973, "Ende");
          if (!(l instanceof m.Publicacion)) return "Libro no hereda de Publicacion";
          if (l.titulo !== "Momo" || l.anio !== 1973) return "el título y el año no se guardan: ¿llamas a super(titulo, anio)?";
          if (l.autor !== "Ende") return "el libro no guarda el autor: después de super(…), this.autor = autor";
          if (l.descripcion() === "Momo (1973)") return "descripcion() da la de Publicacion: escribe descripcion() en Libro y reutiliza la de la base con super.descripcion()";
          return l.descripcion() === "Momo (1973) · Ende" || `descripcion() da ${muestra(l.descripcion())}`;
        },
      },
      {
        id: "4.2",
        texto: "✍️ Revista: otra descripción y otros días de préstamo",
        fn: ({ m }) => {
          const r = new m.Revista("Muy Interesante", 2026, 512);
          if (!(r instanceof m.Publicacion)) return "Revista no hereda de Publicacion";
          if (r.descripcion() !== "Muy Interesante (2026) · nº 512") return `descripcion() da ${muestra(r.descripcion())}`;
          if (r.diasPrestamo() !== 7) return `una revista se presta 7 días y da ${r.diasPrestamo()}: sobrescribe diasPrestamo() en Revista`;
          return new m.Libro("Momo", 1973, "Ende").diasPrestamo() === 14 || "un libro se presta 14 días (lo hereda de Publicacion)";
        },
      },
      {
        id: "4.3",
        texto: "✍️ catalogo: polimorfismo, sin preguntar el tipo",
        fn: ({ m }, ctx) => {
          const lista = [new m.Libro("Momo", 1973, "Ende"), new m.Revista("Muy Interesante", 2026, 512)];
          const r = casos(m.catalogo, "catalogo", [[[lista], ["Momo (1973) · Ende", "Muy Interesante (2026) · nº 512"]]]);
          if (r !== true) return r;
          const fuente = ctx.leer("src/bloque4/herencia.js") ?? "";
          const cuerpo = fuente.slice(fuente.indexOf("function catalogo"), fuente.indexOf("function diasTotales"));
          return /instanceof|\.constructor|typeof/.test(cuerpo) ? { aviso: "funciona, pero preguntas el tipo: cada objeto ya sabe describirse (polimorfismo)" } : true;
        },
      },
      {
        id: "4.4",
        texto: "✍️ diasTotales",
        fn: ({ m }) => {
          try {
            const r = m.diasTotales([new m.Libro("A", 1, "x"), new m.Revista("B", 2, 1)]);
            if (typeof r === "string") return `da ${muestra(r)}: sin valor inicial, reduce empieza con la 1.ª publicación (un objeto), no con 0. Ponle el 0: reduce((total, p) => …, 0)`;
            return casos(m.diasTotales, "diasTotales", [[[[new m.Libro("A", 1, "x"), new m.Revista("B", 2, 1), new m.Revista("C", 3, 2)]], 28], [[[]], 0]]);
          } catch (e) {
            if (/Reduce of empty array/.test(e?.message)) return "con una lista vacía, reduce falla: dale el valor inicial, reduce((total, p) => …, 0)";
            throw e;
          }
        },
      },
    ],
  },
  {
    id: "5",
    titulo: "Bloque 5 · Composición, Map, Date, Intl y errores propios",
    modulos: { m: "src/bloque5/composicion.js", pred: "src/bloque5/predicciones.js" },
    pruebas: [
      {
        id: "5.p",
        texto: "Predicciones",
        fn: predicciones({
          p1: ["new Map([['a', 1]]).size", 1, "size cuenta los pares clave → valor", "un Map se mide con size, no con length"],
          p2: ["new Set([1, 1, 2]).size", 2, "un Set no guarda repetidos", "¿qué pasa con el 1 repetido?"],
          p3: ["const f = new Date(2026, 0, 31); f.setDate(f.getDate() + 1); f.getMonth()", 1, "31 de enero + 1 día = 1 de febrero, y los meses empiezan en 0", "¿en qué mes cae el día siguiente al 31/01? ¿y desde qué número cuentan los meses?"],
          p4: ["class E extends Error {}; new E('x') instanceof Error", true, "un error propio sigue siendo un Error", "¿de quién hereda E?"],
        }),
      },
      {
        id: "5.E",
        texto: "👀 Ejemplo: PrestamoError",
        fn: ({ m }) => {
          const e = new m.PrestamoError("No quedan", "111");
          return (e instanceof Error && e.name === "PrestamoError" && e.isbn === "111") || "PrestamoError no tiene name o isbn";
        },
      },
      { id: "5.e1", texto: "🪜 formatoFecha con Intl", fn: ({ m }) => m.formatoFecha(d(2026, 11, 3)) === "3/11/2026" ? "da 3/11/2026: falta el cero delante. Pide 2 cifras: { day: \"2-digit\", month: \"2-digit\", year: \"numeric\" }" : casos(m.formatoFecha, "formatoFecha", [[[d(2026, 11, 3)], "03/11/2026"], [[d(2026, 1, 9)], "09/01/2026"]]) },
      {
        id: "5.1",
        texto: "✍️ fechaDevolucion (sin tocar la fecha de partida)",
        fn: ({ m }) => {
          const desde = d(2026, 10, 20, 10);
          const r = m.fechaDevolucion(desde, 14);
          if (desde.getDate() !== 20) return "has cambiado la fecha que te pasan: trabaja sobre una copia (new Date(desde))";
          if (!(r instanceof Date)) return "debería devolver un Date";
          if (r.getDate() !== 3 || r.getMonth() !== 10) return `20/10 + 14 días debería ser el 03/11 y da ${r.toLocaleDateString("es-ES")}`;
          return r.getHours() === 10 || `da el 03/11 a las ${r.getHours()}:00: el 25/10 cambia la hora y ese día tiene 25 h. Suma días con setDate, no milisegundos`;
        },
      },
      {
        id: "5.2",
        texto: "✍️ Socio: préstamos en un Map privado, con PrestamoError",
        fn: ({ m }) => {
          const s = new m.Socio("Ana", 2);
          const hoy = d(2026, 10, 20);
          if (typeof s.prestar !== "function") return "falta el método prestar(isbn, hoy, dias = 14)";
          s.prestar("111", hoy);
          if (s.numPrestamos !== 1) return `tras prestar, numPrestamos es ${muestra(s.numPrestamos)}: get numPrestamos() { return this.#prestamos.size; } (un Map se mide con size)`;
          let f = lanza(() => s.prestar("111", hoy), m.PrestamoError);
          if (f) return `prestar dos veces el mismo ${f}`;
          s.prestar("222", hoy);
          f = lanza(() => s.prestar("333", hoy), m.PrestamoError);
          if (f) return `pasar del máximo (2) ${f}`;
          s.devolver("111");
          if (s.numPrestamos !== 1) return "devolver no quita el préstamo";
          f = lanza(() => s.devolver("999"), m.PrestamoError);
          if (f) return `devolver lo que no tiene ${f}`;
          if (new m.Socio("Luis").maximo !== 3) return "el máximo por defecto es 3";
          return igual(Object.keys(s).sort(), ["maximo", "nombre"]) || `el socio enseña ${muestra(Object.keys(s))}: los préstamos van en un campo privado`;
        },
      },
      {
        id: "5.3",
        texto: "✍️ vencidos (por días, sin contar la hora)",
        fn: ({ m }) => {
          const s = new m.Socio("Ana");
          s.prestar("111", d(2026, 10, 1), 14); // vence el 15/10
          if (!igual(s.vencidos(d(2026, 10, 15, 20)), [])) return "el mismo día que vence (15/10 a las 20:00) todavía NO está vencido";
          return igual(s.vencidos(d(2026, 10, 16, 8)), ["111"]) || `el 16/10 debería estar vencido: da ${muestra(s.vencidos(d(2026, 10, 16, 8)))}`;
        },
      },
    ],
  },
  {
    id: "6",
    titulo: "Bloque 6 · Integrador: la biblioteca",
    modulos: { m: "src/bloque6/biblioteca.js", h: "src/bloque4/herencia.js", c: "src/bloque5/composicion.js" },
    pruebas: [
      {
        id: "6.1",
        texto: "✍️ alta y disponibles",
        fn: ({ m, h, c }) => {
          const b = new m.Biblioteca();
          b.alta("111", new h.Libro("Momo", 1973, "Ende"));
          b.alta("222", new h.Revista("Muy Interesante", 2026, 512));
          if (!igual(b.disponibles(), ["Momo (1973) · Ende", "Muy Interesante (2026) · nº 512"])) return `disponibles() da ${muestra(b.disponibles())}`;
          const f = lanza(() => b.alta("111", new h.Libro("Otro", 2000, "X")), c.PrestamoError);
          return f ? `dar de alta un isbn repetido ${f}` : true;
        },
      },
      {
        id: "6.2",
        texto: "✍️ prestar: comprueba que todo existe y que no está prestado",
        fn: ({ m, h, c }) => {
          const b = new m.Biblioteca();
          b.alta("111", new h.Libro("Momo", 1973, "Ende"));
          b.registrar("Ana");
          const hoy = d(2026, 10, 20);
          let f = lanza(() => b.prestar("999", "Ana", hoy), c.PrestamoError);
          if (f) return `prestar un isbn que no existe ${f}`;
          f = lanza(() => b.prestar("111", "Nadie", hoy), c.PrestamoError);
          if (f) return `prestar a un socio que no existe ${f}`;
          b.prestar("111", "Ana", hoy);
          if (b.disponibles().length !== 0) return "un libro prestado sigue saliendo en disponibles()";
          b.registrar("Luis");
          f = lanza(() => b.prestar("111", "Luis", hoy), c.PrestamoError);
          return f ? `prestar algo ya prestado ${f}` : true;
        },
      },
      {
        id: "6.3",
        texto: "✍️ informeVencidos: cada publicación con sus días (polimorfismo)",
        fn: ({ m, h }) => {
          const b = new m.Biblioteca();
          b.alta("111", new h.Libro("Momo", 1973, "Ende"));
          b.alta("222", new h.Revista("Muy Interesante", 2026, 512));
          b.registrar("Ana");
          b.prestar("111", "Ana", d(2026, 10, 1));
          b.prestar("222", "Ana", d(2026, 10, 1));
          const r = b.informeVencidos(d(2026, 10, 10));
          return igual(r, [{ socio: "Ana", isbn: "222" }]) || `el 10/10 solo la revista (7 días) está vencida; da ${muestra(r)}. ¿Usas diasPrestamo() de la publicación?`;
        },
      },
      {
        id: "6.4",
        texto: "✍️ devolver",
        fn: ({ m, h, c }) => {
          const b = new m.Biblioteca();
          b.alta("111", new h.Libro("Momo", 1973, "Ende"));
          b.registrar("Ana");
          b.prestar("111", "Ana", d(2026, 10, 20));
          b.devolver("111");
          if (b.disponibles().length !== 1) return "tras devolverlo, el libro no vuelve a disponibles()";
          const f = lanza(() => b.devolver("111"), c.PrestamoError);
          return f ? `devolver algo que no está prestado ${f}` : true;
        },
      },
    ],
  },
];

// 💡 Para empezar: lo que enseña el comprobador junto al ejercicio que toca hacer (el primero ⏳).
// Más ayuda, paso a paso (idea → ejemplo parecido → esqueleto), en la web: «🆘 ¿Atascado?» de cada bloque.
export const EMPEZAR = {
  "1.p": "En predicciones.js cambia cada undefined por lo que crees que da. Equivocarse no pasa nada: el comprobador te dice por qué.",
  "1.e1": "El nombre de la propiedad está DENTRO de la variable clave: objeto.clave no sirve, objeto[clave] sí.",
  "1.e2": "«Propia» = está en el objeto, no heredada. Hay una función hecha para eso: Object.hasOwn(objeto, clave).",
  "1.1": "No toques libro: devuelve un objeto NUEVO con todo lo del libro y prestado cambiado → { ...libro, prestado: ? }.",
  "1.2": "Un objeto vacío como contador. Por cada libro, súmale 1 a la casilla de su autor (la 1.ª vez no existe: empieza en 0 con ?? 0).",
  "1.3": "{ ...socio } copia solo el primer nivel: direccion y prestamos siguen siendo los del original. Cópialos también.",
  "1.4": "Object.entries(libro) te da pares [clave, valor]. filter (quita las funciones) → map (\"clave: valor\") → join(\" · \").",
  "2.p": "En predicciones.js cambia cada undefined por lo que crees que da. Si dudas, pruébalo: npm run probar \"…\"",
  "2.e1": "Igual que tienePropia del bloque 1: Object.hasOwn(objeto, clave).",
  "2.e2": "Aquí sí vale lo heredado: el operador in → clave in objeto.",
  "2.1": "Copia la forma de Lector (arriba): borra el throw, guarda los datos con this.… y pon presentarse FUERA, en Socio.prototype.",
  "2.2": "Object.create(base) crea un objeto vacío ENLAZADO a base. Guárdalo en una variable, ponle el nombre y devuélvelo.",
  "2.3": "Un while: sube con Object.getPrototypeOf(actual) y cuenta 1 cada vez, hasta que dé null.",
  "3.p": "En predicciones.js cambia cada undefined por lo que crees que da.",
  "3.e1": "Borra el throw. En el constructor: this.x = x; this.y = y. Debajo, el método distanciaAlOrigen() con Math.hypot(this.x, this.y).",
  "3.1": "Por partes: 1) #paginas; arriba de la clase. 2) get/set paginas (el set valida y guarda en this.#paginas). 3) el constructor. Comprueba tras cada parte.",
  "3.2": "static = de la CLASE: static #creados = 0 (súmale 1 en el constructor), static get creados() y static desde({ titulo, autor, paginas }).",
  "3.3": "Si devuelves libro.resumen, al llamarla suelta no hay «libro.» delante y this se pierde. Devuelve una flecha que la llame con el libro delante.",
  "4.p": "En predicciones.js cambia cada undefined por lo que crees que da.",
  "4.1": "Borra el throw: después de super(titulo, anio), guarda this.autor. Luego escribe descripcion() en Libro usando super.descripcion().",
  "4.2": "Como Libro, pero con el número. Y sobrescribe diasPrestamo() para que devuelva 7.",
  "4.3": "Una línea: publicaciones.map(…) pidiéndole a cada una su descripcion(). Sin if ni instanceof.",
  "4.4": "reduce: empieza en 0 y súmale a cada paso el diasPrestamo() de la publicación.",
  "5.p": "En predicciones.js cambia cada undefined por lo que crees que da.",
  "5.e1": "new Intl.DateTimeFormat(\"es-ES\", { day: \"2-digit\", month: \"2-digit\", year: \"numeric\" }).format(fecha)",
  "5.1": "Copia la fecha (new Date(desde)), y a la copia: setDate(getDate() + dias). Devuelve la copia.",
  "5.2": "Borra el throw. Arriba: #prestamos = new Map(); En el constructor, nombre y maximo. Después prestar (has, size, set) y devolver (delete).",
  "5.3": "Haz «hoy a las 00:00» con new Date(año, mes, día). Vencido = fecha de devolución ANTERIOR a eso. [...this.#prestamos] → filter → map.",
  "6.1": "Tres Map privados (catálogo, prestados, socios). alta: si ya existe → throw new PrestamoError; si no, set. disponibles: los del catálogo que no están en prestados.",
  "6.2": "registrar: new Socio(nombre, maximo), guárdalo y devuélvelo. prestar: comprueba en orden (¿existe?, ¿prestado?, ¿socio?) y llama a socio.prestar con publicacion.diasPrestamo().",
  "6.3": "Recorre los socios (this.#socios.values()) y, por cada isbn de socio.vencidos(hoy), un { socio: nombre, isbn }.",
  "6.4": "¿Quién lo tiene? this.#prestados.get(isbn). Si nadie → PrestamoError. Si no, que lo devuelva ese socio y bórralo de prestados.",
};
