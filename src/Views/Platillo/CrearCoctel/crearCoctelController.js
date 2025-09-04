// ==================== Imports ====================
// Funciones de alertas: mostrar errores, OK y temporizados
import { alertaError, alertaOK, alertaTiempo } from "../../../Helpers/alertas";
// Funciones para hacer peticiones a la API
import * as api from "../../../Helpers/api";
// Funciones de validación de campos
import * as validacion from "../../../Helpers/validaciones";

// ==================== Función principal ====================
export default async () => {

  // Selecciona el formulario y los campos de entrada
  const form = document.querySelector(".form");
  const nombre = document.querySelector(".nombre");
  const precio = document.querySelector(".precio");

  // Selecciona los elementos relacionados con la imagen
  const inputPerfil = document.getElementById("ArchivoFoto"); // Input de archivo
  const imagenPerfil = document.getElementById("imagenPlatillo"); // Vista previa
  const spanImagen = document.getElementById("ArchivoEstado"); // Texto de estado del archivo

  // ==================== Funciones de imagen ====================
  // Muestra vista previa al seleccionar un archivo
  const vistaPreviaImg = (e) => {
    const file = e.target.files[0]; // Obtiene el primer archivo seleccionado
    if (!file) return; // Si no hay archivo, salir

    const reader = new FileReader(); // Crea lector de archivos
    reader.onload = () => {
      imagenPerfil.src = reader.result; // Muestra la imagen en el elemento <img>
      spanImagen.textContent = "Archivo imagen seleccionada"; // Cambia el texto de estado
    };
    reader.readAsDataURL(file); // Convierte el archivo a base64
  };

  // Elimina la vista previa y reinicia el input de archivo
  const EliminarVistaPreviaImg = () => {
    imagenPerfil.src = "../../../../public/coctel.png"; // Imagen por defecto
    inputPerfil.value = ""; // Limpia el input
    spanImagen.textContent = "Ningún archivo seleccionado"; // Texto de estado
  };

  // ==================== Validaciones en tiempo real ====================
  // Validación del nombre
  nombre.addEventListener("blur", () => { validacion.quitarError(nombre.parentElement) }); // Quita error al salir del campo
  nombre.addEventListener("keydown", (e) => {
    validacion.validarTextoEspacioKey(e); // Solo letras y espacios
    validacion.validarLimiteKey(e, 20); // Máximo 20 caracteres
  });

  // Validación del precio
  precio.addEventListener("blur", () => { validacion.quitarError(precio.parentElement) });
  precio.addEventListener("keydown", (e) => {
    validacion.validarNumeroKey(e); // Solo números
    validacion.validarLimiteKey(e, 6); // Máximo 6 dígitos
  });

  // Validación de la imagen
  inputPerfil.addEventListener("blur", () => { validacion.quitarError(inputPerfil.parentElement) });
  inputPerfil.addEventListener("change", vistaPreviaImg); // Al cambiar el archivo, mostrar vista previa

  // Botón para eliminar imagen
  window.addEventListener("click", async (e) => {
    if (e.target.matches("#borrarImagen")) EliminarVistaPreviaImg();
  });

  // ==================== Submit del formulario ====================
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita recargar la página

    // Validar todos los campos antes de enviar
    let validarNombre = validacion.validarCampo(nombre);
    let validarPrecio = validacion.validarCampo(precio);
    let validarImagen = validacion.validarImagen(inputPerfil);

    // Si todo es válido
    if (validarNombre && validarPrecio && validarImagen) {

      // Crear objeto con los datos del coctel
      const objetoPlatillo = {
        nombre: nombre.value,
        precio: precio.value,
      }

      // Crear coctel en la base de datos
      const creado = await api.post("cocteles", objetoPlatillo);

      if (creado.Error) {
        alertaError(creado.Error); // Mostrar error si falla
        return;
      } else {
        // Subir la imagen del coctel
        const imagen = await api.postImagen(inputPerfil);
        const bodyImagenPlatillo = { imagen: imagen.nombre }

        // Asociar la imagen al coctel recién creado
        const subidaFoto = await api.patch(`cocteles/imagen/${creado.id}`, bodyImagenPlatillo)

        if (subidaFoto.Ok) {
          await alertaTiempo(5000); // Espera 5s antes de mostrar la alerta
          await alertaOK(creado.Ok); // Mensaje de éxito
          window.location.href = '#/Platillo'; // Redirige a la lista de platillos
        }
      }
    }
  })
}
