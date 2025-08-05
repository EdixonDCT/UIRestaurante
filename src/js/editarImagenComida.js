import { alertaOK, alertaError, alertaTiempo } from "./alertas.js";
import { cargarHeader } from "./header.js";

const hash = window.location.hash.slice(1);
const [idUser, idComida] = hash.split("/");

const formulario = document.getElementById("formularioImagen");
const volver = document.getElementById("volver");
const fotoActual = document.getElementById("fotoActual");
const inputFoto = document.getElementById("nuevaFoto");

let nombreImagenVieja = "";

const cargarImagen = async () => {
  volver.action = `platillos.html#${idUser}`;
  formulario.action = `platillos.html#${idUser}`;
  try {
    const res = await fetch(`http://localhost:8080/ApiRestaurente/api/bebidas/${idComida}`);
    const data = await res.json();
    nombreImagenVieja = data.imagen;
    fotoActual.src = `http://localhost:8080/ApiRestaurente/IMAGENES/${data.imagen}`;
  } catch (error) {
    alertaError("No se pudo cargar la imagen actual.");
  }
};

const enviarImagen = async (e) => {
  e.preventDefault();

  const archivo = inputFoto.files[0];
  if (!archivo) return alertaError("Selecciona una nueva imagen.");

  try {
    // Eliminar imagen anterior
    const resDelete = await fetch(`http://localhost:8080/ApiRestaurente/api/imagen/${nombreImagenVieja}`, {
      method: "DELETE"
    });

    if (!resDelete.ok) {
      const msgDelete = await resDelete.text();
      throw new Error(msgDelete || "Error al eliminar imagen anterior.");
    }

    // Subir nueva imagen
    const formData = new FormData();
    formData.append("imagen", archivo);

    const resUpload = await fetch("http://localhost:8080/ApiRestaurente/api/imagen", {
      method: "POST",
      body: formData
    });

    const json = await resUpload.json();
    if (!resUpload.ok || !json.url) {
      throw new Error(json.error || "Error al subir la imagen.");
    }

    // Actualizar imagen en comida
    const imagen = { imagen: json.nombre };

    const actualizar = await fetch(`http://localhost:8080/ApiRestaurente/api/bebidas/imagen/${idComida}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(imagen)
    });

    const mensaje = await actualizar.text();
    if (!actualizar.ok) throw new Error(mensaje);

    await alertaTiempo(5000);
    await alertaOK("Imagen actualizada correctamente.");
    formulario.submit();
  } catch (error) {
    alertaError(error.message);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  cargarHeader(idUser);
  cargarImagen();
});

formulario.addEventListener("submit", enviarImagen);
