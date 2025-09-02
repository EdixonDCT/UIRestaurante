import { alertaError, alertaOK } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export default async () => {
  //formulario
  const form = document.querySelector(".form");

  //valores a postear
  const numeroMesa = document.querySelector(".numeroMesa");
  const idCaja = document.querySelector(".idCaja");
  const numeroClientes = document.querySelector(".numeroClientes");
  const correoCliente = document.querySelector(".correoCliente");
  const metodoPago = document.querySelector(".metodoPago");

  const listaMesas = [];
  const rellenarMesas = async () => {
    const mesasDisponibles = await api.get("mesas")
    mesasDisponibles.forEach(mesas => {
      if (mesas.disponible == "0") return;
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

  const traerDatos = await api.get(`pedidos/${id}`);
  idCaja.value = traerDatos.idCaja;
  numeroClientes.value = traerDatos.numeroClientes;
  correoCliente.value = traerDatos.correoCliente;
  metodoPago.value = traerDatos.metodoPago;

  const mesaEsta = listaMesas.includes(traerDatos.numeroMesa);
  if (!mesaEsta) {
    const mesa = await api.get(`mesas/${traerDatos.numeroMesa}`);
    let option = document.createElement("option");
    option.value = mesa.numero;
    option.textContent = `Mesa #${mesa.numero}(capacidad:${mesa.capacidad})`;
    numeroMesa.appendChild(option);
  }
  numeroMesa.value = traerDatos.numeroMesa;

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
      const creado = await api.put(`pedidos/${id}`, objetoPedido);
      if (creado.Error) {
        alertaError(creado.Error);
        return;
      }
      if (creado.Ok) {
        const cambiarMesa = objetoPedido.numeroMesa == traerDatos.numeroMesa;
        if (!cambiarMesa) {
          const objetoOcupado = {
            disponible: "0"
          }
          await api.patch(`mesas/${objetoPedido.numeroMesa}`, objetoOcupado);
          const objetoDesocupado = {
            disponible: "1"
          }
          await api.patch(`mesas/${traerDatos.numeroMesa}`, objetoDesocupado);
        }
          await alertaOK(creado.Ok);
          window.location.href = '#/Pedido';
      }
    }
  })
}
