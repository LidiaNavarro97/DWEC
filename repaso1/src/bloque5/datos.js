// El catálogo de prueba. Está CONGELADO (Object.freeze): si tu código intenta modificarlo
// (push, sort, splice, producto.stock = ...), salta un TypeError. Así sabes que estás mutando.
const congelar = (productos) => Object.freeze(productos.map((p) => Object.freeze(p)));

export const CATALOGO = congelar([
  { id: 1, titulo: "Tetris", plataforma: "GAME BOY", categoria: "Puzzle", estado: "usado-como-nuevo", precio: 20, stock: 5 },
  { id: 2, titulo: "Zelda: A Link to the Past", plataforma: "SNES", categoria: "RPG", estado: "nuevo-precintado", precio: 60, stock: 2 },
  { id: 3, titulo: "Sonic 2", plataforma: "MEGA DRIVE", categoria: "Plataformas", estado: "solo-cartucho", precio: 15, stock: 0 },
  { id: 4, titulo: "Crash Bandicoot", plataforma: "PS1", categoria: "Plataformas", estado: "usado-caja-danada", precio: 25, stock: 7 },
  { id: 5, titulo: "Street Fighter II", plataforma: "SNES", categoria: "Lucha", estado: "usado-como-nuevo", precio: 30, stock: 1 },
  { id: 6, titulo: "Super Mario 64", plataforma: "N64", categoria: "Plataformas", estado: "usado-como-nuevo", precio: 40, stock: 4 },
  { id: 7, titulo: "Final Fantasy VII", plataforma: "PS1", categoria: "RPG", estado: "usado-caja-danada", precio: 35, stock: 3 },
  { id: 8, titulo: "Dr. Mario", plataforma: "GAME BOY", categoria: "Puzzle", estado: "solo-cartucho", precio: 10, stock: 6 },
]);
