import { alertaError, alertaOK ,alertaTiempo} from "../alertas.js"; // Importa funciones de alertas
import { cargarHeader } from "../header.js"; // Importa función para cargar header

const hash = window.location.hash.slice(1); // Obtiene el hash de la URL sin "#"

// Formulario y elementos
const form = document.querySelector(".form"); // Selecciona el formulario
const volver = document.getElementById("volver"); // Botón para volver

const nombre = document.querySelector(".nombre"); // Input nombre
const precio = document.querySelector(".precio"); // Input precio
const tipo = document.querySelector(".tipo"); // Input tipo

const inputPerfil = document.getElementById("ArchivoFoto"); // Input archivo imagen
const imagenPerfil = document.getElementById("imagenPerfil"); // Imagen de vista previa
const spanImagen = document.getElementById("ArchivoEstado"); // Texto estado de archivo
const BotonborrarImg = document.getElementById("borrarImagen"); // Botón borrar imagen

volver.action = `platillosTablas.html#${hash}`; // Acción botón volver
form.action = `platillosTablas.html#${hash}`; // Acción formulario

const validar = async (e) => { // Función validar formulario
    e.preventDefault(); // Previene envío por defecto
    const archivo = inputPerfil.files[0]; // Obtiene archivo seleccionado
    if (!archivo) return alertaError("Seleccione una imagen."); // Si no hay archivo error

    const datos = { // Objeto con datos del formulario
        nombre: nombre.value,
        precio: precio.value,
        tipo: tipo.value,    };

    subirComida(datos); // Llama a subir comida
};

const subirComida = async (datos) => { // Función para subir datos comida
    try {
        const response = await fetch("http://localhost:8080/ApiRestaurente/api/comidas", { // POST al backend
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos) // Convierte datos a JSON
        });

    let mensaje; // Variable para mensaje

if (response.ok) {
  mensaje = await response.json(); // Si ok parsea JSON
} else {
  const errorText = await response.text(); // Si error, texto plano
  throw new Error(errorText); // Lanza error
}

        subirImagen(mensaje.id); // Sube imagen con id comida
    } catch (error) {
        alertaError(error.message); // Muestra error
    }
};

const subirImagen = async (id) => { // Función subir imagen
    try {
        const archivo = inputPerfil.files[0]; // Obtiene archivo
        const formData = new FormData(); // Crea formData
        formData.append("imagen", archivo); // Agrega archivo

        const res = await fetch("http://localhost:8080/ApiRestaurente/api/imagen", { // POST imagen
            method: "POST",
            body: formData
        });

        const json = await res.json(); // Respuesta JSON
        if (!res.ok || !json.url) throw new Error(json.error || "Error al subir la imagen"); // Valida respuesta
        console.log(json); // Muestra en consola
        actualizarFotoComida(id, json.nombre); // Actualiza comida con foto
    } catch (error) {
        alertaError(error.message); // Error al subir
    }
};

const actualizarFotoComida = async (id, nombreFoto) => { // Asocia imagen comida
    try {
        console.log(id); // Muestra id en consola
        const imagen = { imagen: nombreFoto }; // Objeto con nombre imagen
        console.log(imagen); // Muestra en consola
        const actualizar = await fetch(`http://localhost:8080/ApiRestaurente/api/comidas/imagen/${id}`, { // PATCH imagen
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(imagen)
        });

        const mensaje = await actualizar.text(); // Obtiene mensaje
        if (!actualizar.ok) throw new Error(mensaje); // Si error lanza
        await alertaTiempo(5000); // Espera tiempo
        await alertaOK("Comida creada con éxito."); // Alerta éxito
        form.submit(); // Envía formulario
    } catch (error) {
        alertaError(error.message); // Error actualizar
    }
};

const vistaPreviaImg = (e) => { // Función vista previa
    const file = e.target.files[0]; // Archivo seleccionado
    if (!file) return; // Si no hay archivo salir
    const reader = new FileReader(); // Crea lector
    reader.onload = () => { // Cuando carga
        imagenPerfil.src = reader.result; // Pone imagen
        spanImagen.textContent = "Archivo imagen seleccionada"; // Cambia texto
    };
    reader.readAsDataURL(file); // Lee archivo
};

const EliminarVistaPreviaImg = () => { // Elimina vista previa
    imagenPerfil.src = "../../img/comida.png"; // Imagen por defecto
    inputPerfil.value = ""; // Limpia input
    spanImagen.textContent = "Ningún archivo seleccionado"; // Texto por defecto
};

document.addEventListener("DOMContentLoaded", () => { // Al cargar DOM
    cargarHeader(hash); // Carga header
});
inputPerfil.addEventListener("change", vistaPreviaImg); // Evento cambio imagen
BotonborrarImg.addEventListener("click", EliminarVistaPreviaImg); // Evento borrar imagen
form.addEventListener("submit", validar); // Evento submit formulario
