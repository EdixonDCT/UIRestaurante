import { alertaOK, alertaError, alertaTiempo } from "../alertas.js"; // Importa funciones de alertas
import { cargarHeader } from "../header.js"; // Importa función para cargar el header

const hash = window.location.hash.slice(1); // Obtiene el hash de la URL sin el #
const lista = hash.split("/"); // Divide el hash en partes por "/"
const trabajador = lista[0]; // Primer valor del hash (trabajador)
const cedula = lista[1]; // Segundo valor del hash (cédula)
const formulario = document.querySelector(".form"); // Selecciona el formulario
const volver = document.getElementById("volver"); // Botón volver
const fotoActual = document.querySelector(".fotoVieja"); // Imagen actual mostrada

let nombreImagenVieja = ""; // Guardará el nombre de la imagen anterior

const inputPerfil = document.getElementById("ArchivoFoto"); // Input para cargar foto
const imagenPerfil = document.getElementById("imagenPerfil"); // Imagen de vista previa
const spanImagen = document.getElementById("ArchivoEstado"); // Texto del estado de la imagen

const cargarImagen = async () => { // Función para cargar la imagen desde la API
  volver.action = `platillosTablas.html#${trabajador}`; // Redirección del botón volver
  formulario.action = `platillosTablas.html#${trabajador}`; // Acción del formulario
  try {
    const res = await fetch(`http://localhost:8080/ApiRestaurente/api/cocteles/${cedula}`); // Petición GET a la API
    const data = await res.json(); // Convierte la respuesta en JSON
    
    nombreImagenVieja = data.imagen; // Guarda el nombre de la imagen
    fotoActual.src = `http://localhost:8080/ApiRestaurente/IMAGENES/${data.imagen}`; // Muestra la imagen actual
  } catch (error) {
    alertaError("No se pudo cargar la imagen actual."); // Alerta en caso de error
  }
};

const enviarImagen = async (e) => { // Función para enviar nueva imagen
  e.preventDefault(); // Previene el submit por defecto

  const archivo = inputPerfil.files[0]; // Obtiene archivo seleccionado
  if (!archivo) { // Si no se seleccionó archivo
    alertaError("Selecciona una nueva imagen."); // Muestra error
    return; // Sale de la función
  }

  // Eliminar imagen anterior
  try {
    const resDelete = await fetch(`http://localhost:8080/ApiRestaurente/api/imagen/${nombreImagenVieja}`, { // Petición DELETE
      method: "DELETE"
    });
    if (!resDelete.ok) { // Si no elimina correctamente
      const msgDelete = await resDelete.text(); // Obtiene mensaje de error
      throw new Error(msgDelete || "Error al eliminar imagen anterior."); // Lanza error
    }
    try {
    
            const formData = new FormData(); // Crea objeto para enviar archivo
            formData.append("imagen", archivo); // Agrega la nueva imagen
    
            const res = await fetch("http://localhost:8080/ApiRestaurente/api/imagen", { // Petición POST para subir imagen
                method: "POST",
                body: formData
            });
    
            const json = await res.json(); // Convierte respuesta a JSON
            if (!res.ok || !json.url) { // Valida si no subió bien
                throw new Error(json.error || "Error al subir la imagen."); // Lanza error
            }
            try {
                    const imagen = { imagen: json.nombre }; // Objeto con nombre de la imagen
            
                    const actualizar = await fetch(`http://localhost:8080/ApiRestaurente/api/cocteles/imagen/${cedula}`, { // PATCH para actualizar imagen
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(imagen) // Envía nueva imagen en JSON
                    });
                    const mensajeImagen = await actualizar.text(); // Obtiene respuesta
                    if (!actualizar.ok) { throw new Error(mensajeImagen); }; // Valida si falla
                    await alertaTiempo(5000); // Espera tiempo de alerta
                    await alertaOK("Platillo Coctel: Imagen actualizada con Exito"); // Alerta éxito
                    formulario.submit(); // Envía formulario
            
                } catch (error) {
                    alertaError(error.message); // Error al actualizar imagen
                }
        } catch (error) {
            alertaError(error.message); // Error al subir imagen
        }
  } catch (error) {
    alertaError("No se pudo eliminar la imagen anterior: " + error.message); // Error al borrar imagen
    return;
  }
};
const vistaPreviaImg = (e) => { // Función para vista previa
  const file = e.target.files[0]; // Obtiene archivo seleccionado
  if (!file) return; // Si no hay archivo, no hace nada

  const reader = new FileReader(); // Lector de archivos
  reader.onload = () => { // Cuando carga el archivo
    imagenPerfil.src = reader.result; // Muestra imagen en vista previa
    spanImagen.textContent = "Archivo imagen seleccionada"; // Actualiza texto
  };
  reader.readAsDataURL(file); // Lee archivo como URL
};

const EliminarVistaPreviaImg = () => { // Función para quitar vista previa
  imagenPerfil.src = "../../img/pfp.png"; // Coloca imagen por defecto
  inputPerfil.value = ""; // Limpia el input
  spanImagen.textContent = "Ningún archivo seleccionado"; // Texto por defecto
};

document.addEventListener("DOMContentLoaded", () => // Al cargar documento
{
  cargarHeader(trabajador); // Carga el header con trabajador
  cargarImagen(); // Carga la imagen actual
});
inputPerfil.addEventListener("change", vistaPreviaImg); // Evento para mostrar vista previa
window.addEventListener("click", async (e) => { // Evento global de click
  if (e.target.matches("#borrarImagen")) EliminarVistaPreviaImg(); // Si clic en borrar, elimina vista previa
});
formulario.addEventListener("submit", enviarImagen); // Evento submit para enviar imagen
