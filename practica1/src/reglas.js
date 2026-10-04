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

export function vender(producto, unidades) {
  const { titulo, stock } = producto;
 
  if (unidades > stock) {
    console.log(`No hay stock suficiente de ${titulo}`);
    return;
  }
 
  const total = calcularPrecio(producto, unidades);
  producto.stock = stock - unidades;
  producto.stockBajo = producto.stock < 3;
 
  console.log(`Vendidas ${unidades} de ${titulo}: ${total} €`);
  return total;
}

// Listado del catálogo

export function mostrarCatalogo(catalogo) {
  catalogo.forEach(({ id, titulo, stock, stockBajo }) => {
    const aviso = stockBajo ? ' ⚠ Stock bajo' : ''; // una ternaria, actua como un if
    console.log(`${id} - ${titulo} - stock: ${stock}${aviso}`);
  });
}
