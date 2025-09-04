import { alertaError, alertaOK, alertaPregunta } from "../../Helpers/alertas";
import * as api from "../../Helpers/api";
import validarPermiso from "../../Helpers/permisos";

export default async () => {
  const app = document.getElementById("app");

  const crear = validarPermiso("Ingrediente.crear")
  if (crear) {
    const boton = document.createElement("button");
    boton.classList.add("boton");
    boton.id = "BotonCrearIngrediente";
    boton.textContent = "Crear Ingrediente";
    app.appendChild(boton);
  }
  let eliminar = validarPermiso("Ingrediente.eliminar");

  const table = document.createElement("table");
  table.classList.add("tablas");
  const headerRow = document.createElement("tr");
  const headers = ["Id", "Nombre del Ingrediente"];
  eliminar ? headers.push("Acciones") : "";
  headers.forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);
  const ingredientes = await api.get("ingredientes");
  ingredientes.forEach((ingrediente) => {
    const row = document.createElement("tr");

    // --- Columna id ---
    const tdId = document.createElement("td");
    tdId.textContent = `#${ingrediente.id}`;
    row.appendChild(tdId);

    // --- Columna capacidad ---
    const tdNombre = document.createElement("td");
    tdNombre.textContent = ingrediente.nombre;
    row.appendChild(tdNombre);

    // --- Columna acciones ---
    const tdAcciones = document.createElement("td");
    const divAcciones = document.createElement("div");
    divAcciones.classList.add("tablaAcciones");

    // Botón Eliminar
    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("boton");
    btnEliminar.id = "BotonEliminarIngrediente";
    btnEliminar.value = ingrediente.id;
    btnEliminar.textContent = "Eliminar";
    divAcciones.appendChild(btnEliminar);
    !eliminar ? btnEliminar.style.display = "none" : eliminar = true;

    tdAcciones.appendChild(divAcciones);
    row.appendChild(tdAcciones);

    table.appendChild(row);
  });
  app.appendChild(table);

  const EliminarIngrediente = async (e) => {
    const id = e.target.value;
    const pregunta = await alertaPregunta(`Desea Eliminar este Ingrediente?`);
    if (pregunta.isConfirmed) {
      const eliminado = await api.del(`ingredientes/${id}`);
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
    if (e.target.matches(".cambiarEstado")) cambiarEstado(e);
    else if (e.target.matches("#BotonEliminarIngrediente")) EliminarIngrediente(e);
    else if (e.target.matches("#BotonCrearIngrediente")) window.location.href = `#/Ingrediente/Crear`;
  });
};
