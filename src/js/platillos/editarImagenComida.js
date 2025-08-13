import { alertaOK, alertaError, alertaTiempo } from "../alertas.js";
import { cargarHeader } from "../header.js";

const hash = window.location.hash.slice(1);
const lista = hash.split("/");
const trabajador = lista[0];
const cedula = lista[1];
const formulario = document.querySelector(".form");
const volver = document.getElementById("volver");
const fotoActual = document.querySelector(".fotoVieja");

let nombreImagenVieja = "";

const inputPerfil = document.getElementById("ArchivoFoto");
const imagenPerfil = document.getElementById("imagenPerfil");
const spanImagen = document.getElementById("ArchivoEstado");

const cargarImagen = async () => {
  volver.action = `platillosTablas.html#${trabajador}`;
  formulario.action = `platillosTablas.html#${trabajador}`;
  try {
    const res = await fetch(`http://localhost:8080/ApiRestaurente/api/comidas/${cedula}`);
    const data = await res.json();
    
    nombreImagenVieja = data.imagen;
    fotoActual.src = `http://localhost:8080/ApiRestaurente/IMAGENES/${data.imagen}`;
  } catch (error) {
    alertaError("No se pudo cargar la imagen actual.");
  }
};

const enviarImagen = async (e) => {
  e.preventDefault();

  const archivo = inputPerfil.files[0];
  if (!archivo) {
    alertaError("Selecciona una nueva imagen.");
    return;
  }

  // Eliminar imagen anterior
  try {
    const resDelete = await fetch(`http://localhost:8080/ApiRestaurente/api/imagen/${nombreImagenVieja}`, {
      method: "DELETE"
    });
    if (!resDelete.ok) {
      const msgDelete = await resDelete.text();
      throw new Error(msgDelete || "Error al eliminar imagen anterior.");
    }
    try {
    
            const formData = new FormData();
            formData.append("imagen", archivo);
    
            const res = await fetch("http://localhost:8080/ApiRestaurente/api/imagen", {
                method: "POST",
                body: formData
            });
    
            const json = await res.json();
            if (!res.ok || !json.url) {
                throw new Error(json.error || "Error al subir la imagen.");
            }
            try {
                    const imagen = { imagen: json.nombre };
            
                    const actualizar = await fetch(`http://localhost:8080/ApiRestaurente/api/comidas/imagen/${cedula}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(imagen)
                    });
                    const mensajeImagen = await actualizar.text();
                    if (!actualizar.ok) { throw new Error(mensajeImagen); };
                    await alertaTiempo(5000);
                    await alertaOK("Platillo Comida: Imagen actualizada con Exito");
                    formulario.submit();
            
                } catch (error) {
                    alertaError(error.message);
                }
        } catch (error) {
            alertaError(error.message);
        }
  } catch (error) {
    alertaError("No se pudo eliminar la imagen anterior: " + error.message);
    return;
  }
};
const vistaPreviaImg = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    imagenPerfil.src = reader.result;
    spanImagen.textContent = "Archivo imagen seleccionada";
  };
  reader.readAsDataURL(file);
};

const EliminarVistaPreviaImg = () => {
  imagenPerfil.src = "../../img/pfp.png";
  inputPerfil.value = "";
  spanImagen.textContent = "Ningún archivo seleccionado";
};

document.addEventListener("DOMContentLoaded", () =>
{
  cargarHeader(trabajador);
  cargarImagen();
});
inputPerfil.addEventListener("change", vistaPreviaImg);
window.addEventListener("click", async (e) => {
  if (e.target.matches("#borrarImagen")) EliminarVistaPreviaImg();
});
formulario.addEventListener("submit", enviarImagen);
