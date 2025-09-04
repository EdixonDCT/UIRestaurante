import CajaController from "./cajaController"; 
// Importa el controlador principal de la sección Caja (listado, acciones)

import AperturaController from "./Apertura/aperturaController"; 
// Importa el controlador para aperturar una nueva caja

import CierreController from "./Cierre/cierreController"; 
// Importa el controlador para cerrar una caja existente

import EditarController from "./Editar/editarController"; 
// Importa el controlador para editar una caja cerrada

import EditarAperturaController from "./EditarApertura/editarAperturaController"; 
// Importa el controlador para editar los datos de apertura de una caja

// Exporta todos los controladores para que puedan usarse en el router o en otras partes
export { CajaController, AperturaController, CierreController, EditarController, EditarAperturaController };
