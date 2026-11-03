// probar.mjs — ejecuta una expresión y enseña lo que da la última sentencia, como la consola del navegador.
//   docker compose run --rm web npm run probar "const a = { n: 1 }; const b = a; b.n = 2; a.n"
import { inspect } from "node:util";
import { runInNewContext } from "node:vm";

const codigo = process.argv[2];
if (!codigo) {
  console.log('Uso: docker compose run --rm web npm run probar "expresión"');
  process.exit(1);
}
try {
  console.log("→", inspect(runInNewContext(codigo)));
} catch (e) {
  console.log("✘", `${e.name}: ${e.message}`);
  process.exit(1);
}
