// 🔮 Bloque 2 · ¿Qué da?  (mismas instrucciones que en el bloque 1)
//
//   const f = (a, b = 2) => a * b;
//   const cuantos = (...cosas) => cosas.length;
//   const ficha = () => { id: 1 };
//   const doble = (n) => n * 2;
//
//   console.log(saludar("Ana"));          // ← se llama ANTES de declararla
//   function saludar(nombre) { return "Hola " + nombre; }

export const predicciones = {
  p1: undefined, // f(3)
  p2: undefined, // f(3, undefined)
  p3: undefined, // f(3, null)
  p4: undefined, // cuantos("a", "b")
  p5: undefined, // cuantos([1, 2, 3])
  p6: undefined, // typeof ficha()
  p7: undefined, // Math.max(...[4, 9, 2])
  p8: undefined, // [1, 2, 3].map(doble)
  p9: undefined, // lo que imprime el console.log de saludar
};
