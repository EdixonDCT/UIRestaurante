import { alertaOK, alertaError, alertaTiempo } from "../alertas.js"; // Importa funciones de alertas
import { cargarHeader } from "../header.js"; // Importa función para cargar el header

const hash = window.location.hash.slice(1); // Obtiene el hash de la URL sin el "#"
const lista = hash.split("/"); // Separa el hash en partes con "/"
const trabajador = lista[0]; // Primer valor es el trabajador
const cedula = lista[1]; // Segundo valor es la cédula
const formulario = document.querySelector(".form"); // Selecciona el formulario
const volver = document.getElementById("volver"); // Botón volver
const fotoActual = document.querySelector(".fotoVieja"); // Imagen actual mostrada

let nombreImagenVieja = ""; // Guarda el nombre de la imagen anterior

const inputPerfil = document.getElementById("ArchivoFoto"); // Input para seleccionar archivo
const imagenPerfil = document.getElementById("imagenPerfil"); // Imagen de vista previa
const spanImagen = document.getElementById("ArchivoEstado"); // Texto de estado de archivo

const cargarImagen = async () => { // Función para cargar la imagen actual
  volver.action = `platillosTablas.html#${trabajador}`; // Ajusta acción de volver
  formulario.action = `platillosTablas.html#${trabajador}`; // Ajusta acción del form
  try {
    const res = await fetch(`http://localhost:8080/ApiRestaurente/api/bebidas/${cedula}`); // Consulta datos
    const data = await res.json(); // Convierte a JSON
    
    nombreImagenVieja = data.imagen; // Guarda nombre de la imagen vieja
    fotoActual.src = `http://localhost:8080/ApiRestaurente/IMAGENES/${data.imagen}`; // Muestra imagen actual
  } catch (error) {
    alertaError("No se pudo cargar la imagen actual."); // Error al cargar
  }
};

const enviarImagen = async (e) => { // Función para enviar imagen nueva
  e.preventDefault(); // Evita recarga del form

  const archivo = inputPerfil.files[0]; // Obtiene archivo seleccionado
  if (!archivo) {
    alertaError("Selecciona una nueva imagen."); // Si no hay archivo
    return;
  }

  // Eliminar imagen anterior
  try {
    const resDelete = await fetch(`http://localhost:8080/ApiRestaurente/api/imagen/${nombreImagenVieja}`, { // Petición DELETE
      method: "DELETE"
    });
    if (!resDelete.ok) {
      const msgDelete = await resDelete.text(); // Mensaje de error si falla
      throw new Error(msgDelete || "Error al eliminar imagen anterior.");
    }
    try {
    
            const formData = new FormData(); // Crea objeto FormData
            formData.append("imagen", archivo); // Agrega archivo al formData
    
            const res = await fetch("http://localhost:8080/ApiRestaurente/api/imagen", { // POST nueva imagen
                method: "POST",
                body: formData
            });
    
            const json = await res.json(); // Convierte respuesta a JSON
            if (!res.ok || !json.url) { // Valida respuesta
                throw new Error(json.error || "Error al subir la imagen.");
            }
            try {
                    const imagen = { imagen: json.nombre }; // Objeto con nuevo nombre
            
                    const actualizar = await fetch(`http://localhost:8080/ApiRestaurente/api/bebidas/imagen/${cedula}`, { // PATCH en la BD
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(imagen)
                    });
                    const mensajeImagen = await actualizar.text(); // Mensaje de respuesta
                    if (!actualizar.ok) { throw new Error(mensajeImagen); }; // Si falla PATCH
                    await alertaTiempo(5000); // Espera
                    await alertaOK("Platillo Bebida: Imagen actualizada con Exito"); // Éxito
                    formulario.submit(); // Envía el form
            
                } catch (error) {
                    alertaError(error.message); // Error al actualizar en la BD
                }
        } catch (error) {
            alertaError(error.message); // Error al subir imagen
        }
  } catch (error) {
    alertaError("No se pudo eliminar la imagen anterior: " + error.message); // Error al eliminar
    return;
  }
};
const vistaPreviaImg = (e) => { // Vista previa al elegir archivo
  const file = e.target.files[0]; // Obtiene archivo
  if (!file) return; // Si no hay archivo, se sale

  const reader = new FileReader(); // Crea lector de archivos
  reader.onload = () => {
    imagenPerfil.src = reader.result; // Asigna imagen a preview
    spanImagen.textContent = "Archivo imagen seleccionada"; // Cambia estado
  };
  reader.readAsDataURL(file); // Lee archivo en base64
};

const EliminarVistaPreviaImg = () => { // Elimina preview de imagen
  imagenPerfil.src = "../../img/pfp.png"; // Vuelve a imagen por defecto
  inputPerfil.value = ""; // Limpia input
  spanImagen.textContent = "Ningún archivo seleccionado"; // Texto default
};

document.addEventListener("DOMContentLoaded", () => // Al cargar DOM
{
  cargarHeader(trabajador); // Carga header
  cargarImagen(); // Carga imagen actual
});
inputPerfil.addEventListener("change", vistaPreviaImg); // Evento cambio de archivo
window.addEventListener("click", async (e) => { // Evento click
  if (e.target.matches("#borrarImagen")) EliminarVistaPreviaImg(); // Si clic en borrarImagen
});
formulario.addEventListener("submit", enviarImagen); // Evento submit formulario
