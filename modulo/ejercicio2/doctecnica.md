DOCUMENTACIÓN TÉCNICA COMPLETA

1. Datos de entrada
    - Definición y tipos esperados
        - Operación (objeto):
        - id: string o number.
        - valores: array de numbers.
        - tipo: string. Regla a aplicar sobre valores: "suma", "multiplicacion".
        - activa: boolean. Controla si la operación será procesada.

    - Validaciones realizadas
        - Existencia de la operación:
            if (!op) {
            throw new Error("La operación se encuentra vacía o indefinida.");
            }
            - Regla: op no puede ser null/undefined.
            - Acción: se lanza Error con mensaje claro si no existe.

        - Tipo del id:
            if (typeof op.id !== "string" && typeof op.id !== "number") {
            throw new Error(`Operación inválida: el id "${op.id}" no es válido (debe ser string o number).`);
            }
            - Regla: debe ser string o number.
            - Acción: Error si no cumple.

        - Estructura de valores:
             if (!Array.isArray(op.valores)) {
            throw new Error(`Operación ${op.id}: 'valores' debe ser un arreglo.`);
            }

            if (op.valores.length === 0) {
            throw new Error(`Operación ${op.id}: el arreglo de valores está vacío.`);
            }

            if (!op.valores.every(v => typeof v === "number")) {
            throw new Error(`Operación ${op.id}: todos los valores deben ser numéricos.`);
            }
            - Regla: debe ser un arreglo, no vacío, y todos sus elementos deben ser numbers.
            - Acción: Error si no es Array, si está vacío, o si algún elemento no es numérico.

        - Tipo del campo tipo:
            if (typeof op.tipo !== "string") {
            throw new Error(`Operación ${op.id}: el tipo debe ser un string.`);
            }
            - Regla: debe ser string.
            - Acción: Error si no cumple.

        - Tipo del campo activa:
            if (typeof op.activa !== "boolean") {
            throw new Error(`Operación ${op.id}: el campo 'activa' debe ser booleano.`);
            }
            - Regla: debe ser boolean.
            - Acción: Error si no cumple.

    - Riesgos si el dato es incorrecto
        - id inválido: dificultad para identificar el caso que falló; se usa “desconocido” de forma segura.
        - valores incorrectos: resultados inválidos (NaN) o excepciones durante el cálculo.
        - tipo no reconocido: reglas no definidas; se detiene esa operación con rechazo explícito.
        - activa "no boolean": decisiones de flujo ambiguas; se rechaza y se explica.

    - Captura desde terminal
        - Menú principal: el usuario elige opción por teclado mediante prompt-sync.
        - Entrada: string devuelta por prompt(...), recortada con .trim().
        - Validación: se verifica vacío y se controla contra las opciones "1", "2", "3".
        - Datos de operaciones: provienen de arrObjeto().

2. Descripción del proceso
    - Variables creadas y propósito
        - operaciones: arreglo devuelto por arrObjeto(), manteniendo inmutabilidad.
        - resultados: arreglo nuevo. Acumula salidas por operación, manteniendo inmutabilidad.
        - resultado: objeto con la forma { id, estado, motivo } retornado por procesarOperacion(op).

    - Explicación de condicionales
        - Validación inicial (en validarOperacion):
            - if (!op): evita procesar null/undefined.
            - if (tipo incorrecto de id/tipo/activa): previene inconsistencias.
            - if (!Array.isArray(op.valores)) e if (op.valores.length === 0): asegura estructura y contenido.
            - if (!op.valores.every(...)): garantiza valores numéricos.

        - Procesamiento (en procesarOperacion):
            - if (!op.activa): rechazo temprano con motivo claro.
            - if (resultado < 0): rechazo por regla de negocio (no se aceptan resultados negativos).

        - Switch (en calcularResultado):
            - case "suma": suma acumulativa con reduce y neutro 0.
            - case "multiplicacion": producto acumulativo con reduce y neutro 1.
            - default: tipo no reconocido => Error explicativo.

    - Justificación de ciclos
        - for...of en ejecutarOperaciones: Permite await dentro de la estructura o cuepro, manteniendo el flujo secuencial y legible.

    - Análisis de mutabilidad e inmutabilidad
        - No se modifica "operaciones" ni los objetos "op": se leen, se procesan y se genera un nuevo objeto de resultado por cada entrada.
        - resultados es un arreglo nuevo: almacena salidas, separando claramente datos de entrada y salida.
        - Funciones puras: calcularResultado(op) no modifica op sino que se calcula usando .reduce.

    - Operadores utilizados y motivo de uso
        - Optional chaining (op?.id): acceso seguro a "id" si "op" es null/undefined, evita excepciones.
        - Nullish coalescing (?? "desconocido"): valor de respaldo cuando "id" no existe o es undefined/null.
        - .reduce: acumulación de suma/producto de forma declarativa y concisa.
        - .every: verificación de que todos los valores sean numéricos.
        - Operadores lógicos y de comparación (===, !, <): control de flujo y reglas de negocio que se encuentran en validarOperacion(op).

    - Justificación del tipo de función
        - validarOperacion(op): función síncrona, sin efectos secundarios; adecuada para validación rápida.
        - calcularResultado(op): función síncrona donde se encapsulan las reglas matemáticas.
        - delay(ms) y tiempoAleatorio(): funciones para simular asincronía.
        - procesarOperacion(op): función asíncrona con async/await; integra validación, simulación de tiempo y cálculo con manejo de errores.
        - ejecutarOperaciones(): función asíncrona orquestadora; recorre, espera, acumula y reporta.

- Flujo de ejecución (paso a paso)
    1. Menú: el usuario elige la opción 1.
    2. Inicio del lote: ejecutarOperaciones() muestra el encabezado y obtiene operaciones.
    3. Recorrido: por cada op:
        - Se llama procesarOperacion(op).
        - Se valida op con reglas explícitas.
        - Si op.activa es false, se rechaza con motivo y se retorna.
    4. Se simula tiempo variable con await delay(tiempoAleatorio()).
    5. Se calcula el resultado con calcularResultado(op) usando switch + .reduce.
    6. Si el resultado < 0, se rechaza con motivo; si no, se aprueba con mensaje y resultado.
    7. El objeto { id, estado, motivo } se agrega a resultados.
    8. Se imprime el reporte de esa operación en la terminal.
    9. Resumen: al terminar el ciclo:
        - Se cuentan aprobadas y rechazadas con filter(...).length.
        - Se imprime el resumen al usuario.

3. Manejo de errores
    - Escenarios donde el usuario puede fallar
        - Entrada del menú vacía o fuera de rango: el usuario escribe algo distinto a las opciones 1–3.
        - Datos inválidos en operaciones:
            - id con tipo erróneo.
            - valores no es un arreglo, está vacío, o contiene elementos no numéricos.
            - tipo no reconocido.
            - activa "no boolean".
            - Errores internos en cálculo: tipos no soportados (default del switch).

    - Tipo de error que se genera
        - Validación: throw new Error(...) con mensajes explicativos en validarOperacion.
        - Cálculo: throw new Error(...) en tipos no reconocidos (default del switch).
    
    - Mensaje claro al usuario
        - Por operación: “Operación X: aprobada/rechazada => motivo”.
        Motivos: “La operación está desactivada.”, “Tipo de operación no reconocido: ...”, “El resultado (...) es negativo.”, “Todos los valores deben ser numéricos.”, etc.
        - Menú: “Entrada vacía...”, “Opción inválida...”.

    - Garantía de que el programa no se bloquea
        - try/catch en procesarOperacion: convierte excepciones en resultados “rechazados” con motivo, asegurando continuidad del lote.
        - try/catch en el menú: captura fallos de interacción y continúa el bucle.
        - Acceso seguro a id: op?.id ?? "desconocido" evita excepciones cuando falta op.

4. Datos de salida
    - Tipo de dato
        - Por operación: objeto { id: string|number|"desconocido", estado: "aprobada"|"rechazada", motivo: string }.
        Resumen: dos números (aprobadas, rechazadas), impresos en terminal.

    - Presentación al usuario
        - Reporte línea a línea: Operación {id}: {estado} => {motivo} durante el procesamiento.
        Resumen final: “Operaciones aprobadas: x”, “Operaciones rechazadas: y”.

    - Validación de funcionamiento correcto
        - Evidencia en consola:
            - Se imprime cada operación con su estado y motivo.
            - Se imprime el resumen final con conteos precisos.

        - Continuidad del flujo:
            - Aunque existan errores de validación o tipos desconocidos, el programa sigue procesando las demás operaciones y muestra sus salidas.

        - Inmutabilidad respetada:
            - operaciones no cambia; resultados es un arreglo nuevo.

        - Reglas aplicadas:
            - Rechazos por operaciones desactivadas, tipos no reconocidos, datos inválidos y resultado negativo aparecen claramente reflejados.

-----------------------------------------------------------------------------------------------------------------------------------------------------------

DOCUMENTO DE EVALUACIÓN

1. Modelo de datos esperados (por operación):
    {
    id: string | number,        // Identificador único de la operación (ej: 1).
    valores: number[],          // Arreglo de valores numéricos (ej: [10, 20, 30]).
    tipo: string,               // Tipo de operación (ej: "suma", "multiplicacion").
    activa: boolean             // Si es true, la operación se procesa; si es false, se rechaza.
    }

    - En el código:
    function arrObjeto() {
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

    - En consola:
        Has elegido la opción 1: Procesar operaciones por lotes.

        Procesando operaciones (Ejercicio 2)
        Operación 1: aprobada => Operación realizada correctamente. Resultado = 60
        Operación 2: aprobada => Operación realizada correctamente. Resultado = 24
        Operación 3: rechazada => Error: Operación 3: el arreglo de valores está vacío.
        Operación 4: rechazada => Error: Operación 4: todos los valores deben ser numéricos.
        Operación 5: rechazada => El resultado (-40) es negativo.
        Operación 6: rechazada => Error: Tipo de operación no reconocido: division
        Operación 7: rechazada => La operación está desactivada.

        Resumen
        Operaciones aprobadas: 2
        Operaciones rechazadas: 5

2. JUSTIFICACIÓN DE TIPOS:
    - id (string|number): flexible y sencillo para identificar cada operación.
    - valores (number[]): permite aplicar operadores matemáticos con facilidad.
    - tipo (string): hace el diseño extensible (podemos agregar más tipos sin cambiar el modelo).
    - activa (boolean): decisión binaria clara para procesar o no.

3. ¿QUÉ OCURRE SI NO SE CUMPLEN?
    - Se lanzan errores con mensajes comprensibles durante la validación inicial.
    - Los errores son capturados en el procesamiento y se devuelven como resultados "rechazados".