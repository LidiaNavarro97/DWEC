// pagina.js — Pinta el panel de depuración. NO tienes que tocar este fichero:
// los bugs están en caja.js. (El DOM lo veremos en la UD5; aquí solo lo usamos.)
import {
  PRODUCTOS,
  totalTicket,
  sumarUnidades,
  stockTexto,
  ordenarPorPrecio,
  precioConDescuento,
} from "./caja.js";

const TICKET = [
  { titulo: "Tetris", precio: 20, unidades: 1 },
  { titulo: "Zelda: A Link to the Past", precio: 35, unidades: 2 },
  { titulo: "Sonic 2", precio: 15, unidades: 1 },
];

let unidadesZelda = 2;

const euros = (n) => `${n.toFixed(2).replace(".", ",")} €`;

const CASOS = [
  {
    id: "E",
    titulo: "👀 Ejemplo resuelto · Total del ticket",
    esperado: "Tetris 20 € × 1 + Zelda 35 € × 2 + Sonic 15 € × 1 = 105,00 €",
    boton: "Calcular el total",
    accion: () => `Total: ${euros(totalTicket(TICKET))}`,
  },
  {
    id: "1",
    titulo: "Bug 1 · Añadir unidades",
    esperado: "Hay 2 Zelda. Si escribes 3, debe haber 5. Si escribes «hola» o cancelas, siguen 2.",
    boton: "Añadir unidades de Zelda",
    accion: () => {
      const texto = prompt("¿Cuántas unidades de Zelda añades?", "3");
      unidadesZelda = sumarUnidades(unidadesZelda, texto);
      return `Zelda: ${unidadesZelda} unidades`;
    },
    extra: { boton: "Volver a 2", accion: () => ((unidadesZelda = 2), "Zelda: 2 unidades") },
  },
  {
    id: "2",
    titulo: "Bug 2 · Stock de cada producto",
    esperado: "Sonic 2 tiene stock 0 (debe salir 0). Pokémon Rojo no tiene el dato (debe salir «sin datos»).",
    boton: "Ver el stock",
    accion: () => PRODUCTOS.map((p) => `${p.titulo}: ${stockTexto(p)}`).join("\n"),
  },
  {
    id: "3",
    titulo: "Bug 3 · Ordenar por precio",
    esperado:
      "Ordenar muestra la lista de más barato a más caro, pero el catálogo original debe seguir en su orden: Tetris, Zelda, Sonic, Crash, Pokémon.",
    boton: "Ordenar por precio",
    accion: () => ordenarPorPrecio(PRODUCTOS).map((p) => `${p.precio} € · ${p.titulo}`).join("\n"),
    extra: {
      boton: "Ver el catálogo original",
      accion: () => PRODUCTOS.map((p) => `${p.id} · ${p.titulo}`).join("\n"),
    },
  },
  {
    id: "4",
    titulo: "Bug 4 · Descuento por volumen",
    esperado: "Crash cuesta 25 €. Con 4 unidades lleva un 10 %: 22,50 € la unidad. Con 3, un 5 %: 23,75 €.",
    boton: "Precio de 4 Crash",
    accion: () => `4 unidades → ${euros(precioConDescuento(25, 4))} cada una`,
    extra: { boton: "Precio de 3 Crash", accion: () => `3 unidades → ${euros(precioConDescuento(25, 3))} cada una` },
  },
];

function crearBoton(texto, salida, accion) {
  const boton = document.createElement("button");
  boton.textContent = texto;
  boton.addEventListener("click", () => {
    try {
      salida.textContent = accion();
      salida.classList.remove("error");
    } catch (error) {
      salida.textContent = `💥 ${error.name}: ${error.message}`;
      salida.classList.add("error");
    }
  });
  return boton;
}

export function montarPanelDepuracion(contenedor) {
  const titulo = document.createElement("h2");
  titulo.textContent = "🐞 Bloque D · Depuración en el navegador";
  const ayuda = document.createElement("p");
  ayuda.textContent =
    "Pulsa cada botón y compara con lo que DEBERÍA salir. Luego abre F12 → Fuentes, Ctrl+P → caja.js, pon un breakpoint y vuelve a pulsar.";
  contenedor.append(titulo, ayuda);

  for (const caso of CASOS) {
    const tarjeta = document.createElement("section");
    tarjeta.className = "caso";
    const h3 = document.createElement("h3");
    h3.textContent = caso.titulo;
    const esperado = document.createElement("p");
    esperado.className = "esperado";
    esperado.textContent = `Debería: ${caso.esperado}`;
    const salida = document.createElement("pre");
    salida.textContent = "(pulsa el botón)";
    const botones = document.createElement("div");
    botones.className = "botones";
    botones.append(crearBoton(caso.boton, salida, caso.accion));
    if (caso.extra) botones.append(crearBoton(caso.extra.boton, salida, caso.extra.accion));
    tarjeta.append(h3, esperado, botones, salida);
    contenedor.append(tarjeta);
  }
}
