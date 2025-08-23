import { alertaError, alertaOK,alertaPregunta } from "../alertas.js"; // Importa funciones de alertas
import { cargarHeader } from "../header.js"; // Importa función para cargar header

const hash = window.location.hash.slice(1); // Obtiene hash de la URL sin '#'
const lista = hash.split("/"); // Separa valores del hash por '/'
const idUser = lista[0]; // Primer valor = id del usuario
const cedulaTrabajador = lista[1]; // Segundo valor = cédula del trabajador

const formulario = document.querySelector(".form"); // Selecciona formulario
const fechaInicio = document.querySelector(".fechaInicio"); // Input fecha inicio
const fechaFin = document.querySelector(".fechaFin"); // Input fecha fin

const validar = async (e) => { // Función validar formulario
    e.preventDefault(); // Evita envío por defecto
    const hoy = new Date(); // Fecha actual
    const inicio = new Date(fechaInicio.value); // Convierte inicio a Date
    const fin = new Date(fechaFin.value); // Convierte fin a Date
    hoy.setHours(0, 0, 0, 0); // Quita horas de hoy
    inicio.setHours(0, 0, 0, 0); // Quita horas inicio
    fin.setHours(0, 0, 0, 0); // Quita horas fin
    
    if (inicio < hoy) { // Valida si inicio es menor que hoy
        return alertaError("Error: La fecha de inicio no puede ser dias anteriores ni HOY(realizar con un DIA de ANTELACION)."); // Muestra error
    }
    if (fin < inicio) { // Valida si fin es menor que inicio
        return alertaError("Error: La fecha de fin no puede ser menor que la fecha de inicio."); // Muestra error
    }
    if (fin.getTime() === inicio.getTime()) { // Si inicio y fin son iguales
        const confirmar = await alertaPregunta("Si la fecha de Inicio y Fin es la misma, solo durara un dia(ese dia) estas seguro?") // Confirma con alerta
        if (!confirmar.isConfirmed) { // Si no confirma
            return; // Sale de la función
        }
    }
    const datos = { // Objeto con fechas
        adminTemporalInicio: fechaInicio.value, // Fecha inicio
        adminTemporalFin: fechaFin.value // Fecha fin
    };
    ActualizarTrabajador(datos); // Llama a función para actualizar
};

const ActualizarTrabajador = async (datos) => { // Función para actualizar trabajador
    try {
        const response = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/adminTemporal/${cedulaTrabajador}`, { // Llamada API PATCH
            method: "PATCH", // Método PATCH
            headers: {
                "Content-Type": "application/json" // Tipo JSON
            },
            body: JSON.stringify(datos) // Convierte datos a JSON
        });

        const mensaje = await response.text(); // Obtiene respuesta en texto
        if (!response.ok) { // Si falla
            throw new Error(mensaje); // Lanza error
        }
        await alertaOK("Trabajador: Acceso de Administrador Temporal realizado con EXITO"); // Muestra éxito
        formulario.action = `TrabajadorEditar.html#${idUser}/${cedulaTrabajador}`; // Redirige acción
        formulario.submit(); // Envía formulario
    } catch (error) { // Si ocurre error
        alertaError(error.message); // Muestra error
    }
};

const infoTrabajador = async (id) => { // Función obtener info trabajador
    try {
        const res = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${id}`); // Llamada GET trabajador
        const data = await res.json(); // Convierte a JSON

        const nombre = ` ${data.nombre} ${data.apellido}(cc:${data.cedula})`; // Nombre completo con cédula
        
        if (data.adminTemporalFin && data.adminTemporalInicio)  // Si tiene fechas guardadas
        {
            fechaInicio.value = data.adminTemporalInicio; // Carga fecha inicio
            fechaFin.value = data.adminTemporalFin; // Carga fecha fin
        }
        return nombre; // Retorna nombre
    } catch (error) {
        console.error("Error:", error); // Muestra error en consola
    }
}
document.addEventListener("DOMContentLoaded", async () => { // Al cargar página
    cargarHeader(idUser); // Carga header
    const botonVolver = document.getElementById("volver"); // Selecciona botón volver
    botonVolver.action = `TrabajadorEditar.html#${idUser}/${cedulaTrabajador}`; // Define acción volver
    const usuario = document.querySelector(".input > label"); // Selecciona label usuario
    let nombre = await infoTrabajador(cedulaTrabajador); // Obtiene info trabajador
    usuario.textContent += nombre; // Agrega nombre al label
}
);
formulario.addEventListener("submit", validar); // Listener submit para validar
