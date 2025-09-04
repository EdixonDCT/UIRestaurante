import { alertaError, alertaOK } from "../../../Helpers/alertas"; 
// Importa funciones para mostrar alertas de error o éxito

import * as api from "../../../Helpers/api"; 
// Importa funciones para interactuar con la API (GET, PATCH, POST, etc.)

import * as validacion from "../../../Helpers/validaciones"; 
// Importa funciones para validar campos del formulario

export default async() => {
    // SELECCIÓN DE ELEMENTOS DEL FORMULARIO
    const form = document.querySelector(".form"); // Formulario principal
    const montoApertura = document.querySelector(".montoApertura"); // Input del monto de apertura

    // ------------------- OBTENER ID DE LA CAJA DESDE EL HASH -------------------
    const hash = location.hash.slice(1); // Elimina "#" del hash
    const [url, id] = hash.split("="); // Divide el hash en URL y ID (ej: "#/Caja/EditarApertura=5")

    // ------------------- OBTENER EL MONTO ACTUAL -------------------
    const valorMonto = await api.get(`caja/${id}`); // Llama a la API para obtener datos de la caja
    montoApertura.value = valorMonto.montoApertura; // Coloca el valor de apertura en el input

    // ------------------- VALIDACIONES EN TIEMPO REAL -------------------
    montoApertura.addEventListener("blur", () => { validacion.quitarError(montoApertura.parentElement) }); 
    // Quita mensaje de error si pierde foco
    montoApertura.addEventListener("keydown", (e) => {
        validacion.validarNumeroKey(e); // Solo permite números
        validacion.validarLimiteKey(e, 8); // Máximo 8 caracteres
    });

    // ------------------- ENVÍO DEL FORMULARIO -------------------
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Evita recargar la página

        // VALIDACIÓN DEL CAMPO MONTO APERTURA
        let validarMontoApertura = validacion.validarCampo(montoApertura); // Verifica que no esté vacío

        if (validarMontoApertura) {
            // OBJETO A ENVIAR A LA API
            const objetoCaja = { montoApertura: montoApertura.value };

            // LLAMADA A LA API PARA ACTUALIZAR EL MONTO DE APERTURA
            const parchear = await api.patch(`caja/apertura/${id}`, objetoCaja);

            if (parchear.Error) {
                alertaError(parchear.Error); // Mostrar error si existe
                return;
            }

            if (parchear.Ok) {
                await alertaOK(parchear.Ok); // Mostrar mensaje de éxito
                window.location.href = '#/Caja'; // Redirigir a la vista de cajas
            }
        }
    })
}
