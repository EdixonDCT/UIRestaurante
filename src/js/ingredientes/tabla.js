import { alertaOK, alertaError, alertaPregunta } from "../alertas.js";
import { cargarHeader } from "../header.js";

const hash = window.location.hash.slice(1);
const section = document.querySelector(".main");

const cargarTabla = async () => {
  const botonVolver = document.getElementById("volver");
  botonVolver.action = `../menu.html#${hash}`;

  const nuevoForm = document.createElement("form");
  nuevoForm.classList.add("botonTabla")
  nuevoForm.action = `ingredienteCrear.html#${hash}`;
  nuevoForm.innerHTML = `<button class="boton" type="submit">Nuevo</button>`;
  section.appendChild(nuevoForm);

  const table = document.createElement("table");
  table.classList.add("tablas");
  const headerRow = document.createElement("tr");
  const headers = ["ID", "Nombre", "Acciones"];
  headers.forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  try {
    const res = await fetch("http://localhost:8080/ApiRestaurente/api/ingredientes");
    const data = await res.json();
    
    data.forEach(ingrediente => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${ingrediente.id}</td>
        <td>${ingrediente.nombre}</td>
        <td>
        <div class="tablaAcciones">
          <button class="boton btnEliminar" value="${ingrediente.id}" type="button">Eliminar</button>
        </div>
        </td>
      `;
      table.appendChild(row);
    });

    section.appendChild(table);
  } catch (error) {
    section.innerHTML = "<p>Error al cargar los ingredientes.</p>";
    console.error("Error:", error);
  }
};

const eliminarIngrediente = async (e) => {
  const id = e.target.value;
  const confirmar = await alertaPregunta(`¿Desea eliminar el ingrediente #${id}?`);
  if (confirmar.isConfirmed) {
    try {
      const response = await fetch(`http://localhost:8080/ApiRestaurente/api/ingredientes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const mensaje = await response.text();
      if (!response.ok) throw new Error("Error: ingrediente ya pertenece a un platillo.");
      await alertaOK(mensaje);
      location.reload();
    } catch (error) {
      alertaError(error.message);
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  cargarHeader(hash);
  cargarTabla();
});
window.addEventListener("click", async (e) => {
  if (e.target.matches(".btnEliminar")) eliminarIngrediente(e);
});
