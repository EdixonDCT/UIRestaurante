import { alertaOK, alertaError, alertaTiempo } from "./alertas.js";

const hash = window.location.hash.slice(1);
const lista = hash.split("/");
const trabajador = lista[0];
const cedula = lista[1];
const formulario = document.getElementById("formularioImagen");
const volver = document.getElementById("volver");
const fotoActual = document.getElementById("fotoActual");
const inputFoto = document.getElementById("nuevaFoto");

let nombreImagenVieja = "";

const cargarImagen = async () => {
  volver.action = `trabajadores.html#${trabajador}`;
  formulario.action = `trabajadores.html#${trabajador}`;
  try {
    const res = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${cedula}`);
    const data = await res.json();
    nombreImagenVieja = data.foto;
    fotoActual.src = `http://localhost:8080/ApiRestaurente/IMAGENES/${data.foto}`;
  } catch (error) {
    alertaError("No se pudo cargar la imagen actual.");
  }
};

const enviarImagen = async (e) => {
  e.preventDefault();

  const archivo = inputFoto.files[0];
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
                    const imagen = { foto: json.nombre };
            
                    const actualizar = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${cedula}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(imagen)
                    });
                    const mensajeImagen = await actualizar.text();
                    if (!actualizar.ok) { throw new Error(mensajeImagen); };
                    await alertaTiempo(5000);
                    await alertaOK("Trabajador: Foto actualizada con Exito");
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

document.addEventListener("DOMContentLoaded", cargarImagen);
formulario.addEventListener("submit", enviarImagen);
