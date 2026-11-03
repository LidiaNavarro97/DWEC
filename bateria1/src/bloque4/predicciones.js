// 🔮 Bloque 4 · ¿Qué da?  (mismas instrucciones que en el bloque 1)
//
//   let r = "";
//   switch (2) {
//     case 1: r += "a";
//     case 2: r += "b";
//     case 3: r += "c"; break;
//     default: r += "d";
//   }
//
//   let n = 0;
//   while (n < 3) { n++; }
//
//   let suma = 0;
//   for (let i = 1; i <= 4; i++) { suma += i; }
//
//   const claves = [];
//   for (const x in ["a", "b"]) { claves.push(x); }
//
//   const stock = 0;
//
//   let veces = 0;
//   do { veces++; } while (veces < 0);

export const predicciones = {
  p1: "bc", // r
  p2: 3, // n
  p3: 10, // suma
  p4: ["0", "1"], // claves         ⚠️ for...IN, no for...of
  p5: 0, // stock && "hay unidades"
  p6: "agotado", // stock > 0 ? "hay" : "agotado"
  p7: 1, // veces          ⚠️ do...while
};
