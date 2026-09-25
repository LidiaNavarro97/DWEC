## Modelo de Datos

Para los productos de la tienda he creado objetos con las siguientes propiedades:

- **id**: Un ID único, que va a ser un número, para identificar cada juego sin liarme con los nombres.
- **titulo**: Nombre del videojuego.
- **plataforma**: El tipo de consola del juego (PS5, PS4, WII o NINTENDO son las que he puesto).
- **categoria**: El género (RPG, Plataformas, Lucha, Deportes, Puzzle) para luego poder filtrar.
- **precioBase**: El precio original del juego antes de aplicar los descuentos o lo que sea.
- **estado**:  Solo puede ser uno de los 4 estados permitidos (`nuevo-precintado`, `usado-como-nuevo`, `usado-caja-danada`, `solo-cartucho`).
- **stock**: La cantidad de unidades que quedan a la venta.
