// caja.js — La caja de RetroStock. Esta vez el código ya está escrito... y tiene 5 bugs.
// NO los busques leyendo: usa la página (http://localhost:6100), reproduce cada fallo y encuéntralo
// con un BREAKPOINT en las DevTools del navegador (F12 → Fuentes / Sources). Nada de console.log.

export const PRODUCTOS = [
  { id: 1, titulo: "Tetris", plataforma: "GAME BOY", precio: 20, stock: 5 },
  { id: 2, titulo: "Zelda: A Link to the Past", plataforma: "SNES", precio: 35, stock: 2 },
  { id: 3, titulo: "Sonic 2", plataforma: "MEGA DRIVE", precio: 15, stock: 0 },
  { id: 4, titulo: "Crash Bandicoot", plataforma: "PS1", precio: 25, stock: 7 },
  { id: 5, titulo: "Pokémon Rojo", plataforma: "GAME BOY", precio: 30 },
];

// Total del ticket: suma precio × unidades de cada línea.
export function totalTicket(lineas) {
  let total = 0;
  for (let i = 0; i < lineas.length; i++) {
    const linea = lineas[i];
    total = total + linea.precio * linea.unidades;
  }
  return total;
}

// Suma a las unidades que ya hay las que escribe el usuario en un prompt.
// Si lo que escribe no es un número, las unidades se quedan como estaban.
export function sumarUnidades(actuales, textoDelUsuario) {
  if(textoDelUsuario === null) {
    return actuales;
  }
  
  const numero = Number(textoDelUsuario);

  if(Number.isNaN(numero)) {
    return actuales;
  }

  return actuales + numero;
}

// Texto del stock de un producto para el listado. Si no tenemos el dato: "sin datos".
export function stockTexto(producto) {
  const stock = producto.stock ?? "sin datos";
  return `${stock}`;
}

// Devuelve los productos ordenados de más barato a más caro (sin tocar la lista original).
export function ordenarPorPrecio(productos) {
  const ordenados = [...productos].sort((a, b) => a.precio - b.precio);
  return ordenados;
}

// Precio unitario con el descuento por volumen (Tabla B de la práctica 1):
// 1 unidad → 0 % · de 2 a 3 → 5 % · 4 o más → 10 %. Redondeado a 2 decimales.
export function precioConDescuento(precio, unidades) {
  let descuento = 0;
  if (unidades >= 4) {
    descuento = 0.1;
  } else if (unidades >= 2) {
    descuento = 0.05;
  }
  return Math.round(precio * (1 - descuento) * 100) / 100;
}
