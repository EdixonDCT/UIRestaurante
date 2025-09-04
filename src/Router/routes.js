import homeController from '../Views/Home/homeController.js' // Importa el controlador de Home

import { loginController } from '../Views/Auth/Login/loginController.js' // Importa el controlador de Login
import { SignupController } from '../Views/Auth/Signup/signupController.js' // Importa el controlador de Registro
// import { MesaController } from '../Views/Mesa/mesaController.js' // Comentado, ya no se usa
import * as mesa from '../Views/Mesa/index.js' // Importa todos los controladores de Mesa
import * as caja from '../Views/Caja/index.js' // Importa todos los controladores de Caja
import * as pedido from '../Views/Pedido/index.js' // Importa todos los controladores de Pedido
import * as detallePedido from '../Views/DetallePedido/index.js' // Importa todos los controladores de DetallePedido
import * as reserva from "../Views/Reserva/index.js"; // Importa todos los controladores de Reserva
import * as ingrediente from '../Views/Ingrediente/index.js' // Importa todos los controladores de Ingrediente
import * as platillo from '../Views/Platillo/index.js' // Importa todos los controladores de Platillo
import * as trabajadores from '../Views/Trabajadores/index.js' // Importa todos los controladores de Trabajadores


export const routes = { // Objeto con todas las rutas del sistema
  Home: { // Ruta Home
    path: "Home/index.html", // HTML de la vista
    controlador: homeController, // Controlador JS
    private: false, // Acceso público
  },
  Login: { // Ruta Login
    path: `Auth/Login/index.html`, 
    controlador: loginController,
    private: false,
  },
  Signup: { // Ruta de registro
    path: `Auth/Signup/index.html`,
    controlador: SignupController,
    private: false,
  },
  Mesa: { // Grupo de rutas Mesa
    "/": { // Ruta por defecto de Mesa
      path: `Mesa/index.html`,
      controlador: mesa.MesaController,
      private: true, // Solo con sesión
      can: "Mesa.listar", // Permiso requerido
    },
    Crear: { // Ruta crear mesa
      path: `Mesa/Crear/index.html`,
      controlador: mesa.CrearController,
      private: true,
      can: "Mesa.crear",
    },
    Editar: { // Ruta editar mesa
      path: `Mesa/Editar/index.html`,
      controlador: mesa.EditarController,
      private: true,
      can: "Mesa.editar",
    },
  },
  Caja: { // Grupo de rutas Caja
    "/": {
      path: `Caja/index.html`,
      controlador: caja.CajaController,
      private: true,
      can: "Caja.listar",
    },
    Apertura: {
      path: `Caja/Apertura/index.html`,
      controlador: caja.AperturaController,
      private: true,
      can: "Caja.crear",
    },
    Cierre: {
      path: `Caja/Cierre/index.html`,
      controlador: caja.CierreController,
      private: true,
      can: "Caja.crear",
    },
    Editar: {
      path: `Caja/Editar/index.html`,
      controlador: caja.EditarController,
      private: true,
      can: "Caja.editar",
    },
    EditarApertura: {
      path: `Caja/EditarApertura/index.html`,
      controlador: caja.EditarAperturaController,
      private: true,
      can: "Caja.editar",
    },
  },
  Pedido: { // Grupo de rutas Pedido
    "/": {
      path: `Pedido/index.html`,
      controlador: pedido.PedidoController,
      private: true,
      can: "Pedido.listar",
    },
    Crear: {
      path: `Pedido/Crear/index.html`,
      controlador: pedido.CrearController,
      private: true,
      can: "Pedido.crear",
    },
    Editar: {
      path: `Pedido/Editar/index.html`,
      controlador: pedido.EditarController,
      private: true,
      can: "Pedido.editar",
    },
    CrearCliente: {
      path: `Pedido/CrearCliente/index.html`,
      controlador: pedido.CrearClienteController,
      private: true,
      can: "Pedido.crear",
    },
    VerificarCliente: {
      path: `Pedido/VerificarCliente/index.html`,
      controlador: pedido.VerificarClienteController,
      private: true,
      can: "Pedido.crear",
    },
  },
  DetallePedido: { // Ruta DetallePedido
    Editar: {
      path: `DetallePedido/index.html`,
      controlador: detallePedido.DetallePedidoController,
      private: true,
      can: "Pedido.crear",
    },
  },
  Reserva: { // Grupo de rutas Reserva
    "/": {
      path: `Reserva/index.html`,
      controlador: reserva.ReservaController,
      private: true,
      can: "Reserva.listar",
    },
    Crear: {
      path: `Reserva/Crear/index.html`,
      controlador: reserva.CrearController,
      private: true,
      can: "Reserva.crear",
    },
    Editar: {
      path: `Reserva/Editar/index.html`,
      controlador: reserva.EditarController,
      private: true,
      can: "Reserva.editar",
    },
    ActivarReserva: {
      path: `Reserva/ActivarReserva/index.html`,
      controlador: reserva.ActivarReservaController,
      private: true,
      can: "Reserva.editar",
    },
  },
  Ingrediente: { // Grupo de rutas Ingrediente
    "/": {
      path: `Ingrediente/index.html`,
      controlador: ingrediente.IngredienteController,
      private: true,
      can: "Ingrediente.listar",
    },
    Crear: {
      path: `Ingrediente/Crear/index.html`,
      controlador: ingrediente.CrearController,
      private: true,
      can: "Ingrediente.crear"
    }
  },
  Platillo: { // Grupo de rutas Platillo
    "/": {
      path: `Platillo/index.html`,
      controlador: platillo.PlatilloController,
      private: true,
      can: "Platillo.listar",
    },
    CrearComida: {
      path: `Platillo/CrearComida/index.html`,
      controlador: platillo.CrearComidaController,
      private: true,
      can: "Platillo.crear",
    },
    CrearBebida: {
      path: `Platillo/CrearBebida/index.html`,
      controlador: platillo.CrearBebidaController,
      private: true,
      can: "Platillo.crear",
    },
    CrearCoctel: {
      path: `Platillo/CrearCoctel/index.html`,
      controlador: platillo.CrearCoctelController,
      private: true,
      can: "Platillo.crear",
    },
    EditarComida: {
      path: `Platillo/EditarComida/index.html`,
      controlador: platillo.EditarComidaController,
      private: true,
      can: "Platillo.editar",
    },
    EditarBebida: {
      path: `Platillo/EditarBebida/index.html`,
      controlador: platillo.EditarBebidaController,
      private: true,
      can: "Platillo.editar",
    },
    EditarCoctel: {
      path: `Platillo/EditarCoctel/index.html`,
      controlador: platillo.EditarCoctelController,
      private: true,
      can: "Platillo.editar",
    },
    EditarImagenComida: {
      path: `Platillo/EditarImagenComida/index.html`,
      controlador: platillo.EditarImagenComidaController,
      private: true,
      can: "Platillo.editar",
    },
    EditarImagenBebida: {
      path: `Platillo/EditarImagenBebida/index.html`,
      controlador: platillo.EditarImagenBebidaController,
      private: true,
      can: "Platillo.editar",
    },
    EditarImagenCoctel: {
      path: `Platillo/EditarImagenCoctel/index.html`,
      controlador: platillo.EditarImagenCoctelController,
      private: true,
      can: "Platillo.editar",
    },
    AsignarIngredienteComida: {
      path: `Platillo/AsignarIngredientesComida/index.html`,
      controlador: platillo.AsignarIngredienteComidaController,
      private: true,
      can: "Platillo.editar", // Asignar ingredientes se considera modificar
    },
    AsignarIngredienteCoctel: {
      path: `Platillo/AsignarIngredientesCoctel/index.html`,
      controlador: platillo.AsignarIngredienteCoctelController,
      private: true,
      can: "Platillo.editar"
    },
  },

  Trabajadores: { // Grupo de rutas Trabajadores
    "/": {
      path: `Trabajadores/index.html`,
      controlador: trabajadores.TrabajadoresController,
      private: true,
      can: "Trabajadores.listar",
    },
    Editar: {
      path: `Trabajadores/Editar/index.html`,
      controlador: trabajadores.EditarController,
      private: true,
      can: "Trabajadores.editar",
    },
    EditarImagen: {
      path: `Trabajadores/EditarImagen/index.html`,
      controlador: trabajadores.EditarImagenController,
      private: true,
      can: "Trabajadores.editar",
    }
  }
};
