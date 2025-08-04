import { alertaOK, alertaError, alertaPregunta } from "./alertas";
import { cargarHeader } from "./header";

const hash = window.location.hash.slice(1);
const section = document.querySelector(".main");

const cargarTabla = async () => {
  const botonVolver = document.getElementById("volver")
  botonVolver.action = `menu.html#${hash}`;    

  const nuevoForm = document.createElement("form");
  nuevoForm.action = `mesaCrear#${hash}`;
  nuevoForm.innerHTML = `<button type="submit">Nuevo</button>`;
  section.appendChild(nuevoForm);
  const table = document.createElement("table");

  const headerRow = document.createElement("tr");
  const headers = ["Número", "Capacidad", "Disponible", "Acciones"];
  headers.forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  try {
    const res = await fetch("http://localhost:8080/ApiRestaurente/api/mesas");
    const data = await res.json();

    data.forEach((mesa) => {
      const row = document.createElement("tr");

      const disponible = mesa.disponible === "1" ? "Si" : "Ocupado";

      row.innerHTML = `
        <td>${mesa.numero}</td>
        <td>${mesa.capacidad}</td>
        <td data-valor-id=${mesa.numero}>${disponible}</td>
        <td>
          <form action="mesaEditar.html#${hash}/${mesa.numero}" method="post">
            <input type="hidden" name="numero" value="${mesa.numero}">
            <button type="submit">Editar</button>
          </form>
            <button id="BotonEliminar" value="${mesa.numero}" type="button">Eliminar</button>
            <input type="checkbox" id="cambiarEstado" data-id="${mesa.numero}" ${mesa.disponible === "1" ? "checked" : ""}>
            <label for="cambiarEstado">Cambiar estado</label>
        </td>`;
      table.appendChild(row);

    });

    section.appendChild(table);
  } catch (error) {
    section.innerHTML = "<p>Error al cargar las mesas.</p>";
    console.error("Error:", error);
  }
}

const cambiarEstado = async (e) => {
  let id = e.target.dataset.id;
  let valor = e.target.checked ? "1" : "0"
  let checkbox = document.querySelector(`[data-valor-id="${id}"]`);
  try {
    const disponibles = { disponible: valor };
    const respuesta = await fetch(`http://localhost:8080/ApiRestaurente/api/mesas/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(disponibles)
    });

    if (!respuesta.ok) throw new Error("Error al cambiar el estado");

    const resultado = await respuesta.text();
    checkbox.textContent = e.target.checked ? "Si" : "Ocupado"

  } catch (error) {
    console.error("Falló el cambio de estado:", error);
  }
}

const EliminarMesa = async (e) => {
  const id = e.target.value
  const pregunta = await alertaPregunta(`Desea Eliminar esta Mesa #${id}?`);
  if (pregunta.isConfirmed) {
    try {
      const response = await fetch(`http://localhost:8080/ApiRestaurente/api/mesas/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const mensaje = await response.text();
      if (!response.ok) {
        throw new Error(mensaje);
      }
      await alertaOK(mensaje);
      location.reload();
    } catch (error) {
      alertaError(error.message);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarHeader(hash)
  cargarTabla();
});
window.addEventListener("click", async (e) => {
  if (e.target.matches("#cambiarEstado")) cambiarEstado(e)
  else if (e.target.matches("#BotonEliminar")) EliminarMesa(e)
});
