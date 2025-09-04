// Importa funciones de alerta y módulos de API/validación
import { alertaError, alertaOK, alertaTiempo } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";

// Exporta la función principal del controlador para asignar ingredientes a una comida
export default async () => {
  // Contenedor principal donde se agregará el formulario
  const app = document.getElementById("app");

  // Obtiene el ID de la comida desde el hash de la URL
  const hash = location.hash.slice(1);
  const [url, id] = hash.split("=");

  // Función que carga los ingredientes disponibles y marca los que ya están asignados
  const cargarIngredientes = async () => {
    // Obtiene todos los ingredientes
    const ingredientes = await api.get("ingredientes");
    // Obtiene los ingredientes que ya tiene la comida
    const ingredientesPlatillo = await api.get(`ingredientesComida/comida/${id}`);
    // Extrae los IDs de los ingredientes ya seleccionados
    const idsSeleccionados = ingredientesPlatillo.map(i => (i.idIngrediente));

    // Crea el formulario
    const form = document.createElement("form");
    form.classList.add("form");

    // Recorre los ingredientes para crear un checkbox por cada uno
    ingredientes.forEach(ingrediente => {
      const div = document.createElement("div");
      div.classList.add("input");

      // Verifica si ya estaba seleccionado
      const estaSeleccionado = idsSeleccionados.includes(ingrediente.id);

      // Inserta checkbox y etiqueta con nombre del ingrediente
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

    // Añade el formulario al contenedor principal
    app.appendChild(form);

    // Asigna el evento de submit para guardar los ingredientes
    form.addEventListener("submit", guardarIngredientes);
  };

  // Función que guarda los ingredientes seleccionados
  const guardarIngredientes = async (e) => {
    e.preventDefault();

    // Obtiene los IDs de los checkboxes seleccionados
    const seleccionados = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
      .map(cb => cb.value);

    // Consulta los ingredientes actuales de la comida
    const existentes = await api.get(`ingredientesComida/comida/${id}`);
    if (existentes.length > 0) {
      // Elimina los ingredientes actuales antes de actualizar
      await api.del(`ingredientesComida/${id}`);
    }

    // Inserta los nuevos ingredientes seleccionados
    for (const idIngrediente of seleccionados) {
      const datos = {
        idComida: id,
        idIngrediente: idIngrediente
      };
      await api.post(`ingredientesComida`, datos);
    }

    // Alerta de éxito y redirección a la lista de platillos
    await alertaOK(`Ingredientes de la Comida actualizados con éxito.`);
    window.location.href = '#/Platillo';
  }

  // Llama a la función para cargar ingredientes al iniciar
  cargarIngredientes();
}
