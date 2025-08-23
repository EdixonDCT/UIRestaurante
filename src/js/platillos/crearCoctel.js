import { alertaError, alertaOK, alertaTiempo } from "../alertas.js"; // Importa funciones de alertas
import { cargarHeader } from "../header.js"; // Importa función para cargar header

const hash = window.location.hash.slice(1); // Obtiene el hash de la URL

// Elementos del DOM
const form = document.querySelector(".form"); // Formulario
const volver = document.getElementById("volver"); // Botón volver
const nombre = document.querySelector(".nombre"); // Input nombre
const precio = document.querySelector(".precio"); // Input precio

const inputFoto = document.getElementById("ArchivoFoto"); // Input archivo
const vistaPrevia = document.getElementById("imagenPerfil"); // Imagen vista previa
const estadoArchivo = document.getElementById("ArchivoEstado"); // Estado archivo
const btnBorrar = document.getElementById("borrarImagen"); // Botón borrar imagen

volver.action = `platillosTablas.html#${hash}`; // Acción de volver
form.action = `platillosTablas.html#${hash}`; // Acción del formulario

// Función principal de validación
const validar = async (e) => { // Valida antes de enviar
  e.preventDefault(); // Previene recarga

  const archivo = inputFoto.files[0]; // Obtiene archivo
  if (!archivo) return alertaError("Seleccione una imagen para el cóctel."); // Si no hay archivo, error

  const datos = { // Datos a enviar
    nombre: nombre.value, // Nombre
    precio: precio.value // Precio
  };

  subirCoctel(datos); // Llama a subir cóctel
};

// Subir datos del cóctel (sin imagen)
const subirCoctel = async (datos) => { // Subir cóctel
  try { // Intentar
    const response = await fetch("http://localhost:8080/ApiRestaurente/api/cocteles", { // Petición POST
      method: "POST", // Método
      headers: { "Content-Type": "application/json" }, // Tipo JSON
      body: JSON.stringify(datos) // Datos en JSON
    });

    let mensaje; // Variable mensaje

if (response.ok) { // Si ok
  mensaje = await response.json(); // Convierte respuesta a JSON
} else { // Si error
  const errorText = await response.text(); // Obtiene texto
  throw new Error(errorText); // Lanza error
};

    subirImagen(mensaje.id); // Subir imagen con id
  } catch (error) { // Si error
    alertaError(error.message); // Muestra error
  }
};

// Subir imagen al servidor
const subirImagen = async (id) => { // Subir imagen
  try { // Intentar
    const archivo = inputFoto.files[0]; // Obtiene archivo
    const formData = new FormData(); // FormData
    formData.append("imagen", archivo); // Agrega imagen

    const res = await fetch("http://localhost:8080/ApiRestaurente/api/imagen", { // Petición POST
      method: "POST", // Método
      body: formData // Envía FormData
    });

    const json = await res.json(); // Convierte a JSON
    if (!res.ok || !json.url) throw new Error(json.error || "Error al subir imagen"); // Si error, lanza

    actualizarFotoCoctel(id, json.nombre); // Actualiza foto cóctel
  } catch (error) { // Si error
    alertaError(error.message); // Muestra error
  }
};

// Asociar imagen con el cóctel
const actualizarFotoCoctel = async (id, nombreFoto) => { // Actualizar foto
  try { // Intentar
    const imagen = { imagen: nombreFoto }; // Objeto imagen

    const actualizar = await fetch(`http://localhost:8080/ApiRestaurente/api/cocteles/imagen/${id}`, { // PATCH
      method: "PATCH", // Método
      headers: { "Content-Type": "application/json" }, // Tipo JSON
      body: JSON.stringify(imagen) // Envía imagen
    });

    const mensaje = await actualizar.text(); // Mensaje respuesta
    if (!actualizar.ok) throw new Error(mensaje); // Si error, lanza

    await alertaTiempo(5000); // Espera alerta tiempo
    await alertaOK("Cóctel creado con éxito."); // Muestra éxito
    form.submit(); // Envía form
  } catch (error) { // Si error
    alertaError(error.message); // Muestra error
  }
};

// Vista previa imagen
const vistaPreviaImg = (e) => { // Vista previa
  const file = e.target.files[0]; // Obtiene archivo
  if (!file) return; // Si no hay, salir
  const reader = new FileReader(); // Lector
  reader.onload = () => { // Cuando carga
    vistaPrevia.src = reader.result; // Pone en vista previa
    estadoArchivo.textContent = "Archivo imagen seleccionado"; // Estado archivo
  };
  reader.readAsDataURL(file); // Lee archivo
};

// Borrar imagen seleccionada
const eliminarImagen = () => { // Eliminar imagen
  vistaPrevia.src = "../../img/coctel.png"; // Pone imagen por defecto
  inputFoto.value = ""; // Vacía input
  estadoArchivo.textContent = "Ningún archivo seleccionado"; // Estado archivo
};

// Eventos
document.addEventListener("DOMContentLoaded", () => { // Al cargar DOM
  cargarHeader(hash); // Carga header
});
inputFoto.addEventListener("change", vistaPreviaImg); // Evento cambio input
btnBorrar.addEventListener("click", eliminarImagen); // Evento borrar
form.addEventListener("submit", validar); // Evento enviar
