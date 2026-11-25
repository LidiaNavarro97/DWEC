// red.js — Bloque C · ✍️ C2. Pedir un JSON con fetch y async/await, sin fiarse de nada.

// ✍️ C2 · async obtenerJSON(url, fetchFn = fetch) → el JSON ya convertido
//   - const respuesta = await fetchFn(url)
//   - Si !respuesta.ok → lanza un Error con el código (respuesta.status) Y la url en el mensaje
//   - Si la cabecera content-type no incluye "application/json" → lanza un Error con la url
//     (Vite devuelve su index.html, con un 200, cuando el fichero no existe)
//   - Si todo va bien, devuelve respuesta.json()
//   - Los errores de red (sin conexión) NO se capturan aquí: que le lleguen a quien llama
export async function obtenerJSON(url, fetchFn = fetch) { // siempre devuelve una promesa
  
  // pido la url y await espera a q llegue la respuesta
  // sino hay red fetch lanza el error pero no lo capturamos pq le llega a quien llama
  const respuesta = await fetchFn(url);

  // respuesta.ok es false cuando el codigo no es 2xx
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al pedir ${url}`);
  }

  //vite devuelve su index con un 200 si el fichero no existe
  // asi q comprobamos q la cabecera diga q es JSON
  // ?? "" evita que includes reviente sino hay cabecera y get devuelve null
  const tipo = respuesta.headers.get("content-type") ?? "";

  if (!tipo.includes("application/json")) {
    throw new Error(`${url} no es JSON`)
  }

  // si esta todo bien
  return await respuesta.json();

}
