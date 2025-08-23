import { alertaOK, alertaError, alertaTiempo } from "../alertas.js"; // Importa funciones de alertas
import { cargarHeader } from "../header.js"; // Importa función para cargar header

const hash = window.location.hash.slice(1); // Obtiene hash sin '#'
const lista = hash.split("/"); // Separa datos por '/'
const trabajador = lista[0]; // Primer valor: trabajador
const cedula = lista[1]; // Segundo valor: cédula
const formulario = document.querySelector(".form"); // Selecciona form
const volver = document.getElementById("volver"); // Botón volver
const fotoActual = document.querySelector(".fotoVieja"); // Imagen actual

let nombreImagenVieja = ""; // Nombre imagen vieja

const inputPerfil = document.getElementById("ArchivoFoto"); // Input file
const imagenPerfil = document.getElementById("imagenPerfil"); // Vista previa
const spanImagen = document.getElementById("ArchivoEstado"); // Estado archivo

const cargarImagen = async () => { // Carga imagen actual
  volver.action = `trabajadoresTablas.html#${trabajador}`; // Redirigir volver
  formulario.action = `trabajadoresTablas.html#${trabajador}`; // Acción formulario
  try {
    const res = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${cedula}`); // Petición trabajador
    const data = await res.json(); // Respuesta JSON
    nombreImagenVieja = data.foto; // Guarda nombre imagen
    fotoActual.src = `http://localhost:8080/ApiRestaurente/IMAGENES/${data.foto}`; // Muestra foto
  } catch (error) {
    alertaError("No se pudo cargar la imagen actual."); // Error
  }
};

const enviarImagen = async (e) => { // Envía nueva imagen
  e.preventDefault(); // Previene submit

  const archivo = inputPerfil.files[0]; // Archivo seleccionado
  if (!archivo) {
    alertaError("Selecciona una nueva imagen."); // Si no hay archivo
    return;
  }

  // Eliminar imagen anterior
  try {
    const resDelete = await fetch(`http://localhost:8080/ApiRestaurente/api/imagen/${nombreImagenVieja}`, { // DELETE
      method: "DELETE"
    });
    if (!resDelete.ok) {
      const msgDelete = await resDelete.text(); // Mensaje error
      throw new Error(msgDelete || "Error al eliminar imagen anterior.");
    }
    try {
            const formData = new FormData(); // Crea formData
            formData.append("imagen", archivo); // Agrega archivo
    
            const res = await fetch("http://localhost:8080/ApiRestaurente/api/imagen", { // POST imagen
                method: "POST",
                body: formData
            });
    
            const json = await res.json(); // Respuesta JSON
            if (!res.ok || !json.url) {
                throw new Error(json.error || "Error al subir la imagen."); // Error subida
            }
            try {
                    const imagen = { foto: json.nombre }; // Objeto foto
            
                    const actualizar = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${cedula}`, { // PATCH foto
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(imagen)
                    });
                    const mensajeImagen = await actualizar.text(); // Mensaje
                    if (!actualizar.ok) { throw new Error(mensajeImagen); }; // Error actualización
                    await alertaTiempo(5000); // Muestra carga
                    await alertaOK("Trabajador: Foto actualizada con Exito"); // Éxito
                    formulario.submit(); // Envía form
            
                } catch (error) {
                    alertaError(error.message); // Error PATCH
                }
        } catch (error) {
            alertaError(error.message); // Error POST
        }
  } catch (error) {
    alertaError("No se pudo eliminar la imagen anterior: " + error.message); // Error DELETE
    return;
  }
};

const vistaPreviaImg = (e) => { // Vista previa imagen
  const file = e.target.files[0]; // Archivo seleccionado
  if (!file) return;

  const reader = new FileReader(); // Lector archivo
  reader.onload = () => {
    imagenPerfil.src = reader.result; // Asigna preview
    spanImagen.textContent = "Archivo imagen seleccionada"; // Estado
  };
  reader.readAsDataURL(file); // Convierte base64
};

const EliminarVistaPreviaImg = () => { // Elimina preview
  imagenPerfil.src = "../../img/pfp.png"; // Imagen por defecto
  inputPerfil.value = ""; // Limpia input
  spanImagen.textContent = "Ningún archivo seleccionado"; // Estado
};

document.addEventListener("DOMContentLoaded", () => // Al cargar DOM
{
  cargarHeader(trabajador); // Cargar header
  cargarImagen(); // Cargar imagen actual
});
inputPerfil.addEventListener("change", vistaPreviaImg); // Evento input file
window.addEventListener("click", async (e) => { // Click borrar img
  if (e.target.matches("#borrarImagen")) EliminarVistaPreviaImg();
});
formulario.addEventListener("submit", enviarImagen); // Evento submit
