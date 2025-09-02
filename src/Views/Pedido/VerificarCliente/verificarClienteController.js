import { alertaError, alertaOK } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export default () => {
    //formulario
    const form = document.querySelector(".form");

    //valores a postear
  const correo = document.querySelector(".correo");
  
    correo.addEventListener("blur", () => { validacion.quitarError(correo.parentElement) });
    correo.addEventListener("keydown", (e) => {
        validacion.validarLimiteKey(e, 30);
    });
  
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
      let validarCorreo = validacion.validarCorreo(correo);
        if (validarCorreo) {
            const existe = await api.get(`clientes/verificar/${correo.value}`);
            if (existe.Error) {
                alertaError(existe.Error);
                return;
            }
            if (existe.Ok) {
                await alertaOK(existe.Ok);
            }
        }
    })
}
