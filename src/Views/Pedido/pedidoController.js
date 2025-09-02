import { alertaError, alertaOK, alertaPregunta, alertaWarning } from "../../Helpers/alertas";
import * as api from "../../Helpers/api";
import validarPermiso from "../../Helpers/permisos";

export default async () => {
  const app = document.getElementById("app");

  const crear = validarPermiso("Pedido.crear")
  const editar = validarPermiso("Pedido.editar");
  const eliminar = validarPermiso("Pedido.eliminar");
  const eliminadoSuave = validarPermiso("Pedido.eliminadoSuave");
  const listarEliminados = validarPermiso("Pedido.eliminadosListar");

  if (crear) {
    const boton = document.createElement("button");
    boton.classList.add("boton");
    boton.id = "BotonCrearPedido";
    boton.textContent = "Crear Pedido";

    const botonCliente = document.createElement("button");
    botonCliente.classList.add("boton");
    botonCliente.id = "BotonCrearCliente";
    botonCliente.textContent = "Crear Cliente";

    const botonVerificar = document.createElement("button");
    botonVerificar.classList.add("boton");
    botonVerificar.id = "BotonVerificarCliente";
    botonVerificar.textContent = "Verificar si EXISTE Cliente";

    app.appendChild(boton);
    app.appendChild(botonCliente);
    app.appendChild(botonVerificar);
  }

  const tituloSinFactura = document.createElement("p");
  const tablaSinFactura = document.createElement("table");
  const tituloFacturados = document.createElement("p");
  const tablaFacturados = document.createElement("table");

  tituloSinFactura.textContent = "Pedidos Sin Facturar";
  tituloFacturados.textContent = "Pedidos Facturados";

  tituloFacturados.classList.add("titulos");
  tituloSinFactura.classList.add("titulos");

  const encabezadosFacturados = [
    "ID", "Fecha", "Hora", "ID Caja", "No.Mesa",
    "No.Clientes", "Cli.Correo", "Reserva", "Método de Pago", "Total"
  ];
  listarEliminados ? encabezadosFacturados.push("Eliminado", "Acciones") : encabezadosFacturados.push("Acciones")
  const encabezadosSinFactura = [
    "ID", "Fecha", "Hora", "ID Caja", "No.Mesa",
    "No.Clientes", "Cli.Correo", "Método de Pago", "Total", "Acciones"
  ];

  // Crear encabezados
  const crearEncabezado = (lista) => {
    const fila = document.createElement("tr");
    lista.forEach(text => {
      const th = document.createElement("th");
      th.textContent = text;
      fila.appendChild(th);
    });
    return fila;
  };

  tablaSinFactura.appendChild(crearEncabezado(encabezadosSinFactura));
  tablaFacturados.appendChild(crearEncabezado(encabezadosFacturados));

  tablaSinFactura.classList.add("tablas");
  tablaFacturados.classList.add("tablas");

  const data = await api.get("pedidos");
  let contadorSinFactura = 0;

  data.forEach(pedido => {
    // ================== SIN FACTURAR ==================
    if (pedido.facturado == "0" && !pedido.idReserva) {
      contadorSinFactura++;
      const fila = document.createElement("tr");

      const celdas = [
        pedido.id,
        pedido.fecha,
        pedido.hora,
        pedido.idCaja,
        `#${pedido.numeroMesa}`,
        pedido.numeroClientes,
        pedido.correoCliente,
        pedido.metodoPago,
        `${pedido.valorTotal}$`
      ];

      celdas.forEach(valor => {
        const td = document.createElement("td");
        td.textContent = valor;
        fila.appendChild(td);
      });

      // Acciones
      const tdAcciones = document.createElement("td");
      const divAcciones = document.createElement("div");
      divAcciones.classList.add("tablaAcciones");
      if (editar) {
        // Botón: Editar Pedido
        const btnEditarPedido = document.createElement("button");
        btnEditarPedido.id = "BotonEditarPedido";
        btnEditarPedido.value = pedido.id;
        btnEditarPedido.textContent = "Editar Pedido";
        btnEditarPedido.classList.add("boton");
        divAcciones.appendChild(btnEditarPedido);

        // Botón: Editar Platillos
        const btnEditarPlatillos = document.createElement("button");
        btnEditarPlatillos.id = "BotonEditarPlatillos";
        btnEditarPlatillos.value = pedido.id;
        btnEditarPlatillos.textContent = "Editar Platillos";
        btnEditarPlatillos.classList.add("boton");
        divAcciones.appendChild(btnEditarPlatillos);
      }


      // Botón: Ver Factura
      const btnVerFactura = document.createElement("button");
      btnVerFactura.textContent = "Ver Factura";
      btnVerFactura.classList.add("boton");
      btnVerFactura.id = "BotonVerFactura";
      btnVerFactura.value = pedido.id;
      btnVerFactura.dataset.idTotal = pedido.valorTotal;
      divAcciones.appendChild(btnVerFactura);

      // Botón: Pagar Factura
      const btnPagar = document.createElement("button");
      btnPagar.textContent = "Pagar Factura";
      btnPagar.classList.add("boton");
      btnPagar.id = "BotonFacturar";
      btnPagar.value = pedido.id;
      btnPagar.dataset.idMesa = pedido.numeroMesa;
      btnPagar.dataset.idTotal = pedido.valorTotal;
      divAcciones.appendChild(btnPagar);

      // Botón: Eliminar
      if (eliminar) {
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.classList.add("boton");
        btnEliminar.id = "BotonEliminarPedido";
        btnEliminar.value = pedido.id;
        btnEliminar.dataset.idMesa = pedido.numeroMesa;
        divAcciones.appendChild(btnEliminar);
      }

      tdAcciones.appendChild(divAcciones);
      fila.appendChild(tdAcciones);
      tablaSinFactura.appendChild(fila);
    }

    // ================== FACTURADOS ==================
    else if (pedido.facturado == "1" || (pedido.facturado == "1" && pedido.idReserva)) {
      if (pedido.eliminado != "1" || (pedido.eliminado == "1" && esAdmin)) {
        const fila = document.createElement("tr");

        const celdas = [
          pedido.id,
          pedido.fecha,
          pedido.hora,
          pedido.idCaja,
          `#${pedido.numeroMesa}`,
          pedido.numeroClientes,
          pedido.correoCliente,
          pedido.idReserva || "-",
          pedido.metodoPago,
          `${pedido.valorTotal}$`,
        ];
        if (listarEliminados) celdas.push(pedido.eliminado == "1" ? "Si" : "No");
        celdas.forEach(valor => {
          const td = document.createElement("td");
          td.textContent = valor;
          fila.appendChild(td);
        });

        // Acciones
        const tdAcciones = document.createElement("td");
        const divAcciones = document.createElement("div");
        divAcciones.classList.add("tablaAcciones");

        const btnVerFactura = document.createElement("button");
        btnVerFactura.textContent = "Ver Factura";
        btnVerFactura.classList.add("boton");
        btnVerFactura.id = "BotonVerFactura";
        btnVerFactura.value = pedido.id;

        divAcciones.append(btnVerFactura);
        if (eliminadoSuave) {

          const btnEliminadoSuave = document.createElement("button");
          btnEliminadoSuave.textContent = pedido.eliminado == "0" ? "Eliminado" : "Incluir";
          btnEliminadoSuave.classList.add("boton");
          btnEliminadoSuave.id = "EliminadoSuavePedido";
          btnEliminadoSuave.value = pedido.id;
          btnEliminadoSuave.dataset.idEliminado = pedido.eliminado;
          divAcciones.appendChild(btnEliminadoSuave)
        }

        tdAcciones.appendChild(divAcciones);
        fila.appendChild(tdAcciones);
        tablaFacturados.appendChild(fila);
      }
    }
  });

  if (contadorSinFactura == 0) {
    tituloSinFactura.style.display = "none";
    tablaSinFactura.style.display = "none";
  }

  const validarCrearPedido = async () => {
    let mesaSi = false;
    let cajaSi = false;

    const mesas = await api.get("mesas/verDisponible");
    const cajas = await api.get("caja/verDisponible");

    if (mesas.Ok) mesaSi = true;
    else if (mesas.Error) mesaSi = false;

    if (cajas.Ok) cajaSi = true;
    else if (cajas.Error) cajaSi = false;

    if (cajaSi && mesaSi) {
      window.location.href = "#/Pedido/Crear";
    } else if (!cajaSi && !mesaSi) {
      alertaWarning("No hay Cajas ni Mesas Disponibles, no se puede realizar pedido.");
    } else if (!cajaSi) {
      alertaWarning("No hay Cajas Disponibles, no se puede realizar pedido.");
    } else if (!mesaSi) {
      alertaWarning("No hay Mesas Disponibles, no se puede realizar pedido.");
    }
  }

  app.append(tituloSinFactura, tablaSinFactura, tituloFacturados, tablaFacturados);
  window.addEventListener("click", async (e) => {
    if (e.target.matches("#BotonCrearPedido")) validarCrearPedido();
    else if (e.target.matches("#BotonEditarPedido")) window.location.href = `#/Pedido/Editar/id=${e.target.value}`;
    else if (e.target.matches("#BotonEditarPlatillos")) window.location.href = `#/DetallePedido/Editar/id=${e.target.value}`;
    else if (e.target.matches("#BotonFacturar")) alertaOK("Pedido #" + e.target.value);
    else if (e.target.matches("#BotonVerFactura")) alertaOK("Pedido #" + e.target.value);
    else if (e.target.matches("#BotonCrearCliente")) window.location.href = `#/Pedido/CrearCliente`;
    else if (e.target.matches("#BotonVerificarCliente")) window.location.href = `#/Pedido/VerificarCliente`;
    else if (e.target.matches("#BotonEliminarPedido")) alertaOK("Pedido #" + e.target.value);
    else if (e.target.matches("#EliminadoSuavePedido")) alertaOK("Pedido #" + e.target.value);
  });
}