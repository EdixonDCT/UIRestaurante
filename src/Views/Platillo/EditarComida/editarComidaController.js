// ==================== Imports ====================
// Funciones para mostrar alertas
import { alertaError, alertaOK, alertaTiempo } from "../../../Helpers/alertas";
// Funciones para hacer peticiones a la API
import * as api from "../../../Helpers/api";
// Funciones para validar campos del formulario
import * as validacion from "../../../Helpers/validaciones";

// ==================== Función principal ====================
export default async () => {

  // Selección de elementos del DOM
  const form = document.querySelector(".form");
  const nombre = document.querySelector(".nombre");
  const precio = document.querySelector(".precio");
  const comboTipo = document.querySelector(".comboTipo");

  // ==================== Obtener ID de la comida ====================
  // Extraer hash de la URL y obtener el ID del platillo a editar
  const hash = location.hash.slice(1); // Quita el '#' al inicio
  const [url, id] = hash.split("=");

  // ==================== Traer datos existentes ====================
  // Obtener datos actuales de la comida desde la API
  const traerDatos = await api.get(`comidas/${id}`);
  // Rellenar campos del formulario con los datos actuales
  nombre.value = traerDatos.nombre;
  precio.value = traerDatos.precio;
  comboTipo.value = traerDatos.tipo;

  // ==================== Validaciones en tiempo real ====================
  // Nombre: quitar error al salir del input y validar caracteres
  nombre.addEventListener("blur", () => { validacion.quitarError(nombre.parentElement) });
  nombre.addEventListener("keydown", (e) => {
    validacion.validarTextoEspacioKey(e); // Solo letras y espacios
    validacion.validarLimiteKey(e, 20);   // Máximo 20 caracteres
  });

  // Precio: quitar error al salir y validar que sean números
  precio.addEventListener("blur", () => { validacion.quitarError(precio.parentElement) });
  precio.addEventListener("keydown", (e) => {
    validacion.validarNumeroKey(e); // Solo números
    validacion.validarLimiteKey(e, 6); // Máximo 6 dígitos
  });

  // Tipo: quitar error al salir del input
  comboTipo.addEventListener("blur", () => { validacion.quitarError(comboTipo.parentElement) });

  // ==================== Submit del formulario ====================
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita recargar la página

    // Validación de campos
    let validarNombre = validacion.validarCampo(nombre);
    let validarPrecio = validacion.validarCampo(precio);
    let validarTipo = validacion.validarCampo(comboTipo);

    if (validarNombre && validarPrecio && validarTipo) {
      // Crear objeto con los datos actualizados
      const objetoPlatillo = {
        nombre: nombre.value,
        precio: precio.value,
        tipo: comboTipo.value,
      }

      // Enviar cambios a la API (PUT)
      const creado = await api.put(`comidas/${id}`, objetoPlatillo);

      if (creado.Error) {
        alertaError(creado.Error); // Mostrar error si falla
        return;
      } else {
        await alertaOK(creado.Ok); // Mensaje de éxito
        window.location.href = '#/Platillo'; // Redirige a la lista de platillos
      }
    }
  })
}
