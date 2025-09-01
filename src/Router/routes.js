import homeController from '../Views/Home/homeController.js'

import { loginController } from '../Views/Auth/Login/loginController.js'
import { SignupController } from '../Views/Auth/Signup/signupController.js'
// import { MesaController } from '../Views/Mesa/mesaController.js'
import * as mesa from '../Views/Mesa/index.js'
import * as caja from '../Views/Caja/index.js'
import { PedidoController } from '../Views/Pedido/pedidoController.js'
import { ReservaController } from '../Views/Reserva/reservaController.js'
import { IngredienteController } from '../Views/Ingrediente/ingredienteController.js'
import { PlatilloController } from '../Views/Platillo/platilloController.js'
import { TrabajadoresController } from '../Views/Trabajadores/trabajadoresController.js'

export const routes = {
  Home: {
    path: "Home/index.html",
    controlador: homeController,
    private: false
  },
  Login: {
    path: `Auth/Login/index.html`,
    controlador: loginController,
    private: false,
  },
  Signup: {
    path: `Auth/Signup/index.html`,
    controlador: SignupController,
    private: false
  },
  Mesa: {
    "/": {
      path: `Mesa/index.html`,
      controlador: mesa.MesaController,
      private: true,
      can: "Mesa.listar"
    },
    Crear: {
      path: `Mesa/Crear/index.html`,
      controlador: mesa.CrearController,
      private: true,
      can: "Mesa.crear"
    },
    Editar: {
      path: `Mesa/Editar/index.html`,
      controlador: mesa.EditarController,
      private: true,
      can: "Mesa.editar"
    }
  },
  Caja: {
    "/": {
      path: `Caja/index.html`,
      controlador: caja.CajaController,
      private: true,
      can: "Caja.listar"
    },
    Apertura: {
      path: `Caja/Apertura/index.html`,
      controlador: caja.AperturaController,
      private: true,
      can: "Caja.crear"
    },
    Cierre:{
      path: `Caja/Cierre/index.html`,
      controlador: caja.CierreController,
      private: true,
      can: "Caja.crear"
    },
    Editar:{
      path: `Caja/Editar/index.html`,
      controlador: caja.EditarController,
      private: true,
      can: "Caja.editar"
    },
    EditarApertura: {
      path: `Caja/EditarApertura/index.html`,
      controlador: caja.EditarAperturaController,
      private: true,
      can: "Caja.editar"
    }
  },
  Pedido: {
    path: `Pedido/index.html`,
    controlador: PedidoController,
    private: true,
    can: "Pedido.listar"
  },
  Reserva: {
    path: `Reserva/index.html`,
    controlador: ReservaController,
    private: true,
    can: "Reserva.listar"
  },
  Ingrediente: {
    path: `Ingrediente/index.html`,
    controlador: IngredienteController,
    private: true,
    can: "Ingrediente.listar"
  },
  Platillo: {
    path: `Platillo/index.html`,
    controlador: PlatilloController,
    private: true,
    can: "Platillo.listar"
  },
  Trabajadores: {
    path: `Trabajadores/index.html`,
    controlador: TrabajadoresController,
    private: true,
    can: "Trabajadores.listar"
  },
}