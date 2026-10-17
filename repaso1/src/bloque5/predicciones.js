// 🔮 Bloque 5 · ¿Qué da?  (mismas instrucciones que en el bloque 1)
//
//   const numeros = [5, 8, 12];
//   const original = ["x", "y"];
//   const otra = original;     otra[0] = "z";     // ← otra NO es una copia
//   const c = [10, 20];
//   const d = [...c];          d.pop();           // ← d SÍ es una copia
//   const { titulo, stock = 0 } = { titulo: "Tetris" };

export const predicciones = {
  p1: undefined, // [2, 100, 30].sort()
  p2: undefined, // numeros.filter((n) => n > 6)
  p3: undefined, // numeros.find((n) => n > 20) ?? "ninguno"
  p4: undefined, // numeros.reduce((acc, n) => acc + n, 0)
  p5: undefined, // numeros.some((n) => n > 10)
  p6: undefined, // numeros.every((n) => n > 6)
  p7: undefined, // original[0]
  p8: undefined, // c.length
  p9: undefined, // stock
  p10: undefined, // numeros.map((n) => n * 2).filter((n) => n > 12)
};
