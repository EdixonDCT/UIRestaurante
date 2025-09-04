// Importa el controlador principal de pedidos
import PedidoController from "./pedidoController";

// Importa el controlador para crear pedidos
import CrearController from "./Crear/crearController";

// Importa el controlador para editar pedidos
import EditarController from "./Editar/editarController";

// Importa el controlador para crear clientes dentro del flujo de pedidos
import CrearClienteController from "./CrearCliente/crearClienteController";

// Importa el controlador para verificar si un cliente ya existe
import VerificarClienteController from "./VerificarCliente/verificarClienteController";

// Exporta todos los controladores para que puedan usarse en otros módulos de la aplicación
export {PedidoController, CrearController, EditarController, CrearClienteController, VerificarClienteController};
