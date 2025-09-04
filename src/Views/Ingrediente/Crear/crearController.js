import { alertaError, alertaOK } from "../../../Helpers/alertas";
// Importa funciones para mostrar alertas de éxito y error

import * as api from "../../../Helpers/api";
// Importa funciones para hacer llamadas a la API (GET, POST, etc.)

import * as validacion from "../../../Helpers/validaciones";
// Importa funciones para validar campos de formulario

export default async () => {
  const form = document.querySelector(".form");
  // Selecciona el formulario principal de la página

  const nombre = document.querySelector(".nombre");
  // Selecciona el input de nombre del ingrediente

  // --- Validaciones en tiempo real ---
  nombre.addEventListener("blur", () => { 
    validacion.quitarError(nombre.parentElement) 
  });
  // Cuando el input pierde el foco, se quita cualquier mensaje de error

  nombre.addEventListener("keydown", (e) => {
    validacion.validarTextoEspacioKey(e);
    // Solo permite letras y espacios
    validacion.validarLimiteKey(e, 20);
    // Limita el input a 20 caracteres
  });

  // --- Envío del formulario ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); 
    // Evita que el formulario recargue la página

    let validarNombre = validacion.validarCampo(nombre);
    // Verifica que el campo no esté vacío

    if (validarNombre) {
      const objetoIngrediente = {
        nombre: nombre.value
      };
      // Crea el objeto que se enviará a la API

      const creado = await api.post("ingredientes", objetoIngrediente);
      // Llamada POST a la API para crear el ingrediente

      if (creado.Error) {
        alertaError(creado.Error);
        // Muestra alerta si hubo un error
        return;
      }

      if (creado.Ok) {
        await alertaOK(creado.Ok);
        // Muestra alerta de éxito
        window.location.href = '#/Ingrediente';
        // Redirige al listado de ingredientes
      }

      // Nota: la última comprobación de Error es redundante, ya se verificó antes
      if (creado.Error) {
        alertaError(creado.Error);
      }
    }
  });
};
