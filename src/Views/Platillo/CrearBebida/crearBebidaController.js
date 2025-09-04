// Importa funciones de alerta, API y validaciones
import { alertaError, alertaOK, alertaTiempo } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";

// Exporta la función principal que se ejecuta al cargar la página de crear bebida
export default async () => {

  // Selecciona el formulario y los campos de entrada
  const form = document.querySelector(".form");
  const nombre = document.querySelector(".nombre");
  const precio = document.querySelector(".precio");
  const comboTipo = document.querySelector(".comboTipo");
  const comboUnidad = document.querySelector(".comboUnidad");

  // Selección del input de archivo e imagen de vista previa
  const inputPerfil = document.getElementById("ArchivoFoto");
  const imagenPerfil = document.getElementById("imagenPlatillo");
  const spanImagen = document.getElementById("ArchivoEstado");

  // ==================== Funciones de imagen ====================
  // Muestra una vista previa de la imagen seleccionada
  const vistaPreviaImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      imagenPerfil.src = reader.result; // Actualiza la imagen de vista previa
      spanImagen.textContent = "Archivo imagen seleccionada";
    };
    reader.readAsDataURL(file);
  };

  // Elimina la vista previa y reinicia el input de archivo
  const EliminarVistaPreviaImg = () => {
    imagenPerfil.src = "../../../../public/bebida.png"; // Imagen por defecto
    inputPerfil.value = "";
    spanImagen.textContent = "Ningún archivo seleccionado";
  };

  // ==================== Validaciones en tiempo real ====================
  nombre.addEventListener("blur", () => { validacion.quitarError(nombre.parentElement) });
  nombre.addEventListener("keydown", (e) => {
    validacion.validarTextoEspacioKey(e); // Solo letras y espacios
    validacion.validarLimiteKey(e, 20); // Máximo 20 caracteres
  });

  precio.addEventListener("blur", () => { validacion.quitarError(precio.parentElement) });
  precio.addEventListener("keydown", (e) => {
    validacion.validarNumeroKey(e); // Solo números
    validacion.validarLimiteKey(e, 6); // Máximo 6 dígitos
  });

  comboTipo.addEventListener("blur", () => { validacion.quitarError(comboTipo.parentElement) });
  comboUnidad.addEventListener("blur", () => { validacion.quitarError(comboUnidad.parentElement) });

  inputPerfil.addEventListener("blur", () => { validacion.quitarError(inputPerfil.parentElement) });
  inputPerfil.addEventListener("change", vistaPreviaImg); // Al cambiar archivo, mostrar vista previa

  window.addEventListener("click", async (e) => {
    if (e.target.matches("#borrarImagen")) EliminarVistaPreviaImg();
  });

  // ==================== Evento submit del formulario ====================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validar todos los campos
    let validarNombre = validacion.validarCampo(nombre);
    let validarPrecio = validacion.validarCampo(precio);
    let validarTipo = validacion.validarCampo(comboTipo);
    let validarUnidad = validacion.validarCampo(comboUnidad);
    let validarImagen = validacion.validarImagen(inputPerfil);

    // Si todo es válido
    if (validarNombre && validarPrecio && validarTipo && validarUnidad && validarImagen) {

      // Crear objeto con los datos de la bebida
      const objetoPlatillo = {
        nombre: nombre.value,
        precio: precio.value,
        tipo: comboTipo.value,
        unidad: comboUnidad.value
      }

      // Crear bebida en la base de datos
      const creado = await api.post("bebidas", objetoPlatillo);
      if (creado.Error) {
        alertaError(creado.Error);
        return;
      } else {
        // Subir la imagen
        const imagen = await api.postImagen(inputPerfil);
        const bodyImagenPlatillo = {
          imagen: imagen.nombre
        }
        // Asociar la imagen a la bebida creada
        const subidaFoto = await api.patch(`bebidas/imagen/${creado.id}`, bodyImagenPlatillo)
        if (subidaFoto.Ok) {
          await alertaTiempo(5000); // Espera un momento antes de mostrar alerta
          await alertaOK(creado.Ok); // Mensaje de éxito
          window.location.href = '#/Platillo'; // Redirige a la lista de platillos
        }
      }
    }
  })
}
