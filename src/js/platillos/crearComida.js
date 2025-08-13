import { alertaError, alertaOK ,alertaTiempo} from "../alertas.js";
import { cargarHeader } from "../header.js";

const hash = window.location.hash.slice(1);

// Formulario y elementos
const form = document.querySelector(".form");
const volver = document.getElementById("volver");

const nombre = document.querySelector(".nombre");
const precio = document.querySelector(".precio");
const tipo = document.querySelector(".tipo");

const inputPerfil = document.getElementById("ArchivoFoto");
const imagenPerfil = document.getElementById("imagenPerfil");
const spanImagen = document.getElementById("ArchivoEstado");
const BotonborrarImg = document.getElementById("borrarImagen");

volver.action = `platillosTablas.html#${hash}`;
form.action = `platillosTablas.html#${hash}`;

const validar = async (e) => {
    e.preventDefault();
    const archivo = inputPerfil.files[0];
    if (!archivo) return alertaError("Seleccione una imagen.");

    const datos = {
        nombre: nombre.value,
        precio: precio.value,
        tipo: tipo.value,    };

    subirComida(datos);
};

const subirComida = async (datos) => {
    try {
        const response = await fetch("http://localhost:8080/ApiRestaurente/api/comidas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const resultado = await response.json();
        if (!response.ok) throw new Error(resultado.error);

        subirImagen(resultado.id); // el backend debe devolver el ID insertado
    } catch (error) {
        alertaError(error.message);
    }
};

const subirImagen = async (id) => {
    try {
        const archivo = inputPerfil.files[0];
        const formData = new FormData();
        formData.append("imagen", archivo);

        const res = await fetch("http://localhost:8080/ApiRestaurente/api/imagen", {
            method: "POST",
            body: formData
        });

        const json = await res.json();
        if (!res.ok || !json.url) throw new Error(json.error || "Error al subir la imagen");
        console.log(json);
        actualizarFotoComida(id, json.nombre);
    } catch (error) {
        alertaError(error.message);
    }
};

const actualizarFotoComida = async (id, nombreFoto) => {
    try {
        console.log(id);
        const imagen = { imagen: nombreFoto };
        console.log(imagen);
        const actualizar = await fetch(`http://localhost:8080/ApiRestaurente/api/comidas/imagen/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(imagen)
        });

        const mensaje = await actualizar.text();
        if (!actualizar.ok) throw new Error(mensaje);
        await alertaTiempo(5000);
        await alertaOK("Comida creada con éxito.");
        form.submit();
    } catch (error) {
        alertaError(error.message);
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
    imagenPerfil.src = "../../img/comida.png";
    inputPerfil.value = "";
    spanImagen.textContent = "Ningún archivo seleccionado";
};

document.addEventListener("DOMContentLoaded", () => {
    cargarHeader(hash);
});
inputPerfil.addEventListener("change", vistaPreviaImg);
BotonborrarImg.addEventListener("click", EliminarVistaPreviaImg);
form.addEventListener("submit", validar);
