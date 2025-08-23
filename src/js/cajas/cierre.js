// Importamos las funciones de alerta y la función para cargar el header
import { alertaError, alertaOK } from "../alertas.js";
import { cargarHeader } from "../header.js";

// Obtenemos el hash de la URL y lo separamos en cédula y ID de caja
const hash = window.location.hash.slice(1);
const [cedula, id] = hash.split("/");

// Seleccionamos elementos del DOM: formulario, input de ID de caja y monto de cierre
const formulario = document.querySelector(".form");
const idCaja = document.querySelector(".idCaja");
const montoCierre = document.querySelector(".montoCierre");

// ======================================
// FUNCION PARA CARGAR DATOS DE LA CAJA
// ======================================
const cargarCaja = async () => {
    const volver = document.getElementById("volver");
    volver.action = `cajasTablas.html#${cedula}`; // Configuramos acción del botón "volver"
    
    try {
        // Solicitamos los datos de la caja por su ID
        const res = await fetch(`http://localhost:8080/ApiRestaurente/api/caja/${id}`);
        if (!res.ok) throw new Error("Error al obtener caja"); // Si hay fallo, lanzamos error

        const data = await res.json();
        idCaja.value = data.id; // Rellenamos el input oculto con el ID de la caja
    } catch (err) {
        alertaError("Error al cargar la caja: " + err.message);
    }
};

// ======================================
// FUNCION PARA VALIDAR Y ENVIAR CIERRE DE CAJA
// ======================================
const validar = async (e) => {
    e.preventDefault(); // Evitamos envío por defecto

    const datos = {
        montoCierre: montoCierre.value // Tomamos el monto ingresado
    };
    try {
        // Enviamos PATCH al API para actualizar la caja
        const response = await fetch(`http://localhost:8080/ApiRestaurente/api/caja/${idCaja.value}`, {
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
        alertaError(error.message); // Mostramos alerta de error
    }
};

// ======================================
// EVENTOS
// ======================================

// Cuando cargue el DOM, cargamos el header y los datos de la caja
document.addEventListener("DOMContentLoaded", async () => {
    cargarHeader(cedula);
    await cargarCaja();
});

// Al enviar el formulario, llamamos a la función validar
formulario.addEventListener("submit", validar);
