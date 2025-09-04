// Importa el controlador principal de Platillos, encargado de listar y manejar la interfaz general de platillos.
import PlatilloController from "./platilloController";

// Importa controladores para asignar ingredientes a platillos específicos
// Estos controladores permiten gestionar los ingredientes de cocteles y comidas.
import AsignarIngredienteCoctelController from "./AsignarIngredientesCoctel/asignarIngredienteCoctelController";
import AsignarIngredienteComidaController from "./AsignarIngredientesComida/asignarIngredienteComidaController";

// Importa controladores para la creación de nuevos platillos
// Cada uno gestiona la creación de un tipo de platillo distinto (bebida, coctel, comida)
import CrearBebidaController from "./CrearBebida/crearBebidaController";
import CrearCoctelController from "./CrearCoctel/crearCoctelController";
import CrearComidaController from "./CrearComida/crearComidaController";

// Importa controladores para editar los datos de platillos existentes
// Permiten modificar información como nombre, precio, tipo, etc.
import EditarBebidaController from "./EditarBebida/editarBebidaController";
import EditarCoctelController from "./EditarCoctel/editarCoctelController";
import EditarComidaController from "./EditarComida/editarComidaController";

// Importa controladores para cambiar la imagen de los platillos
// Cada controlador maneja la actualización de la imagen de un tipo específico de platillo
import EditarImagenBebidaController from "./EditarImagenBebida/editarImagenBebidaController";
import EditarImagenCoctelController from "./EditarImagenCoctel/editarImagenCoctelController";
import EditarImagenComidaController from "./EditarImagenComida/editarImagenComidaController";

// Exporta todos los controladores agrupados
// Esto permite importarlos desde un solo archivo en otras partes de la aplicación
export {
  PlatilloController,
  AsignarIngredienteCoctelController,
  AsignarIngredienteComidaController,
  CrearBebidaController,
  CrearCoctelController,
  CrearComidaController,
  EditarBebidaController,
  EditarCoctelController,
  EditarComidaController,
  EditarImagenBebidaController,
  EditarImagenCoctelController,
  EditarImagenComidaController
};
