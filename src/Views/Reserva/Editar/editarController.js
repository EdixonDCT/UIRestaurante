import { alertaError, alertaOK } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export default async () => {
  const form = document.querySelector(".form");

  const idReserva = document.querySelector(".idReserva");
  const fechaTentativa = document.querySelector(".fechaTentativa");
  const horaTentativa = document.querySelector(".horaTentativa");

  const hash = location.hash.slice(1);
  const [url, id] = hash.split("=");
  const traerDatos = await api.get(`reservas/${id}`);
  idReserva.value = traerDatos.id;
  fechaTentativa.value = traerDatos.fechaTentativa;
  horaTentativa.value = traerDatos.horaTentativa.slice(0, -3);;

  fechaTentativa.addEventListener("blur", () => { validacion.quitarError(fechaTentativa.parentElement); });
  horaTentativa.addEventListener("blur", () => { validacion.quitarError(horaTentativa.parentElement); });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let validarFechaTentativa = validacion.validarFecha(fechaTentativa);
    let validarHoraTentativa = validacion.validarHora(horaTentativa, fechaTentativa);

    if (validarFechaTentativa && validarHoraTentativa) {
      const objetoReserva = {
        fechaTentativa: fechaTentativa.value,
        horaTentativa: horaTentativa.value + ":00",
      };
      const actualizar = await api.put(`reservas/${id}`, objetoReserva);

      if (actualizar.Error) {
        alertaError(actualizar.Error);
        return;
      }
      if (actualizar.Ok) {
        alertaOK(actualizar.Ok);
        window.location.href = '#/Reserva';
      }

    }
  })
}
