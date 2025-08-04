import { alertaError, alertaOK, alertaPregunta } from "./alertas.js";
import { cargarHeader } from "./header.js";

const hash = window.location.hash.slice(1);
const formulario = document.querySelector(".form");
const montoApertura = document.getElementById("montoApertura");
const cedulaTrabajador = document.getElementById("cedulaTrabajador");

// Cargar opciones del combo de trabajadores
const cargarTrabajadores = async () => {
    try {
        const response = await fetch("http://localhost:8080/ApiRestaurente/api/trabajadores");
        if (!response.ok) throw new Error("Error al obtener trabajadores");

        const trabajadores = await response.json();
        trabajadores.forEach(t => {
            const option = document.createElement("option");
            option.value = t.cedula;
            option.textContent = `${t.cedula} - ${t.nombre}`;
            cedulaTrabajador.appendChild(option);
        });
    } catch (error) {
        alertaError("No se pudieron cargar los trabajadores: " + error.message);
    }
};

const validar = async (e) => {
    e.preventDefault();
    const datos = {
        montoApertura: montoApertura.value,
        cedulaTrabajador: cedulaTrabajador.value
    };

    try {
        const response = await fetch("http://localhost:8080/ApiRestaurente/api/caja", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        const mensaje = await response.text();

        if (!response.ok) throw new Error(mensaje);

        await alertaOK("Caja: " + mensaje);
        formulario.action = `caja.html#${hash}`;
        formulario.submit();
    } catch (error) {
        alertaError(error.message);
    }
};

formulario.addEventListener("submit", validar);

document.addEventListener("DOMContentLoaded", () => {
    cargarHeader(hash)  
    cargarTrabajadores();
    const botonVolver = document.getElementById("volver");
    botonVolver.action = `caja.html#${hash}`;
});
