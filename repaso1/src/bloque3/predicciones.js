// 🔮 Bloque 3 · ¿Qué da?  (mismas instrucciones que en el bloque 1)
//    Usa la función crearMarcador del ejemplo de closures.js:
//
//   const m1 = crearMarcador();
//   m1.anotar(10);
//   m1.anotar(5);
//   const m2 = crearMarcador();
//   m2.anotar(100);
//   const copia = m1.jugadas();
//   copia.push(999);
//
//   const elevar = (exponente) => (base) => base ** exponente;
//   const alCuadrado = elevar(2);

export const predicciones = {
  p1: undefined, // m1.puntos()
  p2: undefined, // m2.puntos()
  p3: undefined, // m1.jugadas().length       (después del push de 999)
  p4: undefined, // m1.puntos === 15          ⚠️ sin paréntesis
  p5: undefined, // typeof m1.total
  p6: undefined, // alCuadrado(5)
  p7: undefined, // elevar(3)(2)
};
