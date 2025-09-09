// Importa funciones de alertas
import { alertaError, alertaOK, alertaTiempo } from "../../../Helpers/alertas";
// Importa funciones para interactuar con la API
import * as api from "../../../Helpers/api";
// Importa funciones de validación
import * as validacion from "../../../Helpers/validaciones";

// Función principal exportada
export default async () => {
  // Selecciona el formulario
  const form = document.querySelector(".form");

  // Selecciona elementos del DOM para imagen
  const imagenVieja = document.querySelector(".imagenVieja")
  const inputPerfil = document.getElementById("ArchivoFoto");
  const imagenPerfil = document.getElementById("imagenUsuario");
  const spanImagen = document.getElementById("ArchivoEstado");

  // Obtiene el id del trabajador desde el localstorage
  const id = window.localStorage.getItem("cedula")

  // Traer datos del trabajador
  const traerDatos = await api.get(`trabajadores/${id}`);
  imagenVieja.src = await api.imagen(traerDatos.foto);

  // Función para vista previa de la imagen
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

  // Función para eliminar vista previa
  const EliminarVistaPreviaImg = () => {
    imagenPerfil.src = "../../../../public/perfil.png";
    inputPerfil.value = "";
    spanImagen.textContent = "Ningún archivo seleccionado";
  };

  // Quitar error al perder foco
  inputPerfil.addEventListener("blur", () => { validacion.quitarError(inputPerfil.parentElement) });
  // Evento para actualizar vista previa al cambiar archivo
  inputPerfil.addEventListener("change", vistaPreviaImg);

  // Evento para botón de eliminar vista previa
  window.addEventListener("click", async (e) => {
    if (e.target.matches("#borrarImagen")) EliminarVistaPreviaImg();
  });

  // Evento de envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let validarImagen = validacion.validarImagen(inputPerfil);
    if (validarImagen) {
      // Subir imagen
      const imagen = await api.postImagen(inputPerfil);
      const bodyImagen = { foto: imagen.nombre }
      // Borrar imagen anterior
      await api.imagendel(`imagen/${traerDatos.foto}`);
      // Actualizar trabajador con nueva foto
      const subidaFoto = await api.patch(`trabajadores/${id}`, bodyImagen)
      if (subidaFoto.Ok) {
        await alertaTiempo(5000);
        await alertaOK(subidaFoto.Ok);
        window.localStorage.setItem("fotoPerfil", imagen.nombre);
        window.location.href = '#/Trabajadores';
      }
    }
  })
}
