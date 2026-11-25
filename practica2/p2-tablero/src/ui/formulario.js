// formulario.js — Bloque B · 👀 leerFormulario (RESUELTO) y ✍️ B2 (mostrarErrores).

// 👀 Resuelto. Del formulario TODO llega como texto: aquí se limpia y se convierte.
/**
 * Lee el formulario de alta y devuelve los datos LIMPIOS para el modelo:
 * { titulo, prioridad, limite, cadaDias }. Texto sin espacios de más, limite "AAAA-MM-DD" o null,
 * cadaDias un número o undefined (si está vacío).
 */
export function leerFormulario(form) {
  const campos = Object.fromEntries(new FormData(form)); //convierte el formulario en un objeto
  const datos = {
    titulo: (campos.titulo ?? "").trim(), //sino existe usa "" y quita espacios de los lados
    prioridad: campos.prioridad, //
    limite: campos.limite ? campos.limite : null, // si está vacio pues null
  };

  //solo si hay algo lo convierte a numero
  if (campos.cadaDias?.trim()) datos.cadaDias = Number(campos.cadaDias);
  return datos;
}

// ✍️ B2 · mostrarErrores(form, errores)   errores = { campo: "mensaje" }
//   - Recorre los <p data-error-de="campo"> del formulario (querySelectorAll)
//   - Si ese campo tiene error: el mensaje en el <p> y aria-invalid="true" en el control
//     (el control es form.elements[campo])
//   - Si no lo tiene: <p> vacío y SIN aria-invalid (removeAttribute)
//   Pista: p.dataset.errorDe es el nombre del campo (data-error-de → dataset.errorDe)
export function mostrarErrores(form, errores) {

  // querySelectorAll devuelve todos los ("[data-error-de]") del formulario
  const parrafos = form.querySelectorAll("[data-error-de]");

  for(const p of parrafos){
    
    const campo = p.dataset.errorDe; // esto es igual a titulo
    const control = form.elements[campo];

    if (errores[campo]) {
      // si hay errores escribo el mensaje y marco el control como inválido
      p.textContent = errores[campo];
      control.setAttribute("aria-invalid", "true");

    } else {

      // sino hay error dejo el <p> vacío y quito la marca del control
      p.textContent = "";
      control.removeAttribute("aria-invalid");
    }
  } 

}
