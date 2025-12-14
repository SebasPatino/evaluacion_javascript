// Modulo responsable de:
// - Validación inicial con callbacks.
// - Procesamiento asincrónico con promesas.
// - Orquestación con async/await.
// - Reporte claro y robusto en consola.

// En primer lugar vamos a validarSolicitudConCallback(solicitud, callback)
// - Propósito: validar una solicitud de servicio usando el patrón de callbacks.
// - Entrada:
//   - solicitud: objeto con los campos mínimos { id, cliente, tipoServicio, prioridad, activo, fechaSolicitud }.
//   - callback: función a la que se le entrega el resultado de la validación (aquí devolvemos errores controlados como resultado).
// - Salida (vía callback):
//   - Si la solicitud es válida y está activa: callback(null, solicitud) => continúa el flujo con la solicitud validada.
//   - Si hay reglas incumplidas o la solicitud está inactiva: callback(null, { id, estado: "rechazada", motivo }) => error controlado y flujo continúa.
// - Diseño:
//   - try/catch envuelve toda la validación para convertir cualquier excepción en un objeto de “rechazada” sin bloquear el programa.
//   - No se muta el objeto de entrada (inmutabilidad).
export function validarSolicitudConCallback(solicitud, callback) {
  try {
    // 1) Existencia del objeto:
    //    - Evita trabajar con null/undefined, que romperían el acceso a las propiedades.
    //    - Si encuentra una discrepancia, se lanza un Error con un mensaje claro.
    if (!solicitud) {
      throw new Error("La solicitud se encuentra vacía o indefinida.");
    }

    // 2) Validación del id:
    //    - Debe ser de tipo number para asegurar identificación consistente y operaciones numéricas si hicieran falta.
    if (typeof solicitud.id !== "number") {
      throw new Error(`Solicitud inválida: id "${solicitud.id}" no es numérico.`);
    }

    // 3) Validación del cliente:
    //    - Debe ser string y no estar vacío (trim elimina espacios al inicio/fin).
    //    - Garantiza trazabilidad y mensajes personalizados con el nombre del cliente.
    if (typeof solicitud.cliente !== "string" || solicitud.cliente.trim().length === 0) {
      throw new Error(`Solicitud ${solicitud.id}: el cliente debe ser un string y no debe estar vacío.`);
    }

    // 4) Validación del tipo de servicio:
    //    - Debe ser string.
    //    - La validación de si es “instalacion”, “mantenimiento”, “soporte” se hará en el procesamiento;
    //      aquí verificamos el tipo de dato y dejamos el detalle de negocio para otra línea de código.
    if (typeof solicitud.tipoServicio !== "string") {
      throw new Error(`Solicitud ${solicitud.id}: el tipo de servicio debe ser un string.`);
    }

    // 5) Validación de la prioridad:
    //    - Debe ser número y estar dentro del rango definido (1–5).
    //    - El rango prioriza la urgencia; evita prioridades inválidas que afecten decisiones.
    if (typeof solicitud.prioridad !== "number" || solicitud.prioridad < 1 || solicitud.prioridad > 5) {
      throw new Error(`Solicitud ${solicitud.id}: la prioridad debe ser un número entre 1 y 5.`);
    }

    // 6) Validación de activo:
    //    - Debe ser boolean para tomar decisiones claras (procesar o no)
    if (typeof solicitud.activo !== "boolean") {
      throw new Error(`Solicitud ${solicitud.id}: el campo 'activo' debe ser booleano.`);
    }
  
    // 7) Validación de fecha:
    //    - Aceptamos string (para formatos tipo ISO) o Date (para objetos fecha).
    //    - No imponemos formato aquí; corroboramos el tipo para evitar errores posteriores.
    if (!(typeof solicitud.fechaSolicitud === "string" || solicitud.fechaSolicitud instanceof Date)) {
      throw new Error(`Solicitud ${solicitud.id}: la fecha debe ser string o Date.`);
    }

    // 8) Solicitud inactiva
    //    - Si no está activa, devolvemos rechazo inmediato vía callback.
    //    - No lanzamos Error (primer argumento del callback, en este caso es null): esto NO es una falla técnica, es una decisión de negocio. 
    if (!solicitud.activo) {
      return callback(null, {
        id: solicitud.id,
        estado: "rechazada",
        motivo: "La solicitud está inactiva."
      });
    }

    // 9) Éxito en validación:
    //    - Si todo lo anterior se cumple, retornamos la solicitud validada.
    //    - Se usa el estilo err:'null' en el primer parámetro indica que no hubo error técnico.
    return callback(null, solicitud);
  
  } catch (err) {
    // 10) Manejo de errores (try/catch):
    //     - Cualquier excepción de validación se transforma en un resultado “rechazada”.
    //     - Se garantiza continuidad del flujo (no se bloquea el sistema).
    //     - id: solicitud?.id ?? "desconocido" protegen el acceso a 'id' en casos externos.
    // Combinación: op?.id ?? "desconocido"
    // Primero intenta obtener op.id de forma segura.
    // Si op no existe o id es undefined/null, entonces devuelve "desconocido".
    // Así evitamos errores y siempre tenemos un valor válido para id.
    return callback(null, {
      id: solicitud?.id ?? "desconocido",
      estado: "rechazada",
      motivo: `Error: ${err.message}`
    });
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function tiempoAleatorio() {
  const min = 300;
  const max = 2000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function procesarSolicitudConPromesa(solicitud) {
  return new Promise(async (resolve) => {
    try {
      // Simulamos tiempo de espera como si dependiera de un servicio externo
      await delay(tiempoAleatorio());

      switch (solicitud.tipoServicio.toLowerCase()) {
        case "instalacion":
        case "mantenimiento":
        case "soporte":
          // Aprobada si pasa validaciones
          resolve({
            id: solicitud.id,
            estado: "aprobada",
            motivo: `Solicitud de ${solicitud.tipoServicio} aprobada para cliente ${solicitud.cliente}.`
          });
          break;
        default:
          // Tipo no reconocido
          resolve({
            id: solicitud.id,
            estado: "rechazada",
            motivo: `Tipo de servicio no reconocido: ${solicitud.tipoServicio}`
          });
      }
    } catch (err) {
      resolve({
        id: solicitud?.id ?? "desconocido",
        estado: "rechazada",
        motivo: `Error: ${err.message}`
      });
    }
  });
}

export async function ejecutarSolicitudes() {
  console.log("\nGestionando solicitudes de servicio (Ejercicio 3)");

  const solicitudes = arrSolicitudes(); // Datos de prueba
  const resultados = [];

  for (const solicitud of solicitudes) {
    try {
      // Validación con callback
      const validada = await new Promise(resolve => {
        validarSolicitudConCallback(solicitud, (err, res) => resolve(res));
      });

      // Si la validación devolvió directamente un resultado rechazado
      if (validada.estado === "rechazada") {
        resultados.push(validada);
        console.log(`Solicitud ${validada.id}: ${validada.estado} => ${validada.motivo}`);
        continue;
      }

      // Procesamiento con promesa
      const resultado = await procesarSolicitudConPromesa(validada);
      resultados.push(resultado);

      console.log(`Solicitud ${resultado.id}: ${resultado.estado} => ${resultado.motivo}`);

    } catch (err) {
      const fallo = {
        id: solicitud?.id ?? "desconocido",
        estado: "rechazada",
        motivo: `Error inesperado: ${err.message}`
      };
      resultados.push(fallo);
      console.log(`Solicitud ${fallo.id}: ${fallo.estado} => ${fallo.motivo}`);
    }
  }

  // Resumen final
  const aprobadas = resultados.filter(r => r.estado === "aprobada").length;
  const rechazadas = resultados.filter(r => r.estado === "rechazada").length;

  console.log("\nResumen");
  console.log(`Solicitudes procesadas: ${resultados.length}`);
  console.log(`Solicitudes aprobadas: ${aprobadas}`);
  console.log(`Solicitudes rechazadas: ${rechazadas}`);
}

export function arrSolicitudes() {
  return [
    { id: 1, cliente: "Carlos", tipoServicio: "instalacion", prioridad: 3, activo: true, fechaSolicitud: "2025-12-01" },
    { id: 2, cliente: "Ana", tipoServicio: "mantenimiento", prioridad: 5, activo: true, fechaSolicitud: new Date() },
    { id: 3, cliente: "", tipoServicio: "soporte", prioridad: 2, activo: true, fechaSolicitud: "2025-12-02" },              // error: cliente vacío
    { id: 4, cliente: "Luis", tipoServicio: "auditoria", prioridad: 4, activo: true, fechaSolicitud: "2025-12-03" },        // tipo no reconocido
    { id: 5, cliente: "Marta", tipoServicio: "soporte", prioridad: 7, activo: true, fechaSolicitud: "2025-12-04" },         // prioridad fuera de rango
    { id: 6, cliente: "Pedro", tipoServicio: "instalacion", prioridad: 1, activo: false, fechaSolicitud: "2025-12-05" }     // inactiva
  ];
}