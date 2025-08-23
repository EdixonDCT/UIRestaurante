import { alertaOK, alertaError, alertaPregunta, alertaOpciones } from "../alertas.js"; // Importa funciones de alertas personalizadas
import { cargarHeader } from "../header.js"; // Importa función para cargar el header

const hash = window.location.hash.slice(1); // Obtiene el valor después del # en la URL
const section = document.querySelector(".main"); // Sección principal donde se cargarán tablas
let adminTemporal = false; // Controla si el usuario actual es administrador temporal

// Carga la tabla de trabajadores
const cargarTabla = async () => {
  const botonVolver = document.getElementById("volver"); // Botón para regresar al menú
  botonVolver.action = `../menu.html#${hash}`; // Se le asigna acción de volver con el hash

  // Tabla principal de trabajadores activos/inactivos
  const table = document.createElement("table");
  table.classList.add("tablas");
  const headerRow = document.createElement("tr");
  const headers = ["Cédula", "Nombre", "Apellido", "Nacimiento", "Oficio", "Foto", "Estado", "Acciones"];
  headers.forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });

  // Tabla de nuevos trabajadores (pendientes de activar)
  const tableNuevosInactivos = document.createElement("table");
  tableNuevosInactivos.classList.add("tablas");
  const headerRowNuevosInactivos = document.createElement("tr");
  const headersNuevosInactivos = ["Cédula", "Nombre", "Apellido", "Nacimiento", "Oficio", "Foto", "Acciones"];
  headersNuevosInactivos.forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRowNuevosInactivos.appendChild(th);
  });
  tableNuevosInactivos.appendChild(headerRowNuevosInactivos);
  table.appendChild(headerRow);

  // Títulos de las secciones
  const tituloNuevos = document.createElement("h2");
  tituloNuevos.textContent = "Solicitudes de Registro:";
  tituloNuevos.classList.add("tituloTable");

  const titulo = document.createElement("h2");
  titulo.textContent = "Trabajadores:";
  titulo.classList.add("tituloTable");

  try {
    let contadorSinActivar = 0; // Cuenta cuántos trabajadores aún no han sido activados
    const res = await fetch("http://localhost:8080/ApiRestaurente/api/trabajadores");
    const data = await res.json();

    // Recorre los trabajadores recibidos
    data.forEach(trabajador => {
      // Si ya está activo/inactivo
      if (trabajador.activo == "1" || trabajador.activo == "0") {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${trabajador.cedula}</td>
        <td>${trabajador.nombre}</td>
        <td>${trabajador.apellido}</td>
        <td>${trabajador.nacimiento}</td>
        <td>${adminTemporal && hash == trabajador.cedula ? "Admin(Temporal)" : trabajador.nombreOficio}</td>
        <td><img src="http://localhost:8080/ApiRestaurente/IMAGENES/${trabajador.foto}" alt="Foto"></td>
        <td data-valor-id=${trabajador.cedula}>${trabajador.activo == "1" ? "Activo" : "Inactivo"}</td>
        <td>
        <div class="tablaAcciones"> 
          <!-- Botón para editar trabajador -->
          <form action="trabajadorEditar.html#${hash}/${trabajador.cedula}" method="post">
            <button class="boton" type="submit" ${trabajador.idOficio == "1" && trabajador.cedula == hash || trabajador.idOficio != "1" ? "" : "disabled"}>Editar Trabajador</button>
          </form>
          <!-- Botón para editar foto -->
          <form action="trabajadorEditarImagen.html#${hash}/${trabajador.cedula}" method="post">
            <button class="boton" type="submit" ${trabajador.idOficio == "1" && trabajador.cedula == hash || trabajador.idOficio != "1" ? "" : "disabled"}>Editar Foto</button>
          </form>
          <!-- Checkbox para cambiar estado -->
          <div class="TablaCheckbox">
              <input type="checkbox" class="cambiarEstado" id="cambiarEstado-${trabajador.cedula}" data-id="${trabajador.cedula}" ${trabajador.activo === "1" ? "checked" : ""} ${trabajador.idOficio == "1" && trabajador.cedula == hash || trabajador.idOficio != "1" ? "" : "disabled"}>
              <label for="cambiarEstado-${trabajador.cedula}">Cambiar Estado</label>
              <label ${trabajador.activo === "1" ? "class='checkboxTrue'" : "class='checkboxFalse'"} boton-id="${trabajador.cedula}" for="cambiarEstado-${trabajador.cedula}">${trabajador.activo === "1" ? "Activo" : "Inactivo"}</label>
            </div>
          </div>
        </td>`;
        table.appendChild(row);
      }
      // Si aún no está activado
      else {
        contadorSinActivar++;
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${trabajador.cedula}</td>
        <td>${trabajador.nombre}</td>
        <td>${trabajador.apellido}</td>
        <td>${trabajador.nacimiento}</td>
        <td>${trabajador.nombreOficio}</td>
        <td><img src="http://localhost:8080/ApiRestaurente/IMAGENES/${trabajador.foto}" alt="Foto"></td>
        <td>
        <div class="tablaAcciones">
                    <button id="BotonActivarTrabj" class="boton" value="${trabajador.cedula}" type="button">Activar</button>
                    <button id="BotonEliminar" class="boton" value="${trabajador.cedula}" type="button">Eliminar</button>
        </div>
        </td>`;
        tableNuevosInactivos.appendChild(row);
      }
    });

    // Oculta la tabla de nuevos si no hay registros
    if (contadorSinActivar == 0) {
      tituloNuevos.style.display = "none";
      tableNuevosInactivos.style.display = "none";
    }

    // Inserta todo en la sección principal
    section.append(tituloNuevos, tableNuevosInactivos, titulo, table);
  } catch (error) {
    section.innerHTML = "<p>Error al cargar los trabajadores.</p>";
    console.error("Error:", error);
  }
};

// Eliminar trabajador
const EliminarTrabajador = async (e) => {
  const id = e.target.value;
  const foto = await consultarFoto(id); // Consulta foto del trabajador
  const pregunta = await alertaPregunta(`¿Desea eliminar al trabajador con cédula ${id}?`);
  if (pregunta.isConfirmed) {
    try {
      // Petición DELETE al trabajador
      const response = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const mensaje = await response.text();
      if (!response.ok) throw new Error(mensaje);

      // Elimina también la foto
      try {
        const fotoEliminar = await fetch(`http://localhost:8080/ApiRestaurente/api/imagen/${foto}`, {
          method: "DELETE"
        });
        if (!fotoEliminar.ok) {
          const fotoEliminar = await fotoEliminar.text();
          throw new Error(fotoEliminar || "Error al eliminar imagen anterior.");
        };
        await alertaOK("Trabajador: " + mensaje);
        location.reload(); // Recarga la página
      } catch (error) {
        alertaError(error.message);
      }
    } catch (error) {
      alertaError(error.message);
    }
  }
}

// Activar trabajador pendiente
const activarTrabajador = async (e) => {
  const id = e.target.value;
  try {
    const res = await fetch("http://localhost:8080/ApiRestaurente/api/trabajadores/" + id);
    const data = await res.json();
    const respuesta = await alertaOpciones(data.idOficio, data.nombre + " " + data.apellido); // Pide oficio
    console.log(respuesta.opcion);
    if (respuesta.isDismissed == true && respuesta.opcion) {
      try {
        const activo = {
          activo: "1",
          idOficio: respuesta.opcion
        };
        const actualizar = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/activar/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(activo)
        });
        const mensaje = await actualizar.text();
        if (!actualizar.ok) throw new Error(mensaje);
        await alertaOK(mensaje);
        location.reload();
      } catch (error) {
        alertaError(error.message);
      }
    }
  } catch {
    alertaError(error.message);
  }
}

// Consulta foto del trabajador antes de eliminar
const consultarFoto = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${id}`);
    const trabajador = await response.json();
    if (!response.ok) throw new Error(trabajador);
    return trabajador.foto;
  } catch (error) {
    alertaError(error.message);
  }
}

// Cambiar estado de trabajador (activo/inactivo)
const cambiarEstado = async (e) => {
  let id = e.target.dataset.id;
  let valor = e.target.checked ? "1" : "0"; // 1 activo, 0 inactivo
  let checkbox = document.querySelector(`[data-valor-id="${id}"]`);
  let labelBoton = document.querySelector(`[boton-id="${id}"]`);
  try {
    const disponibles = { activo: valor };
    const respuesta = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/estado/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(disponibles)
    });

    if (!respuesta.ok) throw new Error("Error al cambiar el estado");

    const resultado = await respuesta.text();
    // Actualiza texto y estilos del estado
    checkbox.textContent = e.target.checked ? "Activo" : "Inactivo";
    labelBoton.classList = e.target.checked ? "checkboxTrue" : "checkboxFalse";
    labelBoton.textContent = e.target.checked ? "Activo" : "Inactivo";
  } catch (error) {
    console.error("Falló el cambio de estado:", error);
  }
}

// Valida si el usuario actual es administrador temporal
const ValidaradminTemporal = async () => {
    try {
        const res = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${hash}`);
        const data = await res.json();
        data.adminTemporalFin && data.adminTemporalInicio ? adminTemporal = true : adminTemporal = false;        
    } catch (error) {
        console.error("Error:", error);
    }
}

// Cuando carga la página
document.addEventListener("DOMContentLoaded",async () => {
  cargarHeader(hash); // Carga encabezado
  await ValidaradminTemporal(); // Valida si es admin temporal
  cargarTabla(); // Carga tablas
});

// Delegación de eventos para botones
window.addEventListener("click", async (e) => {
  if (e.target.matches("#BotonEliminar")) EliminarTrabajador(e);
  else if (e.target.matches("#BotonActivarTrabj")) activarTrabajador(e);
  else if (e.target.matches(".cambiarEstado")) cambiarEstado(e);
});
