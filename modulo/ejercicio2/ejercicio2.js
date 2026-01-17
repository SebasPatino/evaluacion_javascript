// Módulo responsable de:
// - Validar operaciones.
// - Procesarlas de forma asíncrona simulando tiempos variables.
// - Demostrar tres enfoques de asincronía: callbacks, promesas y async/await.
// - Reportar resultados claros y mantener la inmutabilidad.
export function validarOperacion(op) {

  // Regla 1: la operación debe existir (no debe estar: null/undefined)
  if (!op) {
    throw new Error("La operación se encuentra vacía o indefinida.");
  }

  // Regla 2: el id debe ser string o number para asegurar identificación simple.
  if (typeof op.id !== "string" && typeof op.id !== "number") {
    throw new Error(`Operación inválida: el id "${op.id}" no es válido (debe ser string o number).`);
  }

  // Regla 3: 'valores' debe ser un arreglo (Array.isArray).
  if (!Array.isArray(op.valores)) {
    throw new Error(`Operación ${op.id}: 'valores' debe ser un arreglo.`);
  }

  // Regla 4: el arreglo no puede estar vacío.
  if (op.valores.length === 0) {
    throw new Error(`Operación ${op.id}: el arreglo de valores está vacío.`);
  }

  // Regla 5: todos los elementos deben ser numéricos (typeof === "number").
  // .every() recorre un arreglo y evalúa una condición sobre cada elemento arrojando True si cumple o False si no lo cumple.
  // v representa cada elemento del arreglo en la iteración.
  if (!op.valores.every(v => typeof v === "number")) {
    throw new Error(`Operación ${op.id}: todos los valores deben ser numéricos.`);
  }

  // Regla 6: 'tipo' debe ser un string.
  if (typeof op.tipo !== "string") {
    throw new Error(`Operación ${op.id}: el tipo debe ser un string.`);
  }

  // Regla 7: 'activa' debe ser booleano.
  if (typeof op.activa !== "boolean") {
    throw new Error(`Operación ${op.id}: el campo 'activa' debe ser booleano.`);
  }
  // Nota: No mutamos 'op' en ningún momento → inmutabilidad garantizada.
}

// En segundo lugar se realiza una SIMULACIÓN DE TIEMPO VARIABLE por medio de una función llamada:
// delay(ms):
// - Devuelve una Promesa que se resuelve luego de 'ms' milisegundos.
// - Se usa para simular tiempos variables de procesamiento.
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// se declara una función llamada tiempoAleatorio():
// - Calcula un tiempo aleatorio entre 300 ms y 2000 ms (es decir, un rango).
function tiempoAleatorio() {
  const min = 300;
  const max = 2000;
  // Genera un número entero aleatorio entre 300ms y 2000ms que luego es multiplicado por el número que arroje Math.random.
  // Esto hace que cada operación tarde un tiempo distinto.
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Como tercer paso se procede a realizar el CÁLCULO DE RESULTADOS por medio de una función llamada:
// calcularResultado(op):
// - Aplica operadores matemáticos según 'tipo'.
// - No modifica 'op' (usa sus valores, pero no los altera).
// - Devuelve un número con el resultado o lanza un rechazo si el tipo no es reconocido.
function calcularResultado(op) {
  switch (op.tipo) {
    // total (acumulador): Es el resultado parcial que se va construyendo en cada iteración. Empieza en el valor inicial que pasas a reduce (0 para suma, 1 para multiplicación).
    // elemento (valor actual): Es el elemento del arreglo que se está procesando en esa iteración.
    case "suma":
      // Suma acumulativa: reduce iniciando en 0
      // .reduce se usa para reducir un array a un único valor, aplicando una función acumuladora a cada elemento de izquierda a derecha, devolviendo un valor final.
      return op.valores.reduce((total, elemento) => total + elemento, 0);
    case "multiplicacion":
      // Producto acumulativo: reduce iniciando en 1
      return op.valores.reduce((total, elemento) => total * elemento, 1);
    default:
      // Tipo no reconocido => decisión: rechazamos con mensaje claro
      throw new Error(`Tipo de operación no reconocido: ${op.tipo}`);
  }
}

// Para el cuarto paso se procede a usar UNO DE TRES ENFOQUES DE ASINCRONÍA
// Para este caso voy a usar el enfoque con ASYNC/AWAIT:
// - Usa await sobre Promesas para un código más legible.
// - Justificación: claridad didáctica y manejo de errores con try/catch natural.
export async function procesarOperacion(op) {
  try {
    // Primero llamamos la función para validar datos
    validarOperacion(op);

    // Luego se procede a verificar el elemento "activa"
    if (!op.activa) {
      return {
        id: op.id,
        estado: "rechazada",
        motivo: "La operación está desactivada."
      };
    }

    // A continuación se simula el tiempo variable usando 'delay' y 'tiempoAleatorio'
    await delay(tiempoAleatorio());

    // Declaramos una constante a la cual le asignamos Calcular resultado
    const resultado = calcularResultado(op);

    // Ahora se toma una decisión según resultado
    if (resultado < 0) {
      return {
        id: op.id,
        estado: "rechazada",
        motivo: `El resultado (${resultado}) es negativo.`
      };
    }

    // Se retorna Aprobada
    return {
      id: op.id,
      estado: "aprobada",
      motivo: `Operación realizada correctamente. Resultado = ${resultado}`
    };
  } catch (err) {
    // Captura de errores: valida que el flujo no se bloquea
    return {
      // 1. op?.id
      // El operador ?. intenta acceder a la propiedad id del objeto op.
      // Si op existe y tiene la propiedad id, devuelve ese valor.
      // Si op es null o undefined, no lanza error, simplemente devuelve undefined.

      // 2. ?? "desconocido"
      // El operador ?? devuelve el valor de la izquierda si no es null ni undefined.
      // Si la izquierda es null o undefined, devuelve el valor de la derecha.

      // 3. Combinación: op?.id ?? "desconocido"
      // Primero intenta obtener op.id de forma segura.
      // Si op no existe o id es undefined/null, entonces devuelve "desconocido".
      // Así evitamos errores y siempre tenemos un valor válido para id.
      id: op?.id ?? "desconocido",
      estado: "rechazada",
      motivo: `Error: ${err.message}`
    };
  }
}

// Como siguiente paso se realiza un arreglo de objetos llamado:
// arrObjeto():
// - Devuelve un arreglo de operaciones de ejemplo para probar todos los casos.
// - No muta ninguna operación; cada procesamiento se lee pero no se altera.
export function arrObjeto() {
  return [
    { id: 1, valores: [10, 20, 30], tipo: "suma", activa: true },           // Aprobada: suma positiva
    { id: 2, valores: [2, 3, 4], tipo: "multiplicacion", activa: true },    // Aprobada: multiplicación positiva
    { id: 3, valores: [], tipo: "suma", activa: true },                     // Rechazo: arreglo vacío
    { id: 4, valores: [5, "x", 7], tipo: "suma", activa: true },            // Rechazo: valor no numérico
    { id: 5, valores: [10, -50], tipo: "suma", activa: true },              // Rechazo: resultado negativo
    { id: 6, valores: [1, 2, 3], tipo: "division", activa: true },          // Rechazo: tipo no reconocido
    { id: 7, valores: [9, 9], tipo: "suma", activa: false }                 // Rechazo: desactivada
  ];
}

// Como ultimo paso se ejecuta el ejercicio 2
// ejecutarOperaciones():
// - Orquesta el procesamiento por lotes.
// - Recorre el arreglo de operaciones (for...of) y procesa cada una.
// - Justificación del ciclo: 'for...of' permite usar 'await' dentro del bucle de manera simple.
// - Muestra resultados individuales y luego un resumen.
// - Evidencia de continuidad del flujo: aunque haya errores, se sigue procesando el resto.

export async function ejecutarOperaciones() {
  // Mensaje inicial para dar contexto al usuario.
  console.log("\nProcesando operaciones (Ejercicio 2)");

  // Obtenemos operaciones al cual se le asigna el arreglo de objetos (no mutamos este arreglo en ningún momento)
  const operaciones = arrObjeto();

  // Arreglo para acumular resultados (nuevo arreglo => inmutabilidad)
  const resultados = [];

  // Ciclo elegido: 'for...of' => permite 'await' y mantiene el orden visual.
  // op es un arreglo que representa cada operación dentro de operaciones.
  for (const op of operaciones) {
    // Procesar cada operación de forma asíncrona.
    // 'procesarOperacion(op)':
    // - Valida datos (try/catch interno).
    // - Simula tiempo variable (asincronía).
    // - Calcula el resultado según el tipo ('suma', 'multiplicacion', etc.).
    // - Devuelve un objeto con { id, estado, motivo } sin lanzar errores.
    const resultado = await procesarOperacion(op);

    // Se guarda el resultado en el arreglo 'resultados'.
    // Esto nos permitirá, más adelante, generar un resumen si lo necesitamos.
    resultados.push(resultado);

    // Reporte inmediato por cada operación:
    // - Muestra el identificador (id).
    // - El estado final (aprobada | rechazada).
    // - El motivo (mensaje claro para el usuario).
    // Esto evidencia que el flujo continúa aunque alguna operación falle.
    console.log(`Operación ${resultado.id}: ${resultado.estado} => ${resultado.motivo}`);
  }

  // Resumen final (sin mutar 'resultados')
  // .filter() recorre el arreglo y devuelve un nuevo arreglo con los elementos que cumplen la condición.
  // r => representa cada objeto dentro de resultados.
  const aprobadas = resultados.filter(r => r.estado === "aprobada").length;
  const rechazadas = resultados.filter(r => r.estado === "rechazada").length;

  console.log("\nResumen");
  console.log(`Operaciones aprobadas: ${aprobadas}`);
  console.log(`Operaciones rechazadas: ${rechazadas}`);
}