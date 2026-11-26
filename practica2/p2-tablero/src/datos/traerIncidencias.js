export async function traerIncidencias(tablero, {url, fetchFn, storage}){

    const respuesta = await fetchFn(url);

    if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al pedir ${url}`);
    }
}
