// Importa funciones de alertas
import { alertaError, alertaOK } from "../../../Helpers/alertas";
// Importa funciones para interactuar con la API
import * as api from "../../../Helpers/api";
// Importa funciones de validación
import * as validacion from "../../../Helpers/validaciones";

// Función principal exportada
export default async () => {
    // Selecciona el formulario
    const form = document.querySelector(".form");

    // Selecciona inputs del formulario
    const contrasena = document.querySelector(".contrasena");
    const contrasenaNueva = document.querySelector(".contrasenaNueva");
    const contrasenaConfirm = document.querySelector(".contrasenaConfirmar");
    const id = window.localStorage.getItem("cedula")

    contrasena.addEventListener("blur", () => { validacion.quitarError(contrasena.parentElement) });
    contrasena.addEventListener("keydown", (e) => { validacion.validarLimiteKey(e, 20); });
    contrasenaNueva.addEventListener("blur", () => { validacion.quitarError(contrasenaNueva.parentElement) });
    contrasenaNueva.addEventListener("keydown", (e) => { validacion.validarLimiteKey(e, 20); });
    contrasenaConfirm.addEventListener("blur", () => { validacion.quitarError(contrasenaConfirm.parentElement) });
    contrasenaConfirm.addEventListener("keydown", (e) => { validacion.validarLimiteKey(e, 20); });

    // Evento submit del formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let validarContrasenaVieja = validacion.validarCampo(contrasena);
        let validarContrasenaNueva = validacion.validarContrasena(contrasenaNueva);
        let validarIgualdad = validacion.validarContrasenaIgual(contrasenaConfirm, contrasenaNueva);

        if (validarContrasenaVieja && validarContrasenaNueva && validarIgualdad) {
            // Objeto para actualizar
            const objetoActualizado = {
                cedula: contrasena.value,
                contrasena: contrasenaNueva.value,
            }
            // Llamada a la API para actualizar
            const actualizacion = await api.put(`trabajadores/contrasena/${id}`, objetoActualizado);
            if (actualizacion.Error) {
                alertaError(actualizacion.Error);
                return;
            } else {
                await alertaOK(actualizacion.Ok);
                window.location.href = '#/Trabajadores';
            }
        }
    })
}
