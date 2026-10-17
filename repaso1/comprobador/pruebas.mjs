// pruebas.mjs — Las pruebas de cada bloque. Puedes leerlas: dicen QUÉ se espera, no CÓMO hacerlo.
// Cada prueba devuelve: true (bien) · "pendiente" · un texto (lo que falla) · { aviso: "..." }
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
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
      const args = argumentos.map(muestra).join(", ");
      return `${nombre}(${args}) debería dar ${muestra(esperado)} y da ${muestra(obtenido)}`;
    }
  }
  return true;
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
      return {
        mal: `${claves.length - falladas.length}/${claves.length} bien. Revisa: ${falladas.join(", ")} → pruébalas en la consola del navegador`,
        info,
      };
    }
    return { bien: true, info };
  };
}

// Ejecuta ESLint sobre unos ficheros. Devuelve { errores: [...] } o null si no hay ESLint
function eslint(ctx, ficheros) {
  const config = ["/opt/herramientas/eslint.config.js", `${ctx.raiz}/eslint.config.js`].find(existsSync);
  const r = spawnSync("eslint", ["-c", config, "--format", "json", ...ficheros], { cwd: ctx.raiz, encoding: "utf8" });
  if (r.error) return null;
  try {
    const informe = JSON.parse(r.stdout);
    const errores = informe.flatMap((f) =>
      f.messages
        .filter((m) => m.severity === 2)
        .map((m) => `${f.filePath.replace(ctx.raiz + "/", "")}:${m.line} ${m.ruleId ?? m.message}`),
    );
    return { errores };
  } catch {
    return null;
  }
}

function git(ctx, ...orden) {
  const r = spawnSync("git", ["-C", ctx.raiz, ...orden], { encoding: "utf8" });
  if (r.error) return null;
  return r.status === 0 ? r.stdout.trim() : "";
}

// El texto de una función (para ver QUÉ técnica usa)
const codigo = (fn) => fn.toString();

// Un catálogo congelado (como el de datos.js) a partir de unos productos
const congelar = (productos) => Object.freeze(productos.map((p) => Object.freeze({ ...p })));

const PRODUCTO = (id, titulo, precio, estado, stock) => ({
  id, titulo, plataforma: "SNES", categoria: "RPG", estado, precio, stock,
});

// ───────────────────────── BLOQUES ─────────────────────────
export const BLOQUES = [
  // ═════════════════════════════ BLOQUE 0 ═════════════════════════════
  {
    id: "0",
    titulo: "Bloque 0 · El entorno paso a paso",
    modulos: {},
    pruebas: [
      {
        id: "0.2",
        texto: "Repositorio Git con al menos un commit",
        fn: (_, ctx) => {
          const n = git(ctx, "rev-list", "--count", "HEAD");
          if (n === null) return { aviso: "No encuentro git en este equipo: no puedo comprobarlo." };
          if (!existsSync(`${ctx.raiz}/.git`)) return "pendiente";
          if (n === "" || Number(n) < 1) return "Hay repositorio pero ningún commit: haz el primero (paso 0.2).";
          return true;
        },
      },
      {
        id: "0.3",
        texto: "docker-compose.yml: servicio web completo",
        fn: (_, ctx) => {
          const texto = ctx.leer("docker-compose.yml");
          if (texto === null) return "No encuentro docker-compose.yml en la carpeta del kit.";
          const web = texto.split(/^\s{2}web:\s*$/m)[1] ?? "";
          if (web.includes("____")) return "pendiente";
          if (!/-\s*["']?\.:\/app["']?\s*$/m.test(web)) return "volumes: tu carpeta (.) tiene que montarse en /app, como en el ejemplo.";
          if (!/["']127\.0\.0\.1:6100:5173["']/.test(web)) return "ports: tiene que ser \"127.0.0.1:6100:5173\" (primero el puerto de TU PC, luego el del contenedor).";
          if (!/"--host",\s*"0\.0\.0\.0"/.test(web)) return "command: Vite tiene que escuchar en 0.0.0.0 (todas las direcciones del contenedor).";
          if (ctx.entorno.COMPOSE_OK === "0") return "Docker dice que el fichero tiene un error: ejecuta  docker compose config  y lee el mensaje.";
          return true;
        },
      },
      {
        id: "0.4",
        texto: "index.html carga src/main.js como módulo",
        fn: (_, ctx) => {
          const html = ctx.leer("index.html") ?? "";
          const etiqueta = html.match(/<script[^>]*src=["'](\.?\/)?src\/main\.js["'][^>]*>/);
          if (!etiqueta) return "pendiente";
          if (!/type=["']module["']/.test(etiqueta[0])) return "El <script> existe pero le falta type=\"module\": sin eso, import y export dan error.";
          if (ctx.entorno.WEB_OK === "0") return "El fichero está bien, pero la página no responde en http://localhost:6100: ¿has hecho ./refuerzo.sh arrancar?";
          return true;
        },
      },
      {
        id: "0.5",
        texto: "saludo.js exporta saludar y main.js la importa y la usa",
        fn: async (_, ctx) => {
          const main = ctx.leer("src/main.js") ?? "";
          let mod;
          try {
            mod = await ctx.cargar("src/bloque0/saludo.js");
          } catch (e) {
            return `saludo.js tiene un error: ${e.message}`;
          }
          if (typeof mod.saludar !== "function") return "saludo.js no EXPORTA saludar (mira cómo lo hace fecha.js).";
          const r = casos(mod.saludar, "saludar", [[["Lidia"], "Hola, Lidia. ¡El entorno funciona!"]]);
          if (r !== true) return r;
          const importacion = main.match(/^\s*import\s*\{[^}]*\bsaludar\b[^}]*\}\s*from\s*(.+);?\s*$/m);
          if (!importacion) return "main.js todavía no importa saludar (mira la línea de import de fechaDeHoy).";
          if (!/^["']\.\/bloque0\/saludo\.js["']/.test(importacion[1].trim())) {
            return `La ruta del import está mal: ${importacion[1].trim()} → tiene que ser "./bloque0/saludo.js" (comillas normales, ./ y .js).`;
          }
          if (!/saludar\(/.test(main.replace(/^\s*import.*$/gm, ""))) return "main.js importa saludar pero no la llama.";
          return true;
        },
      },
      {
        id: "0.6",
        texto: "errores-lint.js sin errores de ESLint (y sigue funcionando)",
        fn: async (_, ctx) => {
          const mod = await ctx.cargar("src/bloque0/errores-lint.js");
          const r = casos(mod.contarAgotados, "contarAgotados", [
            [[[{ stock: 0 }, { stock: 3 }, { stock: 0 }]], 2],
            [[[]], 0],
          ]);
          if (r !== true) return `Ahora la función no hace lo mismo: ${r}`;
          const lint = eslint(ctx, ["src/bloque0/errores-lint.js"]);
          if (lint === null) return { aviso: "Sin ESLint en este equipo (¿sin Docker?): no puedo pasarlo." };
          if (lint.errores.length > 0) return `Quedan ${lint.errores.length}: ${lint.errores.join(" · ")}  → ./refuerzo.sh lint`;
          return true;
        },
      },
    ],
  },

  // ═════════════════════════════ BLOQUE D ═════════════════════════════
  {
    id: "d",
    titulo: "Bloque D · Depuración en el navegador",
    modulos: { caja: "src/depuracion/caja.js" },
    pruebas: [
      {
        id: "D.E",
        texto: "Ejemplo resuelto: totalTicket arreglado",
        fn: ({ caja }) =>
          casos(caja.totalTicket, "totalTicket", [
            [[[{ precio: 20, unidades: 1 }, { precio: 35, unidades: 2 }, { precio: 15, unidades: 1 }]], 105],
            [[[{ precio: 10, unidades: 3 }]], 30],
          ]),
      },
      {
        id: "D.1",
        texto: "Bug 1 · sumarUnidades",
        fn: ({ caja }) =>
          casos(caja.sumarUnidades, "sumarUnidades", [
            [[2, "3"], 5],
            [[2, "hola"], 2],
            [[2, null], 2],
            [[2, ""], 2],
          ]),
      },
      {
        id: "D.2",
        texto: "Bug 2 · stockTexto",
        fn: ({ caja }) =>
          casos(caja.stockTexto, "stockTexto", [
            [[{ stock: 0 }], "0"],
            [[{ stock: 5 }], "5"],
            [[{}], "sin datos"],
          ]),
      },
      {
        id: "D.3",
        texto: "Bug 3 · ordenarPorPrecio no toca la lista original",
        fn: ({ caja }) => {
          const lista = [{ precio: 30 }, { precio: 10 }, { precio: 20 }];
          const ordenada = caja.ordenarPorPrecio(lista);
          if (!igual(ordenada.map((p) => p.precio), [10, 20, 30])) return `No ordena bien: da ${muestra(ordenada.map((p) => p.precio))}`;
          if (!igual(lista.map((p) => p.precio), [30, 10, 20])) return "Ordena, pero la lista ORIGINAL también ha cambiado de orden.";
          return true;
        },
      },
      {
        id: "D.4",
        texto: "Bug 4 · precioConDescuento",
        fn: ({ caja }) =>
          casos(caja.precioConDescuento, "precioConDescuento", [
            [[25, 4], 22.5],
            [[25, 3], 23.75],
            [[25, 1], 25],
            [[25, 10], 22.5],
          ]),
      },
      {
        id: "D.inf",
        texto: "depuracion.md: las 4 fichas rellenas",
        fn: (_, ctx) => {
          const md = ctx.leer("depuracion.md");
          if (md === null) return "No encuentro depuracion.md";
          const fichas = md.split(/^## /m).filter((s) => s.startsWith("Bug"));
          const vacias = fichas.filter((f) => f.includes("____")).map((f) => f.split("·")[0].trim());
          if (vacias.length === fichas.length) return "pendiente";
          if (vacias.length > 0) return `Faltan por rellenar: ${vacias.join(", ")}`;
          const sinLinea = fichas.filter((f) => !/caja\.js:\d+/.test(f)).map((f) => f.split("·")[0].trim());
          if (sinLinea.length > 0) return `En «Breakpoint en» indica fichero y línea, como caja.js:17 (${sinLinea.join(", ")})`;
          return true;
        },
      },
      {
        id: "D.lim",
        texto: "caja.js sin console.log ni debugger",
        fn: (_, ctx) => {
          const js = ctx.leer("src/depuracion/caja.js") ?? "";
          if (/\bconsole\.log\s*\(/.test(js)) return "Hay un console.log en caja.js: se depura con breakpoints. Quítalo.";
          if (/^\s*debugger\s*;?/m.test(js)) return "Te has dejado un debugger; en caja.js. Quítalo al terminar.";
          return true;
        },
      },
    ],
  },

  // ═════════════════════════════ BLOQUE 1 ═════════════════════════════
  {
    id: "1",
    titulo: "Bloque 1 · Tipos, conversiones y operadores",
    modulos: { pred: "src/bloque1/predicciones.js", t: "src/bloque1/tipos.js" },
    pruebas: [
      {
        id: "1.P",
        texto: "Predicciones (10)",
        fn: predicciones({
          p1: ['"5" + 3', "53", "con un texto, + CONCATENA (une textos)", "¿qué hace + cuando uno de los dos es un texto?"],
          p2: ['"5" * 3', 15, "*, - y / no existen para textos, así que convierten a número", "¿se pueden «multiplicar» textos?"],
          p3: ['3 + "3" === "33"', true, '3 + "3" da el texto "33", igual en valor y en tipo', "primero se calcula 3 + \"3\" (mira p1), luego se compara"],
          p4: ["NaN || 1", 1, "NaN es falsy, así que || salta al de la derecha", "repasa la lista de valores falsy: 0, \"\", false, null, undefined… ¿y NaN?"],
          p5: ["NaN ?? 1", NaN, "?? solo salta con null o undefined, y NaN no es ninguno de los dos", "?? no mira si es falsy: solo si es null o undefined"],
          p6: ['"" || "sin nombre"', "sin nombre", 'el texto vacío "" es falsy', "¿el texto vacío cuenta como verdadero o como falso?"],
          p7: ['Number("")', 0, "trampa: un texto vacío (o solo espacios) se convierte en 0, no en NaN", "pruébalo: no es NaN"],
          p8: ['Number("12,5")', NaN, "la coma no es decimal en JavaScript: el texto no es un número válido", "¿qué separador decimal usa JavaScript?"],
          p9: ["0.1 + 0.2 === 0.3", false, "0.1 + 0.2 da 0.30000000000000004 (coma flotante): por eso se redondea", "escribe 0.1 + 0.2 en la consola"],
          p10: ['p.precio?.toFixed(2) ?? "sin precio"', "sin precio", "p.precio no existe: ?. da undefined en vez de romper, y ?? pone el valor por defecto", "¿qué da ?. cuando lo de la izquierda no existe?"],
        }),
      },
      {
        id: "1.a",
        texto: "🪜 esTexto (typeof)",
        fn: ({ t }) => casos(t.esTexto, "esTexto", [[["3"], true], [[""], true], [[3], false], [[null], false], [[undefined], false]]),
      },
      {
        id: "1.b",
        texto: "🪜 sumarTextos (convertir antes de sumar)",
        fn: ({ t }) => casos(t.sumarTextos, "sumarTextos", [[["3", "4"], 7], [["2.5", "1"], 3.5], [["0", "0"], 0]]),
      },
      {
        id: "1.c",
        texto: "🪜 valorODefecto (??)",
        fn: ({ t }) =>
          casos(t.valorODefecto, "valorODefecto", [
            [[0, 10], 0], [[undefined, 10], 10], [[null, "x"], "x"], [["", "x"], ""], [[false, true], false],
          ]),
      },
      {
        id: "1.1",
        texto: "formatearEuros",
        fn: ({ t }) =>
          casos(t.formatearEuros, "formatearEuros", [
            [[42.75], "42,75 €"],
            [[5], "5,00 €"],
            [[0], "0,00 €"],
            [[1234.5], "1234,50 €"],
          ]),
      },
      {
        id: "1.2",
        texto: "aNumero",
        fn: ({ t }) =>
          casos(t.aNumero, "aNumero", [
            [["3"], 3],
            [[" 12,5 "], 12.5],
            [["7.25"], 7.25],
            [["0"], 0],
            [[""], null],
            [["   "], null],
            [["hola"], null],
            [[null], null],
          ]),
      },
      {
        id: "1.3",
        texto: "stockVisible (con ?. y ??)",
        fn: ({ t }) => {
          const r = casos(t.stockVisible, "stockVisible", [
            [[{ titulo: "Tetris", stock: 5 }], 5],
            [[{ titulo: "Sonic", stock: 0 }], 0],
            [[{ titulo: "Pokémon" }], "sin datos"],
            [[undefined], "sin datos"],
          ]);
          if (r !== true) return r;
          if (!codigo(t.stockVisible).includes("?.")) return { aviso: "Funciona, pero usa ?. para practicarlo." };
          return true;
        },
      },
      {
        id: "1.4",
        texto: "nombreCorto",
        fn: ({ t }) =>
          casos(t.nombreCorto, "nombreCorto", [
            [[{ titulo: "Tetris", plataforma: "GAME BOY" }], "Tetris (GAME BOY)"],
            [[{ titulo: "", plataforma: "GAME BOY" }], "Sin título (GAME BOY)"],
            [[{ plataforma: "SNES" }], "Sin título (SNES)"],
            [[{ titulo: "Tetris" }], "Tetris (?)"],
          ]),
      },
    ],
  },

  // ═════════════════════════════ BLOQUE 2 ═════════════════════════════
  {
    id: "2",
    titulo: "Bloque 2 · Funciones",
    modulos: { pred: "src/bloque2/predicciones.js", f: "src/bloque2/funciones.js" },
    pruebas: [
      {
        id: "2.P",
        texto: "Predicciones (9)",
        fn: predicciones({
          p1: ["f(3)", 6, "b no viene, así que vale 2 (por defecto)", "¿qué vale b si no se pasa?"],
          p2: ["f(3, undefined)", 6, "pasar undefined es como no pasar nada: se usa el valor por defecto", "¿undefined activa el valor por defecto?"],
          p3: ["f(3, null)", 0, "null SÍ es un valor (no activa el defecto) y 3 * null = 0", "null no es undefined: ¿se usa el 2?"],
          p4: ['cuantos("a", "b")', 2, "...cosas junta todos los argumentos en un array: [\"a\", \"b\"]", "¿qué es cosas dentro de la función?"],
          p5: ["cuantos([1, 2, 3])", 1, "se pasa UN argumento (que es un array): cosas = [[1, 2, 3]]", "¿cuántos argumentos hay entre los paréntesis?"],
          p6: ["typeof ficha()", "undefined", "las { } son un BLOQUE de código, no un objeto: la función no devuelve nada", "en una arrow, ¿{ } es un objeto o el cuerpo de la función?"],
          p7: ["Math.max(...[4, 9, 2])", 9, "el spread separa el array: es como Math.max(4, 9, 2)", "¿qué hacen los ... delante de un array en una llamada?"],
          p8: ["[1, 2, 3].map(doble)", [2, 4, 6], "map llama a doble con cada elemento (se pasa la función, sin paréntesis)", "map devuelve un array del mismo tamaño"],
          p9: ['saludar("Ana") antes de declararla', "Hola Ana", "las funciones DECLARADAS se pueden usar antes (hoisting)", "¿pasa lo mismo con function que con const?"],
        }),
      },
      {
        id: "2.a",
        texto: "🪜 triple (función declarada)",
        fn: ({ f }) => {
          const r = casos(f.triple, "triple", [[[4], 12], [[0], 0], [[-2], -6]]);
          if (r !== true) return r;
          if (!codigo(f.triple).startsWith("function")) return "Funciona, pero tiene que ser DECLARADA: function triple(n) { }";
          return true;
        },
      },
      {
        id: "2.b",
        texto: "🪜 esPar (arrow de una línea)",
        fn: ({ f }) => {
          const r = casos(f.esPar, "esPar", [[[4], true], [[7], false], [[0], true], [[-3], false]]);
          if (r !== true) return r;
          const fuente = codigo(f.esPar);
          if (!fuente.includes("=>")) return "Funciona, pero tiene que ser una arrow function.";
          if (/=>\s*\{/.test(fuente)) return { aviso: "Funciona; prueba a escribirla en una línea, sin llaves ni return: (n) => ..." };
          return true;
        },
      },
      {
        id: "2.c",
        texto: "🪜 saludar (parámetro por defecto)",
        fn: ({ f }) => casos(f.saludar, "saludar", [[["Ana"], "Hola, Ana"], [[], "Hola, invitado"], [[undefined], "Hola, invitado"]]),
      },
      {
        id: "2.1",
        texto: "descuentoVolumen (función declarada)",
        fn: ({ f }) => {
          const r = casos(f.descuentoVolumen, "descuentoVolumen", [
            [[1], 0], [[2], 0.05], [[3], 0.05], [[4], 0.1], [[10], 0.1],
          ]);
          if (r !== true) return r;
          if (!codigo(f.descuentoVolumen).startsWith("function")) return "Funciona, pero tiene que ser una función DECLARADA: function descuentoVolumen(...) { }";
          return true;
        },
      },
      {
        id: "2.2",
        texto: "precioFinal (expresión de función, unidades = 1)",
        fn: ({ f }, ctx) => {
          const r = casos(f.precioFinal, "precioFinal", [
            [[45, "usado-como-nuevo", 3], 42.75],
            [[60, "nuevo-precintado", 4], 67.5],
            [[20, "solo-cartucho"], 14],
            [[100, "usado-caja-danada", 2], 80.75],
          ]);
          if (r !== true) return r;
          if (!/export\s+const\s+precioFinal\s*=\s*function/.test(ctx.leer("src/bloque2/funciones.js"))) {
            return "Funciona, pero tiene que ser una EXPRESIÓN de función: const precioFinal = function (...) { }";
          }
          return true;
        },
      },
      {
        id: "2.3",
        texto: "crearProducto (arrow que devuelve un objeto)",
        fn: ({ f }) => {
          const r = casos(f.crearProducto, "crearProducto", [
            [[1, "Tetris", 20, 5], { id: 1, titulo: "Tetris", precio: 20, stock: 5 }],
            [[2, "Sonic", 15], { id: 2, titulo: "Sonic", precio: 15, stock: 0 }],
          ]);
          if (r !== true) return r;
          if (!codigo(f.crearProducto).includes("=>")) return "Funciona, pero tiene que ser una arrow function.";
          return true;
        },
      },
      {
        id: "2.4",
        texto: "sumarImportes (parámetro rest)",
        fn: ({ f }) => {
          const r = casos(f.sumarImportes, "sumarImportes", [
            [[10, 20.5, 4], 34.5],
            [[7], 7],
            [[], 0],
            [[0.1, 0.2], 0.3],
          ]);
          if (r !== true) return r.includes("(0.1, 0.2)") ? `${r}  → redondea (redondear está importada)` : r;
          if (!/\(\s*\.\.\.\w+/.test(codigo(f.sumarImportes))) return "Funciona, pero usa un parámetro rest: (...importes)";
          return true;
        },
      },
      {
        id: "2.5",
        texto: "buscarCon (HOF, sin .find)",
        fn: ({ f }) => {
          const r = casos(f.buscarCon, "buscarCon", [
            [[[5, 8, 12], (n) => n > 6], 8],
            [[[1, 2], (n) => n > 5], null],
            [[[], (n) => n], null],
            [[[{ id: 1 }, { id: 2 }], (p) => p.id === 2], { id: 2 }],
            [[[0, 3], (n) => n === 0], 0],
          ]);
          if (r !== true) return r;
          if (/\.find\s*\(/.test(codigo(f.buscarCon))) return "Funciona, pero el ejercicio es hacerlo SIN .find() (como contarSi en el ejemplo).";
          return true;
        },
      },
    ],
  },

  // ═════════════════════════════ BLOQUE 3 ═════════════════════════════
  {
    id: "3",
    titulo: "Bloque 3 · Closures",
    modulos: { pred: "src/bloque3/predicciones.js", cl: "src/bloque3/closures.js" },
    pruebas: [
      {
        id: "3.P",
        texto: "Predicciones (7)",
        fn: predicciones({
          p1: ["m1.puntos()", 15, "10 + 5: las dos anotaciones van al mismo marcador", "suma lo que se anota en m1"],
          p2: ["m2.puntos()", 100, "cada crearMarcador() crea SUS PROPIAS variables: m1 y m2 no se mezclan", "¿m2 comparte los puntos de m1?"],
          p3: ["m1.jugadas().length", 2, "jugadas() devuelve una COPIA: el push de 999 fue en la copia", "¿copia es el array privado o otro?"],
          p4: ["m1.puntos === 15", false, "sin paréntesis es la FUNCIÓN, no su resultado: una función no es 15", "fíjate: no hay ()"],
          p5: ["typeof m1.total", "undefined", "el objeto no tiene ninguna propiedad total", "¿qué propiedades tiene el objeto que devuelve crearMarcador?"],
          p6: ["alCuadrado(5)", 25, "alCuadrado recuerda exponente = 2: 5 ** 2", "¿qué exponente se quedó guardado en alCuadrado?"],
          p7: ["elevar(3)(2)", 8, "elevar(3) devuelve una función con exponente 3; llamada con 2: 2 ** 3", "el primer paréntesis es el exponente, el segundo la base"],
        }),
      },
      {
        id: "3.a",
        texto: "🪜 crearMultiplicador devuelve una función",
        fn: ({ cl }) => {
          const triplicar = cl.crearMultiplicador(3);
          if (typeof triplicar !== "function") return `crearMultiplicador(3) tiene que devolver una FUNCIÓN y devuelve ${muestra(triplicar)}`;
          const r = casos(triplicar, "crearMultiplicador(3)", [[[4], 12], [[0], 0]]);
          if (r !== true) return r;
          return casos(cl.crearMultiplicador(10), "crearMultiplicador(10)", [[[5], 50]]);
        },
      },
      {
        id: "3.b",
        texto: "🪜 crearPasos: dos funciones y una variable privada",
        fn: ({ cl }) => {
          const ficha = cl.crearPasos(2);
          if (typeof ficha?.avanzar !== "function" || typeof ficha?.posicion !== "function") return "crearPasos(2) tiene que devolver un objeto con las funciones avanzar y posicion.";
          if (ficha.posicion() !== 0) return `Al empezar, posicion() debería dar 0 y da ${muestra(ficha.posicion())}`;
          const vistos = [ficha.avanzar(), ficha.avanzar()];
          if (!igual(vistos, [2, 4])) return `Dos avanzar() deberían dar 2 y 4 y dan ${vistos.map(muestra).join(" y ")}`;
          if (ficha.posicion() !== 4) return `posicion() debería dar 4 y da ${muestra(ficha.posicion())}`;
          const otra = cl.crearPasos();
          if (otra.avanzar() !== 1) return "crearPasos() sin nada avanza de 1 en 1 (parámetro por defecto).";
          if (ficha.posicion() !== 4) return "Dos fichas se mezclan: cada crearPasos() necesita su propia posición.";
          return true;
        },
      },
      {
        id: "3.1",
        texto: "crearDescuento devuelve una función",
        fn: ({ cl }) => {
          const rebajas = cl.crearDescuento(20);
          if (typeof rebajas !== "function") return `crearDescuento(20) tiene que devolver una FUNCIÓN y devuelve ${muestra(rebajas)}`;
          const r = casos(rebajas, "crearDescuento(20)", [[[50], 40], [[19.99], 15.99]]);
          if (r !== true) return r;
          return casos(cl.crearDescuento(0), "crearDescuento(0)", [[[10], 10]]);
        },
      },
      {
        id: "3.2",
        texto: "crearListaDeseos: anadir (rest), quitar, contiene, titulos (copia)",
        fn: ({ cl }) => {
          const deseos = cl.crearListaDeseos();
          for (const m of ["anadir", "quitar", "contiene", "titulos"]) {
            if (typeof deseos?.[m] !== "function") return `Falta la función ${m} en el objeto que devuelve crearListaDeseos()`;
          }
          const n = deseos.anadir("Tetris", "Zelda");
          if (n !== 2) return `deseos.anadir("Tetris", "Zelda") debería dar 2 y da ${muestra(n)}`;
          const m = deseos.anadir("Tetris", "", 7);
          if (m !== 0) return `deseos.anadir("Tetris", "", 7) debería dar 0 (repetido, vacío y no texto) y da ${muestra(m)}`;
          if (!igual(deseos.titulos(), ["Tetris", "Zelda"])) return `titulos() debería dar ["Tetris", "Zelda"] y da ${muestra(deseos.titulos())}`;
          if (deseos.contiene("Zelda") !== true) return 'contiene("Zelda") debería dar true';
          if (deseos.contiene("Sonic") !== false) return 'contiene("Sonic") debería dar false';
          if (deseos.quitar("Zelda") !== true) return 'quitar("Zelda") debería dar true (estaba)';
          if (deseos.quitar("Sonic") !== false) return 'quitar("Sonic") debería dar false (no estaba)';
          if (!igual(deseos.titulos(), ["Tetris"])) return `Tras quitar Zelda, titulos() debería dar ["Tetris"] y da ${muestra(deseos.titulos())}`;
          deseos.titulos().push("trampa");
          if (deseos.titulos().length !== 1) return "Si hago deseos.titulos().push(...), la lista cambia: titulos() tiene que devolver una COPIA.";
          const otra = cl.crearListaDeseos();
          otra.anadir("Sonic");
          if (deseos.contiene("Sonic") || otra.titulos().length !== 1) return "Dos listas distintas se mezclan: cada crearListaDeseos() necesita su propio array.";
          const noFunciones = Object.keys(deseos).filter((k) => typeof deseos[k] !== "function");
          if (noFunciones.length > 0) return `El objeto expone datos (${noFunciones.join(", ")}): solo funciones, los datos dentro del closure.`;
          return true;
        },
      },
      {
        id: "3.3",
        texto: "crearGeneradorId",
        fn: ({ cl }) => {
          const siguiente = cl.crearGeneradorId(13);
          if (typeof siguiente !== "function") return `crearGeneradorId(13) tiene que devolver una FUNCIÓN y devuelve ${muestra(siguiente)}`;
          const vistos = [siguiente(), siguiente(), siguiente()];
          if (!igual(vistos, [13, 14, 15])) return `Tres llamadas deberían dar 13, 14, 15 y dan ${vistos.join(", ")}`;
          const otro = cl.crearGeneradorId();
          if (otro() !== 1) return "crearGeneradorId() sin nada tiene que empezar en 1 (parámetro por defecto).";
          if (siguiente() !== 16) return "Dos generadores se mezclan.";
          return true;
        },
      },
    ],
  },

  // ═════════════════════════════ BLOQUE 4 ═════════════════════════════
  {
    id: "4",
    titulo: "Bloque 4 · Control de flujo",
    modulos: { pred: "src/bloque4/predicciones.js", cf: "src/bloque4/control.js" },
    pruebas: [
      {
        id: "4.P",
        texto: "Predicciones (7)",
        fn: predicciones({
          p1: ["r (switch sin break)", "bc", "entra en case 2 y, sin break, sigue con el case 3 hasta su break", "¿qué pasa después de un case que no tiene break?"],
          p2: ["n", 3, "el while repite mientras n < 3: sale cuando n vale 3", "cuenta las vueltas"],
          p3: ["suma", 10, "1 + 2 + 3 + 4 (el <= incluye el 4)", "¿el 4 entra (<=)?"],
          p4: ["claves (for...in)", ["0", "1"], "for...in recorre las CLAVES: en un array, los índices como texto", "¿for...in da los valores o las claves?"],
          p5: ['stock && "hay unidades"', 0, "&& devuelve el primer valor falsy que encuentra (o el último): el 0", "si el de la izquierda es falsy, ¿&& mira el de la derecha?"],
          p6: ['stock > 0 ? "hay" : "agotado"', "agotado", "0 > 0 es false: el ternario devuelve lo de detrás de los dos puntos", "calcula primero 0 > 0"],
          p7: ["veces (do...while)", 1, "do...while ejecuta el cuerpo UNA vez antes de mirar la condición", "¿cuándo se comprueba la condición en un do...while?"],
        }),
      },
      {
        id: "4.a",
        texto: "🪜 signo (if / else if / else)",
        fn: ({ cf }) => casos(cf.signo, "signo", [[[5], "positivo"], [[-3], "negativo"], [[0], "cero"], [[0.5], "positivo"]]),
      },
      {
        id: "4.b",
        texto: "🪜 sumarHasta (for + acumulador)",
        fn: ({ cf }) => {
          const r = casos(cf.sumarHasta, "sumarHasta", [[[4], 10], [[1], 1], [[0], 0], [[100], 5050]]);
          if (r !== true) return r;
          if (!/\bfor\s*\(/.test(codigo(cf.sumarHasta))) return "Funciona, pero hazlo con un bucle for.";
          return true;
        },
      },
      {
        id: "4.c",
        texto: "🪜 contarVocales (for...of sobre un texto)",
        fn: ({ cf }) => {
          const r = casos(cf.contarVocales, "contarVocales", [[["Tetris"], 2], [["AEIOU"], 5], [[""], 0], [["xyz"], 0], [["Crash Bandicoot"], 5]]);
          if (r !== true) return r;
          if (!/for\s*\(\s*const\s+\w+\s+of\b/.test(codigo(cf.contarVocales))) return { aviso: "Funciona; practica con for (const letra of texto)." };
          return true;
        },
      },
      {
        id: "4.1",
        texto: "clasificarStock",
        fn: ({ cf }) =>
          casos(cf.clasificarStock, "clasificarStock", [
            [[0], "agotado"], [[2], "stock bajo"], [[1], "stock bajo"], [[3], "disponible"], [[50], "disponible"],
            [[-1], "error"], [["5"], "error"], [[undefined], "error"],
          ]),
      },
      {
        id: "4.2",
        texto: "nombreEstado (switch)",
        fn: ({ cf }) => {
          const r = casos(cf.nombreEstado, "nombreEstado", [
            [["nuevo-precintado"], "Nuevo (precintado)"],
            [["usado-como-nuevo"], "Usado (como nuevo)"],
            [["usado-caja-danada"], "Usado (caja dañada)"],
            [["solo-cartucho"], "Solo cartucho"],
            [["roto"], "Estado desconocido"],
            [[undefined], "Estado desconocido"],
          ]);
          if (r !== true) return r;
          if (!/switch\s*\(/.test(codigo(cf.nombreEstado))) return "Funciona, pero tiene que ser con switch.";
          return true;
        },
      },
      {
        id: "4.3",
        texto: "simularMenu (bucle + switch)",
        fn: ({ cf }) => {
          const r = casos(cf.simularMenu, "simularMenu", [
            [[["1", "9", "3", "6", "2"]], ["Ver catálogo", "Opción no válida: 9", "Registrar venta", "¡Hasta pronto!"]],
            [[["2"]], ["Buscar producto", "Fin sin salir"]],
            [[["6"]], ["¡Hasta pronto!"]],
            [[[]], ["Fin sin salir"]],
          ]);
          if (r !== true) return r;
          const fuente = codigo(cf.simularMenu);
          if (!/switch\s*\(/.test(fuente) || !/\b(while|for)\s*\(/.test(fuente)) return "Funciona, pero usa un bucle y un switch (como el semáforo).";
          return true;
        },
      },
      {
        id: "4.4",
        texto: "tablaDescuentos (for + funciones importadas)",
        fn: ({ cf }) =>
          casos(cf.tablaDescuentos, "tablaDescuentos", [
            [[4], ["1 ud. → 0 %", "2 uds. → 5 %", "3 uds. → 5 %", "4 uds. → 10 %"]],
            [[1], ["1 ud. → 0 %"]],
            [[0], []],
          ]),
      },
    ],
  },

  // ═════════════════════════════ BLOQUE 5 ═════════════════════════════
  {
    id: "5",
    titulo: "Bloque 5 · Arrays e inmutabilidad",
    modulos: { pred: "src/bloque5/predicciones.js", a: "src/bloque5/arrays.js", d: "src/bloque5/datos.js" },
    pruebas: [
      {
        id: "5.P",
        texto: "Predicciones (10)",
        fn: predicciones({
          p1: ["[2, 100, 30].sort()", [100, 2, 30], "sin comparador, sort ordena como TEXTO: \"100\" < \"2\" < \"30\"", "¿sort compara números o textos si no le pasas función?"],
          p2: ["numeros.filter((n) => n > 6)", [8, 12], "filter se queda con los que cumplen la condición", "¿cuáles son mayores que 6?"],
          p3: ['numeros.find((n) => n > 20) ?? "ninguno"', "ninguno", "ninguno es > 20: find da undefined y ?? lo sustituye", "¿qué devuelve find si no encuentra nada?"],
          p4: ["numeros.reduce((acc, n) => acc + n, 0)", 25, "acc empieza en 0 y va sumando: 5 + 8 + 12", "sigue acc vuelta a vuelta"],
          p5: ["numeros.some((n) => n > 10)", true, "some: ¿ALGUNO cumple? El 12 sí", "basta con uno"],
          p6: ["numeros.every((n) => n > 6)", false, "every: ¿TODOS cumplen? El 5 no", "tienen que cumplir todos"],
          p7: ["original[0]", "z", "otra = original NO copia: son el mismo array con dos nombres", "¿cuántos arrays hay de verdad?"],
          p8: ["c.length", 2, "[...c] crea un array NUEVO: el pop fue en la copia", "¿d es el mismo array que c?"],
          p9: ["stock", 0, "el objeto no tiene stock, así que el destructuring usa el valor por defecto", "¿qué pasa con = 0 si la propiedad no existe?"],
          p10: ["numeros.map((n) => n * 2).filter((n) => n > 12)", [16, 24], "primero map → [10, 16, 24], luego filter se queda con los > 12", "hazlo en dos pasos: primero el map"],
        }),
      },
      {
        id: "5.a",
        texto: "🪜 dobles (map)",
        fn: ({ a }) => {
          const r = casos(a.dobles, "dobles", [[[Object.freeze([1, 5, 10])], [2, 10, 20]], [[Object.freeze([])], []]]);
          if (r !== true) return r;
          if (!/\.map\s*\(/.test(codigo(a.dobles))) return "Funciona, pero usa map().";
          return true;
        },
      },
      {
        id: "5.b",
        texto: "🪜 mayoresQue (filter)",
        fn: ({ a }) => {
          const r = casos(a.mayoresQue, "mayoresQue", [[[Object.freeze([3, 8, 1, 12]), 5], [8, 12]], [[Object.freeze([1, 2]), 5], []], [[Object.freeze([5, 6]), 5], [6]]]);
          if (r !== true) return r;
          if (!/\.filter\s*\(/.test(codigo(a.mayoresQue))) return "Funciona, pero usa filter().";
          return true;
        },
      },
      {
        id: "5.c",
        texto: "🪜 sumaTotal (reduce con valor inicial)",
        fn: ({ a }) => {
          const r = casos(a.sumaTotal, "sumaTotal", [[[Object.freeze([3, 8, 1])], 12], [[Object.freeze([7])], 7], [[Object.freeze([])], 0]]);
          if (r !== true) return r;
          if (!/\.reduce\s*\(/.test(codigo(a.sumaTotal))) return "Funciona, pero usa reduce().";
          return true;
        },
      },
      {
        id: "5.d",
        texto: "🪜 anadirAlFinal (spread, sin push)",
        fn: ({ a }) => {
          const lista = Object.freeze(["a", "b"]);
          const r = casos(a.anadirAlFinal, "anadirAlFinal", [[[lista, "c"], ["a", "b", "c"]], [[Object.freeze([]), 1], [1]]]);
          if (r !== true) return r;
          if (a.anadirAlFinal(lista, "c") === lista) return "Devuelves la misma lista: tiene que ser una nueva.";
          return true;
        },
      },
      {
        id: "5.1",
        texto: "buscarPorId (find, null si no está)",
        fn: ({ a, d }) => {
          const p = a.buscarPorId(d.CATALOGO, 4);
          if (p?.titulo !== "Crash Bandicoot") return `buscarPorId(CATALOGO, 4) debería dar Crash Bandicoot y da ${muestra(p)}`;
          const no = a.buscarPorId(d.CATALOGO, 99);
          if (no !== null) return `buscarPorId(CATALOGO, 99) debería dar null y da ${muestra(no)}`;
          if (!/\.find\s*\(/.test(codigo(a.buscarPorId))) return "Funciona, pero usa find().";
          return true;
        },
      },
      {
        id: "5.2",
        texto: "buscarPorTitulo (filter, sin mayúsculas)",
        fn: ({ a, d }) => {
          const r = a.buscarPorTitulo(d.CATALOGO, "mario").map((p) => p.titulo);
          if (!igual(r, ["Super Mario 64", "Dr. Mario"])) return `buscarPorTitulo(CATALOGO, "mario") debería dar Super Mario 64 y Dr. Mario y da ${muestra(r)}`;
          const r2 = a.buscarPorTitulo(d.CATALOGO, "ZELDA").map((p) => p.titulo);
          if (r2.length !== 1) return `buscarPorTitulo(CATALOGO, "ZELDA") debería encontrar 1 y encuentra ${r2.length}`;
          if (!igual(a.buscarPorTitulo(d.CATALOGO, "xyz"), [])) return `buscarPorTitulo(CATALOGO, "xyz") debería dar []`;
          return true;
        },
      },
      {
        id: "5.3",
        texto: "valorStock (reduce)",
        fn: ({ a, d }) => {
          const r = casos(a.valorStock, "valorStock", [
            [[d.CATALOGO], 750],
            [[[]], 0],
            [[[{ precio: 0.1, stock: 3 }]], 0.3],
          ]);
          if (r !== true) return r.includes("[]") ? `${r}  → ¿le has puesto valor inicial al reduce?` : r;
          if (!/\.reduce\s*\(/.test(codigo(a.valorStock))) return "Funciona, pero tiene que ser con reduce (no con un for y un acumulador).";
          return true;
        },
      },
      {
        id: "5.4",
        texto: "ordenarPorPrecio (sin mutar)",
        fn: ({ a, d }) => {
          const r = a.ordenarPorPrecio(d.CATALOGO);
          if (r === d.CATALOGO) return "Devuelves el mismo array: tiene que ser uno nuevo.";
          const precios = r.map((p) => p.precio);
          if (!igual(precios, [10, 15, 20, 25, 30, 35, 40, 60])) return `Los precios salen así: ${muestra(precios)}`;
          return true;
        },
      },
      {
        id: "5.5",
        texto: "hayStockBajo (some)",
        fn: ({ a, d }) =>
          casos(a.hayStockBajo, "hayStockBajo", [
            [[d.CATALOGO], true],
            [[[{ stock: 5 }, { stock: 3 }]], false],
            [[[{ stock: 5 }, { stock: 0 }]], true],
            [[[]], false],
          ]),
      },
      {
        id: "5.6",
        texto: "lineasCatalogo (filter + map + destructuring)",
        fn: ({ a, d }) => {
          const r = a.lineasCatalogo(d.CATALOGO);
          if (!Array.isArray(r)) return `Tiene que devolver un array y devuelve ${muestra(r)}`;
          if (r.length !== 7) return `Deberían salir 7 líneas (Sonic 2 no, tiene 0) y salen ${r.length}`;
          if (r[0] !== "Tetris · GAME BOY · 5 uds.") return `La primera debería ser "Tetris · GAME BOY · 5 uds." y es ${muestra(r[0])}`;
          if (r[1] !== "Zelda: A Link to the Past · SNES · 2 uds. ⚠️ Stock bajo") return `La segunda debería ser "Zelda: A Link to the Past · SNES · 2 uds. ⚠️ Stock bajo" y es ${muestra(r[1])}`;
          if (r[3] !== "Street Fighter II · SNES · 1 ud. ⚠️ Stock bajo") return `La de Street Fighter II debería ser "Street Fighter II · SNES · 1 ud. ⚠️ Stock bajo" y es ${muestra(r[3])}`;
          if (!/\(\s*\{/.test(codigo(a.lineasCatalogo))) return { aviso: "Funciona; prueba a hacerlo con destructuring en el parámetro: ({ titulo, plataforma, stock }) =>" };
          return true;
        },
      },
      {
        id: "5.7",
        texto: "vender (map + spread, sin mutar)",
        fn: ({ a, d }) => {
          const nuevo = a.vender(d.CATALOGO, 1, 2);
          if (nuevo === d.CATALOGO) return "vender(CATALOGO, 1, 2) devuelve el mismo array: tiene que ser uno nuevo.";
          if (nuevo.find((p) => p.id === 1)?.stock !== 3) return `Tras vender 2 Tetris, su stock debería ser 3 y es ${muestra(nuevo.find((p) => p.id === 1)?.stock)}`;
          if (nuevo.length !== 8) return `El catálogo nuevo debería seguir teniendo 8 productos y tiene ${nuevo.length}`;
          if (d.CATALOGO[0].stock !== 5) return "El original ha cambiado.";
          if (nuevo[1] !== d.CATALOGO[1]) return { aviso: "Funciona; los productos que no cambian no hace falta copiarlos." };
          if (a.vender(d.CATALOGO, 2, 1).find((p) => p.id === 2)?.stock !== 1) return "vender(CATALOGO, 2, 1) debería dejar a Zelda con stock 1.";
          if (a.vender(d.CATALOGO, 6)?.find((p) => p.id === 6)?.stock !== 3) return "Sin unidades, se vende 1 (parámetro por defecto).";
          if (a.vender(d.CATALOGO, 3) !== d.CATALOGO) return "vender(CATALOGO, 3): Sonic 2 tiene 0, tiene que devolver el MISMO catálogo.";
          if (a.vender(d.CATALOGO, 2, 5) !== d.CATALOGO) return "vender(CATALOGO, 2, 5): Zelda solo tiene 2, tiene que devolver el MISMO catálogo.";
          if (a.vender(d.CATALOGO, 99, 1) !== d.CATALOGO) return "vender(CATALOGO, 99, 1): no existe, tiene que devolver el MISMO catálogo.";
          return true;
        },
      },
      {
        id: "5.8",
        texto: "resumenVentas (reduce + destructuring)",
        fn: ({ a }) =>
          casos(a.resumenVentas, "resumenVentas", [
            [[[
              { titulo: "Tetris", unidades: 2, total: 40 },
              { titulo: "Crash Bandicoot", unidades: 4, total: 85 },
              { titulo: "Dr. Mario", unidades: 1, total: 7 },
            ]], { totalFacturado: 132, masVendido: "Crash Bandicoot" }],
            [[[{ titulo: "Tetris", unidades: 1, total: 0.1 }, { titulo: "Sonic", unidades: 1, total: 0.2 }]], { totalFacturado: 0.3, masVendido: "Tetris" }],
            [[[]], { totalFacturado: 0, masVendido: null }],
          ]),
      },
    ],
  },

  // ═════════════════════════════ BLOQUE 6 ═════════════════════════════
  {
    id: "6",
    titulo: "Bloque 6 · Integrador: una venta completa",
    modulos: { t: "src/bloque6/tienda.js" },
    pruebas: [
      {
        id: "6.1",
        texto: "registrarVenta: casos 1 y 2 de la práctica 1",
        fn: ({ t }) => {
          const cat = congelar([
            PRODUCTO(13, "Chrono Trigger", 45, "usado-como-nuevo", 4),
            PRODUCTO(14, "Streets of Rage 2", 60, "nuevo-precintado", 10),
          ]);
          const r1 = t.registrarVenta(cat, 13, 3);
          if (!igual(r1?.venta, { titulo: "Chrono Trigger", unidades: 3, precioUnitario: 42.75, total: 128.25 })) {
            return `Caso 1: venta debería ser { titulo: 'Chrono Trigger', unidades: 3, precioUnitario: 42.75, total: 128.25 } y es ${muestra(r1?.venta)}`;
          }
          if (r1.catalogo.find((p) => p.id === 13)?.stock !== 1) return "Caso 1: en el catálogo devuelto, Chrono Trigger debería quedar con stock 1.";
          const r2 = t.registrarVenta(r1.catalogo, 14, 4);
          if (!igual(r2?.venta, { titulo: "Streets of Rage 2", unidades: 4, precioUnitario: 67.5, total: 270 })) {
            return `Caso 2: venta debería ser { titulo: 'Streets of Rage 2', unidades: 4, precioUnitario: 67.5, total: 270 } y es ${muestra(r2?.venta)}`;
          }
          if (r2.catalogo.find((p) => p.id === 14)?.stock !== 6) return "Caso 2: Streets of Rage 2 debería quedar con stock 6.";
          if (r2.catalogo.find((p) => p.id === 13)?.stock !== 1) return "Tras el caso 2, Chrono Trigger debería seguir con stock 1 (encadena los catálogos).";
          return true;
        },
      },
      {
        id: "6.2",
        texto: "registrarVenta: errores y sin mutar",
        fn: ({ t }) => {
          const cat = congelar([PRODUCTO(1, "Tetris", 20, "usado-como-nuevo", 2)]);
          const pruebas = [
            [[cat, 1, 0], "Cantidad no válida"],
            [[cat, 1, -2], "Cantidad no válida"],
            [[cat, 1, 1.5], "Cantidad no válida"],
            [[cat, 1, "2"], "Cantidad no válida"],
            [[cat, 99, 1], "No existe el producto 99"],
            [[cat, 1, 3], "Stock insuficiente: quedan 2"],
          ];
          for (const [args, error] of pruebas) {
            const r = t.registrarVenta(...args);
            const desc = `registrarVenta(catalogo, ${args.slice(1).map(muestra).join(", ")})`;
            if (r?.error !== error) return `${desc} → error debería ser ${muestra(error)} y es ${muestra(r?.error)}`;
            if (r.catalogo !== cat) return `${desc}: si hay error, devuelve el MISMO catálogo.`;
            if ("venta" in r) return `${desc}: si hay error, no tiene que haber venta.`;
          }
          return true;
        },
      },
      {
        id: "6.3",
        texto: "ticket (destructuring)",
        fn: ({ t }) =>
          casos(t.ticket, "ticket", [
            [[{ titulo: "Chrono Trigger", unidades: 3, precioUnitario: 42.75, total: 128.25 }], "Chrono Trigger · 3 uds. × 42,75 € = 128,25 €"],
            [[{ titulo: "Tetris", unidades: 1, precioUnitario: 20, total: 20 }], "Tetris · 1 ud. × 20,00 € = 20,00 €"],
          ]),
      },
    ],
  },

  // ═════════════════════════════ FINAL ═════════════════════════════
  {
    id: "final",
    titulo: "Final · Para entregar",
    modulos: {},
    pruebas: [
      {
        id: "F.1",
        texto: "respuestas.md: las 5 preguntas contestadas",
        fn: (_, ctx) => {
          const md = ctx.leer("respuestas.md");
          if (md === null) return "No encuentro respuestas.md";
          const secciones = md.split(/^## /m).slice(1);
          const vacias = secciones.filter((s) => s.includes("____")).map((s) => s.split("·")[0].trim());
          if (vacias.length === secciones.length) return "pendiente";
          if (vacias.length > 0) return `Te faltan: ${vacias.join(", ")}`;
          const cortas = secciones.filter((s) => s.split("\n").slice(1).join(" ").trim().length < 80).map((s) => s.split("·")[0].trim());
          if (cortas.length > 0) return `Demasiado cortas (explícalo con más detalle y un ejemplo): ${cortas.join(", ")}`;
          return true;
        },
      },
      {
        id: "F.2",
        texto: "ESLint sin errores en todo src/",
        fn: (_, ctx) => {
          const lint = eslint(ctx, ["src"]);
          if (lint === null) return { aviso: "Sin ESLint en este equipo (¿sin Docker?): no puedo pasarlo." };
          if (lint.errores.length > 0) {
            const primeros = lint.errores.slice(0, 4).join(" · ");
            return `${lint.errores.length} errores: ${primeros}${lint.errores.length > 4 ? " …" : ""}  → ./refuerzo.sh lint`;
          }
          return true;
        },
      },
      {
        id: "F.3",
        texto: "Al menos 8 commits (uno al terminar cada bloque)",
        fn: (_, ctx) => {
          const n = git(ctx, "rev-list", "--count", "HEAD");
          if (n === null) return { aviso: "No encuentro git en este equipo: no puedo comprobarlo." };
          if (n === "") return "pendiente";
          if (Number(n) < 8) return `Llevas ${n}. Haz un commit al terminar cada bloque: git add . && git commit -m "Bloque N: ..."`;
          return true;
        },
      },
      {
        id: "F.4",
        texto: "Sin console.log en src/",
        fn: (_, ctx) => {
          const ficheros = readdirSync(`${ctx.raiz}/src`, { recursive: true }).filter((f) => f.endsWith(".js"));
          const conLog = ficheros.filter((f) =>
            readFileSync(`${ctx.raiz}/src/${f}`, "utf8")
              .split("\n")
              .some((l) => /console\.log\s*\(/.test(l.replace(/\/\/.*$/, ""))),
          );
          if (conLog.length > 0) return `Hay console.log en: ${conLog.map((f) => `src/${f}`).join(", ")}`;
          return true;
        },
      },
    ],
  },
];
