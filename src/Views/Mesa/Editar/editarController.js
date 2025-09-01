import { alertaError, alertaOK } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export default async () => {
  //formulario
  const form = document.querySelector(".form");

  //valores a postear
  const numero = document.querySelector(".numero");
  const capacidad = document.querySelector(".capacidad");

  const hash = location.hash.slice(1);
  const [url,id] = hash.split("=");

  const traerDatos = await api.get(`mesas/${id}`);
  numero.value = traerDatos.numero;
  capacidad.value = traerDatos.capacidad;

  capacidad.addEventListener("blur", () => { validacion.quitarError(capacidad.parentElement) });
  capacidad.addEventListener("keydown", (e) => {
    validacion.validarNumeroKey(e);
    validacion.validarLimiteKey(e, 2);
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let validarCapacidad = validacion.validarCampo(capacidad);

    if (validarCapacidad) {
      const objetoMesa = {
        numero: numero.value,
        capacidad: capacidad.value
      }
      const actualizar = await api.put(`mesas/${id}`, objetoMesa);
      if (actualizar.Error) {
        alertaError(actualizar.Error);
        return;
      }
      if (actualizar.Ok) {
        await alertaOK(actualizar.Ok);
        window.location.href = '#/Mesa';
      }
    }
  })
}
