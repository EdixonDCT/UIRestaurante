import { alertaError, alertaOK, alertaTiempo } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export default async () => {
  const form = document.querySelector(".form");

  const nombre = document.querySelector(".nombre");
  const precio = document.querySelector(".precio");

  const hash = location.hash.slice(1);
  const [url, id] = hash.split("=");

  const traerDatos = await api.get(`cocteles/${id}`);
  nombre.value = traerDatos.nombre;
  precio.value = traerDatos.precio;

  nombre.addEventListener("blur", () => { validacion.quitarError(nombre.parentElement) });
  nombre.addEventListener("keydown", (e) => {
    validacion.validarTextoEspacioKey(e);
    validacion.validarLimiteKey(e, 20);
  });
  precio.addEventListener("blur", () => { validacion.quitarError(precio.parentElement) });
  precio.addEventListener("keydown", (e) => {
    validacion.validarNumeroKey(e);
    validacion.validarLimiteKey(e, 6);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let validarNombre = validacion.validarCampo(nombre);
    let validarPrecio = validacion.validarCampo(precio);

    if (validarNombre && validarPrecio) {
      const objetoPlatillo = {
        nombre: nombre.value,
        precio: precio.value,
      }
      const creado = await api.put(`cocteles/${id}`, objetoPlatillo);
      if (creado.Error) {
        alertaError(creado.Error);
        return;
      }
      else {
        await alertaOK(creado.Ok);
        window.location.href = '#/Platillo';
      }
    }
  })
}
