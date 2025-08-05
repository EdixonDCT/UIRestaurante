import { alertaError, alertaOK, alertaTiempo } from "./alertas.js";
import { cargarHeader } from "./header.js";

const hash = window.location.hash.slice(1);

// Elementos
const form = document.getElementById("formBebida");
const volver = document.getElementById("volver");
const nombre = document.getElementById("nombre");
const precio = document.getElementById("precio");
const unidad = document.getElementById("unidad");
const tipo = document.getElementById("tipo");

const inputFoto = document.getElementById("ArchivoFoto");
const imagenVista = document.getElementById("imagenPerfil");
const spanImagen = document.getElementById("ArchivoEstado");
const btnBorrarImagen = document.getElementById("borrarImagen");

volver.action = `platillos.html#${hash}`;
form.action = `platillos.html#${hash}`;

const validar = async (e) => {
  e.preventDefault();
  const archivo = inputFoto.files[0];
  if (!archivo) return alertaError("Seleccione una imagen.");

  const datos = {
    nombre: nombre.value,
    precio: precio.value,
    unidad: unidad.value,
    tipo: tipo.value
  };

  subirBebida(datos);
};

const subirBebida = async (datos) => {
  try {
    const res = await fetch("http://localhost:8080/ApiRestaurente/api/bebidas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    const resultado = await res.json();
    if (!res.ok) throw new Error(resultado.error);

    subirImagen(resultado.id);
  } catch (error) {
    alertaError(error.message);
  }
};

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
    if (!res.ok || !json.url) throw new Error(json.error || "Error al subir la imagen");

    actualizarFotoBebida(id, json.nombre);
  } catch (error) {
    alertaError(error.message);
  }
};

const actualizarFotoBebida = async (id, nombreImagen) => {
  try {
    const imagen = { imagen: nombreImagen };
    const res = await fetch(`http://localhost:8080/ApiRestaurente/api/bebidas/imagen/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(imagen)
    });

    const mensaje = await res.text();
    if (!res.ok) throw new Error(mensaje);

    await alertaTiempo(5000);
    await alertaOK("Bebida creada con éxito.");
    form.submit();
  } catch (error) {
    alertaError(error.message);
  }
};

// Vista previa
const vistaPreviaImg = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    imagenVista.src = reader.result;
    spanImagen.textContent = "Archivo imagen seleccionada";
  };
  reader.readAsDataURL(file);
};

const eliminarVistaPrevia = () => {
  imagenVista.src = "../img/pfp.png";
  inputFoto.value = "";
  spanImagen.textContent = "Ningún archivo seleccionado";
};

document.addEventListener("DOMContentLoaded", () => {
  cargarHeader(hash);
});
inputFoto.addEventListener("change", vistaPreviaImg);
btnBorrarImagen.addEventListener("click", eliminarVistaPrevia);
form.addEventListener("submit", validar);
