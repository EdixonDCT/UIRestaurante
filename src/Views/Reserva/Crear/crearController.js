import { alertaError, alertaOK } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export default async () => {
  const form = document.querySelector(".form");

  const correoCliente = document.querySelector(".correoCliente");
  const numeroMesa = document.querySelector(".numeroMesa");
  const cantidadTentativa = document.querySelector(".cantidadTentativa");
  const fechaTentativa = document.querySelector(".fechaTentativa");
  const horaTentativa = document.querySelector(".horaTentativa");

  const rellenarMesas = async () => {
    const mesasExisten = await api.get("mesas");
    mesasExisten.forEach((mesas) => {
      let option = document.createElement("option");
      option.value = mesas.numero;
      option.textContent = `Mesa #${mesas.numero}(capacidad:${mesas.capacidad})`;
      numeroMesa.appendChild(option);
    });
  };
  rellenarMesas();

  correoCliente.addEventListener("blur", () => { validacion.quitarError(correoCliente.parentElement); });
  correoCliente.addEventListener("keydown", (e) => {
    validacion.validarLimiteKey(e, 30);
  });
  numeroMesa.addEventListener("blur", () => { validacion.quitarError(numeroMesa.parentElement) });
  cantidadTentativa.addEventListener("blur", () => { validacion.quitarError(cantidadTentativa.parentElement) });
  cantidadTentativa.addEventListener("keydown", (e) => {
    validacion.validarNumeroKey(e);
    validacion.validarLimiteKey(e, 2);
  });
  fechaTentativa.addEventListener("blur", () => { validacion.quitarError(fechaTentativa.parentElement); });
  horaTentativa.addEventListener("blur", () => { validacion.quitarError(horaTentativa.parentElement); });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let validarCorreoCliente = validacion.validarCorreo(correoCliente);
    let validarNumeroMesa = validacion.validarCampo(numeroMesa);
    let validarCantidadTentativa = validacion.validarCampo(cantidadTentativa);
    let validarFechaTentativa = validacion.validarFecha(fechaTentativa);
    let validarHoraTentativa = validacion.validarHora(horaTentativa, fechaTentativa);

    if (validarCorreoCliente && validarNumeroMesa && validarCantidadTentativa && validarFechaTentativa && validarHoraTentativa) {
      const { capacidad } = await api.get(`mesas/${numeroMesa.value}`);
      const objetoReserva = {
        cantidadTentativa: `${cantidadTentativa.value}/${capacidad}/${correoCliente.value}`,
        fechaTentativa: fechaTentativa.value,
        horaTentativa: horaTentativa.value + ":00",
      };
      const creado = await api.post("reservas", objetoReserva);
      if (creado.Error) {
        alertaError(creado.Error);
        return;
      }
      if (creado.Ok) {
        const objetoPedidoReserva = {
          numeroMesa: numeroMesa.value,
          numeroClientes: cantidadTentativa.value,
          correoCliente: correoCliente.value,
          idReserva: creado.id,
        };
        const crearPedidoConReserva = await api.post("pedidos/reserva", objetoPedidoReserva);
        if (crearPedidoConReserva.Ok) {
          alertaOK(creado.Ok);
          window.location.href = '#/Reserva';
        }
        if (crearPedidoConReserva.Error) {
          alertaError(crearPedidoConReserva.Error);
          alertaOK(creado.Ok);
          window.location.href = '#/Reserva';
        }
      }
    }
  })
}
