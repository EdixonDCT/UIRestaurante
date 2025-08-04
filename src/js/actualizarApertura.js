import { alertaError, alertaOK } from "./alertas.js";
import { cargarHeader } from "./header.js";

const hash = window.location.hash.slice(1);
const [cedula, idCaja] = hash.split("/");

const formulario = document.querySelector(".form");
const montoApertura = document.getElementById("montoApertura");

// Traer datos actuales (opcional)
const cargarCaja = async () => {
    const botonVolver = document.getElementById("volver");
    botonVolver.action = `caja.html#${cedula}`;

    try {
        const res = await fetch(`http://localhost:8080/ApiRestaurente/api/caja/${idCaja}`);
        if (!res.ok) throw new Error("Error al cargar caja");
        const data = await res.json();
        montoApertura.value = data.montoApertura;
    } catch (err) {
        alertaError("No se pudo cargar la caja: " + err.message);
    }
};

const validar = async (e) => {
    e.preventDefault();

    const datos = {
        montoApertura: montoApertura.value
    };

    try {
        const response = await fetch(`http://localhost:8080/ApiRestaurente/api/caja/apertura/${idCaja}`, {
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
        alertaError("Error al actualizar apertura: " + error.message);
    }
};

document.addEventListener("DOMContentLoaded", () => {
  cargarHeader(cedula)
    cargarCaja();
});

formulario.addEventListener("submit", validar);
