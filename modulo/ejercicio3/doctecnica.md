DOCUMENTACIÓN TÉCNICA COMPLETA

1. Datos de entrada
    - Definición y tipos esperados
        - Solicitud (objeto):
            - id: number. Identificador único de la solicitud.
            - cliente: string. Nombre del cliente, no de estar vacío.
            - tipoServicio: string. Regla de negocio: "instalacion", "mantenimiento", "soporte".
            - prioridad: number. Rango válido 1–5.
            - activo: boolean. Controla si la solicitud será procesada.
            - fechaSolicitud: string (ej. formato ISO) o Date.

    - Validaciones realizadas (en validarSolicitudConCallback)
        - Existencia de la solicitud: if (!solicitud) => Error si es null/undefined.
        - Tipo de id: debe ser number.
        - Tipo de cliente: debe ser string no vacío.
        - Tipo de tipoServicio: debe ser string.
        - Tipo y rango de prioridad: number entre 1 y 5.
        - Tipo de activo: debe ser boolean.
        - Tipo de fechaSolicitud: string o Date.
        - Activo = false => rechazo inmediato con motivo claro.

    - Riesgos si el dato es incorrecto
        - id inválido: se usa "desconocido" como respaldo.
        - cliente vacío: rechazo por falta de trazabilidad.
        - tipoServicio no reconocido: rechazo en procesamiento.
        - prioridad fuera de rango: rechazo en validación.
        - activo no boolean: rechazo por ambigüedad.
        - fechaSolicitud inválida: rechazo por inconsistencia temporal.

    - Captura desde terminal
        - En este ejercicio no hay menú interactivo; los datos provienen de arrSolicitudes().

2. Descripción del proceso
    - Variables creadas y propósito
        - solicitudes: arreglo devuelto por arrSolicitudes().
        - resultados: arreglo nuevo que acumula salidas por solicitud.
        - resultado: objeto { id, estado, motivo } retornado por procesarSolicitudConPromesa.

    - Explicación de condicionales
        - Validación inicial (en validarSolicitudConCallback):
            - if (!solicitud): evita procesar null/undefined.
            - if (tipo incorrecto de id/cliente/tipoServicio/prioridad/activo/fechaSolicitud): previene inconsistencias.
            - if (!solicitud.activo): rechazo temprano con motivo claro.

        - Procesamiento (en procesarSolicitudConPromesa):
            - switch (tipoServicio.toLowerCase()): reconoce tipos válidos.
            - default: rechazo por tipo no reconocido.

    - Justificación de ciclos
        - for...of en ejecutarSolicitudes: permite await dentro del cuerpo, manteniendo flujo secuencial y legible.

    - Análisis de mutabilidad e inmutabilidad
        - No se modifica solicitudes ni los objetos originales.
        - "resultados" es un arreglo nuevo: separa claramente entrada y salida.
        - Funciones puras: validación y procesamiento generan nuevos objetos resultado.

    - Operadores utilizados y motivo de uso
        - Optional chaining (solicitud?.id): acceso seguro a id.
        - Nullish coalescing (?? "desconocido"): valor de respaldo cuando falta id.
        - .filter: conteo de aprobadas/rechazadas.
        - .toLowerCase(): normalización de tipoServicio.

    - Justificación del tipo de función
        - validarSolicitudConCallback: síncrona, con callback para simular estilo clásico.
        - procesarSolicitudConPromesa: asíncrona, devuelve Promesa.
        - ejecutarSolicitudes: asíncrona, orquestadora con async/await.
        - delay y tiempoAleatorio: simulan asincronía externa.

    - Flujo de ejecución (paso a paso)
        1. Inicio del lote: ejecutarSolicitudes() muestra encabezado y obtiene solicitudes.
        2. Recorrido: por cada solicitud:
            - Se valida con validarSolicitudConCallback.
            - Si estado = "rechazada", se registra y continúa.
            - Si válida, se procesa con procesarSolicitudConPromesa.
        3. Se simula tiempo variable con await delay(tiempoAleatorio()).
        4. Se evalúa tipo de servicio con switch.
        5. Se construye objeto { id, estado, motivo }.
        6. Se imprime reporte en consola.
        7. Resumen: al terminar el ciclo:
            - Se cuentan aprobadas y rechazadas con .filter(...).length.
            - Se imprime resumen final.

3. Manejo de errores
    - Escenarios donde el usuario puede fallar
        - Datos inválidos en solicitudes:
        - id no numérico.
        - cliente vacío.
        - tipoServicio no string o no reconocido.
        - prioridad fuera de rango.
        - activo no boolean.
        - fechaSolicitud inválida.
        - Errores internos en procesamiento: excepciones inesperadas.

    - Tipo de error que se genera
        - Validación: throw new Error(...) con mensajes explicativos.
        - Procesamiento: rechazo controlado en default del switch.
        - Errores inesperados: capturados en catch y convertidos en resultado rechazado.

    - Mensaje claro al usuario
        - Por solicitud: “Solicitud X: aprobada/rechazada => motivo”.
        - Motivos: “La solicitud está inactiva.”, “Tipo de servicio no reconocido: ...”, “Error: prioridad fuera de rango”, etc.

    - Garantía de que el programa no se bloquea
        - try/catch en validación y procesamiento: convierte excepciones en resultados “rechazados”.
        - Acceso seguro a id: solicitud?.id ?? "desconocido" evita excepciones.

4. Datos de salida
    - Tipo de dato
        - Por solicitud: objeto { id: number|"desconocido", estado: "aprobada"|"rechazada", motivo: string }.
        - Resumen: dos números (aprobadas, rechazadas), impresos en terminal.

    - Presentación al usuario
        - Reporte línea a línea: “Solicitud {id}: {estado} => {motivo}”.
        - Resumen final: “Solicitudes procesadas: x”, “Solicitudes aprobadas: y”, “Solicitudes rechazadas: z”.

    - Validación de funcionamiento correcto
        - Evidencia en consola:
            - Se imprime cada solicitud con su estado y motivo.
            - Se imprime el resumen final con conteos precisos.

        - Continuidad del flujo:
            - Aunque existan errores de validación o tipos desconocidos, el programa sigue procesando las demás solicitudes.

        - Inmutabilidad respetada:
            - solicitudes no cambia; resultados es un arreglo nuevo.

        - Reglas aplicadas:
            - Rechazos por solicitudes inactivas, tipos no reconocidos, datos inválidos aparecen claramente reflejados.

____________________________________________________________________________________________________________________________________________

DOCUMENTO DE EVALUACIÓN

1. Modelo de datos esperados (por solicitud):

    { 
    id: number, // Identificador único de la solicitud (ej: 1).
    cliente: string, // Nombre del cliente (ej: "Carlos").
    tipoServicio: string, // Tipo de servicio ("instalacion", "mantenimiento", "soporte").
    prioridad: number, // Número entre 1 y 5.
    activo: boolean, // Si es true, la solicitud se procesa; si es false, se rechaza.
    fechaSolicitud: string|Date // Fecha de la solicitud.
    }

    - En el código (arrSolicitudes()):
        return [
            { id: 1, cliente: "Carlos", tipoServicio: "instalacion", prioridad: 3, activo: true, fechaSolicitud: "2025-12-01" },  // Caso válido: instalación, prioridad media, activo.
            { id: 2, cliente: "Ana", tipoServicio: "mantenimiento", prioridad: 5, activo: true, fechaSolicitud: new Date() },     // Caso válido: mantenimiento, máxima prioridad, activo. new Date se usa para crear un objeto que representa la fecha y hora actuales
            { id: 3, cliente: "", tipoServicio: "soporte", prioridad: 2, activo: true, fechaSolicitud: "2025-12-02" },            // Error: cliente vacío (será rechazado en validación).
            { id: 4, cliente: "Luis", tipoServicio: "auditoria", prioridad: 4, activo: true, fechaSolicitud: "2025-12-03" },      // Tipo no reconocido (será rechazado en procesamiento).
            { id: 5, cliente: "Marta", tipoServicio: "soporte", prioridad: 7, activo: true, fechaSolicitud: "2025-12-04" },       // Prioridad fuera de rango (será rechazado en validación).
            { id: 6, cliente: "Pedro", tipoServicio: "instalacion", prioridad: 1, activo: false, fechaSolicitud: "2025-12-05" }   // Inactiva (rechazo inmediato por decisión de negocio).
        ];

    - En consola:
        Has elegido la opción 2: Gestionar solicitudes de servicio.

        Gestionando solicitudes de servicio (Ejercicio 3)
        Solicitud 1: aprobada => Solicitud de instalacion aprobada para cliente Carlos.
        Solicitud 2: aprobada => Solicitud de mantenimiento aprobada para cliente Ana.
        Solicitud 3: rechazada => Error: Solicitud 3: el cliente debe ser un string y no
        debe estar vacío.
        Solicitud 4: rechazada => Tipo de servicio no reconocido: auditoria
        Solicitud 5: rechazada => Error: Solicitud 5: la prioridad debe ser un número en
        tre 1 y 5.
        Solicitud 6: rechazada => La solicitud está inactiva.

        Resumen
        Solicitudes procesadas: 6
        Solicitudes aprobadas: 2
        Solicitudes rechazadas: 4