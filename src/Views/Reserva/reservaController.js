import { alertaWarning, alertaPregunta, alertaError, alertaOK } from "../../Helpers/alertas";
import * as api from "../../Helpers/api";
import validarPermiso from "../../Helpers/permisos";

export default async () => {
  const app = document.getElementById("app");

  const crear = validarPermiso("Reserva.crear");
  let editar = validarPermiso("Reserva.editar");
  let eliminar = validarPermiso("Reserva.eliminar");

  // Botón para crear reserva
  if (crear) {
    const boton = document.createElement("button");
    boton.classList.add("boton");
    boton.id = "BotonCrearReserva";
    boton.textContent = "Crear Reserva";
    app.appendChild(boton);
  }

  // Título y tabla de reservas actuales
  const titulo = document.createElement("p");
  titulo.textContent = "Reservas Actuales";
  titulo.classList.add("titulos");

  const tabla = document.createElement("table");
  tabla.classList.add("tablas");

  const encabezados = [
    "ID",
    "Correo Cliente",
    "No.Mesa",
    "Cantidad",
    "Fecha",
    "Hora",
    "Acciones",
  ];

  const filaEncabezado = document.createElement("tr");
  encabezados.forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    filaEncabezado.appendChild(th);
  });
  tabla.appendChild(filaEncabezado);

  let contador = 0;

  // Consultar datos
  const pedidos = await api.get("pedidos");
  const reservas = await api.get("reservas");

  pedidos.forEach((pedido) => {
    if (pedido.facturado == "0" && !pedido.idCaja) {
      const reserva = reservas.find((r) => r.id === pedido.idReserva);
      if (reserva) {
        contador++;

        const fila = document.createElement("tr");

        // Columnas
        const columnas = [
          pedido.id,
          pedido.correoCliente,
          pedido.numeroMesa,
          reserva.cantidadTentativa,
          reserva.fechaTentativa,
          reserva.horaTentativa,
        ];

        columnas.forEach((col) => {
          const td = document.createElement("td");
          td.textContent = col;
          fila.appendChild(td);
        });

        // Acciones
        const tdAcciones = document.createElement("td");
        const divAcciones = document.createElement("div");
        divAcciones.classList.add("tablaAcciones");

        const botonActivar = document.createElement("button");
        botonActivar.classList.add("boton");
        botonActivar.id = "BotonActivarReserva";
        botonActivar.value = pedido.idReserva;
        botonActivar.textContent = "Activar Reserva";

        divAcciones.append(botonActivar);
        if (editar) {
          const botonEditar = document.createElement("button");
          botonEditar.classList.add("boton");
          botonEditar.id = "BotonEditarReserva";
          botonEditar.value = pedido.idReserva;
          botonEditar.textContent = "Editar Fecha Reserva";
          divAcciones.append(botonEditar);

        }
        if (eliminar) {
          const botonEliminar = document.createElement("button");
          botonEliminar.classList.add("boton");
          botonEliminar.id = "BotonEliminarReserva";
          botonEliminar.type = "button";
          botonEliminar.value = pedido.idReserva;
          botonEliminar.dataset.idReserva = pedido.idReserva;
          botonEliminar.textContent = "Eliminar";
          divAcciones.append(botonEliminar);
        }

        tdAcciones.appendChild(divAcciones);
        fila.appendChild(tdAcciones);

        tabla.appendChild(fila);
      }
    }
  });

  // Si no hay reservas
  if (contador == 0) {
    titulo.style.display = "none";
    tabla.style.display = "none";

    const tituloNadaPadre = document.createElement("div");
    const tituloNada = document.createElement("p");
    tituloNada.textContent = "No hay reservas...";
    tituloNadaPadre.classList.add("titulos");
    tituloNadaPadre.appendChild(tituloNada);
    app.append(tituloNadaPadre);
  }

  app.append(titulo, tabla);

  const validarActivarReserva = async (e) => {
    const { numeroMesa } = await api.get(`pedidos/reserva/${e.target.value}`)

    let mesaSi = false;
    let cajaSi = false;

    const mesas = await api.get("mesas");
    const cajas = await api.get("caja/verDisponible");

    mesas.filter(m => { if (m.numero == numeroMesa) m.disponible == "1" ? mesaSi = true : ""; });

    if (cajas.Ok) cajaSi = true;
    else if (cajas.Error) cajaSi = false;

    if (cajaSi && mesaSi) {
      window.location.href = `#/Reserva/ActivarReserva/id=${e.target.value}`;
    } else if (!cajaSi && !mesaSi) {
      alertaWarning(
        "No hay Cajas ni Mesa elegida Disponible, no se puede activar reserva."
      );
    } else if (!cajaSi) {
      alertaWarning("No hay Cajas Disponibles, no se puede activar reserva.");
    } else if (!mesaSi) {
      alertaWarning("No esta disponible la Mesa elegida, no se puede activar reserva.");
    }
  };

  const eliminarReservas = async (e) => {
    const id = e.target.value;
    const confirmacion = await alertaPregunta(
      `¿Desea eliminar la reserva #${id}?`
    );
    if (confirmacion.isConfirmed) {
      const pedidoReserva = await api.get(`pedidos/reserva/${id}`)
      const eliminacionPedido = await api.del(`pedidos/${pedidoReserva.id}`);
      if (eliminacionPedido.Ok) {
        const eliminacionReserva = await api.del(`reservas/${id}`);
        if (eliminacionReserva.Ok) {
          await alertaOK(eliminacionReserva.Ok);
          const fila = e.target.parentElement.parentElement.parentElement;
          const padreTabla = fila.parentElement;
          fila.remove();
          const cantidadTabla = padreTabla.querySelectorAll("tr").length;
          if (cantidadTabla == 1) {
            const padrePadre = padreTabla.parentElement;            
            const parrafos = padrePadre.querySelectorAll("p");
            const pCaja = Array.from(parrafos).find(
              (el) => el.textContent.trim() === "Reservas Actuales"
            );
            pCaja.remove();
            padreTabla.remove();

            const tituloNadaPadre = document.createElement("div");
            const tituloNada = document.createElement("p");
            tituloNada.textContent = "No hay reservas...";
            tituloNadaPadre.classList.add("titulos");
            tituloNadaPadre.appendChild(tituloNada);
            app.append(tituloNadaPadre);
          }
        } if (eliminacionReserva.Error) alertaError(eliminacionReserva.Error)
      }
      if (eliminacionPedido.Error) alertaError(eliminacionPedido.Error)
    }
  };

  // Eventos de botones
  window.addEventListener("click", async (e) => {
    if (e.target.matches("#BotonCrearReserva")) window.location.href = `#/Reserva/Crear`;
    else if (e.target.matches("#BotonEditarReserva")) window.location.href = `#/Reserva/Editar/id=${e.target.value}`;
    else if (e.target.matches("#BotonActivarReserva")) validarActivarReserva(e);
    else if (e.target.matches("#BotonEliminarReserva")) eliminarReservas(e);
  });
};
