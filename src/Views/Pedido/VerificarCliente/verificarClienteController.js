// Importa funciones de alerta personalizadas
import { alertaError, alertaOK, alertaWarning } from "../../../Helpers/alertas";

// Importa funciones para hacer llamadas a la API
import * as api from "../../../Helpers/api";

// Importa funciones de validación
import * as validacion from "../../../Helpers/validaciones";

// Exporta una función anónima que se ejecuta al cargar este módulo
export default () => {
  // Selecciona el formulario del DOM
  const form = document.querySelector(".form");

  // Selecciona el input de correo del DOM
  const cedula = document.querySelector(".cedula");

  // Evento 'blur' quita los errores visuales si los había
  cedula.addEventListener("blur", () => {
    validacion.quitarError(cedula.parentElement);
  });

  // Evento 'keydown' limita la longitud del correo a 30 caracteres
  cedula.addEventListener("keydown", (e) => {
    validacion.validarNumeroKey(e);
    validacion.validarLimiteKey(e, 10);
  });

  // Evento submit del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que el formulario se envíe por defecto

    // Valida que el correo tenga un formato correcto
    let validarCedula = validacion.validarCantidad(cedula, 6);

    if (validarCedula) {
      // Consulta la API para verificar si el cliente existe
      const existe = await api.get(`clientes/verificar/${cedula.value}`);

      // Si hay un error de la API, muestra alerta de error
      if (existe.Error) {
        alertaWarning(existe.Error);
        return;
      }

      // Si la API indica que todo está bien, muestra alerta de éxito
      if (existe.Ok) {
        await alertaOK(existe.Ok);
      }
    }
  });
};
