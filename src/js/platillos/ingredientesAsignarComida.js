import { alertaError, alertaOK } from "../alertas.js"; // Importa funciones de alertas personalizadas
import { cargarHeader } from "../header.js"; // Importa función para cargar el header

const hasher = window.location.hash.slice(1); // Obtiene el hash de la URL sin el #
const lista = hasher.split("/"); // Separa el hash por "/"
const hash = lista[0]; // Primer valor del hash
const idPlatillo = lista[1]; // Segundo valor del hash (id del platillo)

const volver = document.getElementById("volver") // Obtiene el elemento con id "volver"
volver.action = `platillosTablas.html#${hash}`; // Cambia su action al listado de platillos con el hash


const section = document.querySelector(".main"); // Selecciona el contenedor principal

const cargarIngredientes = async () => { // Función para cargar ingredientes
  try {

    const resIngredientes = await fetch("http://localhost:8080/ApiRestaurente/api/ingredientes"); // Pide lista de ingredientes
    const ingredientes = await resIngredientes.json(); // Convierte respuesta a JSON

    const resPlatillo = await fetch(`http://localhost:8080/ApiRestaurente/api/ingredientesComida/comida/${idPlatillo}`); // Pide ingredientes del platillo
    const ingredientesPlatillo = await resPlatillo.json(); // Convierte respuesta a JSON

    if (!ingredientes || ingredientes.length === 0) { // Si no hay ingredientes
      section.innerHTML = "<p>No hay ingredientes disponibles.</p>"; // Muestra mensaje
      return; // Sale de la función
    }
    const idsSeleccionados = ingredientesPlatillo.map(i => (i.idIngrediente)); // Obtiene IDs de los ingredientes ya asociados
    
    const form = document.createElement("form"); // Crea formulario
    form.classList.add("form"); // Le asigna clase
    form.innerHTML = `<h3>Selecciona los ingredientes para el platillo:</h3>`; // Título del formulario

    ingredientes.forEach(ingrediente => { // Recorre cada ingrediente
      const div = document.createElement("div"); // Crea div
      div.classList.add("input"); // Le asigna clase

      const estaSeleccionado = idsSeleccionados.includes(ingrediente.id); // Verifica si el ingrediente ya estaba seleccionado

      div.innerHTML = ` 
        <label>
          <input type="checkbox" value="${ingrediente.id}" ${estaSeleccionado ? "checked" : ""}> 
          ${ingrediente.nombre} 
        </label>
      `; // Crea checkbox con el nombre y marca si ya estaba seleccionado
      form.appendChild(div); // Agrega div al formulario
    });

    const btnGuardar = document.createElement("button"); // Crea botón de guardar
    btnGuardar.classList.add("boton"); // Le asigna clase
    btnGuardar.type = "submit"; // Define como botón submit
    btnGuardar.textContent = "Guardar Cambios"; // Texto del botón
    form.appendChild(btnGuardar); // Agrega botón al formulario

    section.appendChild(form); // Inserta el formulario en la sección

    form.addEventListener("submit", guardarIngredientes); // Asigna evento submit para guardar

  } catch (error) { 
    section.innerHTML = "<p>Error al cargar los ingredientes.</p>"; // Muestra mensaje de error
    console.error("Error:", error); // Imprime error en consola
  }
};


const guardarIngredientes = async (e) => { // Función para guardar ingredientes
  e.preventDefault(); // Evita recargar página

    // 1. Obtener ingredientes seleccionados
    const seleccionados = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')) 
        .map(cb => cb.value); // Obtiene todos los checkboxes marcados

    try {
        // 2. Verificar si ya hay ingredientes asociados
        const resExistentes = await fetch(`http://localhost:8080/ApiRestaurente/api/ingredientesComida/comida/${idPlatillo}`); // Consulta ingredientes ya guardados
        const existentes = await resExistentes.json(); // Convierte a JSON

        if (existentes.length > 0) { // Si existen ingredientes
            // 3. Eliminar ingredientes existentes
            const resDelete = await fetch(`http://localhost:8080/ApiRestaurente/api/ingredientesComida/${idPlatillo}`, { 
                method: "DELETE" // Hace DELETE para eliminarlos
            });
            if (!resDelete.ok) { // Si falla
                throw new Error(await resDelete.text()); // Lanza error
            }
        }

        // 4. Agregar ingredientes seleccionados
        for (const idIngrediente of seleccionados) { // Recorre los seleccionados
            const datos = {
                idComida: idPlatillo, // Id de la comida
                idIngrediente: idIngrediente // Id del ingrediente
            };

            const resPost = await fetch("http://localhost:8080/ApiRestaurente/api/ingredientesComida", { 
                method: "POST", // Método POST
                headers: { "Content-Type": "application/json" }, // Cabecera JSON
                body: JSON.stringify(datos) // Convierte datos a JSON
            });
            let mensaje = await resPost.text() // Obtiene respuesta como texto
            console.log(mensaje); // Muestra en consola
            
            if (!resPost.ok) { // Si falla
                throw new Error(await resPost.text()); // Lanza error
            }
        }
        await alertaOK(`Ingredientes de la Comida actualizados con éxito.`); // Alerta de éxito
        window.location.href = `platillosTablas.html#${hash}`; // Redirige a la página de platillos

    } catch (error) {
        alertaError(error.message); // Muestra alerta de error
    }
};

document.addEventListener("DOMContentLoaded", () => { // Cuando cargue el DOM
  cargarHeader(hash); // Carga el header
  cargarIngredientes(); // Carga los ingredientes
});
