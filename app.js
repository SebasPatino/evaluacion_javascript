// Punto de entrada del programa.
// Usa prompt-sync para leer la opción del usuario desde la terminal.
// Importa la librería para entrada por consola.
import PromptSync from "prompt-sync";

import { 
    ejecutarOperaciones,
    ejecutarSolicitudes,
    ejecutarAnalisis
 } from "./modulo/index.js"; // Importa la opción 1 (Ejercicio 2) e Importa la opción 2 (Ejercicio 3) e Importa la opción 3 (Ejercicio 1).

// Inicializa 'prompt' para capturar texto de usuario
const prompt = PromptSync();

// mainMenu():
// - Muestra un menú con tres opciones.
// - Lee la elección del usuario.
// - Ejecuta la opción correspondiente con await.
// - Maneja errores sin bloquear el flujo.
// - Sale cuando el usuario elige la opción "3".

// Detalles didácticos:
// - El 'while (!salir)' mantiene el menú hasta que se indique lo contrario.
// - 'try/catch' envuelve lectura y ejecución para mostrar errores comprensibles.
// - 'switch' decide el flujo según la opción elegida.

async function mainMenu() {
    // Booleano de control: cuando sea true, salimos del bucle y termina el programa.
    let salir = false;

    // Bucle principal del menú: se repite hasta que el usuario elige salir.
    while (!salir) {
        console.log('\nMENÚ PRINCIPAL');                                                    // Muestra el título del menú.
        console.log('Opción 1. Procesar operaciones por lotes (Ejercicio 2)');              // Opción 1.
        console.log('Opción 2. Gestionar solicitudes de servicio (Ejercicio 3)');           // Opción 2.
        console.log('Opción 3. Analizar transacciones y control de riesgo (Ejercicio1)');   // Opción 3.
        console.log('Opción 4. Salir');                                                     // Opción 4.

        // try/catch para capturar errores en la lectura o ejecución de las opciones.
        try {
            const opcion = prompt('Seleccione una opción (1-4): ').trim(); // Lee la opción y elimina espacios extra.

            // Valida entrada vacía (usuario presiona Enter sin escribir).
            if (opcion.length === 0) {
                console.log('\nEntrada vacía. Por favor ingrese una opción válida (1, 2 , 3 o 4).');
                // Vuelve al inicio del bucle sin evaluar el switch.
                continue;
            }

            // Evalúa la opción elegida ('1', '2', '3', '4').
            switch (opcion) {
                case '1':
                console.log('\nHas elegido la opción 1: Procesar operaciones por lotes.');
                // Llama a la lógica del ejercicio “operaciones por lotes”
                // Esta función muestra resultados detallados y un resumen final.
                await ejecutarOperaciones();
                break;

            case '2':
                console.log('\nHas elegido la opción 2: Gestionar solicitudes de servicio.');
                // Llama a la lógica del ejercicio “solicitudes de servicio”
                // Esta función muestra resultados detallados y un resumen final.
                await ejecutarSolicitudes();
                break;

            case '3':
                console.log('\nHas elegido la opción 3: Analizar transacciones y control de riesgo.');
                // Llama a la lógica del ejercicio “solicitudes de transacciones y control de riesgo”
                // Esta función muestra resultados detallados y un resumen final.
                await ejecutarAnalisis();
                break;

            case '4':
                console.log('\nHas elegido la opción 3: Saliendo del sistema... ¡Vuelva pronto!');
                // Cambia la validación para salir del bucle y terminar el programa.
                salir = true;
                break;

            // Cualquier otra entrada que no sea '1', '2', '3' o '4'.
            default:
                console.log('\nOpción inválida. Por favor ingrese las opciones 1, 2, 3 o 4.');
            }
        // Captura errores en la interacción o ejecución.
        } catch (err) {
            // Mostramos el error y continuamos, demostrando que el programa no se bloquea.
            console.error('Error en el menú: ', err.message);
            console.log('Intentalo nuevamente, estamos trabajando en ello.');
        }
    }
}

// Arranca el programa mostrando el menú.
mainMenu();