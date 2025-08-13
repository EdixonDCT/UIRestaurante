import { alertaError, alertaOK, alertaTiempo } from "../alertas.js";
import { cargarHeader } from "../header.js";

const hash = window.location.hash.slice(1);

// Elementos del DOM
const form = document.querySelector(".form");
const volver = document.getElementById("volver");
const nombre = document.querySelector(".nombre");
const precio = document.querySelector(".precio");

const inputFoto = document.getElementById("ArchivoFoto");
const vistaPrevia = document.getElementById("imagenPerfil");
const estadoArchivo = document.getElementById("ArchivoEstado");
const btnBorrar = document.getElementById("borrarImagen");

volver.action = `platillosTablas.html#${hash}`;
form.action = `platillosTablas.html#${hash}`;

// Función principal de validación
const validar = async (e) => {
  e.preventDefault();

  const archivo = inputFoto.files[0];
  if (!archivo) return alertaError("Seleccione una imagen para el cóctel.");

  const datos = {
    nombre: nombre.value,
    precio: precio.value
  };

  subirCoctel(datos);
};

// Subir datos del cóctel (sin imagen)
const subirCoctel = async (datos) => {
  try {
    const response = await fetch("http://localhost:8080/ApiRestaurente/api/cocteles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error);

    subirImagen(result.id); // el ID retornado del nuevo cóctel
  } catch (error) {
    alertaError(error.message);
  }
};

// Subir imagen al servidor
const subirImagen = async (id) => {
  try {
    const archivo = inputFoto.files[0];
    const formData = new FormData();
    formData.append("imagen", archivo);

    const res = await fetch("http://localhost:8080/ApiRestaurente/api/imagen", {
      method: "POST",
      body: formData
    });

    const json = await res.json();
    if (!res.ok || !json.url) throw new Error(json.error || "Error al subir imagen");

    actualizarFotoCoctel(id, json.nombre);
  } catch (error) {
    alertaError(error.message);
  }
};

// Asociar imagen con el cóctel
const actualizarFotoCoctel = async (id, nombreFoto) => {
  try {
    const imagen = { imagen: nombreFoto };

    const actualizar = await fetch(`http://localhost:8080/ApiRestaurente/api/cocteles/imagen/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(imagen)
    });

    const mensaje = await actualizar.text();
    if (!actualizar.ok) throw new Error(mensaje);

    await alertaTiempo(5000);
    await alertaOK("Cóctel creado con éxito.");
    form.submit();
  } catch (error) {
    alertaError(error.message);
  }
};

// Vista previa imagen
const vistaPreviaImg = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    vistaPrevia.src = reader.result;
    estadoArchivo.textContent = "Archivo imagen seleccionado";
  };
  reader.readAsDataURL(file);
};

// Borrar imagen seleccionada
const eliminarImagen = () => {
  vistaPrevia.src = "../../img/coctel.png";
  inputFoto.value = "";
  estadoArchivo.textContent = "Ningún archivo seleccionado";
};

// Eventos
document.addEventListener("DOMContentLoaded", () => {
  cargarHeader(hash);
});
inputFoto.addEventListener("change", vistaPreviaImg);
btnBorrar.addEventListener("click", eliminarImagen);
form.addEventListener("submit", validar);
