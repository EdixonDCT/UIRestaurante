import { alertaError, alertaOK, alertaPregunta } from "../../Helpers/alertas";
import * as api from "../../Helpers/api";
import validarPermiso from "../../Helpers/permisos";

export default async () => {
  const app = document.getElementById("app");

  const crear = validarPermiso("Mesa.crear")
  if (crear) {
    const boton = document.createElement("button");
    boton.classList.add("boton");
    boton.id = "BotonCrearMesa";
    boton.textContent = "Crear Mesa";
    app.appendChild(boton);
  }

  const table = document.createElement("table");
  table.classList.add("tablas");
  const headerRow = document.createElement("tr");
  const headers = ["Número", "Capacidad", "Disponible", "Acciones"];
  headers.forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);
  const mesas = await api.get("mesas");
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

    // Botón Eliminar
    let eliminar = validarPermiso("Mesa.eliminar");
    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("boton");
    btnEliminar.id = "BotonEliminarMesa";
    btnEliminar.value = mesa.numero;
    btnEliminar.textContent = "Eliminar";
    divAcciones.appendChild(btnEliminar);
    !eliminar ? btnEliminar.style.display = "none" : eliminar = true;

    // Contenedor checkbox
    const divCheckbox = document.createElement("div");
    divCheckbox.classList.add("TablaCheckbox");

    // Checkbox
    const check = document.createElement("input");
    check.type = "checkbox";
    check.classList.add("cambiarEstadoMesa");
    check.id = `cambiarEstado-${mesa.numero}`;
    check.dataset.id = mesa.numero;
    if (mesa.disponible === "1") check.checked = true;
    divCheckbox.appendChild(check);

    // Label cambiar estado
    const lblCambiar = document.createElement("label");
    lblCambiar.setAttribute("for", `cambiarEstado-${mesa.numero}`);
    lblCambiar.textContent = "Cambiar estado";
    divCheckbox.appendChild(lblCambiar);

    // Label estado actual
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

  const EliminarMesa = async (e) => {
    const id = e.target.value;
    const pregunta = await alertaPregunta(`Desea Eliminar esta Mesa #${id}?`);
    if (pregunta.isConfirmed) {
      const eliminado = await api.del(`mesas/${id}`);
      if (eliminado.Ok)
      {
        await alertaOK(eliminado.Ok)
        const fila = e.target.parentElement.parentElement.parentElement
        fila.remove()
      }
        if (eliminado.Error) {
        await alertaError(eliminado.Error);
      }
    }
  }

  window.addEventListener("click", async (e) => {
    if (e.target.matches(".cambiarEstadoMesa")) cambiarEstado(e);
    else if (e.target.matches("#BotonEliminarMesa")) EliminarMesa(e);
    else if (e.target.matches("#BotonEditarMesa")) window.location.href = `#/Mesa/Editar/id=${e.target.value}`;
    else if (e.target.matches("#BotonCrearMesa")) window.location.href = `#/Mesa/Crear`;
  });
};
