import { alertaError, alertaOK, alertaPregunta, alertaTiempo } from "./alertas";
import { cargarHeader } from "./header";

const hash = window.location.hash.slice(1);
//formulario
const registro = document.getElementById("formRegistro");
//header informacion del usuario

//valores a postear
const cedula = document.getElementById("cedula");
const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const fecha = document.getElementById("fecha");
const pass1 = document.getElementById("pass1");
const pass2 = document.getElementById("pass2");
const oficio = document.getElementById("oficio");
const comboxOficio = document.getElementById("oficio");
//control de imagen
const inputPerfil = document.getElementById("ArchivoFoto");
const imagenPerfil = document.getElementById("imagenPerfil");
const spanImagen = document.getElementById("ArchivoEstado");
const BotonborrarImg = document.getElementById("borrarImagen");
const volver = document.getElementById("volver");

volver.action = `trabajadores.html#${hash}`;
registro.action = `trabajadores.html#${hash}`;

const validar = async (e) => {
    e.preventDefault();
    const archivo = inputPerfil.files[0];
    if (!archivo) return alertaError("Seleccione una Imagen.");
    if (pass1.value !== pass2.value) {
        return alertaError("Las contraseñas no coinciden");
    }

    const datos = {
        cedula: cedula.value,
        nombre: nombre.value,
        apellido: apellido.value,
        nacimiento: fecha.value,
        contrasena: pass1.value,
        idOficio: oficio.value
    };

    SubirTrabajador(datos);
};
const SubirTrabajador = async (datos) => {
    try {
        const response = await fetch("http://localhost:8080/ApiRestaurente/api/trabajadores", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const mensaje = await response.text();

        if (!response.ok) {
            throw new Error(mensaje);
        }
        subirImagen();

    } catch (error) {
        alertaError(error.message);
    }
}
const subirImagen = async () => {
    try {
        const archivo = inputPerfil.files[0];

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
        actualizarFotoTrabajador(json.nombre)

    } catch (error) {
        alertaError(error.message);
    }

}
const actualizarFotoTrabajador = async (nombreFoto) => {
    try {
        const imagen = { foto: nombreFoto };

        const actualizar = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${cedula.value}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(imagen)
        });
        const mensajeImagen = await actualizar.text();
        if (!actualizar.ok) { throw new Error(mensajeImagen); }
        await alertaTiempo(5000);
        await alertaOK("Trabajador Creado con Exito.");
        registro.submit();

    } catch (error) {
        alertaError(error.message);
    }
}
const cargarOficios = async () => {
    try {
        const response = await fetch("http://localhost:8080/ApiRestaurente/api/oficios");
        if (!response.ok) {
            const mensaje = await response.text();
            throw new Error(mensaje);
        }
        const data = await response.json();
        data.forEach(oficio => {
            const option = document.createElement("option");
            option.value = oficio.codigo;
            option.textContent = oficio.tipo;
            comboxOficio.appendChild(option);
        });
    } catch (error) {
        alertaError(error.message);
    }
}

const vistaPreviaImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        imagenPerfil.src = reader.result;
        spanImagen.textContent = "Archivo imagen seleccionada";
    };
    reader.readAsDataURL(file);
}

const EliminarVistaPreviaImg = () => {
    imagenPerfil.src = "../img/pfp.png";
    inputPerfil.value = "";
    spanImagen.textContent = "Ningún archivo seleccionado";
}
document.addEventListener("DOMContentLoaded",cargarHeader(hash));
document.addEventListener("DOMContentLoaded", cargarOficios);
inputPerfil.addEventListener('change', vistaPreviaImg);
BotonborrarImg.addEventListener('click', EliminarVistaPreviaImg);
registro.addEventListener("submit", validar);
