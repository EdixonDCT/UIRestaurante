import { alertaError, alertaOK, alertaPregunta } from "../alertas.js";
import { cargarHeader } from "../header.js";

const hash = window.location.hash.slice(1);
const formulario = document.querySelector(".form");
const montoApertura = document.querySelector(".montoApertura");

const validar = async (e) => {
    e.preventDefault();
    const datos = {
        montoApertura: montoApertura.value,
        cedulaTrabajador: hash
    };

    try {
        const response = await fetch("http://localhost:8080/ApiRestaurente/api/caja", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        const mensaje = await response.text();

        if (!response.ok) throw new Error(mensaje);

        await alertaOK(mensaje);
        formulario.action = `cajasTablas.html#${hash}`;
        formulario.submit();
    } catch (error) {
        alertaError(error.message);
    }
};

formulario.addEventListener("submit", validar);

document.addEventListener("DOMContentLoaded", () => {
    cargarHeader(hash)  
    const botonVolver = document.getElementById("volver");
    botonVolver.action = `cajasTablas.html#${hash}`;
});
