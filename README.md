# Desarrollo Web en Entorno Cliente

## Modelo de datos

El catálogo es un array de objetos, uno por cada juego.

Propiedades:

- `id` (string): identificador único, con la plataforma y un número (`SNES-001`).
- `titulo` (string): nombre del juego.
- `plataforma` (string): la consola (`SNES`, `Mega Drive`, `PS1`, `N64` o `Game Boy`).
- `categoria` (string): el género (`RPG`, `Lucha`, `Plataformas`...).
- `precioBase` (number): el precio en euros antes de aplicar ningún ajuste.
- `estado` (string): el estado del juego. Solo puede ser uno de los valores de `ESTADOS`.
- `stock` (number): las unidades que quedan.
