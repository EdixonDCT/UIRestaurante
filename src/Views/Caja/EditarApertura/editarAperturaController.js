import { alertaError, alertaOK } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export default async() => {
    const form = document.querySelector(".form");

    const montoApertura = document.querySelector(".montoApertura");

    const hash = location.hash.slice(1);
    const [url, id] = hash.split("=");

    const valorMonto = await api.get(`caja/${id}`);
    montoApertura.value = valorMonto.montoApertura;

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
                montoApertura: montoApertura.value
            }
            const parchear = await api.patch(`caja/apertura/${id}`,objetoCaja);
            if (parchear.Error) {
                alertaError(parchear.Error);
                return;
            }
            if (parchear.Ok) {
                await alertaOK(parchear.Ok);
                window.location.href = '#/Caja';
            }
        }
    })
}
