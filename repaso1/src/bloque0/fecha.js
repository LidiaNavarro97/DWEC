// 👀 EJEMPLO de módulo: una función con «export» para que otros ficheros puedan importarla.
export function fechaDeHoy() {
  return new Date().toLocaleDateString("es-ES");
}
