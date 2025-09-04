import { alertaError, alertaOK, alertaPregunta } from "../../Helpers/alertas";
// Importa funciones para mostrar alertas de éxito, error o de confirmación

import * as api from "../../Helpers/api";
// Importa funciones para hacer llamadas a la API (GET, POST, DELETE)

import validarPermiso from "../../Helpers/permisos";
// Importa función para validar si el usuario tiene permisos

export default async () => {
  const app = document.getElementById("app");
  // Contenedor principal donde se va a renderizar la tabla y los botones

  // --- Validar permisos para crear ingrediente ---
  const crear = validarPermiso("Ingrediente.crear");
  if (crear) {
    const boton = document.createElement("button");
    boton.classList.add("boton"); // Clase CSS del botón
    boton.id = "BotonCrearIngrediente"; // Id para detectar clic
    boton.textContent = "Crear Ingrediente"; // Texto del botón
    app.appendChild(boton); // Añadir botón al contenedor
  }

  // --- Validar permisos para eliminar ingrediente ---
  let eliminar = validarPermiso("Ingrediente.eliminar");

  // --- Crear tabla de ingredientes ---
  const table = document.createElement("table");
  table.classList.add("tablas"); // Clase CSS de la tabla

  // --- Encabezados de la tabla ---
  const headerRow = document.createElement("tr");
  const headers = ["Id", "Nombre del Ingrediente"];
  eliminar ? headers.push("Acciones") : ""; // Si puede eliminar, añadir columna acciones
  headers.forEach((text) => {
    const th = document.createElement("th"); // Crear encabezado
    th.textContent = text; // Texto del encabezado
    headerRow.appendChild(th); // Añadir al tr
  });
  table.appendChild(headerRow); // Añadir fila de encabezados a la tabla

  // --- Traer ingredientes desde la API ---
  const ingredientes = await api.get("ingredientes");

  // --- Renderizar cada ingrediente en la tabla ---
  ingredientes.forEach((ingrediente) => {
    const row = document.createElement("tr");

    // --- Columna Id ---
    const tdId = document.createElement("td");
    tdId.textContent = `#${ingrediente.id}`;
    row.appendChild(tdId);

    // --- Columna Nombre ---
    const tdNombre = document.createElement("td");
    tdNombre.textContent = ingrediente.nombre;
    row.appendChild(tdNombre);

    // --- Columna Acciones ---
    const tdAcciones = document.createElement("td");
    const divAcciones = document.createElement("div");
    divAcciones.classList.add("tablaAcciones");

    // Botón Eliminar
    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("boton");
    btnEliminar.id = "BotonEliminarIngrediente"; // Id para detectar clic
    btnEliminar.value = ingrediente.id; // Guardar id del ingrediente
    btnEliminar.textContent = "Eliminar";
    divAcciones.appendChild(btnEliminar);
    !eliminar ? btnEliminar.style.display = "none" : eliminar = true; 
    // Oculta el botón si no tiene permiso

    tdAcciones.appendChild(divAcciones);
    row.appendChild(tdAcciones);

    table.appendChild(row); // Añadir fila a la tabla
  });

  app.appendChild(table); // Añadir tabla completa al contenedor

  // --- Función para eliminar ingrediente ---
  const EliminarIngrediente = async (e) => {
    const id = e.target.value; // Id del ingrediente
    const pregunta = await alertaPregunta(`Desea Eliminar este Ingrediente?`);
    if (pregunta.isConfirmed) {
      const eliminado = await api.del(`ingredientes/${id}`); // Llamada DELETE
      if (eliminado.Ok) {
        await alertaOK(eliminado.Ok); // Mostrar alerta de éxito
        const fila = e.target.parentElement.parentElement.parentElement; // Obtener fila
        fila.remove(); // Eliminar fila de la tabla
      }
      if (eliminado.Error) {
        await alertaError(eliminado.Error); // Mostrar alerta de error
      }
    }
  };

  // --- Eventos globales de clic ---
  window.addEventListener("click", async (e) => {
    if (e.target.matches(".cambiarEstado")) cambiarEstado(e);
    else if (e.target.matches("#BotonEliminarIngrediente")) EliminarIngrediente(e);
    else if (e.target.matches("#BotonCrearIngrediente")) window.location.href = `#/Ingrediente/Crear`;
    // Redirigir a la página de creación
  });
};
