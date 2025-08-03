import { alertaOK, alertaError, alertaPregunta } from "./alertas.js";

const hash = window.location.hash.slice(1);
const section = document.querySelector(".main");

const cargarTabla = async () => {
  const botonVolver = document.getElementById("volver");
  botonVolver.action = `menu.html#${hash}`;

  const nuevoForm = document.createElement("form");
  nuevoForm.action = `trabajadorCrear.html#${hash}`;
  nuevoForm.innerHTML = `<button type="submit">Nuevo</button>`;
  section.appendChild(nuevoForm);

  const table = document.createElement("table");
  const headerRow = document.createElement("tr");
  const headers = ["Cédula", "Nombre", "Apellido", "Nacimiento", "Oficio", "Foto", "Acciones"];
  headers.forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  try {
    const res = await fetch("http://localhost:8080/ApiRestaurente/api/trabajadores");
    const data = await res.json();

    data.forEach(trabajador => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${trabajador.cedula}</td>
        <td>${trabajador.nombre}</td>
        <td>${trabajador.apellido}</td>
        <td>${trabajador.nacimiento}</td>
        <td>${trabajador.nombreOficio}</td>
        <td><img src="http://localhost:8080/ApiRestaurente/IMAGENES/${trabajador.foto}" alt="Foto" width="50" height="50"></td>
        <td>
          <form action="trabajadorEditar.html#${hash}/${trabajador.cedula}" method="post">
            <button type="submit">Editar Trabajador</button>
          </form>
          <form action="trabajadorEditarImagen.html#${hash}/${trabajador.cedula}" method="post">
            <button type="submit">Editar Foto</button>
          </form>
          <button id="BotonEliminar" value="${trabajador.cedula}" type="button">Eliminar</button>
        </td>`;
      table.appendChild(row);
    });

    section.appendChild(table);
  } catch (error) {
    section.innerHTML = "<p>Error al cargar los trabajadores.</p>";
    console.error("Error:", error);
  }
};

const EliminarTrabajador = async (e) => {
  const id = e.target.value;
  const pregunta = await alertaPregunta(`¿Desea eliminar al trabajador con cédula ${id}?`);
  if (pregunta.isConfirmed) {
    try {
      const response = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const mensaje = await response.text();
      if (!response.ok) throw new Error(mensaje);
      await alertaOK("Trabajador: " + mensaje);
      location.reload();
    } catch (error) {
      alertaError(error.message);
    }
  }
};

document.addEventListener("DOMContentLoaded", cargarTabla);
window.addEventListener("click", async (e) => {
  if (e.target.matches("#BotonEliminar")) EliminarTrabajador(e);
});
