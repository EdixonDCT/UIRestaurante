import { alertaError, alertaOK,alertaTiempo } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export default async () => {
  const form = document.querySelector(".form");

  const nombre = document.querySelector(".nombre");
  const precio = document.querySelector(".precio");

  const inputPerfil = document.getElementById("ArchivoFoto");
  const imagenPerfil = document.getElementById("imagenPlatillo");
  const spanImagen = document.getElementById("ArchivoEstado");


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
    imagenPerfil.src = "../../../../public/coctel.png";
    inputPerfil.value = "";
    spanImagen.textContent = "Ningún archivo seleccionado";
  };

  nombre.addEventListener("blur", () => {validacion.quitarError(nombre.parentElement)});
  nombre.addEventListener("keydown", (e) => {
    validacion.validarTextoEspacioKey(e);
    validacion.validarLimiteKey(e, 20);
  });
  precio.addEventListener("blur", () => {validacion.quitarError(precio.parentElement)});
  precio.addEventListener("keydown", (e) => {
    validacion.validarNumeroKey(e);
    validacion.validarLimiteKey(e, 6);
  });

  inputPerfil.addEventListener("blur", () => {validacion.quitarError(inputPerfil.parentElement)});
  inputPerfil.addEventListener("change", vistaPreviaImg);
  window.addEventListener("click", async (e) => {
    if (e.target.matches("#borrarImagen")) EliminarVistaPreviaImg();
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let validarNombre = validacion.validarCampo(nombre);
    let validarPrecio = validacion.validarCampo(precio);
    let validarImagen = validacion.validarImagen(inputPerfil);

    if (validarNombre && validarPrecio && validarImagen)
      {
      const objetoPlatillo = {
        nombre: nombre.value,
        precio: precio.value,
      }
      const creado = await api.post("cocteles", objetoPlatillo);
      if (creado.Error) {
        alertaError(creado.Error);
        return;
      }
      else {
        const imagen = await api.postImagen(inputPerfil);
        const bodyImagenPlatillo = {
          imagen: imagen.nombre
        }
        const subidaFoto = await api.patch(`cocteles/imagen/${creado.id}`,bodyImagenPlatillo)
        if (subidaFoto.Ok) {
          await alertaTiempo(5000);
          await alertaOK(creado.Ok);
          window.location.href = '#/Platillo';
        }
      }
    }
  })
}
