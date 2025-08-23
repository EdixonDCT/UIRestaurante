// Importa funciones de alerta desde el archivo alertas.js
import { alertaError, alertaOK } from "../alertas.js";
// Importa la función para cargar el header desde el archivo header.js
import { cargarHeader } from "../header.js";

// Obtiene el hash de la URL y lo divide en partes
const hasher = window.location.hash.slice(1);
const [hash,metodo,idEditar] = hasher.split("/");

// Variable para definir la ruta a donde volver según el método recibido
let rutaVolverIrse = ""
if (metodo == "pc") rutaVolverIrse = `pedidoCrear.html#${hash}`
else if (metodo == "pe") rutaVolverIrse = `pedidoEditar.html#${hash}/${idEditar}/pe`
else if (metodo == "rc") rutaVolverIrse = `../reservas/reservaCrear.html#${hash}`
else if (metodo == "re") rutaVolverIrse = `../reservas/reservaEditar.html#${hash}/${idEditar}`
else if (metodo == "rpe") rutaVolverIrse = `pedidoEditar.html#${hash}/${idEditar}/rpe`
else if (metodo == "repa") rutaVolverIrse = `pedidoEditar.html#${hash}/${idEditar}/repa`

// Referencias a elementos del formulario
const formulario = document.querySelector(".form");
const correo = document.querySelector(".correo");
const cedula = document.querySelector(".cedula");
const telefono = document.querySelector(".telefono");

// Evento submit del formulario para crear un cliente
formulario.addEventListener("submit", async (e) => {
    e.preventDefault(); // Previene el envío normal del formulario

    // Datos del cliente a registrar
    const datos = {
        correo: correo.value,
        cedula: cedula.value,
        telefono: telefono.value
    };

    try {
        // Envía los datos al backend por POST
        const response = await fetch("http://localhost:8080/ApiRestaurente/api/clientes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        // Obtiene el mensaje de la respuesta
        const mensaje = await response.text();
        if (!response.ok) throw new Error(mensaje);

        // Muestra alerta de éxito
        await alertaOK(mensaje);

        // Redirige a la ruta correspondiente agregando el correo del cliente creado
        formulario.action = `${rutaVolverIrse}/${correo.value}`;
        formulario.submit();
    } catch (error) {
        // Muestra alerta de error si algo falla
        alertaError(error.message);
    }
});

// Evento cuando carga el documento
document.addEventListener("DOMContentLoaded", () => {
    // Carga el header del usuario
    cargarHeader(hash)

    // Configura la acción del botón volver
    document.getElementById("volver").action = rutaVolverIrse;
});
