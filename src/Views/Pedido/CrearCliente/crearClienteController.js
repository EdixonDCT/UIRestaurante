// Importa funciones para mostrar alertas de éxito o error
import { alertaError, alertaOK } from "../../../Helpers/alertas";

// Importa funciones para hacer peticiones a la API
import * as api from "../../../Helpers/api";

// Importa funciones de validación de formularios
import * as validacion from "../../../Helpers/validaciones";

// Exporta por defecto una función anónima que contiene toda la lógica del formulario
export default () => {
  // Obtiene el formulario del DOM
  const form = document.querySelector(".form");

  // Obtiene los campos de entrada (inputs) del DOM
  const cedula = document.querySelector(".cedula");
  const nombre = document.querySelector(".nombre");
  const apellido = document.querySelector(".apellido");

  // Evento blur para quitar errores cuando el usuario sale del input de correo
  cedula.addEventListener("blur", () => {
    validacion.quitarError(cedula.parentElement);
  });

  // Evento keydown para limitar el correo a 30 caracteres
  cedula.addEventListener("keydown", (e) => {
    validacion.validarNumeroKey(e);
    validacion.validarLimiteKey(e, 10);
  });

  // Evento blur para quitar errores cuando el usuario sale del input de cédula
  nombre.addEventListener("blur", () => {
    validacion.quitarError(nombre.parentElement);
  });

  // Evento keydown para permitir solo números y limitar la cédula a 10 dígitos
  nombre.addEventListener("keydown", (e) => {
    validacion.validarTextoKey(e);
    validacion.validarLimiteKey(e, 20);
  });

  // Evento blur para quitar errores cuando el usuario sale del input de teléfono
  apellido.addEventListener("blur", () => {
    validacion.quitarError(apellido.parentElement);
  });

  // Evento keydown para permitir solo números y limitar el teléfono a 10 dígitos
  apellido.addEventListener("keydown", (e) => {
    validacion.validarTextoKey(e);
    validacion.validarLimiteKey(e, 20);
  });

  // Evento submit del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que se recargue la página al enviar el formulario

    // Valida el correo con la función de validación específica
    let validarCedula = validacion.validarCantidad(cedula, 6); // Verificar que tenga al menos 6 dígitos
    let validarNombre = validacion.validarCampo(nombre); // No vacío
    let validarApellido = validacion.validarCampo(apellido);

    // Si todas las validaciones pasan, se prepara el objeto a enviar a la API
    if (validarCedula && validarNombre && validarApellido) {
      const objetoCliente = {
        cedula: cedula.value,
        nombre: nombre.value,
        apellido: apellido.value,
      };

      // Envía los datos a la API para crear un nuevo cliente
      const creado = await api.post("clientes", objetoCliente);

      // Si la API devuelve un error, se muestra en pantalla
      if (creado.Error) {
        alertaError(creado.Error);
        return;
      }

      // Si la API devuelve éxito, se muestra alerta y se redirige a la página de pedidos
      if (creado.Ok) {
        await alertaOK(creado.Ok);
        window.location.href = "#/Pedido";
      }
    }
  });
};
