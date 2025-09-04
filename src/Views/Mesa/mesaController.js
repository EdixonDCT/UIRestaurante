import { alertaError, alertaOK, alertaPregunta } from "../../Helpers/alertas";
// Importa funciones para mostrar alertas de error, éxito o confirmación

import * as api from "../../Helpers/api";
// Importa funciones para llamadas a la API (GET, POST, PATCH, DELETE)

import validarPermiso from "../../Helpers/permisos";
// Importa función para validar permisos de usuario

export default async () => {
  const app = document.getElementById("app");
  // Selecciona el contenedor principal donde se renderizará todo

  const crear = validarPermiso("Mesa.crear");
  // Verifica si el usuario tiene permiso para crear mesas
  if (crear) {
    const boton = document.createElement("button");
    boton.classList.add("boton");
    boton.id = "BotonCrearMesa";
    boton.textContent = "Crear Mesa";
    app.appendChild(boton);
    // Si tiene permiso, crea un botón para crear nuevas mesas
  }

  const table = document.createElement("table");
  table.classList.add("tablas");
  // Crea la tabla para mostrar las mesas

  const headerRow = document.createElement("tr");
  const headers = ["Número", "Capacidad", "Disponible", "Acciones"];
  // Define los encabezados de la tabla
  headers.forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
    // Agrega cada encabezado a la fila de encabezado
  });
  table.appendChild(headerRow);

  const mesas = await api.get("mesas");
  // Obtiene la lista de mesas desde la API

  mesas.forEach((mesa) => {
    const row = document.createElement("tr");

    // --- Columna número ---
    const tdNumero = document.createElement("td");
    tdNumero.textContent = `#${mesa.numero}`;
    row.appendChild(tdNumero);

    // --- Columna capacidad ---
    const tdCapacidad = document.createElement("td");
    tdCapacidad.textContent = mesa.capacidad;
    row.appendChild(tdCapacidad);

    // --- Columna disponible ---
    const tdDisponible = document.createElement("td");
    tdDisponible.dataset.valorId = mesa.numero;
    tdDisponible.textContent = mesa.disponible === "1" ? "Si" : "Ocupado";
    row.appendChild(tdDisponible);

    // --- Columna acciones ---
    const tdAcciones = document.createElement("td");
    const divAcciones = document.createElement("div");
    divAcciones.classList.add("tablaAcciones");

    // Botón Editar
    let editar = validarPermiso("Mesa.editar");
    const btnEditar = document.createElement("button");
    btnEditar.classList.add("boton");
    btnEditar.id = "BotonEditarMesa";
    btnEditar.value = mesa.numero;
    btnEditar.textContent = "Editar";
    divAcciones.appendChild(btnEditar);
    !editar ? btnEditar.style.display = "none" : editar = true;
    // Si no tiene permiso de edición, oculta el botón

    // Botón Eliminar
    let eliminar = validarPermiso("Mesa.eliminar");
    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("boton");
    btnEliminar.id = "BotonEliminarMesa";
    btnEliminar.value = mesa.numero;
    btnEliminar.textContent = "Eliminar";
    divAcciones.appendChild(btnEliminar);
    !eliminar ? btnEliminar.style.display = "none" : eliminar = true;
    // Si no tiene permiso de eliminación, oculta el botón

    // Contenedor y checkbox para cambiar estado
    const divCheckbox = document.createElement("div");
    divCheckbox.classList.add("TablaCheckbox");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.classList.add("cambiarEstadoMesa");
    check.id = `cambiarEstado-${mesa.numero}`;
    check.dataset.id = mesa.numero;
    if (mesa.disponible === "1") check.checked = true;
    divCheckbox.appendChild(check);

    const lblCambiar = document.createElement("label");
    lblCambiar.setAttribute("for", `cambiarEstado-${mesa.numero}`);
    lblCambiar.textContent = "Cambiar estado";
    divCheckbox.appendChild(lblCambiar);

    const lblEstado = document.createElement("label");
    lblEstado.setAttribute("for", `cambiarEstado-${mesa.numero}`);
    lblEstado.setAttribute("boton-id", mesa.numero);
    lblEstado.textContent = mesa.disponible === "1" ? "Disponible" : "Ocupado";
    lblEstado.classList.add(mesa.disponible === "1" ? "checkboxTrue" : "checkboxFalse");
    divCheckbox.appendChild(lblEstado);

    divAcciones.appendChild(divCheckbox);
    tdAcciones.appendChild(divAcciones);
    row.appendChild(tdAcciones);

    table.appendChild(row);
  });

  app.appendChild(table);

  // Función para cambiar el estado de disponibilidad de la mesa
  const cambiarEstado = async (e) => {
    let id = e.target.dataset.id;
    let valor = e.target.checked ? "1" : "0";
    let checkbox = document.querySelector(`[data-valor-id="${id}"]`);
    let labelBoton = document.querySelector(`[boton-id="${id}"]`);
    const disponibles = { disponible: valor };
    const estado = await api.patch(`mesas/${id}`, disponibles);
    if (estado.Ok) {
      checkbox.textContent = e.target.checked ? "Si" : "Ocupado";
      labelBoton.classList = e.target.checked ? "checkboxTrue" : "checkboxFalse";
      labelBoton.textContent = e.target.checked ? "Disponible" : "Ocupado";
    }
  }

  // Función para eliminar una mesa
  const EliminarMesa = async (e) => {
    const id = e.target.value;
    const pregunta = await alertaPregunta(`Desea Eliminar esta Mesa #${id}?`);
    if (pregunta.isConfirmed) {
      const eliminado = await api.del(`mesas/${id}`);
      if (eliminado.Ok) {
        await alertaOK(eliminado.Ok);
        const fila = e.target.parentElement.parentElement.parentElement;
        fila.remove();
      }
      if (eliminado.Error) {
        await alertaError(eliminado.Error);
      }
    }
  }

  // Eventos globales para botones y checkbox
  window.addEventListener("click", async (e) => {
    if (e.target.matches(".cambiarEstadoMesa")) cambiarEstado(e);
    else if (e.target.matches("#BotonEliminarMesa")) EliminarMesa(e);
    else if (e.target.matches("#BotonEditarMesa")) window.location.href = `#/Mesa/Editar/id=${e.target.value}`;
    else if (e.target.matches("#BotonCrearMesa")) window.location.href = `#/Mesa/Crear`;
  });
};
