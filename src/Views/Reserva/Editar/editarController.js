// ==================== Imports ====================
// Funciones de alertas (error o éxito)
import { alertaError, alertaOK } from "../../../Helpers/alertas";
// Funciones para interactuar con la API
import * as api from "../../../Helpers/api";
// Funciones de validación de campos
import * as validacion from "../../../Helpers/validaciones";

// ==================== Función principal ====================
export default async () => {

  // ==================== Selección de elementos del DOM ====================
  const form = document.querySelector(".form"); // Formulario principal
  const idReserva = document.querySelector(".idReserva"); // Input que muestra el ID de la reserva
  const fechaTentativa = document.querySelector(".fechaTentativa"); // Fecha de la reserva
  const horaTentativa = document.querySelector(".horaTentativa"); // Hora de la reserva

  // ==================== Obtener ID desde el hash de la URL ====================
  const hash = location.hash.slice(1);
  const [url, id] = hash.split("=");

  // ==================== Traer datos existentes de la reserva ====================
  const traerDatos = await api.get(`reservas/${id}`);
  idReserva.value = traerDatos.id; // Mostrar el ID en el input
  fechaTentativa.value = traerDatos.fechaTentativa; // Llenar fecha existente
  horaTentativa.value = traerDatos.horaTentativa.slice(0, -3); // Llenar hora sin los últimos ":00"

  // ==================== Validaciones en tiempo real ====================
  fechaTentativa.addEventListener("blur", () => { validacion.quitarError(fechaTentativa.parentElement); });
  horaTentativa.addEventListener("blur", () => { validacion.quitarError(horaTentativa.parentElement); });

  // ==================== Enviar formulario ====================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validar los campos
    let validarFechaTentativa = validacion.validarFecha(fechaTentativa);
    let validarHoraTentativa = validacion.validarHora(horaTentativa, fechaTentativa);

    // Si los campos son válidos, actualizar la reserva
    if (validarFechaTentativa && validarHoraTentativa) {
      const objetoReserva = {
        fechaTentativa: fechaTentativa.value,
        horaTentativa: horaTentativa.value + ":00", // Formato de hora correcto
      };

      const actualizar = await api.put(`reservas/${id}`, objetoReserva); // Llamada a la API para actualizar

      // Manejo de respuesta
      if (actualizar.Error) {
        alertaError(actualizar.Error); // Mostrar error si falla
        return;
      }
      if (actualizar.Ok) {
        alertaOK(actualizar.Ok); // Mostrar éxito si todo salió bien
        window.location.href = '#/Reserva'; // Redirigir a la lista de reservas
      }
    }
  })
}
