// 🔮 Bloque 5 · ¿Qué da?  (mismas instrucciones que en el bloque 1)
//
//   const numeros = [5, 8, 12];
//   const original = ["x", "y"];
//   const otra = original;     otra[0] = "z";     // ← otra NO es una copia
//   const c = [10, 20];
//   const d = [...c];          d.pop();           // ← d SÍ es una copia
//   const { titulo, stock = 0 } = { titulo: "Tetris" };

export const predicciones = {
  p1: [100,2,30], // [2, 100, 30].sort()
  p2: [8,12], // numeros.filter((n) => n > 6) -> filtra numeros mayores q 6
  p3: "ninguno", // numeros.find((n) => n > 20) ?? "ninguno"
  p4: 25, // numeros.reduce((acc, n) => acc + n, 0) -> suma todos los nº empezando desde 0
  p5: true, // numeros.some((n) => n > 10) -> al menos uno cumple la condicion
  p6: false, // numeros.every((n) => n > 6) -> q todos cumplan la condicion
  p7: "z", // original[0] -> NO ENTIENDO
  p8: 2, // c.length
  p9: 0, // stock
  p10: [16,24], // numeros.map((n) => n * 2).filter((n) => n > 12)
};

