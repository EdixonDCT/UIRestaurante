import { alertaError, alertaOK, alertaPregunta } from "./alertas"; // importa funciones de alertas

//formulario
const registro = document.querySelector(".form"); // selecciona formulario
//valores a postear
const cedula = document.querySelector(".cedula"); // input cedula
const nombre = document.querySelector(".nombre"); // input nombre
const apellido = document.querySelector(".apellido"); // input apellido
const fecha = document.querySelector(".fecha"); // input fecha
const pass1 = document.querySelector(".contrasena"); // input contraseña
const pass2 = document.querySelector(".contrasenaValidar"); // input validar contraseña
const oficio = document.querySelector(".oficio"); // input oficio
const comboxOficio = document.querySelector(".comboxOficio"); // select oficios

const inputPerfil = document.getElementById("ArchivoFoto"); // input archivo
const imagenPerfil = document.getElementById("imagenPerfil"); // img vista previa
const spanImagen = document.getElementById("ArchivoEstado"); // span estado imagen

const validar = async (e) => { // función validar datos
  e.preventDefault(); // evita refrescar
  const archivo = inputPerfil.files[0]; // obtiene archivo
  if (!cedula.value == "") // si hay cedula
  {
    if (!validarCedula(cedula.value)) return alertaError("Error: Cedula debe tener 10 digitos minimo")  // valida formato
  }
  if (!fecha.value == "") // si hay fecha
  {
    if(validarEdad(fecha.value)) return alertaError("Error: No es mayor de 18 Años") // valida menor de edad
    if(validarEdadMayor(fecha.value)) return alertaError("Error: La edad máxima permitida para trabajar es 70 años") // valida mayor a 70
  }
  if (!archivo) return alertaError("Error: Seleccione una Imagen."); // valida imagen
  if (pass1.value !== pass2.value) // compara contraseñas
    return alertaError("Error: Las contraseñas no coinciden"); // error contraseñas
  const datos = { // objeto trabajador
    cedula: cedula.value,
    nombre: nombre.value,
    apellido: apellido.value,
    nacimiento: fecha.value,
    contrasena: pass1.value,
    idOficio: oficio.value,
  };
  SubirTrabajador(datos); // llama subir trabajador
};
const SubirTrabajador = async (datos) => { // función post trabajador
  try {
    const response = await fetch(
      "http://localhost:8080/ApiRestaurente/api/trabajadores", // endpoint trabajador
      {
        method: "POST", // método post
        headers: {
          "Content-Type": "application/json", // tipo json
        },
        body: JSON.stringify(datos), // datos en json
      }
    );

    const mensaje = await response.text(); // mensaje servidor

    if (!response.ok) { // si falla
      throw new Error(mensaje); // lanza error
    }
    subirImagen(); // si ok sube imagen
  } catch (error) {
    alertaError(error.message); // alerta error
  }
};
const validarEdad = (fechaNacimiento) => // función validar >=18
  {
    const hoy = new Date(); // fecha actual
    const nacimiento = new Date(fechaNacimiento); // fecha nac

    let edad = hoy.getFullYear() - nacimiento.getFullYear(); // calcula edad
    const mes = hoy.getMonth() - nacimiento.getMonth(); // resta meses

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) { // si no cumplió año
        edad--; // reduce edad
    }
    
    if (edad >= 18) { // si mayor a 18
      return false // válido
    } else {
      return true; // menor de edad
    }
  }
const validarEdadMayor = (fechaNacimiento) => // función validar <=70
  {
    const hoy = new Date(); // fecha actual
    const nacimiento = new Date(fechaNacimiento); // fecha nac

    let edad = hoy.getFullYear() - nacimiento.getFullYear(); // calcula edad
    const mes = hoy.getMonth() - nacimiento.getMonth(); // resta meses

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) { // si no cumplió año
        edad--; // reduce edad
    }
    if (edad > 70) { // si mayor a 70
      return true // inválido
    } else {
      return false; // válido
    }
  }
  const validarCedula = (cedula) => { // valida formato cedula
    const esValida = /^\d{10}$/.test(cedula); // regex 10 digitos
    return esValida; // retorna boolean
  };
const subirImagen = async () => { // función subir imagen
  try {
    const archivo = inputPerfil.files[0]; // obtiene archivo

    const formData = new FormData(); // crea formdata
    formData.append("imagen", archivo); // agrega imagen

    const res = await fetch("http://localhost:8080/ApiRestaurente/api/imagen", { // endpoint imagen
      method: "POST", // post
      body: formData, // body con formdata
    });

    const json = await res.json(); // obtiene json
    if (!res.ok || !json.url) { // si error
      throw new Error(json.error || "Error al subir la imagen."); // lanza error
    }
    actualizarFotoTrabajador(json.nombre); // actualiza nombre imagen
  } catch (error) {
    alertaError(error.message); // alerta error
  }
};
const actualizarFotoTrabajador = async (nombreFoto) => { // función patch imagen
  try {
    const imagen = { foto: nombreFoto }; // objeto imagen

    const actualizar = await fetch(
      `http://localhost:8080/ApiRestaurente/api/trabajadores/${cedula.value}`, // endpoint patch
      {
        method: "PATCH", // método patch
        headers: {
          "Content-Type": "application/json", // tipo json
        },
        body: JSON.stringify(imagen), // body con imagen
      }
    );
    const mensajeImagen = await actualizar.text(); // mensaje servidor
    if (!actualizar.ok) { // si error
      throw new Error(mensajeImagen); // lanza error
    }
    console.log(mensajeImagen); // log
    await alertaOK("Trabajador Creado con Exito."); // alerta ok
    registro.submit(); // envía form
  } catch (error) {
    alertaError(error.message); // alerta error
  }
};
const cargarOficios = async () => { // función cargar oficios
  try {
    const response = await fetch(
      "http://localhost:8080/ApiRestaurente/api/oficios" // endpoint oficios
    );
    if (!response.ok) { // si falla
      const mensaje = await response.text(); // obtiene mensaje
      throw new Error(mensaje); // lanza error
    }

    const data = await response.json(); // json oficios
    data.forEach((oficio) => { // recorre oficios
      const option = document.createElement("option"); // crea opción
      option.value = oficio.codigo; // valor codigo
      option.textContent = oficio.tipo; // texto tipo
      comboxOficio.appendChild(option); // agrega opción al select
    });
  } catch (error) {
    alertaError(error.message); // alerta error
  }
};

const vistaPreviaImg = (e) => { // función vista previa
  const file = e.target.files[0]; // obtiene archivo
  if (!file) return; // si no archivo retorna

  const reader = new FileReader(); // crea reader
  reader.onload = () => { // evento load
    imagenPerfil.src = reader.result; // muestra imagen
    spanImagen.textContent = "Archivo imagen seleccionada"; // texto estado
  };
  reader.readAsDataURL(file); // lee como url
};

const EliminarVistaPreviaImg = () => { // función quitar imagen
  imagenPerfil.src = "../img/pfp.png"; // imagen por defecto
  inputPerfil.value = ""; // limpia input
  spanImagen.textContent = "Ningún archivo seleccionado"; // texto estado
};

document.addEventListener("DOMContentLoaded", cargarOficios); // evento carga oficios
inputPerfil.addEventListener("change", vistaPreviaImg); // evento vista previa
window.addEventListener("click", async (e) => { // evento click global
  if (e.target.matches("#borrarImagen")) EliminarVistaPreviaImg(); // si click borrar
});
registro.addEventListener("submit", validar); // evento submit form
