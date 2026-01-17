// Módulo responsable de: 
// - Validación inicial con callbacks. 
// - Procesamiento asincrónico con promesas. 
// - Orquestación con async/await.
// - Reporte claro y robusto en consola.

// validarTransaccionConCallback(transaccion, callback) 
// - Propósito: validar estructura y reglas mínimas de una transacción usando callbacks. 
// - Entrada: 
//    - transaccion: { id, usuario, monto, tipo, autorizada, fecha }. 
//    - callback: (err, resultado) => resultado controlado (nunca lanzamos errores hacia fuera). 
// - Salida (vía callback): 
//    - Si la transacción es estructuralmente válida: callback(null, transaccion). 
//    - Si hay reglas incumplidas: callback(null, { id, clasificacion: "invalida", motivo }). 
// - Diseño:
//    - try/catch convierte excepciones en resultados controlados. 
//    - No se muta el objeto de entrada (inmutabilidad).
export function validarTransaccionConCallback(transaccion, callback) {
    try {
        // 1) Existencia del objeto
        if (!transaccion) { throw new Error("La transacción está vacía o indefinida.");
        }

        // 2) id entero positivo
        if (typeof transaccion.id !== "number" || !Number.isInteger(transaccion.id) || transaccion.id <= 0) { throw new Error(`Transacción inválida: id "${transaccion.id}" debe ser entero positivo.`); 
        }

        // 3) usuario string no vacío
        if (typeof transaccion.usuario !== "string" || transaccion.usuario.trim().length === 0) { throw new Error(`Transacción ${transaccion.id}: el usuario debe ser un string no vacío.`); 
        }

        // 4) monto número finito, no NaN, no cero 
        // Justificación: un monto 0 no produce efecto y se considera inconsistente para registro financiero.
        if (typeof transaccion.monto !== "number" || !Number.isFinite(transaccion.monto) || transaccion.monto === 0) { throw new Error(`Transacción ${transaccion.id}: el monto debe ser un número finito distinto de 0.`); 
        }

        // 5) tipo string (detalle de negocio se valida en procesamiento)
        if (typeof transaccion.tipo !== "string") { throw new Error(`Transacción ${transaccion.id}: el tipo debe ser un string.`); 
        }

        // 6) autorizada boolean
        if (typeof transaccion.autorizada !== "boolean") { throw new Error(`Transacción ${transaccion.id}: el campo 'autorizada' debe ser booleano.`); 
        }

        // 7) fecha string o Date
        if (!(typeof transaccion.fecha === "string" || transaccion.fecha instanceof Date)) { throw new Error(`Transacción ${transaccion.id}: la fecha debe ser string o Date.`); 
        }

        // 8) Reglas de coherencia de monto según tipo: 
        // - ingreso => monto > 0 (un ingreso negativo sería una contradicción) 
        // - egreso => monto > 0 (un egreso negativo invierte el significado) 
        // Justificación: aunque el enunciado permite que "monto" sea negativo, 
        // aquí se clasifica como inválido por conflicto semántico y para evitar ambigüedad contable.
        const tipoLower = String(transaccion.tipo).toLowerCase();
        if (tipoLower === "ingreso" && transaccion.monto <= 0) {
            return callback(null, {
                id: transaccion.id, 
                clasificacion: "invalida", 
                motivo: "Ingreso con monto <= 0 es incoherente."
            });
        }
        
        if (tipoLower === "egreso" && transaccion.monto <= 0) {
            return callback(null, {
                id: transaccion.id,
                clasificacion: "invalida",
                motivo: "Egreso con monto <= 0 es incoherente."
            });
        }

        // 9) Éxito en validación estructural 
        return callback(null, transaccion);
        
    } catch (err) {
        // 10) Manejo de errores de validación (controlados)
        return callback(null, {
            id: transaccion?.id ?? "desconocido", 
            clasificacion: "invalida", 
            motivo: `Error: ${err.message}`
        });
    }
}

// delay(ms) 
// - Propósito: simular latencia de servicios externos.
// - Diseño: setTimeout envuelto en Promesa para integrar con async/await. 
function delay(ms) { 
    return new Promise(resolve => setTimeout(resolve, ms));
}

// tiempoAleatorio()
// - Propósito: generar latencia aleatoria entre 300 y 2000 ms.
function tiempoAleatorio() { 
    const min = 300; 
    const max = 2000; 
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}

// procesarTransaccionConPromesa(transaccion) 
// - Propósito: aplicar reglas de negocio y clasificación usando Promesas. 
// - Reglas: 
//    - tipo "ingreso" o "egreso" => datos correctos. 
//    - autorizada true => "valida". 
//    - autorizada false => "sospechosa".
//    - tipo no reconocido => "invalida".
export function procesarTransaccionConPromesa(transaccion) { 
    return new Promise(async (resolve) => { 
        try { 
            await delay(tiempoAleatorio()); // Simula dependencia externa

            const tipoLower = String(transaccion.tipo).toLowerCase();
            if (tipoLower !== "ingreso" && tipoLower !== "egreso") {
                return resolve({
                    id: transaccion.id, 
                    clasificacion: "invalida", 
                    motivo: `Tipo no reconocido: ${transaccion.tipo}`
                }); 
            }

            if (transaccion.autorizada === true) {
                return resolve({
                    id: transaccion.id, 
                    clasificacion: "valida", 
                    motivo: `Transacción ${tipoLower} autorizada para usuario ${transaccion.usuario}.`, 
                    tipo: tipoLower, 
                    monto: transaccion.monto
                }); 
            }

            // Datos correctos pero no autorizada => sospechosa 
            return resolve({
                id: transaccion.id, 
                clasificacion: "sospechosa", 
                motivo: `Transacción ${tipoLower} NO autorizada para usuario ${transaccion.usuario}.`, 
                tipo: tipoLower, 
                monto: transaccion.monto
            });

        } catch (err) { 
            // Rechazo controlado (no lanzamos reject)
            resolve({ 
                id: transaccion?.id ?? "desconocido", 
                clasificacion: "invalida", 
                motivo: `Error de procesamiento: ${err.message}` 
            });

        } 
    }); 
}

// Datos de prueba
export function arrTransacciones() { 
    return [ 
        { id: 1, usuario: "Sebas", monto: 500, tipo: "ingreso", autorizada: true, fecha: "2025-12-01" },    // válida ingreso 
        { id: 2, usuario: "Karol", monto: 300, tipo: "egreso", autorizada: true, fecha: new Date() },          // válida egreso 
        { id: 3, usuario: "Juan", monto: -200, tipo: "ingreso", autorizada: true, fecha: "2025-12-02" },     // inválida: ingreso negativo 
        { id: 4, usuario: "Nicolle", monto: 150, tipo: "egreso", autorizada: false, fecha: "2025-12-03" },     // sospechosa: egreso no autorizado 
        { id: 5, usuario: "", monto: 100, tipo: "ingreso", autorizada: true, fecha: "2025-12-04" },          // inválida: usuario vacío 
        { id: 6, usuario: "Santi", monto: 0, tipo: "egreso", autorizada: true, fecha: "2025-12-05" },        // inválida: monto 0 
        { id: 7, usuario: "David", monto: 250, tipo: "transfer",autorizada: true, fecha: "2025-12-06" }        // inválida: tipo no reconocido 
    ]; 
}

// Como ultimo paso se ejecuta el ejercicio 1
export async function ejecutarAnalisis() { 
    console.log("\nSistema de Transacciones y Control de Riesgo");

    const transacciones = arrTransacciones(); 
    const resultados = [];      // resultados por transacción (valida/sospechosa/invalida) 
    const validas = [];         // subconjunto clasificadas como "valida" 
    const sospechosas = [];     // subconjunto clasificadas como "sospechosa" 
    const invalidas = [];       // subconjunto clasificadas como "invalida"

    // Acumuladores
    let totalIngresos = 0;      // suma de ingresos válidos 
    let totalEgresos = 0;       // suma de egresos válidos

    for (const t of transacciones) {
        try {
            // Validación con callback (envuelta en Promesa para await) 
            const validada = await new Promise(resolve => { 
                validarTransaccionConCallback(t, (err, res) => resolve(res)); 
            });
        
            // Si salió inválida en validación, reportar y continuar 
            if (validada.clasificacion === "invalida") { 
                invalidas.push(validada); 
                resultados.push(validada); 
                console.log(`Transacción ${validada.id}: ${validada.clasificacion} => ${validada.motivo}`); 
                continue; 
            }

            // Procesamiento con Promesa 
            const procesada = await procesarTransaccionConPromesa(validada); 
            resultados.push(procesada);

            // Clasificación y acumulación de totales 
            if (procesada.clasificacion === "valida") { 
                validas.push(procesada);
                if (procesada.tipo === "ingreso") {
                    totalIngresos += procesada.monto; // monto > 0 garantizado por validación
                } else if (procesada.tipo === "egreso") {
                    totalEgresos += procesada.monto; // monto > 0 garantizado por validación
                }
            } else if (procesada.clasificacion === "sospechosa") { 
                sospechosas.push(procesada); 
            } else { 
                invalidas.push(procesada); 
            }

            // Reporte por transacción 
            const msgBase = `Transacción ${procesada.id}: ${procesada.clasificacion} => ${procesada.motivo}`; 
            console.log(msgBase);

        } catch (err) { 
            // Error inesperado (estandarizado) 
            const fallo = {
                id: t?.id ?? "desconocido", 
                clasificacion: "invalida", 
                motivo: `Error inesperado: ${err.message}`
            };
            invalidas.push(fallo); 
            resultados.push(fallo); 
            console.log(`Transacción ${fallo.id}: ${fallo.clasificacion} => ${fallo.motivo}`); 
        } 
    }

    // Cálculo de balance final: ingresos - egresos 
    const balanceFinal = totalIngresos - totalEgresos;

    // Resumen claro y ordenado 
    console.log("\nResumen"); 
    console.log(`Total procesadas (number): ${resultados.length} — incluye válidas, sospechosas e inválidas según reglas aplicadas.`); 
    console.log(`Válidas (array): ${validas.length} — datos correctos y autorizadas.`); 
    console.log(`Sospechosas (array): ${sospechosas.length} — datos correctos pero NO autorizadas.`); 
    console.log(`Inválidas (array): ${invalidas.length} — errores de estructura o lógica.`);

    // Listados 
    console.log("\nListado de válidas (array de objetos):"); 
    console.log(validas);

    console.log("\nListado de sospechosas (array de objetos):"); 
    console.log(sospechosas); 
        
    console.log("\nListado de inválidas con motivo (array de objetos):"); 
    console.log(invalidas);

    // Totales y balance 
    console.log("\nTotales"); 
    console.log(`Total de ingresos válidos (number): ${totalIngresos} — suma de montos de transacciones válidas con tipo "ingreso".`); 
    console.log(`Total de egresos válidos (number): ${totalEgresos} — suma de montos de transacciones válidas con tipo "egreso".`); 
    console.log(`Balance final (number): ${balanceFinal} — ingresos válidos menos egresos válidos.`); 
}