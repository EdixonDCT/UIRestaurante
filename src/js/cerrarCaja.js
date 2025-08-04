import { alertaError, alertaOK } from "./alertas.js";
import { cargarHeader } from "./header.js";

const hash = window.location.hash.slice(1);
const [cedula, idCaja] = hash.split("/");

const formulario = document.querySelector(".form");
const montoCierre = document.getElementById("montoCierre");

const validar = async (e) => {
    e.preventDefault();

    const datos = {
        montoCierre: montoCierre.value
    };

    try {
        const response = await fetch(`http://localhost:8080/ApiRestaurente/api/caja/${idCaja}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const mensaje = await response.text();

        if (!response.ok) throw new Error(mensaje);

        await alertaOK("Caja: " + mensaje);
        formulario.action = `caja.html#${cedula}`;
        formulario.submit();
    } catch (error) {
        alertaError("Error al cerrar la caja: " + error.message);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    cargarHeader(cedula)  
    const botonVolver = document.getElementById("volver");
    botonVolver.action = `caja.html#${cedula}`;
});

formulario.addEventListener("submit", validar);
