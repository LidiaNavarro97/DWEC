// ESLint: el «corrector ortográfico» del código. Lo lanza ./refuerzo.sh lint.
// Esta copia es para que veas las reglas: la que se usa va dentro de la imagen (no hace falta tocarla).
import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["comprobador/**", "solucion/**", "entrega/**"] },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser },
    },
    rules: {
      "no-var": "error", //            nada de var
      eqeqeq: "error", //              siempre === y !==
      "prefer-const": "error", //      si no se reasigna, const
      "no-unused-vars": ["error", { args: "none" }],
      "no-console": "warn", //         console.log no es una forma de depurar
      "no-debugger": "warn", //        quita los debugger; cuando termines
    },
  },
];
