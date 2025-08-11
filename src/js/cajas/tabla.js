import { alertaOK, alertaError, alertaPregunta } from "../alertas";
import { cargarHeader } from "../header";

const hash = window.location.hash.slice(1);
const section = document.querySelector(".main");

const cargarTabla = async () => {
    const botonVolver = document.getElementById("volver");
    botonVolver.action = `../menu.html#${hash}`;

    const nuevoForm = document.createElement("form");
    nuevoForm.action = `cajaApertura.html#${hash}`;
    nuevoForm.innerHTML = `<button type="submit">Nueva Caja</button>`;
    nuevoForm.method = "post"
    nuevoForm.innerHTML = `<button class="boton" type="submit">Añadir Nueva Caja</button>`;
    nuevoForm.classList.add("botonTabla")
    section.appendChild(nuevoForm);

    const table = document.createElement("table");
    table.classList.add("tablas")
    const tableIncompleto = document.createElement("table")
    tableIncompleto.classList.add("tablas")
    const titulo = document.createElement("h2");
    const tituloIncompleto = document.createElement("h2");
    titulo.textContent = "Cajas Cerradas";
    tituloIncompleto.textContent = "Cajas Abiertas";
    titulo.classList.add("tituloTable")
    tituloIncompleto.classList.add("tituloTable");
    const headerRow = document.createElement("tr");
    const headerTwo = document.createElement("tr");
    const headers = [
        "ID", "Fecha Apertura", "Hora Apertura", "Monto Apertura",
        "Fecha Cierre", "Hora Cierre", "Monto Cierre",
        "Cédula Trabajador", "Nombre Cajero", "Acciones"
    ];
    const headerstwo = [
        "ID", "Fecha Apertura", "Hora Apertura", "Monto Apertura","Cédula Trabajador", "Nombre Cajero", "Acciones"
    ];
    headers.forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    headerstwo.forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerTwo.appendChild(th);
    });
    tableIncompleto.appendChild(headerTwo);
    try {
        const res = await fetch("http://localhost:8080/ApiRestaurente/api/caja");
        const data = await res.json();  
        let contadorCajaAbierta = 0;
        data.forEach((caja) => {
            if (!caja.fechaCierre && !caja.horaCierre && !caja.montoCierre) {
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
                contadorCajaAbierta++
            }
            else {
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
        if (contadorCajaAbierta == 0)
            {
                tituloIncompleto.style.display = "none";
                tableIncompleto.style.display = "none";
            }
        section.append(tituloIncompleto, tableIncompleto, titulo, table);
    } catch (error) {
        section.innerHTML = "<p>Error al cargar las cajas.</p>";
        console.error("Error:", error);
    }
};

const EliminarCaja = async (e) => {
    const id = e.target.value;
    const pregunta = await alertaPregunta(`Desea eliminar la caja #${id}?`);
    if (pregunta.isConfirmed) {
        try {
            const response = await fetch(`http://localhost:8080/ApiRestaurente/api/caja/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const mensaje = await response.text();
            if (!response.ok) {
                throw new Error(mensaje);
            }
            await alertaOK(mensaje);
            location.reload();
        } catch (error) {
            alertaError(error.message);
        }
    }
};

document.addEventListener("DOMContentLoaded", async (e) =>
{
  cargarHeader(hash);
  cargarTabla();
});
window.addEventListener("click", async (e) => {
    if (e.target.matches("#BotonEliminar")) EliminarCaja(e);
});
