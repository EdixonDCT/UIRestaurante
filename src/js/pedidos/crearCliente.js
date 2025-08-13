import { alertaError, alertaOK } from "../alertas.js";
import { cargarHeader } from "../header.js";

const hasher = window.location.hash.slice(1);
const [hash,metodo,idEditar] = hasher.split("/");
let rutaVolverIrse = ""
if (metodo == "pc") rutaVolverIrse = `pedidoCrear.html#${hash}`
else if (metodo == "pe") rutaVolverIrse = `pedidoEditar.html#${hash}/${idEditar}/pe`
else if (metodo == "rc") rutaVolverIrse = `../reservas/reservaCrear.html#${hash}`
else if (metodo == "re") rutaVolverIrse = `../reservas/reservaEditar.html#${hash}/${idEditar}`
else if (metodo == "rpe") rutaVolverIrse = `pedidoEditar.html#${hash}/${idEditar}/rpe`
else if (metodo == "repa") rutaVolverIrse = `pedidoEditar.html#${hash}/${idEditar}/repa`
const formulario = document.querySelector(".form");
const correo = document.querySelector(".correo");
const cedula = document.querySelector(".cedula");
const telefono = document.querySelector(".telefono");

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
        formulario.action = `${rutaVolverIrse}/${correo.value}`;
        formulario.submit();
    } catch (error) {
        alertaError(error.message);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    cargarHeader(hash)
    document.getElementById("volver").action = rutaVolverIrse;
});
