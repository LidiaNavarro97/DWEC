import { catalogoInicial } from './data/catalogo.js';
import {
  actualizarProducto,
  calcularPrecio,
  conStock,
  formatearProducto,
} from './reglas.js';
 
const texto_menu = `=== TIENDA RETRO ===
1. Ver catálogo
2. Buscar producto
3. Registrar una venta
4. Reponer stock
5. Informe de caja
6. Salir`;
 
