// app.js — La página de la batería. No hace falta tocarla: lo tuyo está en src/.
// Carga TUS ficheros del bloque, deja sus funciones y clases en la consola y ejecuta los ejemplos.
// Cada vez que guardas un fichero de src/, Vite recarga la página sola.
import { BLOQUES, cargarBloque, cargarPredicciones } from "./ejemplos.js";

const n = Number(new URLSearchParams(location.search).get("bloque")) || 1;
const bloque = BLOQUES.find((b) => b.n === n) ?? BLOQUES[0];
const app = document.querySelector("#app");

// ── Mostrar un valor como lo enseñaría la consola (en corto) ──
function mostrar(v, prof = 0) {
  if (v === undefined) return "undefined";
  if (v === null) return "null";
  if (typeof v === "string") return JSON.stringify(v);
  if (typeof v === "function") return /^class\b/.test(Function.prototype.toString.call(v)) ? `class ${v.name}` : `ƒ ${v.name || "(anónima)"}()`;
  if (typeof v !== "object") return String(v);
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? "Invalid Date" : `Date(${v.toLocaleString("es-ES")})`;
  if (v instanceof Error) return `${v.name}: ${v.message}`;
  if (prof > 3) return "…";
  if (v instanceof Map) return `Map(${v.size}) {${[...v].map(([k, x]) => ` ${mostrar(k, prof + 1)} => ${mostrar(x, prof + 1)}`).join(",")} }`;
  if (Array.isArray(v)) return `[${v.map((x) => mostrar(x, prof + 1)).join(", ")}]`;
  const clase = v.constructor && v.constructor !== Object ? `${v.constructor.name} ` : "";
  const props = Object.entries(v).map(([k, x]) => `${k}: ${mostrar(x, prof + 1)}`);
  return props.length ? `${clase}{ ${props.join(", ")} }` : `${clase}{}`;
}

// ── Ejecutar código como la consola: da el valor de la última sentencia ──
// Las funciones y clases del bloque están en window, así que el código las ve por su nombre.
const ejecutarEnGlobal = (codigo) => (0, eval)(codigo); // eval indirecto: cada ejecución con sus propias const

function ejecutar(codigo) {
  try {
    return { ok: true, valor: ejecutarEnGlobal(codigo) };
  } catch (error) {
    return { ok: false, error };
  }
}

// ── Pintar ──
const el = (etiqueta, props = {}, ...hijos) => {
  const nodo = Object.assign(document.createElement(etiqueta), props);
  nodo.append(...hijos);
  return nodo;
};

// Un TypeError «x is not a function» casi siempre es que ese método o esa función aún no está escrito
const faltaAlgo = (error) => error instanceof TypeError && / is not a (function|constructor)$/.test(error.message);
// Los errores del programa (no los que lanzas tú a propósito con throw new Error / PrestamoError…)
const errorDePrograma = (error) => [TypeError, ReferenceError, SyntaxError, RangeError].some((C) => error?.constructor === C);

function textoError(error, codigo) {
  if (error?.message === "Sin hacer") return ["pendiente", "⏳ Sin hacer todavía"];
  if (faltaAlgo(error)) {
    console.info(`⏳ ${error.message} (al ejecutar: ${codigo.split("\n").at(-1)})`);
    return ["pendiente", `⏳ Todavía no existe: ${error.message.replace(/ is not a (function|constructor)$/, "")}. ¿Lo has escrito?`];
  }
  // A la consola, con su pila: pinchando en el enlace (src/bloqueN/…:línea) vas directo a la línea que falla
  console.groupCollapsed(`💥 ${error?.name}: ${error?.message} · al ejecutar: ${codigo.split("\n").at(-1)}`);
  console.error(error);
  console.groupEnd();
  return ["mal", `💥 ${error?.name ?? "Error"}: ${error?.message ?? error}   (más detalle en la consola, F12)`];
}

function filaEjemplo({ codigo, espera, tipo = "✍️" }) {
  const r = ejecutar(codigo);
  let clase;
  let texto;
  if (espera === "💥") {
    if (r.ok) [clase, texto] = ["mal", `No lanza ningún error, y debería. Da: ${mostrar(r.valor)}`];
    else if (r.error?.message === "Sin hacer" || errorDePrograma(r.error)) [clase, texto] = textoError(r.error, codigo);
    else [clase, texto] = ["bien", `💥 lanza ${r.error?.name}: ${r.error?.message}  ✔`];
  } else if (r.ok) {
    const sale = mostrar(r.valor);
    [clase, texto] = sale === espera ? ["bien", `${sale}  ✔`] : ["mal", `${sale}   ✘ se esperaba ${espera}`];
  } else {
    [clase, texto] = textoError(r.error, codigo);
  }
  return el(
    "li",
    { className: `ejemplo ${clase}` },
    el("span", { className: "tipo", textContent: tipo }),
    el("pre", { className: "codigo", textContent: codigo }),
    el("div", { className: "resultado", textContent: `→ ${texto}` }),
  );
}

function seccionPredicciones(predicciones) {
  if (predicciones.length === 0) return "";
  const filas = predicciones.map(({ clave, expresion, tuya }) => {
    const salida = el("td", { className: "real" });
    const boton = el("button", { type: "button", textContent: "Probar" });
    boton.addEventListener("click", () => {
      const r = ejecutar(expresion);
      salida.textContent = r.ok ? mostrar(r.valor) : `💥 ${r.error.name}: ${r.error.message}`;
    });
    return el(
      "tr",
      {},
      el("td", { textContent: clave }),
      el("td", {}, el("code", { textContent: expresion })),
      el("td", { textContent: tuya === undefined ? "(sin contestar)" : mostrar(tuya) }),
      el("td", {}, boton),
      salida,
    );
  });
  return el(
    "section",
    {},
    el("h2", { textContent: "🔮 Predicciones" }),
    el("p", { textContent: "Contesta primero en predicciones.js. Después pulsa «Probar» o pégala en la consola (F12) para ver lo que da de verdad. El PORQUÉ te lo da docker compose run --rm web npm run comprobar." }),
    el(
      "table",
      {},
      el("thead", {}, el("tr", {}, ...["", "Expresión", "Tu respuesta", "", "Lo que da"].map((t) => el("th", { textContent: t })))),
      el("tbody", {}, ...filas),
    ),
  );
}

function seccionProbar() {
  const area = el("textarea", { rows: 4, spellcheck: false, value: bloque.ejemplos.at(-1).codigo });
  const salida = el("pre", { className: "salida" });
  const boton = el("button", { type: "button", textContent: "▶ Ejecutar" });
  boton.addEventListener("click", () => {
    const r = ejecutar(area.value);
    salida.className = `salida ${r.ok ? "bien" : "mal"}`;
    salida.textContent = r.ok ? `→ ${mostrar(r.valor)}` : textoError(r.error, area.value)[1];
  });
  return el(
    "section",
    {},
    el("h2", { textContent: "🧪 Prueba tu código" }),
    el("p", { textContent: "Como en la consola: se enseña lo que da la última línea. Puedes usar todo lo del bloque." }),
    area,
    boton,
    salida,
  );
}

function seccionDepurar(nombres) {
  return el(
    "section",
    { className: "depurar" },
    el("h2", { textContent: "🐞 Depurar en el navegador" }),
    el(
      "ol",
      {},
      el("li", { textContent: "F12 → Consola: están tus funciones y clases con su nombre. Prueba, por ejemplo: " }, el("code", { textContent: nombres.join(", ") })),
      el("li", { textContent: "Si un ejemplo sale 💥, en la consola está el error: pincha en el enlace azul (src/bloque…:línea) y te lleva a la línea que falla." }),
      el("li", { textContent: "Para ver tu código paso a paso: F12 → Sources (Fuentes) → src/bloque… → pincha en el número de línea (punto de parada) y recarga. O escribe debugger; dentro de tu función." }),
      el("li", { textContent: "Con el código parado: pasa el ratón por encima de las variables, mira this y avanza línea a línea con F10 (siguiente) y F11 (entrar en la función)." }),
    ),
    el("p", { className: "nota", textContent: "Los campos #privados no salen en los resultados de esta página, pero en la consola de Chrome sí los ves al desplegar el objeto." }),
  );
}

// ── Arrancar ──
document.querySelector("#bloques").append(
  ...BLOQUES.map((b) => el("a", { href: `?bloque=${b.n}`, className: b.n === bloque.n ? "activo" : "", textContent: `${b.n} · ${b.titulo}` })),
);

let exportado;
try {
  exportado = await cargarBloque(bloque);
} catch (error) {
  console.error(error);
  app.append(
    el("section", { className: "mal" }, el("h2", { textContent: "💥 Tu código no se puede cargar" }), el("pre", { textContent: `${error.name}: ${error.message}` }), el("p", { textContent: "Suele ser un error de sintaxis (una llave o un paréntesis de más o de menos). Vite también lo enseña en la terminal. Arréglalo y guarda: la página se recarga sola." })),
  );
}

if (exportado) {
  delete exportado.predicciones;
  Object.assign(window, exportado);
  const nombres = Object.keys(exportado);
  console.info(`Bloque ${bloque.n}: tienes en la consola ${nombres.join(", ")}`);
  const predicciones = await cargarPredicciones(bloque.n);
  app.append(
    el("h2", { className: "titulo-bloque", textContent: `Bloque ${bloque.n} · ${bloque.titulo}` }),
    el(
      "section",
      {},
      el("h2", { textContent: "▶ Tus funciones, en marcha" }),
      el("p", { textContent: "La página ejecuta estos ejemplos con TU código cada vez que guardas. 👀 = ejemplo resuelto. docker compose run --rm web npm run comprobar prueba muchos casos más." }),
      el("ul", { className: "ejemplos" }, ...bloque.ejemplos.map(filaEjemplo)),
    ),
    seccionPredicciones(predicciones),
    seccionProbar(),
    seccionDepurar(nombres),
  );
}
