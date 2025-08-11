import { alertaError, alertaOK } from "../alertas.js";
import { cargarHeader } from "../header.js";

const hash = window.location.hash.slice(1);
const lista = hash.split("/");
const idUser = lista[0];
const cedulaTrabajador = lista[1];

const formulario = document.querySelector(".form");
const cedula = document.querySelector(".cedula");
const nombre = document.querySelector(".nombre");
const apellido = document.querySelector(".apellido");
const nacimiento = document.querySelector(".fecha");
const contrasena = document.querySelector(".contrasena");
const contrasenaValidar = document.querySelector(".contrasenaValidar");
const oficio = document.querySelector(".oficio");

const validar = async (e) => {
    e.preventDefault();
    if (!nacimiento.value == "") {
        if (validarEdad(nacimiento.value)) return alertaError("Error: No es mayor de 18 Años")
        if (validarEdadMayor(nacimiento.value)) return alertaError("Error: La edad máxima permitida para trabajar es 70 años")
    }
    if (contrasena.value !== contrasenaValidar.value) return alertaError("Error: Las contraseñas no coinciden");
    const datos = {
        cedula: cedula.value,
        nombre: nombre.value,
        apellido: apellido.value,
        nacimiento: nacimiento.value,
        contrasena: contrasena.value,
        idOficio: oficio.value,
    };
    ActualizarTrabajador(datos);
};
const ActualizarTrabajador = async (datos) => {
    try {
        const response = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${cedulaTrabajador}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const mensaje = await response.text();
        if (!response.ok) {
            throw new Error(mensaje);
        }
        await alertaOK("Trabajador Creado con Exito.");
        formulario.action = `trabajadoresTablas.html#${idUser}`;
        formulario.submit();
    } catch (error) {
        alertaError(error.message);
    }
};
const validarEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }

    if (edad >= 18) {
        return false
    } else {
        return true;
    }
}
const validarEdadMayor = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    if (edad > 70) {
        return true
    } else {
        return false;
    }
}
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
    botonVolver.action = `trabajadoresTablas.html#${idUser}`;

    await cargarOficios();

    try {
        const res = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${cedulaTrabajador}`);
        const data = await res.json();

        cedula.value = data.cedula;
        nombre.value = data.nombre;
        apellido.value = data.apellido;
        nacimiento.value = data.nacimiento;
        contrasena.value = data.contrasena;
        contrasenaValidar.value = data.contrasena;
        oficio.value = data.idOficio;
    } catch (error) {
        console.error("Error:", error);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    cargarHeader(idUser);
    infoTrabajador();
}
);
formulario.addEventListener("submit", validar);
