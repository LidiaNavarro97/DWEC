import { catalogoInicial } from './data/catalogo.js';
import {
  actualizarProducto,
  calcularPrecio,
  conStock,
  formatearProducto,
} from './reglas.js';
 
const TEXTO_MENU = `=== TIENDA RETRO ===
1. Ver catálogo
2. Buscar producto
3. Registrar una venta
4. Reponer stock
5. Informe de caja
6. Salir`;


let productos = catalogoInicial;
let ventas = [];

// pido texto al usuario y si cancela devuelve texto vacio
function pedirTexto(mensaje){
  return prompt(mensaje)?.trim() ?? '';
}

// pido numero entero positivo y sino es valido devuelve 0
function pedirUnidades(mensaje){
  const numero = Number(pedirTexto(mensaje));
  return Number.isInteger(numero) && numero > 0 ? numero : 0;
}

// pido un id y devuelve el producto o undefined sino existe
function pedirProducto() {
  const id = pedirTexto('ID del producto: ');
  const producto = productos.find((p) => p.id.toLowerCase() === id.toLowerCase());

  if (!producto) console.log('No existe ningún producto con ese id. ');
  return producto;
} 

// imprime una lista de productos
function mostrar(lista) {
  if (lista.length === 0) {
    console.log('No hay productos que mostrar. ');
    return;
  }
  console.log(lista.map(formatearProducto).join('\n'));
}
const totalFacturado = () => ventas.reduce((acc, v) => acc + v.total, 0);


// 1. VER CATALOGO

function verCatalogo() {
  const vista = pedirTexto(
    '1. Todo el catálogo\n 2. Filtrar por categoría\n 3. Solo stock bajo',
  );


  switch(vista){
    case '1':
      mostrar(productos);
      break;
    case '2': {
      const categoría = pedirTexto('Categoría: ').toLowerCase();
      mostrar(productos.filter((p) => p.categoria.toLowerCase() === categoria));
      break;  
    }
    case '3':
      mostrar(productos.filter((p) => p.stockBajo));
      break;
    default:
      console.log('Vista no válida. ');  
  }
}