import { alertaError, alertaOK } from "../../../Helpers/alertas"; 
// Importa funciones para mostrar alertas de error o de éxito

import * as api from "../../../Helpers/api"; 
// Importa funciones para hacer llamadas a la API (GET, POST, PATCH)

import * as validacion from "../../../Helpers/validaciones"; 
// Importa funciones para validar campos del formulario

export const SignupController = () => {
  // Seleccionamos los elementos del formulario
  const form = document.querySelector(".form"); // Formulario completo
  const cedula = document.querySelector(".cedula"); // Input de cédula
  const nombre = document.querySelector(".nombre"); // Input de nombre
  const apellido = document.querySelector(".apellido"); // Input de apellido
  const fecha = document.querySelector(".fecha"); // Input de fecha de nacimiento
  const contrasena = document.querySelector(".contrasena"); // Input de contraseña
  const contrasenaConfirm = document.querySelector(".contrasenaConfirmar"); // Confirmación de contraseña
  const comboRoles = document.querySelector(".comboRoles"); // Select de roles
  const inputPerfil = document.getElementById("ArchivoFoto"); // Input de archivo de imagen
  const imagenPerfil = document.getElementById("imagenPerfil"); // Imagen de vista previa
  const spanImagen = document.getElementById("ArchivoEstado"); // Texto que indica estado de la imagen

  // Función para rellenar el select de roles desde la API
  const rellenarRoles = async () => {
    const roles = await api.getPublic("roles"); // Obtener lista de roles
    roles.forEach(rol => {
      let option = document.createElement("option"); // Crear un elemento <option>
      option.value = rol.id; // Valor del option = id del rol
      option.textContent = rol.nombre; // Texto visible = nombre del rol
      comboRoles.appendChild(option); // Agregar el option al select
    });
  }
  rellenarRoles(); // Ejecutamos la función para llenar el select al cargar el controlador

  // Función para mostrar la vista previa de la imagen seleccionada
  const vistaPreviaImg = (e) => {
    const file = e.target.files[0]; // Tomar el primer archivo del input
    if (!file) return; // Si no hay archivo, salir

    const reader = new FileReader(); // Crear un lector de archivos
    reader.onload = () => {
      imagenPerfil.src = reader.result; // Asignar la imagen al preview
      spanImagen.textContent = "Archivo imagen seleccionada"; // Cambiar el texto del estado
    };
    reader.readAsDataURL(file); // Leer el archivo como base64
  };

  // Función para eliminar la vista previa de la imagen
  const EliminarVistaPreviaImg = () => {
    imagenPerfil.src = "../../../../public/perfil.png"; // Imagen por defecto
    inputPerfil.value = ""; // Limpiar el input
    spanImagen.textContent = "Ningún archivo seleccionado"; // Texto de estado
  };

  // Validaciones en tiempo real y control de eventos de los inputs
  cedula.addEventListener("blur", () => { validacion.quitarError(cedula.parentElement) }); 
  // Quitar error si el input pierde foco
  cedula.addEventListener("keydown", (e) => {
    validacion.validarNumeroKey(e); // Solo permitir números
    validacion.validarLimiteKey(e, 10); // Máximo 10 caracteres
  });

  nombre.addEventListener("blur", () => { validacion.quitarError(nombre.parentElement) });
  nombre.addEventListener("keydown", (e) => {
    validacion.validarTextoKey(e); // Solo permitir letras
    validacion.validarLimiteKey(e, 20); // Máximo 20 caracteres
  });

  apellido.addEventListener("blur", () => { validacion.quitarError(apellido.parentElement) });
  apellido.addEventListener("keydown", (e) => {
    validacion.validarTextoKey(e);
    validacion.validarLimiteKey(e, 20);
  });

  fecha.addEventListener("blur", () => { validacion.quitarError(fecha.parentElement) });

  contrasena.addEventListener("blur", () => { validacion.quitarError(contrasena.parentElement) });
  contrasena.addEventListener("keydown", (e) => { validacion.validarLimiteKey(e, 20) });

  contrasenaConfirm.addEventListener("blur", () => { validacion.quitarError(contrasenaConfirm.parentElement) });
  contrasenaConfirm.addEventListener("keydown", (e) => { validacion.validarLimiteKey(e, 20) });

  comboRoles.addEventListener("blur", () => { validacion.quitarError(comboRoles.parentElement) });
  inputPerfil.addEventListener("blur", () => { validacion.quitarError(inputPerfil.parentElement) });
  inputPerfil.addEventListener("change", vistaPreviaImg); // Actualiza preview cuando se selecciona archivo

  window.addEventListener("click", async (e) => {
    if (e.target.matches("#borrarImagen")) EliminarVistaPreviaImg(); // Eliminar imagen al hacer click en el botón
  });

  // Envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evitar que la página se recargue al enviar

    // Validaciones antes de enviar
    let validarCedula = validacion.validarCantidad(cedula, 6); // Verificar que tenga al menos 6 dígitos
    let validarNombre = validacion.validarCampo(nombre); // No vacío
    let validarApellido = validacion.validarCampo(apellido);
    let validarFecha = validacion.validarMayorEdad(fecha); // Mayor de edad
    let validarContrasena = validacion.validarContrasena(contrasena); // Contraseña válida
    let validarIgualdad = validacion.validarContrasenaIgual(contrasenaConfirm, contrasena); // Contraseñas coinciden
    let validarRol = validacion.validarCampo(comboRoles); // Rol seleccionado
    let validarImagen = validacion.validarImagen(inputPerfil); // Imagen cargada

    // Si todas las validaciones son correctas
    if (validarCedula && validarNombre && validarApellido && validarFecha && validarContrasena && validarIgualdad && validarRol && validarImagen) {
      // Crear objeto con los datos del usuario
      const objetoLogin = {
        cedula: cedula.value,
        nombre: nombre.value,
        apellido: apellido.value,
        nacimiento: fecha.value,
        contrasena: contrasena.value,
        idRol: comboRoles.value
      }

      // Enviar datos del usuario a la API
      const registro = await api.postPublic("register", objetoLogin);
      if (registro.Error) {
        alertaError(registro.Error); // Mostrar error si falla
        return;
      } else {
        // Subir la imagen del perfil
        const imagen = await api.postImagen(inputPerfil);
        const bodyImagenRegistro = { foto: imagen.nombre } // Preparar datos para actualizar usuario

        // Asociar imagen al usuario registrado
        const subidaFoto = await api.patchPublic(`register/${cedula.value}`, bodyImagenRegistro);
        if (subidaFoto.Ok) {
          await alertaOK(registro.Ok); // Mostrar mensaje de éxito
          window.location.href = '#/Login'; // Redirigir al login
        }
      }
    }
  })
}
