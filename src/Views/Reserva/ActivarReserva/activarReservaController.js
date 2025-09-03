import { alertaError, alertaOK } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export default async () => {
  const form = document.querySelector(".form");

  const numeroMesa = document.querySelector(".numeroMesa");
  const numeroClientes = document.querySelector(".numeroClientes");
  const correoCliente = document.querySelector(".correoCliente");
  const idCaja = document.querySelector(".idCaja");
  const metodoPago = document.querySelector(".metodoPago");

  const listaMesas = [];
  const rellenarMesas = async () => {
    const mesasDisponibles = await api.get("mesas")
    mesasDisponibles.forEach(mesas => {
      let option = document.createElement("option");
      option.value = mesas.numero;
      option.textContent = `Mesa #${mesas.numero}(capacidad:${mesas.capacidad})`;
      numeroMesa.appendChild(option);
      listaMesas.push(mesas.numero);
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
  await rellenarMesas();
  await rellenarCajas();

  const hash = location.hash.slice(1);
  const [url, id] = hash.split("=");
  const traerDatos = await api.get(`pedidos/reserva/${id}`);
  let idPedido = traerDatos.id;
  numeroMesa.value = traerDatos.numeroMesa;
  numeroClientes.value = traerDatos.numeroClientes;
  correoCliente.value = traerDatos.correoCliente;

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
        idCaja: idCaja.value,
        metodoPago: metodoPago.value
      }
      const activado = await api.put(`pedidos/reserva/${idPedido}`, objetoPedido);
      if (activado.Error) {
        alertaError(activado.Error);
        return;
      }
      if (activado.Ok) {
        await alertaOK(activado.Ok);
        window.location.href = '#/Reserva';
      }
    }
  })
}