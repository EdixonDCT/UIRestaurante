import { alertaError, alertaOK } from "../alertas.js";
import { cargarHeader } from "../header.js";

const hasher = window.location.hash.slice(1);
const lista = hasher.split("/");
const hash = lista[0];
const idPlatillo = lista[1];

const volver = document.getElementById("volver")
volver.action = `platillosTablas.html#${hash}`;


const section = document.querySelector(".main");

const cargarIngredientes = async () => {
  try {

    const resIngredientes = await fetch("http://localhost:8080/ApiRestaurente/api/ingredientes");
    const ingredientes = await resIngredientes.json();

    const resPlatillo = await fetch(`http://localhost:8080/ApiRestaurente/api/ingredientesComida/comida/${idPlatillo}`);
    const ingredientesPlatillo = await resPlatillo.json();

    if (!ingredientes || ingredientes.length === 0) {
      section.innerHTML = "<p>No hay ingredientes disponibles.</p>";
      return;
    }
    const idsSeleccionados = ingredientesPlatillo.map(i => (i.idIngrediente));
    
    const form = document.createElement("form");
    form.classList.add("form");
    form.innerHTML = `<h3>Selecciona los ingredientes para el platillo:</h3>`;

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

    section.appendChild(form);

    form.addEventListener("submit", guardarIngredientes);

  } catch (error) {
    section.innerHTML = "<p>Error al cargar los ingredientes.</p>";
    console.error("Error:", error);
  }
};


const guardarIngredientes = async (e) => {
  e.preventDefault();

    // 1. Obtener ingredientes seleccionados
    const seleccionados = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value);

    try {
        // 2. Verificar si ya hay ingredientes asociados
        const resExistentes = await fetch(`http://localhost:8080/ApiRestaurente/api/ingredientesComida/comida/${idPlatillo}`);
        const existentes = await resExistentes.json();

        if (existentes.length > 0) {
            // 3. Eliminar ingredientes existentes
            const resDelete = await fetch(`http://localhost:8080/ApiRestaurente/api/ingredientesComida/${idPlatillo}`, {
                method: "DELETE"
            });
            if (!resDelete.ok) {
                throw new Error(await resDelete.text());
            }
        }

        // 4. Agregar ingredientes seleccionados
        for (const idIngrediente of seleccionados) {
            const datos = {
                idComida: idPlatillo,
                idIngrediente: idIngrediente
            };

            const resPost = await fetch("http://localhost:8080/ApiRestaurente/api/ingredientesComida", {
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
        await alertaOK(`Ingredientes de la Comida actualizados con éxito.`);
        window.location.href = `platillosTablas.html#${hash}`;

    } catch (error) {
        alertaError(error.message);
    }
};

document.addEventListener("DOMContentLoaded", () => {
  cargarHeader(hash);
  cargarIngredientes();
});
