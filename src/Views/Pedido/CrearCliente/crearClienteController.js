import { alertaError, alertaOK } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export default () => {
    //formulario
    const form = document.querySelector(".form");

    //valores a postear
    const correo = document.querySelector(".correo");
    const cedula = document.querySelector(".cedula");
    const telefono = document.querySelector(".telefono");
  
    correo.addEventListener("blur", () => { validacion.quitarError(correo.parentElement) });
    correo.addEventListener("keydown", (e) => {
        validacion.validarLimiteKey(e, 30);
    });
    cedula.addEventListener("blur", () => { validacion.quitarError(cedula.parentElement) });
    cedula.addEventListener("keydown", (e) => {
        validacion.validarNumeroKey(e);
        validacion.validarLimiteKey(e, 10);
    });
    telefono.addEventListener("blur", () => { validacion.quitarError(telefono.parentElement) });
    telefono.addEventListener("keydown", (e) => {
        validacion.validarNumeroKey(e);
        validacion.validarLimiteKey(e, 10);
    });
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
      let validarCorreo = validacion.validarCorreo(correo);
      let validarCedula = true;
      let validarTelefono = true;
      if (cedula.value != "" && telefono.value != "")
      {
        validarCedula = validacion.validarCampo(correo);
        validarTelefono = validacion.validarCampo(telefono);
      }
        if (validarCorreo && validarCedula && validarTelefono) {
            const objetoMesa = {
                correo: correo.value,
                cedula: cedula.value,
                telefono: telefono.value,
            }
            const creado = await api.post("clientes", objetoMesa);
            if (creado.Error) {
                alertaError(creado.Error);
                return;
            }
            if (creado.Ok) {
                await alertaOK(creado.Ok);
                window.location.href = '#/Pedido';
            }
        }
    })
}
