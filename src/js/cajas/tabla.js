// Importamos funciones de alertas y para cargar el header
import { alertaOK, alertaError, alertaPregunta } from "../alertas";
import { cargarHeader } from "../header";

// Obtenemos el hash de la URL (cédula del usuario)
const hash = window.location.hash.slice(1);

// Seleccionamos la sección principal donde se van a mostrar las tablas
const section = document.querySelector(".main");

// ======================================
// FUNCION PARA CARGAR LA TABLA DE CAJAS
// ======================================
const cargarTabla = async () => {
    // Configuramos el botón "volver" para regresar al menú principal
    const botonVolver = document.getElementById("volver");
    botonVolver.action = `../menu.html#${hash}`;

    // Creamos un formulario para "Añadir Nueva Caja"
    const nuevoForm = document.createElement("form");
    nuevoForm.action = `cajaApertura.html#${hash}`;
    nuevoForm.method = "post";
    nuevoForm.innerHTML = `<button class="boton" type="submit">Añadir Nueva Caja</button>`;
    nuevoForm.classList.add("botonTabla");
    section.appendChild(nuevoForm);

    // Creamos las tablas: una para cajas cerradas y otra para cajas abiertas
    const table = document.createElement("table");
    table.classList.add("tablas");

    const tableIncompleto = document.createElement("table");
    tableIncompleto.classList.add("tablas");

    // Títulos de las tablas
    const titulo = document.createElement("h2");
    titulo.textContent = "Cajas Cerradas";
    titulo.classList.add("tituloTable");

    const tituloIncompleto = document.createElement("h2");
    tituloIncompleto.textContent = "Cajas Abiertas";
    tituloIncompleto.classList.add("tituloTable");

    // Cabecera de columnas para cajas cerradas
    const headerRow = document.createElement("tr");
    const headers = [
        "ID", "Fecha Apertura", "Hora Apertura", "Monto Apertura",
        "Fecha Cierre", "Hora Cierre", "Monto Cierre",
        "Cédula Trabajador", "Nombre Cajero", "Acciones"
    ];
    headers.forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Cabecera de columnas para cajas abiertas
    const headerTwo = document.createElement("tr");
    const headerstwo = ["ID", "Fecha Apertura", "Hora Apertura", "Monto Apertura", "Cédula Trabajador", "Nombre Cajero", "Acciones"];
    headerstwo.forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerTwo.appendChild(th);
    });
    tableIncompleto.appendChild(headerTwo);

    try {
        // Traemos la lista de cajas desde el backend
        const res = await fetch("http://localhost:8080/ApiRestaurente/api/caja");
        const data = await res.json();

        let contadorCajaAbierta = 0;

        // Recorremos cada caja y la clasificamos como abierta o cerrada
        data.forEach((caja) => {
            if (!caja.fechaCierre && !caja.horaCierre && !caja.montoCierre) {
                // Cajas abiertas
                const row = document.createElement("tr");
                row.innerHTML = `
        <td>${caja.id}</td>
        <td>${caja.fechaApertura || "-"}</td>
        <td>${caja.horaApertura || "-"}</td>
        <td>${caja.montoApertura || "-"}</td>
        <td>${caja.cedulaTrabajador}</td>
        <td>${caja.nombreCajero}</td>
        <td>
          <div class="tablaAcciones">
            <form action="cajaEditarApertura.html#${hash}/${caja.id}" method="post">
              <input type="hidden" name="id" value="${caja.id}">
              <button class="boton" type="submit">Actualizar Apertura</button>
            </form>

            <form action="cajaCerrar.html#${hash}/${caja.id}" method="post">
              <input type="hidden" name="id" value="${caja.id}">
              <button class="boton" type="submit">Cerrar Caja</button>
            </form>

            <button class="boton" id="BotonEliminar" value="${caja.id}" type="button">Eliminar</button>
          </div>
        </td>`;
                tableIncompleto.appendChild(row);
                contadorCajaAbierta++;
            } else {
                // Cajas cerradas
                const row = document.createElement("tr");
                row.innerHTML = `
        <td>${caja.id}</td>
        <td>${caja.fechaApertura || "-"}</td>
        <td>${caja.horaApertura || "-"}</td>
        <td>${caja.montoApertura || "-"}</td>
        <td>${caja.fechaCierre || "-"}</td>
        <td>${caja.horaCierre || "-"}</td>
        <td>${caja.montoCierre || "-"}</td>
        <td>${caja.cedulaTrabajador}</td>
        <td>${caja.nombreCajero}</td>
        <td>
          <div class="tablaAcciones">
            <form action="cajaEditar.html#${hash}/${caja.id}" method="post">
              <input type="hidden" name="id" value="${caja.id}">
              <button class="boton" type="submit">Editar</button>
            </form>
          </div>
        </td>`;
                table.appendChild(row);
            }
        });

        // Si no hay cajas abiertas, ocultamos la tabla correspondiente
        if (contadorCajaAbierta == 0) {
            tituloIncompleto.style.display = "none";
            tableIncompleto.style.display = "none";
        }

        // Añadimos las tablas al DOM
        section.append(tituloIncompleto, tableIncompleto, titulo, table);

    } catch (error) {
        section.innerHTML = "<p>Error al cargar las cajas.</p>";
        console.error("Error:", error);
    }
};

// ======================================
// FUNCION PARA ELIMINAR UNA CAJA
// ======================================
const EliminarCaja = async (e) => {
    const id = e.target.value;

    // Preguntamos al usuario antes de eliminar
    const pregunta = await alertaPregunta(`Desea eliminar la caja #${id}?`);
    if (pregunta.isConfirmed) {
        try {
            const response = await fetch(`http://localhost:8080/ApiRestaurente/api/caja/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            const mensaje = await response.text();
            if (!response.ok) throw new Error(mensaje);

            await alertaOK(mensaje); // Mostramos alerta de éxito
            location.reload(); // Recargamos la página
        } catch (error) {
            alertaError("Error: no se puede eliminar Caja porque esta asociada a un Pedido.");
        }
    }
};

// ======================================
// EVENTOS
// ======================================
document.addEventListener("DOMContentLoaded", async () => {
    cargarHeader(hash); // Cargamos el header
    cargarTabla();       // Cargamos la tabla de cajas
});

// Evento global para capturar clicks en botones de eliminar
window.addEventListener("click", async (e) => {
    if (e.target.matches("#BotonEliminar")) EliminarCaja(e);
});
