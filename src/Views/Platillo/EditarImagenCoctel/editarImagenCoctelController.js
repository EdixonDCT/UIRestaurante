// ==================== Imports ====================
// Funciones para mostrar alertas
import { alertaError, alertaOK, alertaTiempo } from "../../../Helpers/alertas";
// Funciones para interactuar con la API
import * as api from "../../../Helpers/api";
// Funciones para validar campos del formulario
import * as validacion from "../../../Helpers/validaciones";

// ==================== Función principal ====================
export default async () => {

  // ==================== Selección de elementos del DOM ====================
  const form = document.querySelector(".form"); // Formulario
  const imagenVieja = document.querySelector(".imagenVieja"); // Imagen actual del coctel
  const inputPerfil = document.getElementById("ArchivoFoto"); // Input de nueva imagen
  const imagenPerfil = document.getElementById("imagenPlatillo"); // Vista previa
  const spanImagen = document.getElementById("ArchivoEstado"); // Texto que indica estado del input

  // ==================== Obtener ID del coctel desde el hash ====================
  const hash = location.hash.slice(1);
  const [url, id] = hash.split("=");

  // ==================== Traer imagen existente ====================
  const traerDatos = await api.get(`cocteles/${id}`);
  // Mostrar la imagen actual
  imagenVieja.src = await api.imagen(traerDatos.imagen);

  // ==================== Función vista previa ====================
  const vistaPreviaImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Mostrar la imagen seleccionada antes de subirla
    const reader = new FileReader();
    reader.onload = () => {
      imagenPerfil.src = reader.result;
      spanImagen.textContent = "Archivo imagen seleccionada";
    };
    reader.readAsDataURL(file);
  };

  // ==================== Función para eliminar vista previa ====================
  const EliminarVistaPreviaImg = () => {
    imagenPerfil.src = "../../../../public/coctel.png"; // Imagen por defecto
    inputPerfil.value = "";
    spanImagen.textContent = "Ningún archivo seleccionado";
  };

  // ==================== Eventos ====================
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
      // Subir nueva imagen
      const imagen = await api.postImagen(inputPerfil);
      const bodyImagenPlatillo = { imagen: imagen.nombre };

      // Borrar imagen anterior
      const borarImagen = await api.imagendel(`imagen/${traerDatos.imagen}`);

      // Actualizar registro con la nueva imagen
      const subidaFoto = await api.patch(`cocteles/imagen/${id}`, bodyImagenPlatillo);
      if (subidaFoto.Ok) {
        await alertaTiempo(5000); // Espera 5 segundos antes de continuar
        await alertaOK(subidaFoto.Ok); // Mensaje de éxito
        window.location.href = '#/Platillo'; // Redirige a la lista de platillos
      }
    }
  });
}
