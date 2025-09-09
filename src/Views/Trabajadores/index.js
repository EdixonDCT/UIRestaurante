// Importa el controlador principal de Trabajadores
import TrabajadoresController from "./trabajadoresController";
// Importa el controlador para editar datos de un trabajador
import EditarController from "./Editar/editarController";
// Importa el controlador para editar la imagen de un trabajador
import EditarImagenController from "./EditarImagen/editarImagenController";
// Importa el controlador para editar para el cambio de contraseña
import editarContrasenaController from "./EditarContrasena/editarContrasenaController";
// Exporta los tres controladores para poder importarlos desde otros módulos
export {TrabajadoresController, EditarController, EditarImagenController, editarContrasenaController};
