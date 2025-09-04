import { alertaError, alertaOK } from "../../../Helpers/alertas"; // Importa funciones para mostrar alertas
import * as api from "../../../Helpers/api"; // Importa funciones para llamadas a la API
import * as validacion from "../../../Helpers/validaciones"; // Importa funciones de validación

export const loginController = () => {
  const form = document.querySelector(".form"); // Referencia al formulario
  const cedula = document.querySelector(".cedula"); // Referencia al input de cédula
  const contrasena = document.querySelector(".contrasena"); // Referencia al input de contraseña

  // Cuando el input de cédula pierde el foco, se quita cualquier error
  cedula.addEventListener("blur", () => {
    validacion.quitarError(cedula.parentElement);
  });

  // Mientras se escribe en cédula, validar solo números y límite de 10 caracteres
  cedula.addEventListener("keydown", (e) => {
    validacion.validarNumeroKey(e); // Permite solo números
    validacion.validarLimiteKey(e, 10); // Limita a 10 caracteres
  });

  // Cuando el input de contraseña pierde el foco, se quita cualquier error
  contrasena.addEventListener("blur", () => {
    validacion.quitarError(contrasena.parentElement);
  });

  // Mientras se escribe en contraseña, limita a 30 caracteres
  contrasena.addEventListener("keydown", (e) => {
    validacion.validarLimiteKey(e, 30);
  });

  // Evento al enviar el formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita el envío por defecto del formulario

    // Validaciones de campos obligatorios
    let validarCedula = validacion.validarCampo(cedula);
    let validarContrasena = validacion.validarCampo(contrasena);

    // Si ambos campos son válidos
    if (validarCedula && validarContrasena){
      const datos = {
        cedula: cedula.value,
        contrasena: contrasena.value
      }

      // Llamada a la API pública para login
      const respuesta = await api.postPublic("login", datos);

      // Si la API devuelve un error, se muestra alerta y termina
      if (respuesta.Error) {
        alertaError(respuesta.Error);
        return;
      } else {
        // Guardar los datos recibidos en localStorage
        for (const element in respuesta) {
          if (Array.isArray(respuesta[element])) {
            window.localStorage.setItem(
              element,
              JSON.stringify(respuesta[element])
            );
            continue;
          }
          window.localStorage.setItem(element, respuesta[element]);
        }

        // Limpiar datos innecesarios
        localStorage.removeItem("contrasena");
        localStorage.removeItem("rol");

        // Mostrar alerta de éxito
        await alertaOK("Inicio de Sesion Correctamente.");

        // Redirigir a la página Home
        window.location.href = '#/Home';
      }
    }
  });
};
