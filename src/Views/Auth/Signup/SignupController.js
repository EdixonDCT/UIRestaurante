import "../../../css/register.css";
import { alertaError, alertaOK } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export const SignupController = () => {
  console.log("Registro");
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

  cedula.addEventListener("keydown", (e) => {
    validacion.validarNumeroKey(e);
    validacion.validarCantidad(e, 10)
    validacion.validarLimiteKey(e, 10);
  });
  nombre.addEventListener("blur", validacion.validarCampo);
  nombre.addEventListener("keydown", (e) => {
    validacion.validarTextoKey(e);
    validacion.validarLimiteKey(e, 20);
  });
  apellido.addEventListener("blur", validacion.validarCampo);
  apellido.addEventListener("keydown", (e) => {
    validacion.validarTextoKey(e);
    validacion.validarLimiteKey(e, 20);
  });
  fecha.addEventListener("blur", validacion.validarCampo);
  contrasena.addEventListener("keydown", (e) => {
    validacion.validarContrasenaKey(e);
    validacion.validarLimiteKey(e, 20);
  });
  contrasenaConfirm.addEventListener("keydown", (e) => {
    validacion.validarContrasena(e, contrasena);
    validacion.validarLimiteKey(e, 20);
  });

  inputPerfil.addEventListener("change", vistaPreviaImg);
  window.addEventListener("click", async (e) => {
    if (e.target.matches("#borrarImagen")) EliminarVistaPreviaImg();
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (validacion.validarCampos(e)){
      const objetoLogin = validacion.datos;
      delete objetoLogin.contrasenaConfirm;
      delete objetoLogin.foto;
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
        const subidaFoto = await api.patchPublic(`register/${objetoLogin.cedula}`, bodyImagenRegistro)
        if (subidaFoto.Ok) {
          await alertaOK(registro.Ok);
          window.location.href = '#/Login';
        }
      }
    }
  })
}
