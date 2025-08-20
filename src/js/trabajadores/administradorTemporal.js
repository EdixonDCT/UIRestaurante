import { alertaError, alertaOK,alertaPregunta } from "../alertas.js";
import { cargarHeader } from "../header.js";

const hash = window.location.hash.slice(1);
const lista = hash.split("/");
const idUser = lista[0];
const cedulaTrabajador = lista[1];

const formulario = document.querySelector(".form");
const fechaInicio = document.querySelector(".fechaInicio");
const fechaFin = document.querySelector(".fechaFin");

const validar = async (e) => {
    e.preventDefault();
    const hoy = new Date();
    const inicio = new Date(fechaInicio.value);
    const fin = new Date(fechaFin.value);
    hoy.setHours(0, 0, 0, 0);
    inicio.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);
    
    if (inicio < hoy) {
        return alertaError("Error: La fecha de inicio no puede ser dias anteriores ni HOY(realizar con un DIA de ANTELACION).");
    }
    if (fin < inicio) {
        return alertaError("Error: La fecha de fin no puede ser menor que la fecha de inicio.");
    }
    if (fin.getTime() === inicio.getTime()) {
        const confirmar = await alertaPregunta("Si la fecha de Inicio y Fin es la misma, solo durara un dia(ese dia) estas seguro?")
        if (!confirmar.isConfirmed) {
            return;
        }
    }
    const datos = {
        adminTemporalInicio: fechaInicio.value,
        adminTemporalFin: fechaFin.value
    };
    ActualizarTrabajador(datos);
};

const ActualizarTrabajador = async (datos) => {
    try {
        const response = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/adminTemporal/${cedulaTrabajador}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const mensaje = await response.text();
        if (!response.ok) {
            throw new Error(mensaje);
        }
        await alertaOK("Trabajador: Acceso de Administrador Temporal realizado con EXITO");
        formulario.action = `TrabajadorEditar.html#${idUser}/${cedulaTrabajador}`;
        formulario.submit();
    } catch (error) {
        alertaError(error.message);
    }
};

const infoTrabajador = async (id) => {
    try {
        const res = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${id}`);
        const data = await res.json();

        const nombre = ` ${data.nombre} ${data.apellido}(cc:${data.cedula})`;
        
        if (data.adminTemporalFin && data.adminTemporalInicio) 
        {
            fechaInicio.value = data.adminTemporalInicio;
            fechaFin.value = data.adminTemporalFin;
        }
        return nombre;
    } catch (error) {
        console.error("Error:", error);
    }
}
document.addEventListener("DOMContentLoaded", async () => {
    cargarHeader(idUser);
    const botonVolver = document.getElementById("volver");
    botonVolver.action = `TrabajadorEditar.html#${idUser}/${cedulaTrabajador}`;
    const usuario = document.querySelector(".input > label");
    let nombre = await infoTrabajador(cedulaTrabajador);
    usuario.textContent += nombre;
}
);
formulario.addEventListener("submit", validar);
