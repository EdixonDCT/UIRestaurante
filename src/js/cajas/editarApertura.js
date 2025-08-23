// Importamos funciones para mostrar alertas y para cargar el header
import { alertaError, alertaOK } from "../alertas.js";
import { cargarHeader } from "../header.js";

// Obtenemos el hash de la URL y lo separamos en cédula del trabajador y ID de la caja
const hash = window.location.hash.slice(1);
const [cedula, id] = hash.split("/");

// Seleccionamos los elementos del DOM que usaremos
const formulario = document.querySelector(".form"); // Formulario de apertura de caja
const idCaja = document.querySelector(".idCaja"); // Input oculto para ID de la caja
const montoApertura = document.querySelector(".montoApertura"); // Input de monto de apertura

// ======================================
// FUNCION PARA CARGAR DATOS DE LA CAJA
// ======================================
const cargarCaja = async () => {
    // Configuramos el botón "volver" para regresar al listado de cajas
    const volver = document.getElementById("volver");
    volver.action = `cajasTablas.html#${cedula}`;

    try {
        // Solicitamos los datos de la caja al API
        const res = await fetch(`http://localhost:8080/ApiRestaurente/api/caja/${id}`);
        if (!res.ok) throw new Error("Error al obtener caja"); // Si falla, lanzamos error

        const data = await res.json();
        // Rellenamos los inputs con la información de la caja
        idCaja.value = data.id;
        montoApertura.value = data.montoApertura;
    } catch (err) {
        alertaError("Error al cargar la caja: " + err.message); // Mostramos alerta en caso de error
    }
};

// ======================================
// FUNCION PARA VALIDAR Y ACTUALIZAR APERTURA DE CAJA
// ======================================
const validar = async (e) => {
    e.preventDefault(); // Evitamos el envío por defecto del formulario

    // Creamos el objeto con los datos que enviaremos al backend
    const datos = {
        montoApertura: montoApertura.value
    };

    try {
        // Enviamos PATCH al API para actualizar la apertura de la caja
        const response = await fetch(`http://localhost:8080/ApiRestaurente/api/caja/apertura/${idCaja.value}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        const mensaje = await response.text();

        if (!response.ok) throw new Error(mensaje); // Si falla, lanzamos error

        await alertaOK(mensaje); // Mostramos alerta de éxito
        formulario.action = `cajasTablas.html#${cedula}`; // Redirigimos al listado de cajas
        formulario.submit();
    } catch (error) {
        alertaError(error.message); // Mostramos alerta en caso de error
    }
};

// ======================================
// EVENTOS
// ======================================

// Al cargar la página, cargamos el header y los datos de la caja
document.addEventListener("DOMContentLoaded", async () => {
    cargarHeader(cedula);
    await cargarCaja();
});

// Al enviar el formulario, llamamos a la función validar
formulario.addEventListener("submit", validar);
