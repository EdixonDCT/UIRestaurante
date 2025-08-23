// Importamos funciones personalizadas de alertas y la función para cargar el header
import { alertaOK, alertaError, alertaPregunta } from "../alertas.js";
import { cargarHeader } from "../header.js";

// Obtenemos el hash de la URL, probablemente para identificar al usuario o sesión
const hash = window.location.hash.slice(1);

// Seleccionamos la sección principal donde se cargará la tabla
const section = document.querySelector(".main");

// Función que carga la tabla de ingredientes en la página
const cargarTabla = async () => {
  // Configuramos el botón "volver" para que regrese al menú principal con el hash
  const botonVolver = document.getElementById("volver");
  botonVolver.action = `../menu.html#${hash}`;

  // Creamos un formulario para agregar un nuevo ingrediente
  const nuevoForm = document.createElement("form");
  nuevoForm.classList.add("botonTabla");
  nuevoForm.action = `ingredienteCrear.html#${hash}`;
  nuevoForm.innerHTML = `<button class="boton" type="submit">Nuevo</button>`;
  section.appendChild(nuevoForm);

  // Creamos la tabla HTML y agregamos la clase "tablas" para estilo
  const table = document.createElement("table");
  table.classList.add("tablas");

  // Creamos la fila de encabezados
  const headerRow = document.createElement("tr");
  const headers = ["ID", "Nombre", "Acciones"]; // Columnas de la tabla
  headers.forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  try {
    // Fetch a la API para obtener la lista de ingredientes
    const res = await fetch("http://localhost:8080/ApiRestaurente/api/ingredientes");
    const data = await res.json(); // Convertimos la respuesta a JSON

    // Iteramos sobre cada ingrediente para crear las filas de la tabla
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

    // Finalmente, agregamos la tabla completa a la sección principal
    section.appendChild(table);
  } catch (error) {
    // Si ocurre un error al cargar los ingredientes, mostramos un mensaje y lo registramos en consola
    section.innerHTML = "<p>Error al cargar los ingredientes.</p>";
    console.error("Error:", error);
  }
};

// Función para eliminar un ingrediente
const eliminarIngrediente = async (e) => {
  const id = e.target.value; // Obtenemos el ID del ingrediente a eliminar

  // Mostramos una alerta de confirmación
  const confirmar = await alertaPregunta(`¿Desea eliminar el ingrediente #${id}?`);
  if (confirmar.isConfirmed) {
    try {
      // Petición DELETE al backend para eliminar el ingrediente
      const response = await fetch(`http://localhost:8080/ApiRestaurente/api/ingredientes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
      });

      const mensaje = await response.text();

      // Si la respuesta no es correcta, lanzamos un error
      if (!response.ok) throw new Error("Error: ingrediente ya pertenece a un platillo.");

      // Si se eliminó correctamente, mostramos alerta de éxito y recargamos la página
      await alertaOK(mensaje);
      location.reload();
    } catch (error) {
      // Mostramos alerta de error si falla la eliminación
      alertaError(error.message);
    }
  }
};

// Inicialización cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
  cargarHeader(hash); // Cargamos el header
  cargarTabla();      // Cargamos la tabla de ingredientes
});

// Escuchamos clicks en la ventana para detectar botones de eliminar
window.addEventListener("click", async (e) => {
  if (e.target.matches(".btnEliminar")) eliminarIngrediente(e);
});
