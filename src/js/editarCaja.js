import { alertaError, alertaOK } from "./alertas.js";

const hash = window.location.hash.slice(1);
const [cedula, idCaja] = hash.split("/");

const formulario = document.querySelector(".form");

const id = document.getElementById("id");
const fechaApertura = document.getElementById("fechaApertura");
const horaApertura = document.getElementById("horaApertura");
const montoApertura = document.getElementById("montoApertura");
const fechaCierre = document.getElementById("fechaCierre");
const horaCierre = document.getElementById("horaCierre");
const montoCierre = document.getElementById("montoCierre");
const cedulaTrabajador = document.getElementById("cedulaTrabajador");

const cargarTrabajadores = async () => {
    try {
        const response = await fetch("http://localhost:8080/ApiRestaurente/api/trabajadores");
        if (!response.ok) throw new Error("Error al cargar trabajadores");
        const data = await response.json();

        data.forEach(t => {
            const option = document.createElement("option");
            option.value = t.cedula;
            option.textContent = `${t.cedula} - ${t.nombre}`;
            cedulaTrabajador.appendChild(option);
        });
    } catch (err) {
        alertaError("No se pudo cargar el combo de trabajadores: " + err.message);
    }
};

const cargarCaja = async () => {
    const volver = document.getElementById("volver");
    volver.action = `caja.html#${cedula}`;
    try {
        const res = await fetch(`http://localhost:8080/ApiRestaurente/api/caja/${idCaja}`);
        if (!res.ok) throw new Error("Error al obtener caja");
        const data = await res.json();

        id.value = data.id;
        fechaApertura.value = data.fechaApertura;
        horaApertura.value = data.horaApertura;
        montoApertura.value = data.montoApertura;
        fechaCierre.value = data.fechaCierre;
        horaCierre.value = data.horaCierre;
        montoCierre.value = data.montoCierre;
        cedulaTrabajador.value = data.cedulaTrabajador;
    } catch (err) {
        alertaError("Error al cargar la caja: " + err.message);
    }
};

const validar = async (e) => {
    e.preventDefault();

    const datos = {
        fechaApertura: fechaApertura.value,
        horaApertura: horaApertura.value,
        montoApertura: montoApertura.value,
        fechaCierre: fechaCierre.value,
        horaCierre: horaCierre.value,
        montoCierre: montoCierre.value,
        cedulaTrabajador: cedulaTrabajador.value
    };

    try {
        const response = await fetch(`http://localhost:8080/ApiRestaurente/api/caja/${idCaja}`, {
            method: "PUT",
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
        alertaError("Error al actualizar caja: " + error.message);
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    await cargarTrabajadores();
    await cargarCaja();
});

formulario.addEventListener("submit", validar);
