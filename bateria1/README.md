# 🛠️ DWEC · Refuerzo de la Práctica 1

El enunciado completo está en la web de DWEC → **UD 3 → 3.2 Batería de repaso** (o en
`Refuerzo-P1_DWEC.docx`, si te lo han dado). Esto es solo el arranque:

```bash
chmod +x refuerzo.sh
./refuerzo.sh preparar       # (1 vez) tu nombre + construir la imagen
./refuerzo.sh ayuda          # todas las órdenes
```

Después, sigue el enunciado desde el **Bloque 0** (paso 0.2: Git). Hazlo en orden:
0 → D → 1 → 2 → 3 → 4 → 5 → 6 → `respuestas.md`, y un commit al terminar cada bloque.

| Orden | Para qué |
|---|---|
| `./refuerzo.sh arrancar` | Arrancar Vite → http://localhost:6100 |
| `./refuerzo.sh comprobar [bloque]` | Qué llevas bien y qué falta (`0`, `d`, `1`…`6`, `final`) |
| `./refuerzo.sh lint` | ESLint |
| `./refuerzo.sh parar` | Parar Vite |
| `./refuerzo.sh entregar` | El `.zip` de la entrega, en `entrega/` (si te lo piden) |

En Windows: usa **Git Bash** o **WSL**. Sin Docker pero con Node 20+: el kit funciona igual
(sin ESLint).
