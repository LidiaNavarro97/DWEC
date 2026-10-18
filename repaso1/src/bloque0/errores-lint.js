// ✍️ TU TURNO (paso 0.6)
// ESLint encuentra 4 problemas en este fichero. Lánzalo con  ./refuerzo.sh lint
// Lee cada mensaje (línea:columna · mensaje · regla) y arréglalos SIN cambiar lo que hace la función:
// contar cuántos productos tienen el stock a 0.
export function contarAgotados(productos) {
  let agotados = 0;
  const total = productos.length;
  for (let i = 0; i < total; i++) {
    if (productos[i].stock === 0) {
      agotados++;
    }
  }
  
  return agotados;
}
