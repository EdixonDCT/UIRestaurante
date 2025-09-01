import { alertaError, alertaOK } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export default () => {
    const form = document.querySelector(".form");

    const montoApertura = document.querySelector(".montoApertura");

    montoApertura.addEventListener("blur", () => { validacion.quitarError(montoApertura.parentElement) });
    montoApertura.addEventListener("keydown", (e) => {
        validacion.validarNumeroKey(e);
        validacion.validarLimiteKey(e, 8);
    });
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let validarMontoApertura = validacion.validarCampo(montoApertura);

        if (validarMontoApertura) {
            const objetoCaja = {
                cedulaTrabajador: window.localStorage.getItem("cedula"),
                montoApertura: montoApertura.value
            }
            const creado = await api.post("caja", objetoCaja);
            if (creado.Error) {
                alertaError(creado.Error);
                return;
            }
            if (creado.Ok) {
                await alertaOK(creado.Ok);
                window.location.href = '#/Caja';
            }
        }
    })
}
