import { alertaError, alertaOK } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export default () => {
    //formulario
    const form = document.querySelector(".form");

    //valores a postear
    const numero = document.querySelector(".numero");
    const capacidad = document.querySelector(".capacidad");

    numero.addEventListener("blur", () => { validacion.quitarError(numero.parentElement) });
    numero.addEventListener("keydown", (e) => {
        validacion.validarNumeroKey(e);
        validacion.validarLimiteKey(e, 3);
    });
    capacidad.addEventListener("blur", () => { validacion.quitarError(capacidad.parentElement) });
    capacidad.addEventListener("keydown", (e) => {
        validacion.validarNumeroKey(e);
        validacion.validarLimiteKey(e, 2);
    });
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let validarNumero = validacion.validarCampo(numero);
        let validarCapacidad = validacion.validarCampo(capacidad);

        if (validarNumero && validarCapacidad) {
            const objetoMesa = {
                numero: numero.value,
                capacidad: capacidad.value
            }
            const creado = await api.post("mesas", objetoMesa);
            if (creado.Error) {
                alertaError(creado.Error);
                return;
            }
            if (creado.Ok) {
                await alertaOK(creado.Ok);
                window.location.href = '#/Mesa';
            }
        }
    })
}
