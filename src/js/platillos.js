import { alertaOK, alertaError, alertaPregunta } from "./alertas.js";
import { cargarHeader } from "./header.js";

const volver = document.getElementById("volver");
const hash = window.location.hash.slice(1);
volver.action = `menu.html#${hash}`;

document.addEventListener("DOMContentLoaded", () => {
  cargarHeader(hash);
  const botonCrearComida = document.getElementById("crearComida");
  botonCrearComida.action = `comidaCrear.html#${hash}`;
  const botonCrearBebida = document.getElementById("crearBebida");
  botonCrearBebida.action = `bebidaCrear.html#${hash}`;
  const botonCrearCoctel = document.getElementById("crearCoctel");
  botonCrearCoctel.action = `coctelCrear.html#${hash}`;
  cargarPlatillos("comidas", "tablaComidas");
  cargarPlatillos("bebidas", "tablaBebidas");
  cargarPlatillos("cocteles", "tablaCocteles");
});

window.addEventListener("click", async (e) => {
  if (e.target.matches(".eliminar")) await eliminarPlatillo(e);
  else if (e.target.matches(".cambiarEstado")) await cambiarEstado(e);
});

const cargarPlatillos = async (tipo, idSeccion) => {
  const seccion = document.getElementById(idSeccion);
  const tabla = document.createElement("table");
  const encabezado = document.createElement("tr");

  const columnas = ["Imagen", "Nombre", "Precio"];
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
    const datos = await res.json();

    datos.forEach(item => {
      const fila = document.createElement("tr");
      const clave = `${tipo}-${item.id}`; // Clave única para evitar conflicto

      fila.innerHTML = `
        <td>${item.id}</td>
        <td><img src="http://localhost:8080/ApiRestaurente/IMAGENES/${item.imagen}" width="60" height="60" style="border-radius: 10px;"></td>
        <td>${item.nombre}</td>
        <td>$${parseInt(item.precio).toLocaleString()}</td>
        ${tipo === "comidas" ? `<td>${item.tipo}</td>` : ""}
        ${tipo === "bebidas" ? `<td>${item.tipo}</td><td>${item.unidad}</td>` : ""}
        <td data-clave="${clave}">${item.disponible === "1" ? "Sí" : "No"}</td>
        <td>
          <form action="${tipo}Editar.html#${hash}/${item.id}" method="post">
            <button>Editar</button>
          </form>
          <form action="${tipo}EditarImagen.html#${hash}/${item.id}" method="post">
            <button>Editar Foto</button>
          </form>
          <button class="eliminar" data-id="${item.id}" data-tipo="${tipo}">Eliminar</button>
          <label>
            <input type="checkbox" class="cambiarEstado" 
              data-id="${item.id}" 
              data-tipo="${tipo}" 
              data-clave="${clave}" 
              ${item.disponible === "1" ? "checked" : ""}>
            Disponible
          </label>
        </td>
      `;

      tabla.appendChild(fila);
    });

    seccion.innerHTML = ""; // Limpia sección previa antes de cargar
    seccion.appendChild(tabla);
  } catch (err) {
    console.error(`Error al cargar ${tipo}:`, err);
    seccion.innerHTML += "<p>Error al cargar datos.</p>";
  }
};

const cambiarEstado = async (e) => {
  const id = e.target.dataset.id;
  const tipo = e.target.dataset.tipo;
  const clave = e.target.dataset.clave;
  const nuevoEstado = e.target.checked ? "1" : "0";

  try {
    const res = await fetch(`http://localhost:8080/ApiRestaurente/api/${tipo}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disponible: nuevoEstado }),
    });

    const resultado = await res.text();
    if (!res.ok) throw new Error(resultado);

    // Actualiza el texto del estado en la columna correspondiente
    const celdaEstado = document.querySelector(`[data-clave="${clave}"]`);
    if (celdaEstado) {
      celdaEstado.textContent = nuevoEstado === "1" ? "Sí" : "No";
    }
  } catch (err) {
    alertaError("Error al cambiar estado: " + err.message);
  }
};

const eliminarPlatillo = async (e) => {
  const id = e.target.dataset.id;
  const tipo = e.target.dataset.tipo;

  const confirm = await alertaPregunta(`¿Eliminar ${tipo.slice(0, -1)} #${id}?`);
  if (!confirm.isConfirmed) return;

  try {
    const res = await fetch(`http://localhost:8080/ApiRestaurente/api/${tipo}/${id}`, {
      method: "DELETE",
    });
    const mensaje = await res.text();
    if (!res.ok) throw new Error(mensaje);
    await alertaOK(mensaje);
    location.reload();
  } catch (err) {
    alertaError("No se pudo eliminar: " + err.message);
  }
};
