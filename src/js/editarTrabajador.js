import { alertaError, alertaOK } from "./alertas.js";

const hash = window.location.hash.slice(1);
const lista = hash.split("/");
const idUser = lista[0];
const cedulaTrabajador = lista[1];

const formulario = document.querySelector(".form");
const cedula = document.getElementById("cedula");
const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const nacimiento = document.getElementById("nacimiento");
const contrasena = document.getElementById("contrasena");
const oficio = document.getElementById("oficio");

const validar = async (e) => {
    e.preventDefault();
    const datos = {
        nombre: nombre.value,
        apellido: apellido.value,
        nacimiento: nacimiento.value,
        contrasena: contrasena.value,
        idOficio: oficio.value
    };

    try {
        const response = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${cedulaTrabajador}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const mensaje = await response.text();
        if (!response.ok) throw new Error(mensaje);

        await alertaOK(mensaje);
        formulario.action = `trabajadores.html#${idUser}`;
        formulario.submit();
    } catch (error) {
        alertaError(error.message);
    }
};

const cargarOficios = async () => {
    try {
        const res = await fetch("http://localhost:8080/ApiRestaurente/api/oficios");
        const data = await res.json();
        oficio.innerHTML = data.map(o => `<option value="${o.codigo}">${o.tipo}</option>`).join("");
    } catch (error) {
        console.error("Error cargando oficios:", error);
    }
};

const infoTrabajador = async () => {
    const botonVolver = document.getElementById("volver");
    botonVolver.action = `trabajadores.html#${idUser}`;

    await cargarOficios();

    try {
        const res = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${cedulaTrabajador}`);
        const data = await res.json();

        cedula.value = data.cedula;
        nombre.value = data.nombre;
        apellido.value = data.apellido;
        nacimiento.value = data.nacimiento;
        contrasena.value = data.contrasena;
        oficio.value = data.idOficio;
    } catch (error) {
        console.error("Error:", error);
    }
};

document.addEventListener("DOMContentLoaded", infoTrabajador);
formulario.addEventListener("submit", validar);
