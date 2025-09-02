import { alertaError, alertaOK } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export default () => {
  //formulario
  const form = document.querySelector(".form");

  //valores a postear
  const numeroMesa = document.querySelector(".numeroMesa");
  const idCaja = document.querySelector(".idCaja");
  const numeroClientes = document.querySelector(".numeroClientes");
  const correoCliente = document.querySelector(".correoCliente");
  const metodoPago = document.querySelector(".metodoPago");

  const rellenarMesas = async () => {
    const mesasDisponibles = await api.get("mesas")
    mesasDisponibles.forEach(mesas => {
      if (mesas.disponible == "0") return;
      let option = document.createElement("option");
      option.value = mesas.numero;
      option.textContent = `Mesa #${mesas.numero}(capacidad:${mesas.capacidad})`;
      numeroMesa.appendChild(option);
    });
  }
  const rellenarCajas = async () => {
    const cajasDisponibles = await api.get("caja")
    cajasDisponibles.forEach(caja => {
      if (caja.fechaCierre && caja.horaCierre && caja.montoCierre) return;
      let option = document.createElement("option");
      option.value = caja.id;
      option.textContent = `Caja #${caja.id}`;
      idCaja.appendChild(option);
    });
  }
  rellenarMesas();
  rellenarCajas();

  numeroMesa.addEventListener("blur", () => { validacion.quitarError(numeroMesa.parentElement) });
  idCaja.addEventListener("blur", () => { validacion.quitarError(idCaja.parentElement) });
  numeroClientes.addEventListener("blur", () => { validacion.quitarError(numeroClientes.parentElement) });
  numeroClientes.addEventListener("keydown", (e) => {
    validacion.validarNumeroKey(e);
    validacion.validarLimiteKey(e, 2);
  });
  correoCliente.addEventListener("blur", () => { validacion.quitarError(correoCliente.parentElement) });
  correoCliente.addEventListener("keydown", (e) => {
    validacion.validarLimiteKey(e, 30);
  });
  metodoPago.addEventListener("blur", () => { validacion.quitarError(metodoPago.parentElement) });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let validarNumeroMesa = validacion.validarCampo(numeroMesa);
    let validaridCaja = validacion.validarCampo(idCaja);
    let validarNumeroClientes = validacion.validarCampo(numeroClientes);
    let validarCorreoCliente = validacion.validarCorreo(correoCliente);
    let validarMetodoPago = validacion.validarCampo(metodoPago);

    if (validarNumeroMesa && validaridCaja && validarNumeroClientes && validarCorreoCliente && validarMetodoPago) {
      const objetoPedido = {
        numeroMesa: numeroMesa.value,
        idCaja: idCaja.value,
        numeroClientes: numeroClientes.value,
        correoCliente: correoCliente.value,
        metodoPago: metodoPago.value
      }
      const creado = await api.post("pedidos", objetoPedido);
      if (creado.Error) {
        alertaError(creado.Error);
        return;
      }
      if (creado.Ok) {
        const objetoOcupado = {
          disponible: "0"
        }
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
