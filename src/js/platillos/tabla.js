import { alertaOK, alertaError } from "../alertas.js";
import { cargarHeader } from "../header.js";

const hash = window.location.hash.slice(1);
const main = document.querySelector(".main");
const volver = document.getElementById("volver");
volver.action = `../menu.html#${hash}`
document.addEventListener("DOMContentLoaded", async () => {
  cargarHeader(hash);

  // Botones para crear
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

  main.append(nuevoComida, nuevoBebida, nuevoCoctel);

  await cargarPlatillos("comidas");
  await cargarPlatillos("bebidas");
  await cargarPlatillos("cocteles");
});

const cargarPlatillos = async (tipo) => {
  const tabla = document.createElement("table");
  tabla.classList.add("tablas");

  // Encabezados
  const encabezado = document.createElement("tr");
  const columnas = ["ID", "Imagen", "Nombre", "Precio"];
  if (tipo === "comidas") columnas.push("Tipo");
  if (tipo === "bebidas") columnas.push("Tipo", "Unidad");
  columnas.push("Disponible", "Acciones");

  columnas.forEach(col => {
    const th = document.createElement("th");
    th.textContent = col;
    encabezado.appendChild(th);
  });
  tabla.appendChild(encabezado);

  try {
    const res = await fetch(`http://localhost:8080/ApiRestaurente/api/${tipo}`);
    if (!res.ok) throw new Error(`Error al cargar ${tipo}: ${res.statusText}`);

    const datos = await res.json();

    datos.forEach(item => {
      const fila = document.createElement("tr");
      const clave = `${tipo}-${item.id}`;

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
            <form action="${tipo}Editar.html#${hash}/${item.id}" method="post">
              <button class="boton">Editar</button>
            </form>
            <form action="${tipo}EditarImagen.html#${hash}/${item.id}" method="post">
              <button class="boton">Editar Foto</button>
            </form>
            ${tipo == "comidas" || tipo == "cocteles" ? '<form action=asignarIngredientes'+tipo+'.html#'+hash+"/"+item.id+' method="post"><button class="boton">Editar Ingredientes</button></form>' : ""}
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

    const titulo = document.createElement("h2");
    titulo.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);
    titulo.classList.add("tituloTable");
    main.append(titulo, tabla);

  } catch (error) {
    console.error(error);
    main.innerHTML += `<p>Error al cargar datos de ${tipo}.</p>`;
  }
};

const cambiarEstado = async (e) => {
  const checkbox = e.target;
  const id = checkbox.dataset.id;
  const tipo = checkbox.dataset.tipo;
  const nuevoEstado = checkbox.checked ? "1" : "0";

  if (!tipo || !id) {
    checkbox.checked = !checkbox.checked; // revertir si falta info
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/ApiRestaurente/api/${tipo}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disponible: nuevoEstado }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Error desconocido");
    }

    // Actualizar label correspondiente
    const labelEstado = document.querySelector(`label[data-estado="${tipo}-${id}"]`);
    if (labelEstado) {
      labelEstado.textContent = nuevoEstado === "1" ? "Activo" : "Inactivo";
      labelEstado.className = nuevoEstado === "1" ? "checkboxTrue" : "checkboxFalse";
    }

    // Actualizar td Disponible
    const tdDisponible = document.querySelector(`td[data-clave="${tipo}-${id}"]`);
    if (tdDisponible) {
      tdDisponible.textContent = nuevoEstado === "1" ? "Sí" : "No";
    }

  } catch (error) {
    alertaError("Error al cambiar estado: " + (error.message || "Error desconocido"));
    checkbox.checked = !checkbox.checked; // revertir si falla
  }
};

// Listener para checkbox
document.addEventListener("change", async (e) => {
  if (e.target.classList.contains("cambiarEstado")) {
    await cambiarEstado(e);
  }
});
