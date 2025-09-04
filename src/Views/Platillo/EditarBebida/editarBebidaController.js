import { alertaError, alertaOK, alertaTiempo } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export default async () => {
  const form = document.querySelector(".form");

  const nombre = document.querySelector(".nombre");
  const precio = document.querySelector(".precio");
  const comboTipo = document.querySelector(".comboTipo");
  const comboUnidad = document.querySelector(".comboUnidad");

  const hash = location.hash.slice(1);
  const [url, id] = hash.split("=");

  const traerDatos = await api.get(`bebidas/${id}`);
  nombre.value = traerDatos.nombre;
  precio.value = traerDatos.precio;
  comboTipo.value = traerDatos.tipo;
  comboUnidad.value = traerDatos.unidad;

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
  comboTipo.addEventListener("blur", () => { validacion.quitarError(comboTipo.parentElement) });
  comboUnidad.addEventListener("blur", () => { validacion.quitarError(comboUnidad.parentElement) });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let validarNombre = validacion.validarCampo(nombre);
    let validarPrecio = validacion.validarCampo(precio);
    let validarTipo = validacion.validarCampo(comboTipo);
    let validarUnidad = validacion.validarCampo(comboUnidad);

    if (validarNombre && validarPrecio && validarTipo && validarUnidad) {
      const objetoPlatillo = {
        nombre: nombre.value,
        precio: precio.value,
        tipo: comboTipo.value,
        unidad: comboUnidad.value
      }
      const creado = await api.put(`bebidas/${id}`, objetoPlatillo);
      if (creado.Error) {
        alertaError(creado.Error);
        return;
      }
      await alertaOK(creado.Ok);
      window.location.href = '#/Platillo';
    }
  })
}
