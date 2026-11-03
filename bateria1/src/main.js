// main.js — el punto de entrada: index.html carga este fichero y él carga el resto.

// 👀 EJEMPLO: importar una función de otro fichero.
//    fecha.js la EXPORTA (mira su «export») y aquí la IMPORTAMOS con la ruta relativa y el .js
import { fechaDeHoy } from "./bloque0/fecha.js";
import { montarPanelDepuracion } from "./depuracion/pagina.js";

// ✍️ TU TURNO (paso 0.5): importa aquí la función saludar desde ./bloque0/saludo.js
import { saludar } from "./bloque0/saludo.js";


const saludo = document.querySelector("#saludo");

// ✍️ TU TURNO (paso 0.5): cambia esta línea para que el texto sea  saludar("Tu Nombre")
saludo.textContent = saludar("Lidia");

montarPanelDepuracion(document.querySelector("#app"));
