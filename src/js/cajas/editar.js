import { alertaError, alertaOK } from "../alertas.js";
import { cargarHeader } from "../header.js";

const hash = window.location.hash.slice(1);
const [cedula, id] = hash.split("/");

const formulario = document.querySelector(".form");
const idCaja = document.querySelector(".idCaja");
const montoApertura = document.querySelector(".montoApertura");
const montoCierre = document.querySelector(".montoCierre");
const cedulaTrabajador = document.querySelector(".cedulaTrabajador")
const cargarCaja = async () => {
    const volver = document.getElementById("volver");
    volver.action = `cajasTablas.html#${cedula}`;
    try {
        const res = await fetch(`http://localhost:8080/ApiRestaurente/api/caja/${id}`);
        if (!res.ok) throw new Error("Error al obtener caja");
        const data = await res.json();
        idCaja.value = data.id;
        montoApertura.value = data.montoApertura;
        montoCierre.value = data.montoCierre;
        cedulaTrabajador.value = cedula;
    } catch (err) {
        alertaError("Error al cargar la caja: " + err.message);
    }
};
const validar = async (e) => {
    e.preventDefault();

    const datos = {
        montoApertura: montoApertura.value,
        montoCierre: montoCierre.value,
        cedulaTrabajador: cedulaTrabajador.value
    };
    try {
        const response = await fetch(`http://localhost:8080/ApiRestaurente/api/caja/${idCaja.value}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const mensaje = await response.text();

        if (!response.ok) throw new Error(mensaje);

        await alertaOK(mensaje);
        formulario.action = `cajasTablas.html#${cedula}`;
        formulario.submit();
    } catch (error) {
        alertaError(error.message);
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    cargarHeader(cedula)
    await cargarCaja();
});

formulario.addEventListener("submit", validar);
