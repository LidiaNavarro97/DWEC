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
 
// Estado de la sesión. Nunca se modifican los arrays: se sustituyen por otros nuevos
let productos = catalogoInicial;
let ventas = [];
 
// Pide un texto al usuario (si cancela, devuelve texto vacío)
function pedirTexto(mensaje) {
  return prompt(mensaje)?.trim() ?? '';
}
 
// Pide un número entero positivo (si no es válido, devuelve 0)
function pedirUnidades(mensaje) {
  const numero = Number(pedirTexto(mensaje));
  return Number.isInteger(numero) && numero > 0 ? numero : 0;
}
 
// Pide un id y devuelve el producto (o undefined si no existe)
function pedirProducto() {
  const id = pedirTexto('ID del producto (míralo en el catálogo):');
  const producto = productos.find((p) => p.id.toLowerCase() === id.toLowerCase());
 
  if (!producto) console.log(`No existe ningún producto con el id "${id}"`);
  return producto;
}
 
// Imprime una lista de productos, una línea por producto
function mostrar(lista) {
  if (lista.length === 0) {
    console.log('No hay productos que mostrar');
    return;
  }
  console.log(lista.map(formatearProducto).join('\n'));
}
 
const totalFacturado = () => ventas.reduce((acc, v) => acc + v.total, 0);
 
// OPCIÓN 1
function verCatalogo() {
  const vista = pedirTexto(
    '1. Todo el catálogo\n2. Filtrar por categoría\n3. Solo stock bajo',
  );
 
  switch (vista) {
    case '1':
      mostrar(productos);
      break;
    case '2': {
      const categoria = pedirTexto('Categoría (ej. RPG):').toLowerCase();
      mostrar(productos.filter((p) => p.categoria.toLowerCase() === categoria));
      break;
    }
    case '3':
      mostrar(productos.filter((p) => p.stockBajo));
      break;
    default:
      console.log('Vista no válida');
  }
}
 
// OPCIÓN 2
function buscarProducto() {
  const texto = pedirTexto('ID o parte del título:').toLowerCase();
  if (!texto) return console.log('Escribe algo para buscar');
 
  const encontrado = productos.find(
    (p) => p.id.toLowerCase() === texto || p.titulo.toLowerCase().includes(texto),
  );
 
  console.log(
    encontrado
      ? formatearProducto(encontrado)
      : `No se ha encontrado ningún producto con "${texto}"`,
  );
}
 
// OPCIÓN 3
function registrarVenta() {
  const producto = pedirProducto();
  if (!producto) return;
 
  const unidades = pedirUnidades('¿Cuántas unidades?');
 
  if (unidades === 0) {
    console.log('Cantidad no válida');
  } else if (unidades > producto.stock) {
    console.log(`No hay stock suficiente de ${producto.titulo} (quedan ${producto.stock})`);
  } else {
    const total = calcularPrecio(producto, unidades);
    productos = actualizarProducto(productos, conStock(producto, producto.stock - unidades));
    ventas = [...ventas, { id: producto.id, titulo: producto.titulo, unidades, total }];
    console.log(`Vendidas ${unidades} de ${producto.titulo}: ${total} €`);
  }
}
 
// OPCIÓN 4
function reponerStock() {
  const producto = pedirProducto();
  if (!producto) return;
 
  const unidades = pedirUnidades('¿Cuántas unidades repones?');
 
  if (unidades === 0) {
    console.log('Cantidad no válida');
  } else {
    const nuevoStock = producto.stock + unidades;
    productos = actualizarProducto(productos, conStock(producto, nuevoStock));
    console.log(`Repuestas ${unidades} de ${producto.titulo}. Stock actual: ${nuevoStock}`);
  }
}
 
// OPCIÓN 5
function informeCaja() {
  const valorStock = productos.reduce((acc, p) => acc + p.precioBase * p.stock, 0);
 
  // Unidades vendidas de un producto en esta sesión
  const unidadesVendidas = (id) =>
    ventas.filter((v) => v.id === id).reduce((acc, v) => acc + v.unidades, 0);
 
  const masVendido = productos.reduce(
    (mejor, p) => (unidadesVendidas(p.id) > unidadesVendidas(mejor.id) ? p : mejor),
    productos[0],
  );
  const maximo = unidadesVendidas(masVendido.id);
  const bajos = productos.filter((p) => p.stockBajo);
 
  console.log('--- Informe de caja ---');
  console.log(`Total facturado: ${totalFacturado().toFixed(2)} €`);
  console.log(
    `Producto más vendido: ${maximo > 0 ? `${masVendido.titulo} (${maximo} uds)` : 'ninguno todavía'}`,
  );
  console.log(`Valor del stock restante: ${valorStock.toFixed(2)} €`);
  console.log(
    bajos.length > 0
      ? `⚠ Stock bajo en: ${bajos.map((p) => p.titulo).join(', ')}`
      : 'No hay productos con stock bajo',
  );
}
 
// OPCIÓN 6
function salir() {
  const unidades = ventas.reduce((acc, v) => acc + v.unidades, 0);
 
  console.log('--- Resumen de la sesión ---');
  console.log(`Ventas realizadas: ${ventas.length}`);
  console.log(`Unidades vendidas: ${unidades}`);
  console.log(`Total facturado: ${totalFacturado().toFixed(2)} €`);
  console.log('¡Hasta pronto!');
}
 
// Bucle principal: se repite hasta que se elige Salir (o se cancela el menú)
export function iniciarMenu() {
  let opcion;
 
  do {
    opcion = prompt(TEXTO_MENU)?.trim() ?? '6';
 
    switch (opcion) {
      case '1':
        verCatalogo();
        break;
      case '2':
        buscarProducto();
        break;
      case '3':
        registrarVenta();
        break;
      case '4':
        reponerStock();
        break;
      case '5':
        informeCaja();
        break;
      case '6':
        salir();
        break;
      default:
        console.log('Opción no válida, elige un número del 1 al 6');
    }
  } while (opcion !== '6');
}