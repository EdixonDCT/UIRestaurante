import { alertaOK, alertaError, alertaTiempo } from "../alertas.js"; // Importa funciones de alertas
import { cargarHeader } from "../header.js"; // Importa función para cargar header

const hash = window.location.hash.slice(1); // Obtiene el hash de la URL sin #
const lista = hash.split("/"); // Divide el hash en partes
const trabajador = lista[0]; // Obtiene el trabajador del hash
const cedula = lista[1]; // Obtiene la cédula del hash
const formulario = document.querySelector(".form"); // Selecciona el formulario
const volver = document.getElementById("volver"); // Botón para volver
const fotoActual = document.querySelector(".fotoVieja"); // Imagen actual mostrada

let nombreImagenVieja = ""; // Variable para guardar nombre de imagen vieja

const inputPerfil = document.getElementById("ArchivoFoto"); // Input de archivo
const imagenPerfil = document.getElementById("imagenPerfil"); // Imagen de vista previa
const spanImagen = document.getElementById("ArchivoEstado"); // Texto estado archivo

const cargarImagen = async () => { // Función cargar imagen actual
  volver.action = `platillosTablas.html#${trabajador}`; // Acción de volver
  formulario.action = `platillosTablas.html#${trabajador}`; // Acción del form
  try {
    const res = await fetch(`http://localhost:8080/ApiRestaurente/api/comidas/${cedula}`); // Llama API comida
    const data = await res.json(); // Convierte respuesta a JSON
    
    nombreImagenVieja = data.imagen; // Guarda nombre imagen actual
    fotoActual.src = `http://localhost:8080/ApiRestaurente/IMAGENES/${data.imagen}`; // Muestra imagen
  } catch (error) {
    alertaError("No se pudo cargar la imagen actual."); // Error al cargar imagen
  }
};

const enviarImagen = async (e) => { // Función enviar nueva imagen
  e.preventDefault(); // Previene envío por defecto

  const archivo = inputPerfil.files[0]; // Obtiene archivo seleccionado
  if (!archivo) { // Si no hay archivo
    alertaError("Selecciona una nueva imagen."); // Muestra error
    return; // Sale
  }

  // Eliminar imagen anterior
  try {
    const resDelete = await fetch(`http://localhost:8080/ApiRestaurente/api/imagen/${nombreImagenVieja}`, { // Petición DELETE
      method: "DELETE"
    });
    if (!resDelete.ok) { // Si no fue correcta
      const msgDelete = await resDelete.text(); // Lee mensaje
      throw new Error(msgDelete || "Error al eliminar imagen anterior."); // Lanza error
    }
    try {
    
            const formData = new FormData(); // Crea formData
            formData.append("imagen", archivo); // Agrega imagen
    
            const res = await fetch("http://localhost:8080/ApiRestaurente/api/imagen", { // Petición POST
                method: "POST",
                body: formData
            });
    
            const json = await res.json(); // Convierte a JSON
            if (!res.ok || !json.url) { // Si error al subir
                throw new Error(json.error || "Error al subir la imagen."); // Lanza error
            }
            try {
                    const imagen = { imagen: json.nombre }; // Nuevo objeto imagen
            
                    const actualizar = await fetch(`http://localhost:8080/ApiRestaurente/api/comidas/imagen/${cedula}`, { // PATCH a comida
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(imagen)
                    });
                    const mensajeImagen = await actualizar.text(); // Lee respuesta
                    if (!actualizar.ok) { throw new Error(mensajeImagen); }; // Error si falla
                    await alertaTiempo(5000); // Espera 5s
                    await alertaOK("Platillo Comida: Imagen actualizada con Exito"); // Mensaje ok
                    formulario.submit(); // Envía form
            
                } catch (error) {
                    alertaError(error.message); // Error al actualizar BD
                }
        } catch (error) {
            alertaError(error.message); // Error al subir imagen
        }
  } catch (error) {
    alertaError("No se pudo eliminar la imagen anterior: " + error.message); // Error delete
    return; // Sale
  }
};
const vistaPreviaImg = (e) => { // Función vista previa
  const file = e.target.files[0]; // Obtiene archivo
  if (!file) return; // Si no hay archivo, salir

  const reader = new FileReader(); // Crea FileReader
  reader.onload = () => { // Cuando cargue
    imagenPerfil.src = reader.result; // Muestra preview
    spanImagen.textContent = "Archivo imagen seleccionada"; // Cambia texto
  };
  reader.readAsDataURL(file); // Lee archivo
};

const EliminarVistaPreviaImg = () => { // Función eliminar vista previa
  imagenPerfil.src = "../../img/pfp.png"; // Pone imagen por defecto
  inputPerfil.value = ""; // Limpia input
  spanImagen.textContent = "Ningún archivo seleccionado"; // Cambia texto
};

document.addEventListener("DOMContentLoaded", () => // Al cargar DOM
{
  cargarHeader(trabajador); // Carga header
  cargarImagen(); // Carga imagen
});
inputPerfil.addEventListener("change", vistaPreviaImg); // Evento cambio input
window.addEventListener("click", async (e) => { // Evento click en ventana
  if (e.target.matches("#borrarImagen")) EliminarVistaPreviaImg(); // Si clic en borrar
});
formulario.addEventListener("submit", enviarImagen); // Evento enviar form
