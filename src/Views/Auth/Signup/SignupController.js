import { alertaError, alertaOK } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export const SignupController = () => {
  //formulario
  const form = document.querySelector(".form");

  //valores a postear
  const cedula = document.querySelector(".cedula");
  const nombre = document.querySelector(".nombre");
  const apellido = document.querySelector(".apellido");
  const fecha = document.querySelector(".fecha");
  const contrasena = document.querySelector(".contrasena");
  const contrasenaConfirm = document.querySelector(".contrasenaConfirmar");
  const comboRoles = document.querySelector(".comboRoles");

  const inputPerfil = document.getElementById("ArchivoFoto");
  const imagenPerfil = document.getElementById("imagenPerfil");
  const spanImagen = document.getElementById("ArchivoEstado");


  const rellenarRoles = async () => {
    const roles = await api.getPublic("roles")
    roles.forEach(rol => {
      // if (rol.id == "1") return;
      let option = document.createElement("option");
      option.value = rol.id;
      option.textContent = rol.nombre;
      comboRoles.appendChild(option);
    });
  }
  rellenarRoles();

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
    imagenPerfil.src = "../../../../public/perfil.png";
    inputPerfil.value = "";
    spanImagen.textContent = "Ningún archivo seleccionado";
  };


  cedula.addEventListener("blur", () => {validacion.quitarError(cedula.parentElement)});
  cedula.addEventListener("keydown", (e) => {
    validacion.validarNumeroKey(e);
    validacion.validarLimiteKey(e, 10);
  });
  nombre.addEventListener("blur", () => {validacion.quitarError(nombre.parentElement)});
  nombre.addEventListener("keydown", (e) => {
    validacion.validarTextoKey(e);
    validacion.validarLimiteKey(e, 20);
  });
  apellido.addEventListener("blur", () => {validacion.quitarError(apellido.parentElement)});
  apellido.addEventListener("keydown", (e) => {
    validacion.validarTextoKey(e);
    validacion.validarLimiteKey(e, 20);
  });
  fecha.addEventListener("blur", () => {validacion.quitarError(fecha.parentElement)});
  contrasena.addEventListener("blur", () => {validacion.quitarError(contrasena.parentElement)});
  contrasena.addEventListener("keydown", (e) => {
    validacion.validarLimiteKey(e, 20);
  });
  contrasenaConfirm.addEventListener("blur", () => {validacion.quitarError(contrasenaConfirm.parentElement)});
  contrasenaConfirm.addEventListener("keydown", (e) => {
    validacion.validarLimiteKey(e, 20);
  });
  comboRoles.addEventListener("blur", () => {validacion.quitarError(comboRoles.parentElement)});
  inputPerfil.addEventListener("blur", () => {validacion.quitarError(inputPerfil.parentElement)});
  inputPerfil.addEventListener("change", vistaPreviaImg);
  window.addEventListener("click", async (e) => {
    if (e.target.matches("#borrarImagen")) EliminarVistaPreviaImg();
  });
  form.addEventListener("submit", async (e) => {

    e.preventDefault();
    let validarCedula = validacion.validarCantidad(cedula,6);
    let validarNombre = validacion.validarCampo(nombre);
    let validarApellido = validacion.validarCampo(apellido);
    let validarFecha = validacion.validarMayorEdad(fecha);
    let validarContrasena = validacion.validarContrasena(contrasena);
    let validarIgualdad = validacion.validarContrasenaIgual(contrasenaConfirm,contrasena);
    let validarRol = validacion.validarCampo(comboRoles);
    let validarImagen = validacion.validarImagen(inputPerfil);

    if (validarCedula && validarNombre && validarApellido && validarFecha && validarContrasena && validarIgualdad && validarRol && validarImagen)
      {
      const objetoLogin = {
        cedula: cedula.value,
        nombre: nombre.value,
        apellido: apellido.value,
        nacimiento: fecha.value,
        contrasena: contrasena.value,
        idRol: comboRoles.value
      }
      const registro = await api.postPublic("register", objetoLogin);
      if (registro.Error) {
        alertaError(registro.Error);
        return;
      }
      else {
        const imagen = await api.postImagen(inputPerfil);
        const bodyImagenRegistro = {
          foto: imagen.nombre
        }
        const subidaFoto = await api.patchPublic(`register/${cedula.value}`,bodyImagenRegistro)
        if (subidaFoto.Ok) {
          await alertaOK(registro.Ok);
          window.location.href = '#/Login';
        }
      }
    }
  })
}
