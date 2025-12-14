// solicitudes.js
// Módulo placeholder para el Ejercicio 3.
// Objetivo: que el menú tenga una opción 2 funcional,
// aunque la lógica real de "gestionar solicitudes" aún no esté implementada.

export async function ejecutarSolicitudes() {
  // Mensajes explicativos para el aprendiz:
  // - Aquí iremos agregando validaciones, procesamiento asíncrono y reportes,
  //   tal como hicimos en operaciones.js, pero adaptado al dominio de "solicitudes de servicio".
  // - El uso de async/await nos permite, desde ya, simular demoras y manejar errores.

  console.log("\n=== Gestionando solicitudes de servicio (Ejercicio 3) ===");

  try {
    // Simulación de tiempo de carga para dar sensación de proceso
    await new Promise(resolve => setTimeout(resolve, 800));

    // Reporte informativo
    console.log("Este es un placeholder. Aquí iría la validación y el procesamiento real.");
    console.log("Pronto se implementarán reglas claras, asincronía y reportes, igual de didácticos.");
  } catch (err) {
    // Manejo de errores: aunque no haya lógica real, demostramos cómo informar sin bloquear el flujo
    console.error("Error gestionando solicitudes: ", err.message);
  }
}

