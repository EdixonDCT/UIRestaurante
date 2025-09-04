import { alertaError, alertaOK } from "../../../Helpers/alertas";
// Importa funciones para mostrar alertas de error o éxito

import * as api from "../../../Helpers/api";
// Importa funciones para realizar llamadas a la API (GET, PUT, etc.)

import * as validacion from "../../../Helpers/validaciones";
// Importa funciones para validar campos de formulario

export default async () => {
  // Selecciona el formulario en la página
  const form = document.querySelector(".form");

  // Selecciona los inputs de número y capacidad
  const numero = document.querySelector(".numero");
  const capacidad = document.querySelector(".capacidad");

  // Obtiene el ID de la mesa desde el hash de la URL
  const hash = location.hash.slice(1);
  const [url, id] = hash.split("=");

  // Trae los datos de la mesa desde la API y los asigna a los inputs
  const traerDatos = await api.get(`mesas/${id}`);
  numero.value = traerDatos.numero;
  capacidad.value = traerDatos.capacidad;

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

    // Valida que el campo capacidad no esté vacío
    let validarCapacidad = validacion.validarCampo(capacidad);

    if (validarCapacidad) {
      // Crea el objeto con los datos a enviar
      const objetoMesa = {
        numero: numero.value,
        capacidad: capacidad.value
      }

      // Envía los datos actualizados a la API
      const actualizar = await api.put(`mesas/${id}`, objetoMesa);

      // Manejo de errores y confirmación
      if (actualizar.Error) {
        alertaError(actualizar.Error);
        return;
      }
      if (actualizar.Ok) {
        await alertaOK(actualizar.Ok);
        window.location.href = '#/Mesa';
      }
    }
  })
}
