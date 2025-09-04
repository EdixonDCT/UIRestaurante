import homeController from '../Views/Home/homeController.js'

import { loginController } from '../Views/Auth/Login/loginController.js'
import { SignupController } from '../Views/Auth/Signup/signupController.js'
// import { MesaController } from '../Views/Mesa/mesaController.js'
import * as mesa from '../Views/Mesa/index.js'
import * as caja from '../Views/Caja/index.js'
import * as pedido from '../Views/Pedido/index.js'
import * as detallePedido from '../Views/DetallePedido/index.js'
import * as reserva from "../Views/Reserva/index.js";
import * as ingrediente from '../Views/Ingrediente/index.js'
import * as platillo from '../Views/Platillo/index.js'
import * as trabajadores from '../Views/Trabajadores/index.js'


export const routes = {
  Home: {
    path: "Home/index.html",
    controlador: homeController,
    private: false,
  },
  Login: {
    path: `Auth/Login/index.html`,
    controlador: loginController,
    private: false,
  },
  Signup: {
    path: `Auth/Signup/index.html`,
    controlador: SignupController,
    private: false,
  },
  Mesa: {
    "/": {
      path: `Mesa/index.html`,
      controlador: mesa.MesaController,
      private: true,
      can: "Mesa.listar",
    },
    Crear: {
      path: `Mesa/Crear/index.html`,
      controlador: mesa.CrearController,
      private: true,
      can: "Mesa.crear",
    },
    Editar: {
      path: `Mesa/Editar/index.html`,
      controlador: mesa.EditarController,
      private: true,
      can: "Mesa.editar",
    },
  },
  Caja: {
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
  Pedido: {
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
  DetallePedido: {
    Editar: {
      path: `DetallePedido/index.html`,
      controlador: detallePedido.DetallePedidoController,
      private: true,
      can: "Pedido.crear",
    },
  },
  Reserva: {
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
  Ingrediente: {
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
  Platillo: {
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
      can: "Platillo.editar", // asignar ingredientes también es modificar
    },
    AsignarIngredienteCoctel: {
      path: `Platillo/AsignarIngredientesCoctel/index.html`,
      controlador: platillo.AsignarIngredienteCoctelController,
      private: true,
      can: "Platillo.editar"
    },
  },

  Trabajadores: {
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