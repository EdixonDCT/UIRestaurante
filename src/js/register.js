import { alertaError, alertaOK, alertaPregunta } from "./alertas";

//formulario
const registro = document.querySelector(".form");
//valores a postear
const cedula = document.querySelector(".cedula");
const nombre = document.querySelector(".nombre");
const apellido = document.querySelector(".apellido");
const fecha = document.querySelector(".fecha");
const pass1 = document.querySelector(".contrasena");
const pass2 = document.querySelector(".contrasenaValidar");
const oficio = document.querySelector(".oficio");
const comboxOficio = document.querySelector(".comboxOficio");

const inputPerfil = document.getElementById("ArchivoFoto");
const imagenPerfil = document.getElementById("imagenPerfil");
const spanImagen = document.getElementById("ArchivoEstado");

const validar = async (e) => {
  e.preventDefault();
  const archivo = inputPerfil.files[0];
  if (!cedula.value == "")
  {
    if (!validarCedula(cedula.value)) return alertaError("Error: Cedula debe tener 10 digitos minimo")  
  }
  if (!fecha.value == "")
  {
    if(validarEdad(fecha.value)) return alertaError("Error: No es mayor de 18 Años")
    if(validarEdadMayor(fecha.value)) return alertaError("Error: La edad máxima permitida para trabajar es 70 años")
  }
  if (!archivo) return alertaError("Error: Seleccione una Imagen.");
  if (pass1.value !== pass2.value)
    return alertaError("Error: Las contraseñas no coinciden");
  const datos = {
    cedula: cedula.value,
    nombre: nombre.value,
    apellido: apellido.value,
    nacimiento: fecha.value,
    contrasena: pass1.value,
    idOficio: oficio.value,
  };
  SubirTrabajador(datos);
};
const SubirTrabajador = async (datos) => {
  try {
    const response = await fetch(
      "http://localhost:8080/ApiRestaurente/api/trabajadores",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      }
    );

    const mensaje = await response.text();

    if (!response.ok) {
      throw new Error(mensaje);
    }
    subirImagen();
  } catch (error) {
    alertaError(error.message);
  }
};
const validarEdad = (fechaNacimiento) =>
  {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    
    if (edad >= 18) {
      return false
    } else {
      return true;
    }
  }
const validarEdadMayor = (fechaNacimiento) =>
  {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    if (edad > 70) {
      return true
    } else {
      return false;
    }
  }
  const validarCedula = (cedula) => {
    const esValida = /^\d{10}$/.test(cedula);
    return esValida;
  };
const subirImagen = async () => {
  try {
    const archivo = inputPerfil.files[0];

    const formData = new FormData();
    formData.append("imagen", archivo);

    const res = await fetch("http://localhost:8080/ApiRestaurente/api/imagen", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    if (!res.ok || !json.url) {
      throw new Error(json.error || "Error al subir la imagen.");
    }
    actualizarFotoTrabajador(json.nombre);
  } catch (error) {
    alertaError(error.message);
  }
};
const actualizarFotoTrabajador = async (nombreFoto) => {
  try {
    const imagen = { foto: nombreFoto };

    const actualizar = await fetch(
      `http://localhost:8080/ApiRestaurente/api/trabajadores/${cedula.value}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(imagen),
      }
    );
    const mensajeImagen = await actualizar.text();
    if (!actualizar.ok) {
      throw new Error(mensajeImagen);
    }
    console.log(mensajeImagen);
    await alertaOK("Trabajador Creado con Exito.");
    registro.submit();
  } catch (error) {
    alertaError(error.message);
  }
};
const cargarOficios = async () => {
  try {
    const response = await fetch(
      "http://localhost:8080/ApiRestaurente/api/oficios"
    );
    if (!response.ok) {
      const mensaje = await response.text();
      throw new Error(mensaje);
    }

    const data = await response.json();
    data.forEach((oficio) => {
      const option = document.createElement("option");
      option.value = oficio.codigo;
      option.textContent = oficio.tipo;
      comboxOficio.appendChild(option);
    });
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
  imagenPerfil.src = "../img/pfp.png";
  inputPerfil.value = "";
  spanImagen.textContent = "Ningún archivo seleccionado";
};

document.addEventListener("DOMContentLoaded", cargarOficios);
inputPerfil.addEventListener("change", vistaPreviaImg);
window.addEventListener("click", async (e) => {
  if (e.target.matches("#borrarImagen")) EliminarVistaPreviaImg();
});
registro.addEventListener("submit", validar);
