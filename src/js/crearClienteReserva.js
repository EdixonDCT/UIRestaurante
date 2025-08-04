import { alertaError, alertaOK } from "./alertas.js";
import { cargarHeader } from "./header.js";

const hash = window.location.hash.slice(1);
const formulario = document.querySelector(".form");
const formularioIr = document.querySelector(".formIr")
const correo = document.getElementById("correo");
const cedula = document.getElementById("cedula");
const telefono = document.getElementById("telefono");

formulario.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const datos = {
        correo: correo.value,
        cedula: cedula.value,
        telefono: telefono.value
    };

    try {
        const response = await fetch("http://localhost:8080/ApiRestaurente/api/clientes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        const mensaje = await response.text();
        if (!response.ok) throw new Error(mensaje);

        await alertaOK(mensaje);
        formulario.action = `reservaCrear.html#${hash}`;
        formulario.submit();
    } catch (error) {
        alertaError(error.message);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    cargarHeader(hash);
    formularioIr.action =`reservaCrear.html#${hash}`;
    document.getElementById("volver").action = `reservas.html#${hash}`;
});
