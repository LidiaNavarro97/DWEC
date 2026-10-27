// 🔮 PREDICCIONES · Escribe lo que crees que da cada expresión ANTES de probarla.
// Cambia cada undefined por tu respuesta (un número, true/false o un texto entre comillas).
// Luego: ./bateria.sh comprobar 1  → te dice el PORQUÉ de las que aciertas y una pista de las que fallas.
// Para probar una expresión de verdad: ./bateria.sh probar "const a = { n: 1 }; const b = a; b.n = 2; a.n"
export const predicciones = {
  p1: 2, // const a = { n: 1 }; const b = a; b.n = 2; a.n
  p2: 1, // const a = { n: 1 }; const b = { ...a }; b.n = 2; a.n
  p3: 2, // const a = { x: { n: 1 } }; const b = { ...a }; b.x.n = 2; a.x.n
  p4: 2, // Object.keys({ a: 1, b: 2 }).length
  p5: "function", // typeof { saludo() { return "hola"; } }.saludo
};
