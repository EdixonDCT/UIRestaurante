import { alertaError, alertaOK } from "../../../Helpers/alertas"; 
// Importa funciones para mostrar alertas de error o éxito

import * as api from "../../../Helpers/api"; 
// Importa funciones para hacer llamadas a la API (GET, POST, PATCH)

import * as validacion from "../../../Helpers/validaciones"; 
// Importa funciones para validar campos del formulario

export default () => {
    // SELECCIÓN DE ELEMENTOS DEL FORMULARIO
    const form = document.querySelector(".form"); // Formulario principal
    const montoApertura = document.querySelector(".montoApertura"); // Input del monto de apertura de caja

    // ------------------- VALIDACIONES EN TIEMPO REAL -------------------
    montoApertura.addEventListener("blur", () => { 
        validacion.quitarError(montoApertura.parentElement) 
    }); 
    // Quita el mensaje de error si el input pierde foco

    montoApertura.addEventListener("keydown", (e) => {
        validacion.validarNumeroKey(e); // Solo permitir números
        validacion.validarLimiteKey(e, 8); // Limitar a máximo 8 caracteres
    });

    // ------------------- ENVÍO DEL FORMULARIO -------------------
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Evita que la página se recargue al enviar

        let validarMontoApertura = validacion.validarCampo(montoApertura); 
        // Verifica que el campo no esté vacío

        if (validarMontoApertura) {
            // Crear objeto con datos para enviar a la API
            const objetoCaja = {
                cedulaTrabajador: window.localStorage.getItem("cedula"), 
                // Obtiene la cédula del trabajador desde localStorage
                montoApertura: montoApertura.value // Valor ingresado en el input
            }

            // Enviar datos a la API para crear la caja
            const creado = await api.post("caja", objetoCaja);

            if (creado.Error) {
                alertaError(creado.Error); // Mostrar error si la API retorna uno
                return;
            }

            if (creado.Ok) {
                await alertaOK(creado.Ok); // Mostrar mensaje de éxito
                window.location.href = '#/Caja'; // Redirigir a la vista de cajas
            }
        }
    })
}
