import { alertaError, alertaOK } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export const loginController = () => {
  const form = document.querySelector(".form");
  const cedula = document.querySelector(".cedula");
  const contrasena = document.querySelector(".contrasena");

  cedula.addEventListener("blur", () => {validacion.quitarError(cedula.parentElement)});
  cedula.addEventListener("keydown", (e) => {
    validacion.validarNumeroKey(e);
    validacion.validarLimiteKey(e, 10);
  });
  contrasena.addEventListener("blur", () => {validacion.quitarError(contrasena.parentElement)});
  contrasena.addEventListener("keydown", (e) => {
    validacion.validarLimiteKey(e, 30);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let validarCedula = validacion.validarCampo(cedula);
    let validarContrasena = validacion.validarCampo(contrasena);
    if (validarCedula && validarContrasena){
      const datos = {
        cedula: cedula.value,
        contrasena: contrasena.value
      }
      const respuesta = await api.postPublic("login",datos);
      if (respuesta.Error) {
        alertaError(respuesta.Error);
        return;
      } else {
        for (const element in respuesta) {
          if (Array.isArray(respuesta[element])) {
            window.localStorage.setItem(
              element,
              JSON.stringify(respuesta[element])
            );
            continue;
          }
          window.localStorage.setItem(element, respuesta[element]);
        }
        // console.log(JSON.parse(window.localStorage.getItem("permisos")));
        await alertaOK("Inicio de Sesion Correctamente.");
        window.location.href = '#/Home';
      }
    }
  });
};
