import { alertaError, alertaOK } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export default async () => {
  const form = document.querySelector(".form");

  const nombre = document.querySelector(".nombre");

  nombre.addEventListener("blur", () => { validacion.quitarError(nombre.parentElement) });
  nombre.addEventListener("keydown", (e) => {
    validacion.validarTextoEspacioKey(e);
    validacion.validarLimiteKey(e, 20);
  })

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let validarNombre = validacion.validarCampo(nombre);

    if (validarNombre) {
      const objetoIngrediente = {
        nombre: nombre.value
      };
      const creado = await api.post("ingredientes", objetoIngrediente);
      if (creado.Error) {
        alertaError(creado.Error);
        return;
      }
      if (creado.Ok) {
        await alertaOK(creado.Ok);
        window.location.href = '#/Ingrediente';
      }
      if (creado.Error) {
        alertaError(creado.Error);
      }
    }
  })
}
