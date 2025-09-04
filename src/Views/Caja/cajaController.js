import { alertaPregunta, alertaError, alertaOK } from "../../Helpers/alertas"; 
// Importa funciones para mostrar alertas: confirmación, error y éxito

import * as api from "../../Helpers/api"; 
// Funciones para llamadas a la API (GET, POST, DELETE, etc.)

import validarPermiso from "../../Helpers/permisos"; 
// Función para validar permisos del usuario

import * as validacion from "../../Helpers/validaciones"; 
// Funciones de validación de formularios (aunque no se usan mucho aquí)

export default async () => {
  // Contenedor principal donde se colocarán tablas y botones
  const app = document.getElementById("app");

  // Validar permisos del usuario
  const crear = validarPermiso("Caja.crear"); // Permiso para crear caja
  let editar = validarPermiso("Caja.editar"); // Permiso para editar caja
  let eliminar = validarPermiso("Caja.eliminar"); // Permiso para eliminar caja

  // Si el usuario tiene permiso de crear, mostrar botón "Aperturar Caja"
  if (crear) {
    const boton = document.createElement("button");
    boton.classList.add("boton");
    boton.id = "BotonApertura";
    boton.textContent = "Aperturar Caja";
    app.appendChild(boton);
  }

  // Crear tablas y títulos para cajas abiertas y cerradas
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

  // ------------------- ENCABEZADOS TABLA CERRADAS -------------------
  const headerRowCerradas = document.createElement("tr");
  const headersCerradas = [
    "ID", "Fecha Apertura", "Hora Apertura", "Monto Apertura",
    "Fecha Cierre", "Hora Cierre", "Monto Cierre",
    "Cédula Trabajador", "Nombre Cajero"
  ];
  if (editar) headersCerradas.push("Acciones"); // Añadir columna acciones si puede editar
  headersCerradas.forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRowCerradas.appendChild(th);
  });
  tablaCerradas.appendChild(headerRowCerradas);

  // ------------------- ENCABEZADOS TABLA ABIERTAS -------------------
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

  // ------------------- TRAER DATOS DE LA API -------------------
  const data = await api.get("caja"); // Obtener todas las cajas
  let contadorCajaAbierta = 0; // Contador para ocultar tabla si no hay cajas abiertas

  data.forEach(caja => {
    if (!caja.fechaCierre && !caja.horaCierre && !caja.montoCierre) {
      // ------------------- FILA CAJA ABIERTA -------------------
      const row = document.createElement("tr");

      const celdas = [
        caja.id,
        caja.fechaApertura || "-",
        caja.horaApertura || "-",
        caja.montoApertura || "-",
        caja.cedulaTrabajador,
        caja.nombreCajero
      ];

      // Llenar celdas de la fila
      celdas.forEach(valor => {
        const td = document.createElement("td");
        td.textContent = valor;
        row.appendChild(td);
      });

      // ------------------- ACCIONES CAJA ABIERTA -------------------
      const tdAcciones = document.createElement("td");
      const divAcciones = document.createElement("div");
      divAcciones.classList.add("tablaAcciones");

      // Botón para actualizar apertura
      const btnActualizar = document.createElement("button");
      btnActualizar.classList.add("boton");
      btnActualizar.id = "BotonEditarApertura";
      btnActualizar.value = caja.id;
      btnActualizar.textContent = "Actualizar Apertura";
      !editar ? btnActualizar.style.display = "none" : editar = true;

      // Botón para cerrar caja
      const btnCerrar = document.createElement("button");
      btnCerrar.classList.add("boton");
      btnCerrar.id = "BotonCierre";
      btnCerrar.value = caja.id;
      btnCerrar.textContent = "Cerrar Caja";

      // Botón para eliminar caja
      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add("boton");
      btnEliminar.id = "BotonEliminarCaja";
      btnEliminar.value = caja.id;
      btnEliminar.textContent = "Eliminar";
      !eliminar ? btnEliminar.style.display = "none" : eliminar = true;

      // Añadir botones al contenedor de acciones
      divAcciones.append(btnActualizar, btnCerrar, btnEliminar);
      tdAcciones.appendChild(divAcciones);
      row.appendChild(tdAcciones);

      tablaAbiertas.appendChild(row);
      contadorCajaAbierta++;

    } else {
      // ------------------- FILA CAJA CERRADA -------------------
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

      // Añadir columna acciones solo si tiene permiso de editar
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

  // Ocultar tabla de cajas abiertas si no hay ninguna
  if (contadorCajaAbierta === 0) {
    tituloAbiertas.style.display = "none";
    tablaAbiertas.style.display = "none";
  }

  // ------------------- FUNCION PARA ELIMINAR CAJA -------------------
  const EliminarMesa = async (e) => {
    const id = e.target.value;
    const pregunta = await alertaPregunta(`Desea Eliminar esta Caja #${id}?`);
    if (pregunta.isConfirmed) {
      const eliminado = await api.del(`caja/${id}`);
      if (eliminado.Ok) {
        await alertaOK(eliminado.Ok);
        const fila = e.target.parentElement.parentElement.parentElement;
        const padreTabla = fila.parentElement;
        fila.remove();

        // Si la tabla queda vacía, eliminarla
        const cantidadTabla = padreTabla.querySelectorAll("tr").length;
        if (cantidadTabla == 1) {
          const padrePadre = padreTabla.parentElement;
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

  // ------------------- AGREGAR TABLAS Y EVENTOS -------------------
  app.append(tituloAbiertas, tablaAbiertas, tituloCerradas, tablaCerradas);

  window.addEventListener("click", async (e) => {
    if (e.target.matches("#BotonEliminarCaja")) EliminarMesa(e); // Eliminar caja
    else if (e.target.matches("#BotonEditarCaja")) window.location.href = `#/Caja/Editar/id=${e.target.value}`; // Editar caja cerrada
    else if (e.target.matches("#BotonEditarApertura")) window.location.href = `#/Caja/EditarApertura/id=${e.target.value}`; // Editar apertura
    else if (e.target.matches("#BotonApertura")) window.location.href = `#/Caja/Apertura`; // Abrir nueva caja
    else if (e.target.matches("#BotonCierre")) window.location.href = `#/Caja/Cierre/id=${e.target.value}`; // Cerrar caja
  });
}
