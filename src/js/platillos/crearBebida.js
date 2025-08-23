import { alertaError, alertaOK, alertaTiempo } from "../alertas.js"; // Importa funciones de alertas
import { cargarHeader } from "../header.js"; // Importa función para cargar header

const hash = window.location.hash.slice(1); // Obtiene el hash de la URL sin #

 // Elementos
const form = document.querySelector(".form"); // Formulario principal
const volver = document.getElementById("volver"); // Botón volver
const nombre = document.querySelector(".nombre"); // Input nombre
const precio = document.querySelector(".precio"); // Input precio
const unidad = document.querySelector(".unidad"); // Input unidad
const tipo = document.querySelector(".tipo"); // Input tipo

const inputFoto = document.getElementById("ArchivoFoto"); // Input archivo foto
const imagenVista = document.getElementById("imagenPerfil"); // Imagen vista previa
const spanImagen = document.getElementById("ArchivoEstado"); // Texto estado imagen
const btnBorrarImagen = document.getElementById("borrarImagen"); // Botón borrar imagen

volver.action = `platillosTablas.html#${hash}`; // Redirigir volver al listado
form.action = `platillosTablas.html#${hash}`; // Acción del form al listado

const validar = async (e) => { // Función validar form
  e.preventDefault(); // Evita recargar
  const archivo = inputFoto.files[0]; // Obtiene archivo
  if (!archivo) return alertaError("Seleccione una imagen."); // Valida que haya imagen

  const datos = { // Datos bebida
    nombre: nombre.value,
    precio: precio.value,
    unidad: unidad.value,
    tipo: tipo.value
  };

  subirBebida(datos); // Llama a subir bebida
};

const subirBebida = async (datos) => { // Función registrar bebida
  try {
    const res = await fetch("http://localhost:8080/ApiRestaurente/api/bebidas", { // POST bebida
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    let mensaje;

if (res.ok) { // Si la respuesta es ok
  mensaje = await res.json(); // Parsear JSON
} else {
  const errorText = await res.text(); // Captura error en texto
  throw new Error(errorText); // Lanza error
}
    subirImagen(mensaje.id); // Llama a subir imagen
  } catch (error) {
    alertaError(error.message); // Muestra error
  }
};

const subirImagen = async (id) => { // Función subir imagen
  try {
    const archivo = inputFoto.files[0]; // Obtiene archivo
    const formData = new FormData(); // Crea formData
    formData.append("imagen", archivo); // Agrega imagen

    const res = await fetch("http://localhost:8080/ApiRestaurente/api/imagen", { // POST imagen
      method: "POST",
      body: formData
    });

    const json = await res.json(); // Parsear JSON
    if (!res.ok || !json.url) throw new Error(json.error || "Error al subir la imagen"); // Valida respuesta

    actualizarFotoBebida(id, json.nombre); // Actualiza bebida con foto
  } catch (error) {
    alertaError(error.message); // Muestra error
  }
};

const actualizarFotoBebida = async (id, nombreImagen) => { // Función actualizar imagen bebida
  try {
    const imagen = { imagen: nombreImagen }; // Objeto con nombre imagen
    const res = await fetch(`http://localhost:8080/ApiRestaurente/api/bebidas/imagen/${id}`, { // PATCH imagen bebida
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(imagen)
    });

    const mensaje = await res.text(); // Mensaje respuesta
    if (!res.ok) throw new Error(mensaje); // Si error lanza

    await alertaTiempo(5000); // Espera 5 seg
    await alertaOK("Bebida creada con éxito."); // Muestra OK
    form.submit(); // Envía form
  } catch (error) {
    alertaError(error.message); // Muestra error
  }
};

 // Vista previa
const vistaPreviaImg = (e) => { // Función vista previa
  const file = e.target.files[0]; // Obtiene archivo
  if (!file) return; // Si no hay archivo salir

  const reader = new FileReader(); // Lector archivo
  reader.onload = () => { // Cuando carga
    imagenVista.src = reader.result; // Muestra imagen
    spanImagen.textContent = "Archivo imagen seleccionada"; // Texto estado
  };
  reader.readAsDataURL(file); // Lee archivo
};

const eliminarVistaPrevia = () => { // Función eliminar vista previa
  imagenVista.src = "../../img/bebida.png"; // Imagen por defecto
  inputFoto.value = ""; // Limpia input
  spanImagen.textContent = "Ningún archivo seleccionado"; // Texto estado
};

document.addEventListener("DOMContentLoaded", () => { // Al cargar doc
  cargarHeader(hash); // Carga header
});
inputFoto.addEventListener("change", vistaPreviaImg); // Cambio foto ejecuta vista previa
btnBorrarImagen.addEventListener("click", eliminarVistaPrevia); // Botón borra imagen
form.addEventListener("submit", validar); // Al enviar form valida
