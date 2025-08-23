import { alertaOK, alertaError, alertaPregunta } from "../alertas";
import { cargarHeader } from "../header";

// Se obtiene el valor del hash de la URL (ej: id del usuario logueado)
const hash = window.location.hash.slice(1);

// Contenedor principal donde se pintará todo el contenido
const section = document.querySelector(".main");

// Formulario dinámico para crear nueva mesa
const nuevoForm = document.createElement("form");

// Variable para validar si el usuario es mesero
let esMesero = false;

const cargarTabla = async () => {
  // Configura el botón "Volver" para regresar al menú del usuario
  const botonVolver = document.getElementById("volver")
  botonVolver.action = `../menu.html#${hash}`;

  // Configura el formulario para redirigir a la creación de mesa
  nuevoForm.action = `mesaCrear.html#${hash}`;
  nuevoForm.method = "post"
  nuevoForm.innerHTML = `<button class="boton" type="submit">Añadir Nueva Mesa</button>`;
  nuevoForm.classList.add("botonTabla")
  section.appendChild(nuevoForm);

  // Se construye la tabla de mesas
  const table = document.createElement("table");
  table.classList.add("tablas")

  // Cabecera de la tabla
  const headerRow = document.createElement("tr");
  const headers = ["Número", "Capacidad", "Disponible", "Acciones"];
  headers.forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  try {
    // Petición al backend para obtener todas las mesas
    const res = await fetch("http://localhost:8080/ApiRestaurente/api/mesas");
    const data = await res.json();

    // Recorre las mesas recibidas y construye cada fila
    data.forEach((mesa) => {
      const row = document.createElement("tr");

      // Traduce el valor disponible (1 = disponible, 0 = ocupado)
      const disponible = mesa.disponible === "1" ? "Si" : "Ocupado";

      // Estructura HTML de cada fila
      row.innerHTML = `
        <td>#${mesa.numero}</td>
        <td>${mesa.capacidad}</td>
        <td data-valor-id=${mesa.numero}>${disponible}</td>
        <td>
          <div class="tablaAcciones">
            ${esMesero ? "" : `<form action="mesaEditar.html#${hash}/${mesa.numero}" method="post">
              <input type="hidden" name="numero" value="${mesa.numero}">
              <button class="boton" type="submit">Editar</button>
            </form>
            
            <button id="BotonEliminar" class="boton" value="${mesa.numero}" type="button">Eliminar</button>
            `}
            <div class="TablaCheckbox">
              <input type="checkbox" class="cambiarEstado" id="cambiarEstado-${mesa.numero}" data-id="${mesa.numero}" ${mesa.disponible === "1" ? "checked" : ""}>
              <label for="cambiarEstado-${mesa.numero}">Cambiar estado</label>
              <label ${mesa.disponible === "1" ? "class='checkboxTrue'" : "class='checkboxFalse'"} boton-id="${mesa.numero}" for="cambiarEstado-${mesa.numero}">${mesa.disponible === "1" ? "Disponible" : "Ocupado"}</label>
            </div>
          </div>
        </td>`;

      table.appendChild(row);
    });

    // Inserta la tabla en el contenedor
    section.appendChild(table);
  } catch (error) {
    // Manejo de error si la API falla
    section.innerHTML = "<p>Error al cargar las mesas.</p>";
    console.error("Error:", error);
  }
}

const cambiarEstado = async (e) => {
  // Obtiene el id de la mesa y el nuevo estado
  let id = e.target.dataset.id;
  let valor = e.target.checked ? "1" : "0";
  let checkbox = document.querySelector(`[data-valor-id="${id}"]`);
  let labelBoton = document.querySelector(`[boton-id="${id}"]`);
  try {
    // Envia PATCH para actualizar disponibilidad
    const disponibles = { disponible: valor };
    const respuesta = await fetch(`http://localhost:8080/ApiRestaurente/api/mesas/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(disponibles)
    });

    if (!respuesta.ok) throw new Error("Error al cambiar el estado");

    // Actualiza en el DOM según el nuevo estado
    const resultado = await respuesta.text();
    checkbox.textContent = e.target.checked ? "Si" : "Ocupado";
    labelBoton.classList = e.target.checked ? "checkboxTrue" : "checkboxFalse";
    labelBoton.textContent = e.target.checked ? "Disponible" : "Ocupado";
  } catch (error) {
    console.error("Falló el cambio de estado:", error);
  }
}

const EliminarMesa = async (e) => {
  // Obtiene id de la mesa seleccionada
  const id = e.target.value;

  // Pregunta confirmación antes de eliminar
  const pregunta = await alertaPregunta(`Desea Eliminar esta Mesa #${id}?`);
  if (pregunta.isConfirmed) {
    try {
      // Llama al backend para eliminar
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

      // Si fue exitoso muestra alerta y recarga la página
      await alertaOK(mensaje);
      location.reload();
    } catch (error) {
      // Error cuando la mesa tiene pedidos asociados
      alertaError("Error: no se puede eliminar Mesa porque esta asociada a un Pedido.");
    }
  }
}

const validarMesero = async () => {
  try {
    // Valida si el usuario logueado es mesero (oficio 3)
    const res = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${hash}`);
    const data = await res.json();
    data.idOficio == "3" ? esMesero = true : esMesero = false;

    // Si es mesero, oculta el botón de "nueva mesa"
    if (data.idOficio == "3") {
      nuevoForm.style.display = "none";
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Al cargar la página se arma todo
document.addEventListener("DOMContentLoaded", async () => {
  cargarHeader(hash);   // Carga el header dinámico
  await validarMesero() // Valida permisos de usuario
  cargarTabla();        // Carga las mesas en la tabla
});

// Se manejan los clicks globalmente (delegación de eventos)
window.addEventListener("click", async (e) => {
  if (e.target.matches(".cambiarEstado")) cambiarEstado(e);
  else if (e.target.matches("#BotonEliminar")) EliminarMesa(e);
});
