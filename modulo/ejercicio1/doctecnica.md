DOCUMENTACIÓN TÉCNICA COMPLETA

1. Datos de entrada
    - Definición y tipos esperados
        - Transacción (objeto):
            - id: number entero positivo.
            - usuario: string no vacío.
            - monto: number finito distinto de 0.
            - tipo: string. Valores permitidos: "ingreso", "egreso".
            - autorizada: boolean. Controla si la transacción está autorizada.
            - fecha: string o Date. No se valida formato real, solo tipo.
    
    - Validaciones realizadas
        - Existencia de la transacción:
            if (!transaccion) throw new Error("La transacción está vacía o indefinida.")
            - Regla: id: debe ser entero positivo.
        - usuario: string con longitud > 0.
        - monto: number finito distinto de 0.
        - tipo: debe ser string.
        - autorizada: debe ser boolean.
        - fecha: debe ser string o Date.
        - Coherencia de monto según tipo:
            - ingreso => monto > 0.
            - egreso => monto > 0.

    - Riesgos si el dato es incorrecto
        - id inválido: difícil identificar transacción => se usa "desconocido".
        - usuario vacío: transacción inválida => se rechaza.
        - monto 0 o negativo incoherente: invalida balance => se rechaza.
        - tipo desconocido: reglas no definidas => se rechaza.
        - autorizada no boolean: flujo ambiguo => se rechaza.
    
    Captura desde terminal
        - Menú principal: el usuario elige opción “3” mediante prompt-sync.
        - Entrada: string devuelta por prompt(...).trim().
        - Validación: se controla vacío y se compara contra opciones “1–4”.
        - Datos de transacciones: provienen de arrTransacciones().

2. Descripción del proceso
    - Variables creadas y propósito
        - transacciones: arreglo fuente (inmutable).
        - resultados: arreglo nuevo con clasificaciones.
        - validas, sospechosas, invalidas: subconjuntos por clasificación.
        - totalIngresos, totalEgresos: acumuladores numéricos.
        - balanceFinal: diferencia entre ingresos y egresos válidos.

    - Explicación de condicionales
        - Validación inicial (callback):
            - if (!transaccion): evita null/undefined.
            - if (id/usuario/monto/tipo/autorizada/fecha incorrectos): previene inconsistencias.
            - if (monto <= 0 según tipo): invalida por incoherencia.

        - Procesamiento (promesa):
            - if (tipo !== ingreso/egreso): invalida.
            - if (autorizada === true): válida.
            - if (autorizada === false): sospechosa.

        - Acumulación: solo válidas suman a ingresos/egresos.
    
    - Justificación de ciclos
        - for...of: permite usar await dentro del bucle, mantiene orden y claridad.

    - Análisis de mutabilidad e inmutabilidad
        - No se modifica transacciones.
        - Se generan nuevos objetos de resultado.
        - Acumuladores numéricos actualizados de forma controlada.

    - Operadores utilizados y motivo de uso
        - Lógicos y comparaciones (===, !==, <=): reglas de validación.
        - Aritméticos (+, -): cálculo de totales y balance.
        - Optional chaining (t?.id): acceso seguro.
        - Nullish coalescing (?? "desconocido"): respaldo en errores.

    - Justificación del tipo de función
        - validarTransaccionConCallback: síncrona con callback => convierte errores en resultados controlados.
        - procesarTransaccionConPromesa: asincrónica => simula latencia y clasifica.
        - ejecutarAnalisis: async/await => orquesta flujo completo con claridad.

    - Flujo de ejecución (paso a paso)
        1. Menú: usuario elige opción 3.
        2. ejecutarAnalisis() obtiene transacciones.
        3. Itera con for...of.
        4. Valida con callback ⇒ si inválida, se registra y continúa.
        5. Procesa con promesa ⇒ clasifica válida/sospechosa/inválida.
        6. Acumula totales si válida.
        7. Imprime reporte por transacción.
        8. Calcula balance final.
        9. Imprime resumen con listados y totales.    

3. Manejo de errores
    - Escenarios donde el usuario puede fallar
        - Entrada del menú vacía o fuera de rango.
        - Datos inválidos en transacciones: id incorrecto, usuario vacío, monto 0/negativo incoherente, tipo desconocido, autorizada no boolean.

    - Tipo de error que se genera
        - Validación: Error(...) con mensajes explicativos.
        - Procesamiento: Error(...) en tipo no reconocido.
        - Errores inesperados: objeto con clasificacion: "invalida" y motivo.

    - Mensaje claro al usuario
        - Por transacción: 
            - Transacción X: válida/sospechosa/inválida => motivo
        - Menú: 
            - Entrada vacía...
            - Opción inválida...
    
    - Garantía de que el programa NO se bloquea
        - try/catch en cada iteración.
        - Promesas resueltas con objetos de error (no reject).
        - Continuidad: siempre se procesa el resto y el menú sigue activo.

4. Datos de salida
    - Tipo de dato
        - Por transacción: objeto { id, clasificacion, motivo, tipo?, monto? }.
        - Resumen: números (conteos, totales, balance).

    - Presentación al usuario
        - Reporte línea a línea en consola.
        - Listados de válidas, sospechosas e inválidas.
        - Totales y balance final.

    - Validación de funcionamiento correcto
        - Se imprime cada transacción con estado y motivo.
        - Se imprime resumen con conteos y totales.
        - Flujo continúa aun con errores.
        - Inmutabilidad respetada: transacciones originales no se alteran.
    
-----------------------------------------------------------------------------------------------------------------------------------------------------------

DOCUMENTO DE EVALUACIÓN

1. Modelo de datos esperados (por transacción):
    { 
        id: number,             // Identificador único (ej: 1). 
        usuario: string,        // Nombre del usuario (ej: "Carlos").
        monto: number,          // Valor numérico distinto de 0. 
        tipo: string,           // "ingreso" o "egreso". 
        autorizada: boolean,    // true = autorizada, false = no autorizada. 
        fecha: string | Date    // Fecha en formato libre.
    }

    - Ejemplo en código:
        function arrTransacciones() {
            return [
                { id: 1, usuario: "Carlos", monto: 500, tipo: "ingreso", autorizada: true, fecha: "2025-12-01" },   // válida ingreso
                { id: 2, usuario: "Ana", monto: 300, tipo: "egreso", autorizada: true, fecha: new Date() },         // válida egreso
                { id: 3, usuario: "Luis", monto: -200, tipo: "ingreso", autorizada: true, fecha: "2025-12-02" },    // inválida: ingreso negativo
                { id: 4, usuario: "Marta", monto: 150, tipo: "egreso", autorizada: false, fecha: "2025-12-03" },    // sospechosa: egreso no autorizado
                { id: 5, usuario: "", monto: 100, tipo: "ingreso", autorizada: true, fecha: "2025-12-04" },         // inválida: usuario vacío
                { id: 6, usuario: "Pedro", monto: 0, tipo: "egreso", autorizada: true, fecha: "2025-12-05" },       // inválida: monto 0
                { id: 7, usuario: "Ana", monto: 250, tipo: "transfer", autorizada: true, fecha: "2025-12-06" }      // inválida: tipo no reconocido
            ]; 
        }

    - En consola:
        Has elegido la opción 3: Analizar transacciones y control de riesgo.

        Sistema de Transacciones y Control de Riesgo
        Transacción 1: valida => Transacción ingreso autorizada para usuario Sebas.
        Transacción 2: valida => Transacción egreso autorizada para usuario Karol.
        Transacción 3: invalida => Ingreso con monto <= 0 es incoherente.
        Transacción 4: sospechosa => Transacción egreso NO autorizada para usuario Nicolle.
        Transacción 5: invalida => Error: Transacción 5: el usuario debe ser un string no vacío.
        Transacción 6: invalida => Error: Transacción 6: el monto debe ser un número finito distinto de 0.
        Transacción 7: invalida => Tipo no reconocido: transfer

        Resumen
        Total procesadas (number): 7 — incluye válidas, sospechosas e inválidas según reglas aplicadas.
        Válidas (array): 2 — datos correctos y autorizadas.
        Sospechosas (array): 1 — datos correctos pero NO autorizadas.
        Inválidas (array): 4 — errores de estructura o lógica.

        Listado de válidas (array de objetos):
        [
            {
                id: 1,
                clasificacion: 'valida',
                motivo: 'Transacción ingreso autorizada para usuario Sebas.',
                tipo: 'ingreso',
                monto: 500
            },
            {
                id: 2,
                clasificacion: 'valida',
                motivo: 'Transacción egreso autorizada para usuario Karol.',
                tipo: 'egreso',
                monto: 300
            }
        ]

        Listado de sospechosas (array de objetos):
        [
            {
                id: 4,
                clasificacion: 'sospechosa',
                motivo: 'Transacción egreso NO autorizada para usuario Nicolle.',
                tipo: 'egreso',
                monto: 150
            }
        ]

        Listado de inválidas con motivo (array de objetos):
        [
            {
                id: 3,
                clasificacion: 'invalida',
                motivo: 'Ingreso con monto <= 0 es incoherente.'
            },
            {
                id: 5,
                clasificacion: 'invalida',
                motivo: 'Error: Transacción 5: el usuario debe ser un string no vacío.'
            },
            {
                id: 6,
                clasificacion: 'invalida',
                motivo: 'Error: Transacción 6: el monto debe ser un número finito distinto d
            e 0.'
            },
            {
                id: 7,
                clasificacion: 'invalida',
                motivo: 'Tipo no reconocido: transfer'
            }
        ]

        Totales
        Total de ingresos válidos (number): 500 — suma de montos de transacciones válidas con tipo "ingreso".
        Total de egresos válidos (number): 300 — suma de montos de transacciones válidas con tipo "egreso".
        Balance final (number): 200 — ingresos válidos menos egresos válidos.

    2. JUSTIFICACIÓN DE TIPOS
        - id (number):
            - Se exige entero positivo para asegurar identificación única y evitar ambigüedad.
            - Permite trazabilidad clara en reportes y mensajes de error.

        - usuario (string):
            - Representa el titular de la transacción.
            - No puede ser vacío porque perdería sentido contable y dificultaría auditoría.

        - monto (number):
            - Valor numérico finito distinto de 0.
            - Permite aplicar operadores aritméticos para calcular ingresos, egresos y balance.
            - Se valida coherencia con el tipo (ingreso/egreso).

        - tipo (string):
            - Define la naturaleza de la transacción: "ingreso" o "egreso".
            - Extensible: se podrían agregar más tipos en el futuro, pero actualmente solo se aceptan los dos definidos.

        - autorizada (boolean):
            - Control binario claro: true = válida, false = sospechosa.
            - Evita interpretaciones ambiguas sobre el estado de autorización.

        - fecha (string | Date):
            - Permite registrar cuándo ocurrió la transacción.
            - No se valida formato real, pero se exige tipo correcto para consistencia.

    3. ¿QUÉ OCURRE SI NO SE CUMPLEN?
        - id inválido (no number o ≤ 0):
            - Se lanza error en validación.
            - Se captura y se devuelve como transacción inválida con motivo: "id debe ser entero positivo".

        - usuario vacío o no string:
            - Se lanza error en validación.
            - Resultado: transacción inválida con motivo: "usuario debe ser string no vacío".

        - monto incorrecto (0, NaN, no number, incoherente con tipo):
            - Se lanza error o se clasifica como inválida.
            - Resultado: transacción inválida con motivo: "monto debe ser número finito distinto de 0" o "Ingreso/Egreso con monto <= 0 es incoherente".

        - tipo desconocido:
            - Se clasifica como inválida en procesamiento.
            - Resultado: "Tipo no reconocido: transfer".

        - autorizada no boolean:
            - Se lanza error en validación.
            - Resultado: transacción inválida con motivo: "autorizada debe ser boolean".

        - fecha incorrecta (ni string ni Date):
            - Se lanza error en validación.
            - Resultado: transacción inválida con motivo: "fecha debe ser string o Date".

        - Garantía de continuidad:
            - Todos los errores son capturados con try/catch.
            - Se devuelven como objetos inválidos con motivo claro.
            - El programa nunca se bloquea y sigue procesando las demás transacciones.