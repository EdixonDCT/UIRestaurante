import { alertaError, alertaOK } from "../../../Helpers/alertas"; 
// Importa funciones para mostrar alertas de error o éxito

import * as api from "../../../Helpers/api"; 
// Importa funciones para hacer llamadas a la API (GET, POST, PATCH)

import * as validacion from "../../../Helpers/validaciones"; 
// Importa funciones para validar campos del formulario

export default () => {
    // SELECCIÓN DE ELEMENTOS DEL FORMULARIO
    const form = document.querySelector(".form"); // Formulario principal
    const montoCierre = document.querySelector(".montoCierre"); // Input del monto de cierre de caja

    // ------------------- OBTENER ID DE LA CAJA DESDE EL HASH -------------------
    const hash = location.hash.slice(1); // Elimina "#" del hash
    const [url, id] = hash.split("="); // Divide el hash en URL y ID (ej: "#/Caja/Cierre=5")

    // ------------------- VALIDACIONES EN TIEMPO REAL -------------------
    montoCierre.addEventListener("blur", () => { 
        validacion.quitarError(montoCierre.parentElement) 
    }); 
    // Quita mensaje de error si pierde foco

    montoCierre.addEventListener("keydown", (e) => {
        validacion.validarNumeroKey(e); // Solo permitir números
        validacion.validarLimiteKey(e, 8); // Limitar a máximo 8 caracteres
    });

    // ------------------- ENVÍO DEL FORMULARIO -------------------
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Evita recargar la página

        let validarMontoCierre = validacion.validarCampo(montoCierre); 
        // Verifica que el campo no esté vacío

        if (validarMontoCierre) {
            // Crear objeto con datos para enviar a la API
          const objetoCaja = {
            cedulaTrabajador: window.localStorage.getItem("cedula"),
            montoCierre: montoCierre.value, // Valor ingresado en el input
          };

            // Llamada a la API para actualizar el cierre de la caja
            const parchear = await api.patch(`caja/${id}`, objetoCaja);

            if (parchear.Error) {
                alertaError(parchear.Error); // Mostrar error si la API retorna uno
                return;
            }

            if (parchear.Ok) {
                await alertaOK(parchear.Ok); // Mostrar mensaje de éxito
                window.location.href = '#/Caja'; // Redirigir a la vista de cajas
            }
        }
    })
}
