// TABLA A
// Se aplica sobre el precio base para obtener el precio de venta
// Cuanto cambvia el precio segun el estado

function ajusteEstado(estado) {
  switch (estado) {
    case 'nuevo-precintado':
      return 1.25; // +25%
    case 'usado-como-nuevo':
      return 1; // +0%
    case 'usado-caja-danada':
      return 0.85; // -15%
    case 'solo-cartucho':
      return 0.7; // -30%
    default:
      console.error(`Estado no válido: ${estado}`);
  }
}

// TABLA B
// Desceunto por volumen en una misma venta

function descuentoVolumen(unidades) {
  if (unidades >= 4) return 0.1; // 10%
  if (unidades >= 2 && unidades <=3) return 0.05; // 5%
  return 0; // 1 unidad no tiene descuento
}

// Precio total de una venta

export function calcularPrecio({ precioBase, estado }, unidades) {
  const precioUnidad = precioBase * ajusteEstado(estado);
  const total = precioUnidad * unidades * (1 - descuentoVolumen(unidades));
  return Math.round(total * 100) / 100; // redondeado a dos decimales
}

// TABLA C
// si tras una venta el stock queda por debajo de 3, el catalogo muestra un error
// copio las propiedades del producto en un objeto nuevo
// nunevoStock como va detras, piso el valor de lo q tenga copiado

export function conStock(producto, nuevoStock) {
  return { ...producto, stock: nuevoStock, stockBajo: nuevoStock < 3 };
}
 
// Devuelve un array NUEVO donde solo cambia el producto indicado
export function actualizarProducto(productos, productoNuevo) {
  return productos.map((p) => (p.id === productoNuevo.id ? productoNuevo : p));
}
 
// si stock bajo es true, aviso con stock bajo
// si es false, porque no se venda, vale texto vacio
export function formatearProducto({ id, titulo, stock, stockBajo }) {
  const aviso = stockBajo ? ' ⚠ Stock bajo' : '';
  return `${id} - ${titulo} - stock: ${stock}${aviso}`;
}
