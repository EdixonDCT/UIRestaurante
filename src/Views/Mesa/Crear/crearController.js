import { alertaError, alertaOK } from "../../../Helpers/alertas";
// Importa funciones para mostrar alertas de error o éxito

import * as api from "../../../Helpers/api";
// Importa funciones para hacer llamadas a la API

import * as validacion from "../../../Helpers/validaciones";
// Importa funciones para validar los campos del formulario

export default () => {
    // Selecciona el formulario
    const form = document.querySelector(".form");

    // Selecciona los inputs de número y capacidad
    const numero = document.querySelector(".numero");
    const capacidad = document.querySelector(".capacidad");

    // Validación del número al perder foco
    numero.addEventListener("blur", () => { 
        validacion.quitarError(numero.parentElement);
    });

    // Validación del número mientras se escribe
    numero.addEventListener("keydown", (e) => {
        validacion.validarNumeroKey(e); // Solo permite números
        validacion.validarLimiteKey(e, 3); // Máximo 3 dígitos
    });

    // Validación de capacidad al perder foco
    capacidad.addEventListener("blur", () => { 
        validacion.quitarError(capacidad.parentElement);
    });

    // Validación de capacidad mientras se escribe
    capacidad.addEventListener("keydown", (e) => {
        validacion.validarNumeroKey(e); // Solo permite números
        validacion.validarLimiteKey(e, 2); // Máximo 2 dígitos
    });

    // Evento submit del formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Valida que los campos no estén vacíos
        let validarNumero = validacion.validarCampo(numero);
        let validarCapacidad = validacion.validarCampo(capacidad);

        if (validarNumero && validarCapacidad) {
            // Objeto con los datos de la nueva mesa
            const objetoMesa = {
                numero: numero.value,
                capacidad: capacidad.value
            }

            // Llamada a la API para crear la mesa
            const creado = await api.post("mesas", objetoMesa);

            // Manejo de errores y confirmación
            if (creado.Error) {
                alertaError(creado.Error);
                return;
            }
            if (creado.Ok) {
                await alertaOK(creado.Ok);
                window.location.href = '#/Mesa';
            }
        }
    })
}
