import { alertaError, alertaOK, alertaTiempo } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export default async () => {
  const app = document.getElementById("app");

  const hash = location.hash.slice(1);
  const [url, id] = hash.split("=");


  const cargarIngredientes = async () => {
    const ingredientes = await api.get("ingredientes");
    const ingredientesPlatillo = await api.get(`ingredientesCoctel/coctel/${id}`)
    const idsSeleccionados = ingredientesPlatillo.map(i => (i.idIngrediente));

    const form = document.createElement("form");
    form.classList.add("form");

    ingredientes.forEach(ingrediente => {
      const div = document.createElement("div");
      div.classList.add("input");

      const estaSeleccionado = idsSeleccionados.includes(ingrediente.id);

      div.innerHTML = `
        <label>
          <input type="checkbox" value="${ingrediente.id}" ${estaSeleccionado ? "checked" : ""}>
          ${ingrediente.nombre}
        </label>
      `;
      form.appendChild(div);
    });

    const btnGuardar = document.createElement("button");
    btnGuardar.classList.add("boton");
    btnGuardar.type = "submit";
    btnGuardar.textContent = "Guardar Cambios";
    form.appendChild(btnGuardar);

    app.appendChild(form);

    form.addEventListener("submit", guardarIngredientes);
  };


  const guardarIngredientes = async (e) => {
    e.preventDefault();
    const seleccionados = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
      .map(cb => cb.value);

    const existentes = await api.get(`ingredientesCoctel/coctel/${id}`);
    if (existentes.length > 0) {
      await api.del(`ingredientesCoctel/${id}`);
    }
    for (const idIngrediente of seleccionados) {
      const datos = {
        idCoctel: id,
        idIngrediente: idIngrediente
      };
      await api.post(`ingredientesCoctel`, datos);
    }
    await alertaOK(`Ingredientes del Coctel actualizados con éxito.`);
    window.location.href = '#/Platillo';
  }
  cargarIngredientes();
}
