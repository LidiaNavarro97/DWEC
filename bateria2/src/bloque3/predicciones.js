// 🔮 PREDICCIONES · Cambia cada undefined por lo que crees que da. Luego: docker compose run --rm web npm run comprobar 3
export const predicciones = {
  p1: 1, // class C { #x = 1; get x() { return this.#x; } }; new C().x
  p2: 0, // class C { #x = 1; }; Object.keys(new C()).length
  p3: false, // class D { static n = 3; }; "n" in new D()
  p4: "function", // class L { resumen() {} }; typeof L.prototype.resumen
};

// p3 -> static significa que la propiedad pertenece a la clase o a sus instancias
// new D() crea una instancia que no tiene la propiedad n