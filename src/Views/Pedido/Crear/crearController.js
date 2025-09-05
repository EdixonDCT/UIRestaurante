import { alertaError, alertaOK } from "../../../Helpers/alertas";
// Importa funciones para mostrar alertas de error o éxito

import * as api from "../../../Helpers/api";
// Importa funciones para interactuar con la API

import * as validacion from "../../../Helpers/validaciones";
// Importa funciones para validar los campos del formulario

export default () => {
  // Selecciona el formulario
  const form = document.querySelector(".form");

  // Selecciona los campos del formulario
  const numeroMesa = document.querySelector(".numeroMesa");
  const idCaja = document.querySelector(".idCaja");
  const numeroClientes = document.querySelector(".numeroClientes");
  const cedulaCliente = document.querySelector(".cedulaCliente");
  const metodoPago = document.querySelector(".metodoPago");

  // Función para rellenar el select de mesas disponibles
  const rellenarMesas = async () => {
    const mesasDisponibles = await api.get("mesas");
    mesasDisponibles.forEach(mesas => {
      if (mesas.disponible == "0") return; // Ignora mesas ocupadas
      let option = document.createElement("option");
      option.value = mesas.numero;
      option.textContent = `Mesa #${mesas.numero}(capacidad:${mesas.capacidad})`;
      numeroMesa.appendChild(option);
    });
  }

  // Función para rellenar el select de cajas abiertas
  const rellenarCajas = async () => {
    const cajasDisponibles = await api.get("caja");
    cajasDisponibles.forEach(caja => {
      // Ignora cajas cerradas
      if (caja.fechaCierre && caja.horaCierre && caja.montoCierre) return;
      let option = document.createElement("option");
      option.value = caja.id;
      option.textContent = `Caja #${caja.id}`;
      idCaja.appendChild(option);
    });
  }

  // Llama las funciones para rellenar selects al cargar la página
  rellenarMesas();
  rellenarCajas();

  // Validaciones de los campos al perder foco
  numeroMesa.addEventListener("blur", () => { validacion.quitarError(numeroMesa.parentElement) });
  idCaja.addEventListener("blur", () => { validacion.quitarError(idCaja.parentElement) });
  numeroClientes.addEventListener("blur", () => { validacion.quitarError(numeroClientes.parentElement) });
  cedulaCliente.addEventListener("blur", () => { validacion.quitarError(cedulaCliente.parentElement); });
  metodoPago.addEventListener("blur", () => { validacion.quitarError(metodoPago.parentElement) });

  // Validación mientras se escribe
  numeroClientes.addEventListener("keydown", (e) => {
    validacion.validarNumeroKey(e); // Solo números
    validacion.validarLimiteKey(e, 2); // Máx 2 dígitos
  });
  cedulaCliente.addEventListener("keydown", (e) => {
    validacion.validarNumeroKey(e); // Solo números
    validacion.validarLimiteKey(e, 10); // Máx 30 caracteres
  });

  // Evento submit del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validar cada campo
    let validarNumeroMesa = validacion.validarCampo(numeroMesa);
    let validaridCaja = validacion.validarCampo(idCaja);
    let validarNumeroClientes = validacion.validarCampo(numeroClientes);
    let validarCedulaCliente = validacion.validarCantidad(cedulaCliente, 6);
    let validarMetodoPago = validacion.validarCampo(metodoPago);

    if (validarNumeroMesa && validaridCaja && validarNumeroClientes && validarCedulaCliente && validarMetodoPago) {
      // Construye el objeto del nuevo pedido
      const objetoPedido = {
        numeroMesa: numeroMesa.value,
        idCaja: idCaja.value,
        numeroClientes: numeroClientes.value,
        cedulaUsuario: cedulaCliente.value,
        metodoPago: metodoPago.value,
      };

      // Llama a la API para crear el pedido
      const creado = await api.post("pedidos", objetoPedido);

      if (creado.Error) {
        alertaError(creado.Error);
        return;
      }

      if (creado.Ok) {
        // Cambia el estado de la mesa a ocupada
        const objetoOcupado = { disponible: "0" };
        const cambiarEstado = await api.patch(`mesas/${numeroMesa.value}`, objetoOcupado);

        if (cambiarEstado.Ok) {
          await alertaOK(creado.Ok);
          window.location.href = `#/DetallePedido/Editar/id=${creado.id}`;
        }

        if (cambiarEstado.Error) {
          await alertaOK(cambiarEstado.Error);
          await alertaOK(creado.Ok);
          window.location.href = '#/Pedido';
        }
      }
    }
  })
}
