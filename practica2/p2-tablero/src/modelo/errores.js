// errores.js — Bloque A · ✍️ A4. Errores propios del tablero.
// La interfaz de la UD5 tiene que poder distinguir con instanceof un error «esperado» (columna llena,
// movimiento prohibido) de un fallo de programación. Error es una clase: se hereda de ella.

// ErrorTablero extends Error
//   - constructor(mensaje): llama al padre con el mensaje
//   - name = el nombre de la clase. Pista: this.constructor.name también vale en las subclases.
export class ErrorTablero extends Error {

    constructor(mensaje){ // el constructor solo recibe el mensaje
        super(mensaje);

        // this.constructor es la clase real del objeto creado
        this.name = this.constructor.name;
    }  
}

// ColumnaLlenaError extends ErrorTablero
//   - constructor(columna): recibe la Columna (o cualquier objeto con nombre y limiteWip)
//   - mensaje: «En curso» está llena (máximo 2)   ← que diga «llena», el nombre y el límite
//   - guarda this.columna (el NOMBRE, un string) y this.limite
export class ColumnaLlenaError extends ErrorTablero{

    constructor(columna){
    
    // tiene que decir -> «En curso» está llena (máximo 2)
    super(`«${columna.nombre}» está llena (máximo ${columna.limiteWip})`);

    // Guardamos el nombre de la columna (string), no el objeto entero.
    this.columna = columna.nombre;

    // Guardamos también el límite.
    this.limite = columna.limiteWip;

    }
}

// MovimientoNoPermitidoError extends ErrorTablero
//   - constructor(id, desde, hasta): los dos últimos son nombres de columna
//   - mensaje con el id de la tarea; guarda this.desde y this.hasta
export class MovimientoNoPermitidoError extends ErrorTablero{

    // recibe el id y los dos nombres de la columna origen y destino
    constructor(id, desde, hasta){ 

        // llamamos al padre con el mensaje que debe llevar el id
        super(`Movimiento no permitido para la tarea ${id}: de ${desde} a ${hasta}`);

        // guardamos los nombres de las columnas
        this.desde = desde;
        this.hasta = hasta;
    }
}
