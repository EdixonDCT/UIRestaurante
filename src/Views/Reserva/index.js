// ==================== Imports ====================
// Importa el controlador principal de reservas
import ReservaController from "./reservaController";
// Importa el controlador para crear nuevas reservas
import CrearController from "./Crear/crearController";
// Importa el controlador para editar reservas existentes
import EditarController from "./Editar/editarController";
// Importa el controlador para activar reservas (cuando se confirma la reserva)
import ActivarReservaController from "./ActivarReserva/activarReservaController";

// ==================== Exportación ====================
// Exporta todos los controladores juntos para poder importarlos fácilmente en otras partes de la app
export {
  ReservaController,
  CrearController,
  EditarController,
  ActivarReservaController
};
