// Importamos funciones de alerta y para cargar el header
import { alertaError, alertaOK } from "../alertas.js";
import { cargarHeader } from "../header.js";

// Obtenemos el hash de la URL y lo separamos en cédula y ID de la caja
const hash = window.location.hash.slice(1);
const [cedula, id] = hash.split("/");

// Seleccionamos elementos del DOM: formulario e inputs de caja
const formulario = document.querySelector(".form");
const idCaja = document.querySelector(".idCaja");
const montoApertura = document.querySelector(".montoApertura");
const montoCierre = document.querySelector(".montoCierre");
const cedulaTrabajador = document.querySelector(".cedulaTrabajador");

// ======================================
// FUNCION PARA CARGAR DATOS DE LA CAJA
// ======================================
const cargarCaja = async () => {
    const volver = document.getElementById("volver");
    volver.action = `cajasTablas.html#${cedula}`; // Configura el botón "volver"

    try {
        // Solicitamos los datos de la caja al API
        const res = await fetch(`http://localhost:8080/ApiRestaurente/api/caja/${id}`);
        if (!res.ok) throw new Error("Error al obtener caja"); // Si falla, lanzamos error

        const data = await res.json();
        // Rellenamos los inputs con la información recibida
        idCaja.value = data.id;
        montoApertura.value = data.montoApertura;
        montoCierre.value = data.montoCierre;
        cedulaTrabajador.value = cedula;
    } catch (err) {
        alertaError("Error al cargar la caja: " + err.message);
    }
};

// ======================================
// FUNCION PARA VALIDAR Y ACTUALIZAR CAJA
// ======================================
const validar = async (e) => {
    e.preventDefault(); // Evita envío por defecto

    // Creamos el objeto con los datos que enviaremos
    const datos = {
        montoApertura: montoApertura.value,
        montoCierre: montoCierre.value,
        cedulaTrabajador: cedulaTrabajador.value
    };

    try {
        // Enviamos PUT al API para actualizar la caja
        const response = await fetch(`http://localhost:8080/ApiRestaurente/api/caja/${idCaja.value}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        const mensaje = await response.text();

        if (!response.ok) throw new Error(mensaje); // Si falla, lanzamos error

        await alertaOK(mensaje); // Mostramos alerta de éxito
        formulario.action = `cajasTablas.html#${cedula}`; // Redirigimos al listado
        formulario.submit();
    } catch (error) {
        alertaError(error.message); // Mostramos alerta de error
    }
};

// ======================================
// EVENTOS
// ======================================

// Al cargar el DOM, cargamos el header y los datos de la caja
document.addEventListener("DOMContentLoaded", async () => {
    cargarHeader(cedula);
    await cargarCaja();
});

// Al enviar el formulario, llamamos a la función validar
formulario.addEventListener("submit", validar);
