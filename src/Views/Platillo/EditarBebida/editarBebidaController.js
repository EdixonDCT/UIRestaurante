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
  const comboTipo = document.querySelector(".comboTipo");   // Select con tipo de bebida
  const comboUnidad = document.querySelector(".comboUnidad"); // Select con unidad de bebida

  // ==================== Obtener ID de la bebida ====================
  // Tomamos el hash de la URL y extraemos el ID
  const hash = location.hash.slice(1); // Quita el '#' al inicio
  const [url, id] = hash.split("=");   // url no se usa aquí, solo id

  // ==================== Traer datos existentes ====================
  // Petición a la API para obtener la bebida que vamos a editar
  const traerDatos = await api.get(`bebidas/${id}`);
  // Rellenar los campos del formulario con los datos actuales
  nombre.value = traerDatos.nombre;
  precio.value = traerDatos.precio;
  comboTipo.value = traerDatos.tipo;
  comboUnidad.value = traerDatos.unidad;

  // ==================== Validaciones en tiempo real ====================
  // Nombre: quitar error al salir y validar caracteres
  nombre.addEventListener("blur", () => { validacion.quitarError(nombre.parentElement) });
  nombre.addEventListener("keydown", (e) => {
    validacion.validarTextoEspacioKey(e); // Solo letras y espacios
    validacion.validarLimiteKey(e, 20);   // Máximo 20 caracteres
  });

  // Precio: quitar error al salir y validar números
  precio.addEventListener("blur", () => { validacion.quitarError(precio.parentElement) });
  precio.addEventListener("keydown", (e) => {
    validacion.validarNumeroKey(e); // Solo números
    validacion.validarLimiteKey(e, 6); // Máximo 6 dígitos
  });

  // Combo tipo y unidad: quitar error al salir
  comboTipo.addEventListener("blur", () => { validacion.quitarError(comboTipo.parentElement) });
  comboUnidad.addEventListener("blur", () => { validacion.quitarError(comboUnidad.parentElement) });

  // ==================== Submit del formulario ====================
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita recargar la página

    // Validación de todos los campos
    let validarNombre = validacion.validarCampo(nombre);
    let validarPrecio = validacion.validarCampo(precio);
    let validarTipo = validacion.validarCampo(comboTipo);
    let validarUnidad = validacion.validarCampo(comboUnidad);

    if (validarNombre && validarPrecio && validarTipo && validarUnidad) {
      // Crear objeto con los datos actualizados
      const objetoPlatillo = {
        nombre: nombre.value,
        precio: precio.value,
        tipo: comboTipo.value,
        unidad: comboUnidad.value
      }

      // Enviar cambios a la API (PUT)
      const creado = await api.put(`bebidas/${id}`, objetoPlatillo);

      if (creado.Error) {
        alertaError(creado.Error); // Mostrar error si falla
        return;
      }

      await alertaOK(creado.Ok); // Mensaje de éxito
      window.location.href = '#/Platillo'; // Redirige a la lista de platillos
    }
  })
}
