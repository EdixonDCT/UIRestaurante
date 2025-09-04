// ==================== Imports ====================
// Funciones para mostrar alertas
import { alertaError, alertaOK, alertaTiempo } from "../../../Helpers/alertas";
// Funciones para interactuar con la API
import * as api from "../../../Helpers/api";
// Funciones para validar campos del formulario
import * as validacion from "../../../Helpers/validaciones";

// ==================== Función principal ====================
export default async () => {

  // Selección de elementos del DOM
  const form = document.querySelector(".form");
  const imagenVieja = document.querySelector(".imagenVieja"); // Imagen actual
  const inputPerfil = document.getElementById("ArchivoFoto"); // Input para nueva imagen
  const imagenPerfil = document.getElementById("imagenPlatillo"); // Preview de la imagen
  const spanImagen = document.getElementById("ArchivoEstado"); // Estado del input

  // ==================== Obtener ID de la bebida ====================
  const hash = location.hash.slice(1);
  const [url, id] = hash.split("=");

  // ==================== Traer imagen existente ====================
  const traerDatos = await api.get(`bebidas/${id}`);
  // Mostrar la imagen actual de la bebida
  imagenVieja.src = await api.imagen(traerDatos.imagen);

  // ==================== Función vista previa ====================
  const vistaPreviaImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Mostrar preview de la imagen seleccionada
    const reader = new FileReader();
    reader.onload = () => {
      imagenPerfil.src = reader.result;
      spanImagen.textContent = "Archivo imagen seleccionada";
    };
    reader.readAsDataURL(file);
  };

  // ==================== Eliminar vista previa ====================
  const EliminarVistaPreviaImg = () => {
    imagenPerfil.src = "../../../../public/bebida.png"; // Imagen por defecto
    inputPerfil.value = "";
    spanImagen.textContent = "Ningún archivo seleccionado";
  };

  // ==================== Validaciones y eventos ====================
  inputPerfil.addEventListener("blur", () => { validacion.quitarError(inputPerfil.parentElement) });
  inputPerfil.addEventListener("change", vistaPreviaImg);
  window.addEventListener("click", async (e) => {
    if (e.target.matches("#borrarImagen")) EliminarVistaPreviaImg();
  });

  // ==================== Enviar formulario ====================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validar que se haya seleccionado una imagen
    let validarImagen = validacion.validarImagen(inputPerfil);
    if (validarImagen) {
      // Subir nueva imagen a la API
      const imagen = await api.postImagen(inputPerfil);
      const bodyImagenPlatillo = { imagen: imagen.nombre };

      // Borrar la imagen anterior
      const borarImagen = await api.imagendel(`imagen/${traerDatos.imagen}`);

      // Actualizar el registro de la bebida con la nueva imagen
      const subidaFoto = await api.patch(`bebidas/imagen/${id}`, bodyImagenPlatillo);
      if (subidaFoto.Ok) {
        await alertaTiempo(5000); // Pausa 5s antes de mostrar OK
        await alertaOK(subidaFoto.Ok); // Mensaje de éxito
        window.location.href = '#/Platillo'; // Redirige a la lista de platillos
      }
    }
  })
}
