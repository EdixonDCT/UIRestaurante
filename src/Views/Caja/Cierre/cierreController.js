import { alertaError, alertaOK } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export default () => {
    const form = document.querySelector(".form");

    const montoCierre = document.querySelector(".montoCierre");

    const hash = location.hash.slice(1);
    const [url, id] = hash.split("=");

    montoCierre.addEventListener("blur", () => { validacion.quitarError(montoCierre.parentElement) });
    montoCierre.addEventListener("keydown", (e) => {
        validacion.validarNumeroKey(e);
        validacion.validarLimiteKey(e, 8);
    });
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let validarMontoCierre = validacion.validarCampo(montoCierre);

        if (validarMontoCierre) {
            const objetoCaja = {
                montoCierre: montoCierre.value
            }
            const parchear = await api.patch(`caja/${id}`, objetoCaja);
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
