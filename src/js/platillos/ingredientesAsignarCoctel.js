import { alertaError, alertaOK } from "../alertas.js";
import { cargarHeader } from "../header.js";

// Obtiene el fragmento (hash) de la URL actual, quitando el #
const hasher = window.location.hash.slice(1);

// Separa el hash en dos partes: la primera es el hash del trabajador, la segunda el id del platillo/coctel
const lista = hasher.split("/");
const hash = lista[0];
const idPlatillo = lista[1];

// Obtiene el formulario de "volver" y le asigna la ruta para regresar a la tabla de platillos
const volver = document.getElementById("volver")
volver.action = `platillosTablas.html#${hash}`;

// Selecciona la sección principal donde se mostrarán los ingredientes
const section = document.querySelector(".main");

// Función que carga todos los ingredientes y los que ya están asociados al coctel
const cargarIngredientes = async () => {
  try {
    // Trae todos los ingredientes existentes desde la API
    const resIngredientes = await fetch("http://localhost:8080/ApiRestaurente/api/ingredientes");
    const ingredientes = await resIngredientes.json();

    // Trae los ingredientes que ya tiene asociado el coctel específico
    const resPlatillo = await fetch(`http://localhost:8080/ApiRestaurente/api/ingredientesCoctel/coctel/${idPlatillo}`);
    const ingredientesPlatillo = await resPlatillo.json();

    // Si no hay ingredientes disponibles, muestra un mensaje
    if (!ingredientes || ingredientes.length === 0) {
      section.innerHTML = "<p>No hay ingredientes disponibles.</p>";
      return;
    }

    // Obtiene los ids de ingredientes ya seleccionados para el coctel
    const idsSeleccionados = ingredientesPlatillo.map(i => (i.idIngrediente));
    
    // Crea un formulario dinámicamente
    const form = document.createElement("form");
    form.classList.add("form");
    form.innerHTML = `<h3>Selecciona los ingredientes para el platillo:</h3>`;

    // Recorre todos los ingredientes y crea un checkbox por cada uno
    ingredientes.forEach(ingrediente => {
      const div = document.createElement("div");
      div.classList.add("input");

      // Verifica si este ingrediente ya estaba asociado
      const estaSeleccionado = idsSeleccionados.includes(ingrediente.id);

      // Crea el input checkbox con el nombre del ingrediente
      div.innerHTML = `
        <label>
          <input type="checkbox" value="${ingrediente.id}" ${estaSeleccionado ? "checked" : ""}>
          ${ingrediente.nombre}
        </label>
      `;
      form.appendChild(div);
    });

    // Botón para guardar cambios
    const btnGuardar = document.createElement("button");
    btnGuardar.classList.add("boton");
    btnGuardar.type = "submit";
    btnGuardar.textContent = "Guardar Cambios";
    form.appendChild(btnGuardar);

    // Inserta el formulario en la sección
    section.appendChild(form);

    // Agrega el listener para manejar el guardado
    form.addEventListener("submit", guardarIngredientes);

  } catch (error) {
    // En caso de error al traer datos, se muestra mensaje
    section.innerHTML = "<p>Error al cargar los ingredientes.</p>";
    console.error("Error:", error);
  }
};

// Función para guardar los ingredientes seleccionados
const guardarIngredientes = async (e) => {
  e.preventDefault();

  // 1. Obtiene todos los checkboxes seleccionados (ingredientes marcados)
  const seleccionados = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
      .map(cb => cb.value);

  try {
      // 2. Verifica si ya existen ingredientes asociados al coctel
      const resExistentes = await fetch(`http://localhost:8080/ApiRestaurente/api/ingredientesCoctel/coctel/${idPlatillo}`);
      const existentes = await resExistentes.json();

      // 3. Si existen ingredientes, primero los elimina (para volver a registrar los nuevos)
      if (existentes.length > 0) {
          const resDelete = await fetch(`http://localhost:8080/ApiRestaurente/api/ingredientesCoctel/${idPlatillo}`, {
              method: "DELETE"
          });
          if (!resDelete.ok) {
              throw new Error(await resDelete.text());
          }
      }

      // 4. Recorre todos los seleccionados y los envía a la API
      for (const idIngrediente of seleccionados) {
          const datos = {
              idCoctel: idPlatillo,
              idIngrediente: idIngrediente
          };

          // Hace un POST por cada ingrediente seleccionado
          const resPost = await fetch("http://localhost:8080/ApiRestaurente/api/ingredientesCoctel", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(datos)
          });
          let mensaje = await resPost.text()
          console.log(mensaje);

          if (!resPost.ok) {
              throw new Error(await resPost.text());
          }
      }

      // Mensaje de éxito y redirección
      await alertaOK(`Ingredientes del Coctel actualizados con éxito.`);
      window.location.href = `platillosTablas.html#${hash}`;

  } catch (error) {
      // Si ocurre un error en cualquier parte del proceso
      alertaError(error.message);
  }
};

// Cuando el documento esté listo, carga el header y los ingredientes
document.addEventListener("DOMContentLoaded", () => {
  cargarHeader(hash);
  cargarIngredientes();
});
