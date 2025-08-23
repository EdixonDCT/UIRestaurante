// Importamos funciones auxiliares
import { alertaOK, alertaError } from "../alertas.js"; // para mostrar alertas
import { cargarHeader } from "../header.js"; // para cargar el header dinámico

// Obtenemos el hash de la URL (ej: #idUsuario)
const hash = window.location.hash.slice(1);

// Seleccionamos elementos principales del DOM
const main = document.querySelector(".main");
const volver = document.getElementById("volver");

// Configuramos el botón de volver al menú principal
volver.action = `../menu.html#${hash}`

// Cuando se carga la página
document.addEventListener("DOMContentLoaded", async () => {
  // Cargamos el header con el id del usuario
  cargarHeader(hash);

  // Creamos botones (formularios) para crear comida, bebida y cóctel
  const nuevoComida = document.createElement("form");
  nuevoComida.action = `comidaCrear.html#${hash}`;
  nuevoComida.innerHTML = `<button class="boton" type="submit">Crear Comida</button>`;
  nuevoComida.method = "post";
  nuevoComida.classList.add("botonTabla");

  const nuevoBebida = document.createElement("form");
  nuevoBebida.action = `bebidaCrear.html#${hash}`;
  nuevoBebida.innerHTML = `<button class="boton" type="submit">Crear Bebida</button>`;
  nuevoBebida.method = "post";
  nuevoBebida.classList.add("botonTabla");

  const nuevoCoctel = document.createElement("form");
  nuevoCoctel.action = `coctelCrear.html#${hash}`;
  nuevoCoctel.innerHTML = `<button class="boton" type="submit">Crear Coctel</button>`;
  nuevoCoctel.method = "post";
  nuevoCoctel.classList.add("botonTabla");

  // Agregamos los botones al main
  main.append(nuevoComida, nuevoBebida, nuevoCoctel);

  // Cargamos las tablas de comidas, bebidas y cócteles
  await cargarPlatillos("comidas");
  await cargarPlatillos("bebidas");
  await cargarPlatillos("cocteles");
});


// Función para cargar una tabla según el tipo (comidas, bebidas o cocteles)
const cargarPlatillos = async (tipo) => {
  const tabla = document.createElement("table");
  tabla.classList.add("tablas");

  // Cabecera de la tabla
  const encabezado = document.createElement("tr");
  const columnas = ["ID", "Imagen", "Nombre", "Precio"];
  if (tipo === "comidas") columnas.push("Tipo");
  if (tipo === "bebidas") columnas.push("Tipo", "Unidad");
  columnas.push("Disponible", "Acciones");

  // Generamos los <th>
  columnas.forEach(col => {
    const th = document.createElement("th");
    th.textContent = col;
    encabezado.appendChild(th);
  });
  tabla.appendChild(encabezado);

  try {
    // Llamada a la API para obtener los datos
    const res = await fetch(`http://localhost:8080/ApiRestaurente/api/${tipo}`);
    if (!res.ok) throw new Error(`Error al cargar ${tipo}: ${res.statusText}`);

    const datos = await res.json();

    // Recorremos los datos y armamos cada fila
    datos.forEach(item => {
      const fila = document.createElement("tr");
      const clave = `${tipo}-${item.id}`;

      // Creamos celdas según tipo de platillo
      fila.innerHTML = `
        <td>${item.id}</td>
        <td><img src="http://localhost:8080/ApiRestaurente/IMAGENES/${item.imagen}" alt="${item.nombre}" /></td>
        <td>${item.nombre}</td>
        <td>${item.precio}$</td>
        ${tipo === "comidas" ? `<td>${item.tipo}</td>` : ""}
        ${tipo === "bebidas" ? `<td>${item.tipo}</td><td>${item.unidad}</td>` : ""}
        <td data-clave="${clave}">${item.disponible === "1" ? "Sí" : "No"}</td>
        <td>
          <div class="tablaAcciones">
            <!-- Formulario para editar -->
            <form action="${tipo}Editar.html#${hash}/${item.id}" method="post">
              <button class="boton">Editar</button>
            </form>
            <!-- Formulario para editar foto -->
            <form action="${tipo}EditarImagen.html#${hash}/${item.id}" method="post">
              <button class="boton">Editar Foto</button>
            </form>
            <!-- Si es comida o cóctel, se muestra botón de editar ingredientes -->
            ${tipo == "comidas" || tipo == "cocteles" ? '<form action=asignarIngredientes'+tipo+'.html#'+hash+"/"+item.id+' method="post"><button class="boton">Editar Ingredientes</button></form>' : ""}
            <!-- Checkbox para activar/desactivar -->
            <div class="TablaCheckbox">
              <input
                type="checkbox"
                class="cambiarEstado"
                id="cambiarEstado-${tipo}-${item.id}"
                data-id="${item.id}"
                data-tipo="${tipo}"
                ${item.disponible === "1" ? "checked" : ""}
              />
              <label for="cambiarEstado-${tipo}-${item.id}">Cambiar Estado</label>
              <label
                class="${item.disponible === "1" ? "checkboxTrue" : "checkboxFalse"}"
                data-estado="${tipo}-${item.id}"
                for="cambiarEstado-${tipo}-${item.id}"
              >
                ${item.disponible === "1" ? "Activo" : "Inactivo"}
              </label>
            </div>
          </div>
        </td>
      `;

      tabla.appendChild(fila);
    });

    // Agregamos título y tabla al main
    const titulo = document.createElement("h2");
    titulo.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);
    titulo.classList.add("tituloTable");
    main.append(titulo, tabla);

  } catch (error) {
    console.error(error);
    main.innerHTML += `<p>Error al cargar datos de ${tipo}.</p>`;
  }
};


// Función para cambiar el estado (disponible/inactivo)
const cambiarEstado = async (e) => {
  const checkbox = e.target;
  const id = checkbox.dataset.id;
  const tipo = checkbox.dataset.tipo;
  const nuevoEstado = checkbox.checked ? "1" : "0";

  // Validación: si falta info, revertimos cambio
  if (!tipo || !id) {
    checkbox.checked = !checkbox.checked;
    return;
  }

  try {
    // Llamada a la API (PATCH) para cambiar el estado
    const res = await fetch(`http://localhost:8080/ApiRestaurente/api/${tipo}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disponible: nuevoEstado }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Error desconocido");
    }

    // Actualizamos label del estado
    const labelEstado = document.querySelector(`label[data-estado="${tipo}-${id}"]`);
    if (labelEstado) {
      labelEstado.textContent = nuevoEstado === "1" ? "Activo" : "Inactivo";
      labelEstado.className = nuevoEstado === "1" ? "checkboxTrue" : "checkboxFalse";
    }

    // Actualizamos la celda de "Disponible"
    const tdDisponible = document.querySelector(`td[data-clave="${tipo}-${id}"]`);
    if (tdDisponible) {
      tdDisponible.textContent = nuevoEstado === "1" ? "Sí" : "No";
    }

  } catch (error) {
    // Si hay error, mostramos alerta y revertimos el checkbox
    alertaError("Error al cambiar estado: " + (error.message || "Error desconocido"));
    checkbox.checked = !checkbox.checked;
  }
};

// Listener global para detectar cuando se cambia un checkbox
document.addEventListener("change", async (e) => {
  if (e.target.classList.contains("cambiarEstado")) {
    await cambiarEstado(e);
  }
});
