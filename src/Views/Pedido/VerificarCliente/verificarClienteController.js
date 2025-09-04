// Importa funciones de alerta personalizadas
import { alertaError, alertaOK } from "../../../Helpers/alertas";

// Importa funciones para hacer llamadas a la API
import * as api from "../../../Helpers/api";

// Importa funciones de validación
import * as validacion from "../../../Helpers/validaciones";

// Exporta una función anónima que se ejecuta al cargar este módulo
export default () => {
    // Selecciona el formulario del DOM
    const form = document.querySelector(".form");

    // Selecciona el input de correo del DOM
    const correo = document.querySelector(".correo");
  
    // Evento 'blur' quita los errores visuales si los había
    correo.addEventListener("blur", () => { 
        validacion.quitarError(correo.parentElement);
    });

    // Evento 'keydown' limita la longitud del correo a 30 caracteres
    correo.addEventListener("keydown", (e) => {
        validacion.validarLimiteKey(e, 30);
    });
  
    // Evento submit del formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Evita que el formulario se envíe por defecto

        // Valida que el correo tenga un formato correcto
        let validarCorreo = validacion.validarCorreo(correo);

        if (validarCorreo) {
            // Consulta la API para verificar si el cliente existe
            const existe = await api.get(`clientes/verificar/${correo.value}`);

            // Si hay un error de la API, muestra alerta de error
            if (existe.Error) {
                alertaError(existe.Error);
                return;
            }

            // Si la API indica que todo está bien, muestra alerta de éxito
            if (existe.Ok) {
                await alertaOK(existe.Ok);
            }
        }
    });
}
