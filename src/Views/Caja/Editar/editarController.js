import { alertaError, alertaOK } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export default async () => {
    const form = document.querySelector(".form");

    const montoApertura = document.querySelector(".montoApertura");
    const montoCierre = document.querySelector(".montoCierre");

    const hash = location.hash.slice(1);
    const [url, id] = hash.split("=");

    const valorMonto = await api.get(`caja/${id}`);
    montoApertura.value = valorMonto.montoApertura;
    montoCierre.value = valorMonto.montoCierre;

    montoApertura.addEventListener("blur", () => { validacion.quitarError(montoApertura.parentElement) });
    montoApertura.addEventListener("keydown", (e) => {
        validacion.validarNumeroKey(e);
        validacion.validarLimiteKey(e, 8);
    });

    montoCierre.addEventListener("blur", () => { validacion.quitarError(montoCierre.parentElement) });
    montoCierre.addEventListener("keydown", (e) => {
        validacion.validarNumeroKey(e);
        validacion.validarLimiteKey(e, 8);
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let validarMontoCierre = validacion.validarCampo(montoCierre);
        let validarMontoApertura = validacion.validarCampo(montoApertura);

        if (validarMontoApertura && validarMontoCierre) {
            const objetoCaja = {
                montoApertura: montoApertura.value,
                montoCierre: montoCierre.value,
                cedulaTrabajador: window.localStorage.getItem("cedula")
            }
            const actualizar = await api.put(`caja/${id}`, objetoCaja);
            if (actualizar.Error) {
                alertaError(actualizar.Error);
                return;
            }
            if (actualizar.Ok) {
                await alertaOK(actualizar.Ok);
                window.location.href = '#/Caja';
            }
        }
    })
}
