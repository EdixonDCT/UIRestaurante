import { alertaError, alertaOK,alertaTiempo } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export default async () => {
  const form = document.querySelector(".form");

  const imagenVieja = document.querySelector(".imagenVieja")
  const inputPerfil = document.getElementById("ArchivoFoto");
  const imagenPerfil = document.getElementById("imagenPlatillo");
  const spanImagen = document.getElementById("ArchivoEstado");

  const hash = location.hash.slice(1);
  const [url, id] = hash.split("=");

  const traerDatos = await api.get(`comidas/${id}`);
  imagenVieja.src = await api.imagen(traerDatos.imagen);

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
    imagenPerfil.src = "../../../../public/comida.png";
    inputPerfil.value = "";
    spanImagen.textContent = "Ningún archivo seleccionado";
  };
  inputPerfil.addEventListener("blur", () => {validacion.quitarError(inputPerfil.parentElement)});
  inputPerfil.addEventListener("change", vistaPreviaImg);
  window.addEventListener("click", async (e) => {
    if (e.target.matches("#borrarImagen")) EliminarVistaPreviaImg();
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let validarImagen = validacion.validarImagen(inputPerfil);
    if (validarImagen)
      {
        const imagen = await api.postImagen(inputPerfil);
        const bodyImagenPlatillo = {
          imagen: imagen.nombre
        }
        const borarImagen = await api.imagendel(`imagen/${traerDatos.imagen}`);
        const subidaFoto = await api.patch(`comidas/imagen/${id}`,bodyImagenPlatillo)
        if (subidaFoto.Ok) {
          await alertaTiempo(5000);
          await alertaOK(subidaFoto.Ok);
          window.location.href = '#/Platillo';
        }
    }
  })
}
