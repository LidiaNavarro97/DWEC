# DWEC · Batería de ejercicios de la UD4 (Objetos y POO)

**Opcional** y **no cuenta para la nota**: es para practicar la UD4 antes del bloque A de la práctica.

Se trabaja **igual que en la práctica**: todo con `docker compose` (Node y Vite van dentro del contenedor; en tu
ordenador no se instala nada más).

```bash
docker compose run --rm web npm install            # 1 vez, con internet
docker compose run --rm web npm run comprobar      # todos los bloques
docker compose run --rm web npm run comprobar 3    # solo el bloque 3 (y el porqué de cada predicción)
docker compose run --rm web npm run probar "EXPR"  # ejecuta código y enseña lo que da
docker compose up                                  # la página en http://localhost:5173 (Ctrl+C para pararla)
```

1. Lee la explicación de cada bloque en la web de DWEC: **Practicar → UD4 · Objetos y clases**.
2. Haz los ejercicios de `src/bloque1` … `src/bloque6`, en orden, y compruébalos.
3. Para **ver y depurar** tu código: `docker compose up` y abre **http://localhost:5173**. La página se recarga sola
   cada vez que guardas, ejecuta ejemplos con tus funciones y, con **F12**, las tienes en la consola y puedes poner
   puntos de parada en `src/`.
4. Al terminar, contesta `respuestas.md`.
