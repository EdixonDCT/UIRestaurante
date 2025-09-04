import { alertaError, alertaOK } from "../../../Helpers/alertas"; 
// Importa funciones para mostrar alertas de error o éxito

import * as api from "../../../Helpers/api"; 
// Importa funciones para interactuar con la API (GET, PUT, PATCH)

import * as validacion from "../../../Helpers/validaciones"; 
// Importa funciones para validar campos del formulario

export default async () => {
    // SELECCIÓN DE ELEMENTOS DEL FORMULARIO
    const form = document.querySelector(".form"); // Formulario principal
    const montoApertura = document.querySelector(".montoApertura"); // Input monto de apertura
    const montoCierre = document.querySelector(".montoCierre"); // Input monto de cierre

    // ------------------- OBTENER ID DE LA CAJA DESDE EL HASH -------------------
    const hash = location.hash.slice(1); // Elimina "#" del hash
    const [url, id] = hash.split("="); // Divide el hash en URL y ID (ej: "#/Caja/Editar=5")

    // ------------------- OBTENER DATOS ACTUALES DE LA CAJA -------------------
    const valorMonto = await api.get(`caja/${id}`); // Llama a la API para obtener los datos de la caja
    montoApertura.value = valorMonto.montoApertura; // Coloca el monto de apertura en el input
    montoCierre.value = valorMonto.montoCierre; // Coloca el monto de cierre en el input

    // ------------------- VALIDACIONES EN TIEMPO REAL -------------------
    montoApertura.addEventListener("blur", () => { validacion.quitarError(montoApertura.parentElement) });
    // Quita mensaje de error si pierde foco
    montoApertura.addEventListener("keydown", (e) => {
        validacion.validarNumeroKey(e); // Solo permitir números
        validacion.validarLimiteKey(e, 8); // Máximo 8 caracteres
    });

    montoCierre.addEventListener("blur", () => { validacion.quitarError(montoCierre.parentElement) });
    montoCierre.addEventListener("keydown", (e) => {
        validacion.validarNumeroKey(e); // Solo permitir números
        validacion.validarLimiteKey(e, 8); // Máximo 8 caracteres
    });

    // ------------------- ENVÍO DEL FORMULARIO -------------------
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Evita recargar la página

        // VALIDACIONES ANTES DE ENVIAR
        let validarMontoCierre = validacion.validarCampo(montoCierre); // Verifica que no esté vacío
        let validarMontoApertura = validacion.validarCampo(montoApertura); // Verifica que no esté vacío

        if (validarMontoApertura && validarMontoCierre) {
            // OBJETO A ENVIAR A LA API
            const objetoCaja = {
                montoApertura: montoApertura.value,
                montoCierre: montoCierre.value,
                cedulaTrabajador: window.localStorage.getItem("cedula") // Cedula del trabajador logueado
            }

            // LLAMADA A LA API PARA ACTUALIZAR LA CAJA
            const actualizar = await api.put(`caja/${id}`, objetoCaja);

            if (actualizar.Error) {
                alertaError(actualizar.Error); // Mostrar error si existe
                return;
            }

            if (actualizar.Ok) {
                await alertaOK(actualizar.Ok); // Mostrar mensaje de éxito
                window.location.href = '#/Caja'; // Redirigir a la vista de cajas
            }
        }
    })
}
