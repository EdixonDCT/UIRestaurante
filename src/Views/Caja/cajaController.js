import { alertaPregunta, alertaError, alertaOK } from "../../Helpers/alertas";
import * as api from "../../Helpers/api";
import validarPermiso from "../../Helpers/permisos";
import * as validacion from "../../Helpers/validaciones";
export default async () => {
  const app = document.getElementById("app");

  const crear = validarPermiso("Caja.crear")
  let editar = validarPermiso("Caja.editar")
  let eliminar = validarPermiso("Caja.eliminar")
  if (crear) {
    const boton = document.createElement("button");
    boton.classList.add("boton");
    boton.id = "BotonApertura";
    boton.textContent = "Aperturar Caja";
    app.appendChild(boton);
  }
  const tablaCerradas = document.createElement("table");
  tablaCerradas.classList.add("tablas");

  const tablaAbiertas = document.createElement("table");
  tablaAbiertas.classList.add("tablas");

  const tituloCerradas = document.createElement("p");
  tituloCerradas.textContent = "Cajas Cerradas";
  tituloCerradas.classList.add("titulos");

  const tituloAbiertas = document.createElement("p");
  tituloAbiertas.textContent = "Cajas Abiertas";
  tituloAbiertas.classList.add("titulos");

  // Encabezados tabla CERRADA
  const headerRowCerradas = document.createElement("tr");
  const headersCerradas = [
    "ID", "Fecha Apertura", "Hora Apertura", "Monto Apertura",
    "Fecha Cierre", "Hora Cierre", "Monto Cierre",
    "Cédula Trabajador", "Nombre Cajero"
  ];
  if (editar) headersCerradas.push("Acciones");
  headersCerradas.forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRowCerradas.appendChild(th);
  });
  tablaCerradas.appendChild(headerRowCerradas);

  // Encabezados tabla ABIERTA
  const headerRowAbiertas = document.createElement("tr");
  const headersAbiertas = [
    "ID", "Fecha Apertura", "Hora Apertura", "Monto Apertura",
    "Cédula Trabajador", "Nombre Cajero", "Acciones"
  ];
  headersAbiertas.forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRowAbiertas.appendChild(th);
  });
  tablaAbiertas.appendChild(headerRowAbiertas);

  // Traer datos
  const data = await api.get("caja");
  let contadorCajaAbierta = 0;

  data.forEach(caja => {
    if (!caja.fechaCierre && !caja.horaCierre && !caja.montoCierre) {
      // fila caja abierta
      const row = document.createElement("tr");

      const celdas = [
        caja.id,
        caja.fechaApertura || "-",
        caja.horaApertura || "-",
        caja.montoApertura || "-",
        caja.cedulaTrabajador,
        caja.nombreCajero
      ];

      celdas.forEach(valor => {
        const td = document.createElement("td");
        td.textContent = valor;
        row.appendChild(td);
      });

      // Acciones
      const tdAcciones = document.createElement("td");
      const divAcciones = document.createElement("div");
      divAcciones.classList.add("tablaAcciones");

      const btnActualizar = document.createElement("button");
      btnActualizar.classList.add("boton");
      btnActualizar.id = "BotonEditarApertura"
      btnActualizar.value = caja.id;
      btnActualizar.textContent = "Actualizar Apertura";
      !editar ? btnActualizar.style.display = "none" : editar = true;

      const btnCerrar = document.createElement("button");
      btnCerrar.classList.add("boton");
      btnCerrar.id = "BotonCierre"
      btnCerrar.value = caja.id;
      btnCerrar.textContent = "Cerrar Caja";

      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add("boton");
      btnEliminar.id = "BotonEliminarCaja";
      btnEliminar.value = caja.id;
      btnEliminar.textContent = "Eliminar";
      !eliminar ? btnEliminar.style.display = "none" : eliminar = true;

      divAcciones.append(btnActualizar, btnCerrar, btnEliminar);
      tdAcciones.appendChild(divAcciones);
      row.appendChild(tdAcciones);

      tablaAbiertas.appendChild(row);
      contadorCajaAbierta++;

    } else {
      // fila caja cerrada
      const row = document.createElement("tr");

      const celdas = [
        caja.id,
        caja.fechaApertura || "-",
        caja.horaApertura || "-",
        caja.montoApertura || "-",
        caja.fechaCierre || "-",
        caja.horaCierre || "-",
        caja.montoCierre || "-",
        caja.cedulaTrabajador,
        caja.nombreCajero
      ];

      celdas.forEach(valor => {
        const td = document.createElement("td");
        td.textContent = valor;
        row.appendChild(td);
      });

      // Acciones
      if (editar) {
        const tdAcciones = document.createElement("td");
        const divAcciones = document.createElement("div");
        divAcciones.classList.add("tablaAcciones");

        const btnEditar = document.createElement("button");
        btnEditar.classList.add("boton");
        btnEditar.id = "BotonEditarCaja";
        btnEditar.value = caja.id;
        btnEditar.textContent = "Editar";

        divAcciones.appendChild(btnEditar);
        tdAcciones.appendChild(divAcciones);
        row.appendChild(tdAcciones);
      }

      tablaCerradas.appendChild(row);
    }
  });

  if (contadorCajaAbierta === 0) {
    tituloAbiertas.style.display = "none";
    tablaAbiertas.style.display = "none";
  }

  const EliminarMesa = async (e) => {
    const id = e.target.value;
    const pregunta = await alertaPregunta(`Desea Eliminar esta Caja #${id}?`);
    if (pregunta.isConfirmed) {
      const eliminado = await api.del(`caja/${id}`);
      if (eliminado.Ok) {
        await alertaOK(eliminado.Ok)
        const fila = e.target.parentElement.parentElement.parentElement
        const padreTabla = fila.parentElement;
        fila.remove()
        const cantidadTabla = padreTabla.querySelectorAll("tr").length
        if (cantidadTabla == 1) {
          const padrePadre = padreTabla.parentElement
          const parrafos = padrePadre.querySelectorAll("p");
          const pCaja = Array.from(parrafos).find(el => el.textContent.trim() === "Cajas Abiertas");
          pCaja.remove();
          padreTabla.remove();
        }
      }
      if (eliminado.Error) {
        await alertaError(eliminado.Error);
      }
    }
  }

  app.append(tituloAbiertas, tablaAbiertas, tituloCerradas, tablaCerradas);
  window.addEventListener("click", async (e) => {
    if (e.target.matches("#BotonEliminarCaja")) EliminarMesa(e);
    else if (e.target.matches("#BotonEditarCaja")) window.location.href = `#/Caja/Editar/id=${e.target.value}`;
    else if (e.target.matches("#BotonEditarApertura")) window.location.href = `#/Caja/EditarApertura/id=${e.target.value}`;
    else if (e.target.matches("#BotonApertura")) window.location.href = `#/Caja/Apertura`;
    else if (e.target.matches("#BotonCierre")) window.location.href = `#/Caja/Cierre/id=${e.target.value}`;
  });
}

