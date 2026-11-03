// 🔮 Bloque 1 · ¿Qué da?
//
// 1 · Escribe el valor que CREES que da cada expresión, SIN probarla antes.
//     Escríbelo como un valor de JavaScript: un número (15), un texto entre comillas ("53"),
//     true / false, null, NaN o un array ([1, 2]).
// 2 · ./refuerzo.sh comprobar 1   → te dice cuáles has fallado (no cuál es la buena) y te da una
//     pista del concepto. Las que aciertes, te explica POR QUÉ dan eso: léelo.
// 3 · Las falladas, pruébalas en la consola del navegador (F12 → Consola) y piensa por qué.
//     Apunta lo que no entiendas: es justo lo que tienes que repasar.

export const predicciones = {
  p1: "53", //  "5" + 3
  p2: (15), //  "5" * 3
  p3: true, //  3 + "3" === "33" -> primero hace la suma y luego compara 33===33
  p4: (1), //  NaN || 1
  p5: NaN, //  NaN ?? 1
  p6: ("sin nombre"), //  "" || "sin nombre"
  p7: (0), //  Number("") -> convierte la cadena vacia en 0
  p8: NaN, //  Number("12,5")
  p9: false, //  0.1 + 0.2 === 0.3
  p10: "sin precio" , // const p = { titulo: "Tetris" };   p.precio?.toFixed(2) ?? "sin precio" -> p.precio no existe asi que ?. evita el error y ?? devuelve el texto alternativo
};
