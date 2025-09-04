// Importa funciones para mostrar alertas, y módulos de API y validación
import { alertaError, alertaOK, alertaTiempo } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";

// Exporta la función principal del controlador de asignación de ingredientes para un coctel
export default async () => {
  // Obtiene el contenedor principal donde se va a renderizar el formulario
  const app = document.getElementById("app");

  // Obtiene el id del coctel desde el hash de la URL
  const hash = location.hash.slice(1);
  const [url, id] = hash.split("=");

  // Función para cargar los ingredientes y marcar los que ya están asignados al coctel
  const cargarIngredientes = async () => {
    // Obtiene todos los ingredientes disponibles
    const ingredientes = await api.get("ingredientes");
    // Obtiene los ingredientes asignados al coctel actual
    const ingredientesPlatillo = await api.get(`ingredientesCoctel/coctel/${id}`);
    // Extrae solo los IDs de los ingredientes asignados
    const idsSeleccionados = ingredientesPlatillo.map(i => (i.idIngrediente));

    // Crea el formulario donde se mostrarán los checkboxes
    const form = document.createElement("form");
    form.classList.add("form");

    // Recorre todos los ingredientes para crear un checkbox por cada uno
    ingredientes.forEach(ingrediente => {
      const div = document.createElement("div");
      div.classList.add("input");

      // Verifica si el ingrediente ya estaba asignado al coctel
      const estaSeleccionado = idsSeleccionados.includes(ingrediente.id);

      // Inserta un checkbox y etiqueta con el nombre del ingrediente
      div.innerHTML = `
        <label>
          <input type="checkbox" value="${ingrediente.id}" ${estaSeleccionado ? "checked" : ""}>
          ${ingrediente.nombre}
        </label>
      `;
      form.appendChild(div);
    });

    // Botón para guardar los cambios
    const btnGuardar = document.createElement("button");
    btnGuardar.classList.add("boton");
    btnGuardar.type = "submit";
    btnGuardar.textContent = "Guardar Cambios";
    form.appendChild(btnGuardar);

    // Agrega el formulario al contenedor principal
    app.appendChild(form);

    // Agrega el listener para guardar los ingredientes cuando se envíe el formulario
    form.addEventListener("submit", guardarIngredientes);
  };

  // Función para guardar los ingredientes seleccionados
  const guardarIngredientes = async (e) => {
    e.preventDefault();

    // Obtiene los IDs de los checkboxes seleccionados
    const seleccionados = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
      .map(cb => cb.value);

    // Consulta los ingredientes actuales del coctel
    const existentes = await api.get(`ingredientesCoctel/coctel/${id}`);
    if (existentes.length > 0) {
      // Borra todos los ingredientes actuales para reemplazarlos
      await api.del(`ingredientesCoctel/${id}`);
    }

    // Recorre los seleccionados y los agrega al coctel uno por uno
    for (const idIngrediente of seleccionados) {
      const datos = {
        idCoctel: id,
        idIngrediente: idIngrediente
      };
      await api.post(`ingredientesCoctel`, datos);
    }

    // Alerta de éxito y redirección a la página de platillos
    await alertaOK(`Ingredientes del Coctel actualizados con éxito.`);
    window.location.href = '#/Platillo';
  }

  // Llama a la función para cargar los ingredientes al iniciar
  cargarIngredientes();
}
