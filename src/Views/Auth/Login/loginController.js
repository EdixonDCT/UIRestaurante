import "../../../css/login.css";
import { alertaError, alertaOK } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export const loginController = () => {
  const form = document.querySelector(".container");
  const cedula = document.querySelector(".login__input.cedula");
  const contrasena = document.querySelector(".login__input.contraseña");
  
  cedula.addEventListener("blur", validacion.validarCampo);
  cedula.addEventListener("keydown", (e) => {
    validacion.validarNumeroKey(e);
    validacion.validarLimiteKey(e, 10);
  });

  contrasena.addEventListener("blur", validacion.validarCampo);
  contrasena.addEventListener("keydown", (e) => {
    validacion.validarLimiteKey(e, 30);
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (validacion.validarCampos(e)) {
      const respuesta = await api.postPublic("login", validacion.datos);
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
