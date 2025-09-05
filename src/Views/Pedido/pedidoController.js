import {
  alertaError,
  alertaOK,
  alertaPregunta,
  alertaWarning,
  alertaMensaje,
} from "../../Helpers/alertas";
import * as api from "../../Helpers/api";
import validarPermiso from "../../Helpers/permisos";

export default async () => {
  const app = document.getElementById("app");

  const crear = validarPermiso("Pedido.crear");
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
    botonCliente.id = "BotonCrearClientePedido";
    botonCliente.textContent = "Crear Cliente";

    const botonVerificar = document.createElement("button");
    botonVerificar.classList.add("boton");
    botonVerificar.id = "BotonVerificarClientePedido";
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
    "ID",
    "Fecha",
    "Hora",
    "ID Caja",
    "No.Mesa",
    "No.Clientes",
    "CC.Cliente",
    "Nombre Cliente",
    "Reserva",
    "Método de Pago",
    "Total",
  ];
  listarEliminados
    ? encabezadosFacturados.push("Eliminado", "Acciones")
    : encabezadosFacturados.push("Acciones");
  const encabezadosSinFactura = [
    "ID",
    "Fecha",
    "Hora",
    "ID Caja",
    "No.Mesa",
    "No.Clientes",
    "CC.Cliente",
    "Nombre Cliente",
    "Reserva",
    "Método de Pago",
    "Total",
    "Acciones",
  ];

  // Crear encabezados
  const crearEncabezado = (lista) => {
    const fila = document.createElement("tr");
    lista.forEach((text) => {
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

  data.forEach((pedido) => {
    // ================== SIN FACTURAR ==================
    console.log(pedido);
    if (pedido.facturado == "0" && pedido.metodoPago && pedido.idCaja) {
      contadorSinFactura++;
      const fila = document.createElement("tr");
    
      const celdas = [
        pedido.id,
        pedido.fecha,
        pedido.hora,
        pedido.idCaja,
        `#${pedido.numeroMesa}`,
        pedido.numeroClientes,
        pedido.cedulaUsuario,
        pedido.nombreApellidoCliente,
        pedido.idReserva || "-",
        pedido.metodoPago,
        `${pedido.valorTotal}$`,
      ];

      celdas.forEach((valor) => {
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
        btnEditarPlatillos.id = "BotonEditarPlatillosPedido";
        btnEditarPlatillos.value = pedido.id;
        btnEditarPlatillos.textContent = "Editar Platillos";
        btnEditarPlatillos.classList.add("boton");
        divAcciones.appendChild(btnEditarPlatillos);
      }

      // Botón: Ver Factura
      const btnVerFactura = document.createElement("button");
      btnVerFactura.textContent = "Ver Factura";
      btnVerFactura.classList.add("boton");
      btnVerFactura.id = "BotonVerFacturaPedido";
      btnVerFactura.value = pedido.id;
      btnVerFactura.dataset.idTotal = pedido.valorTotal;
      divAcciones.appendChild(btnVerFactura);

      // Botón: Pagar Factura
      const btnPagar = document.createElement("button");
      btnPagar.textContent = "Pagar Factura";
      btnPagar.classList.add("boton");
      btnPagar.id = "BotonFacturarPedido";
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
    else if (
      pedido.facturado == "1") {
      if (listarEliminados && pedido.eliminado == "1" || pedido.eliminado == "0") {
        const fila = document.createElement("tr");

        const celdas = [
          pedido.id,
          pedido.fecha,
          pedido.hora,
          pedido.idCaja,
          `#${pedido.numeroMesa}`,
          pedido.numeroClientes,
          pedido.cedulaUsuario,
          pedido.nombreApellidoCliente,
          pedido.idReserva || "-",
          pedido.metodoPago,
          `${pedido.valorTotal}$`,
        ];
        if (listarEliminados)
          celdas.push(pedido.eliminado == "1" ? "Si" : "No");
        celdas.forEach((valor) => {
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
        btnVerFactura.id = "BotonVerFacturaPedido";
        btnVerFactura.value = pedido.id;

        divAcciones.append(btnVerFactura);
        if (eliminadoSuave) {
          const btnEliminadoSuave = document.createElement("button");
          btnEliminadoSuave.textContent =
            pedido.eliminado == "0" ? "Eliminado" : "Incluir";
          btnEliminadoSuave.classList.add("boton");
          btnEliminadoSuave.id = "EliminadoSuavePedido";
          btnEliminadoSuave.value = pedido.id;
          btnEliminadoSuave.dataset.idEliminado = pedido.eliminado;
          divAcciones.appendChild(btnEliminadoSuave);
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
      alertaWarning(
        "No hay Cajas ni Mesas Disponibles, no se puede realizar pedido."
      );
    } else if (!cajaSi) {
      alertaWarning("No hay Cajas Disponibles, no se puede realizar pedido.");
    } else if (!mesaSi) {
      alertaWarning("No hay Mesas Disponibles, no se puede realizar pedido.");
    }
  };

  const eliminarPedido = async (e) => {
    const id = e.target.value;
    const mesa = e.target.dataset.idMesa;
    const confirmacion = await alertaPregunta(
      `¿Desea eliminar el pedido #${id}?`
    );
    if (confirmacion.isConfirmed) {
      const eliminacionPedido = await api.del(`pedidos/${id}`);
      if (eliminacionPedido.Ok) {
        cambiarEstado(mesa);
        await alertaOK(eliminacionPedido.Ok);
        const fila = e.target.parentElement.parentElement.parentElement;
        const padreTabla = fila.parentElement;
        fila.remove();
        const cantidadTabla = padreTabla.querySelectorAll("tr").length;
        if (cantidadTabla == 1) {
          const padrePadre = padreTabla.parentElement;
          const parrafos = padrePadre.querySelectorAll("p");
          const pCaja = Array.from(parrafos).find(
            (el) => el.textContent.trim() === "Pedidos Sin Facturar"
          );
          pCaja.remove();
          padreTabla.remove();
        }
      } else if (eliminacionPedido.Error) {
        await alertaError(eliminacionPedido.Error);
      }
    }
  };

  const VerFacturaPedido = async (e) => {
    const total = parseFloat(e.target.dataset.idTotal);
    if (total == 0)
      return await alertaError(
        "Error: no se puede mostrar factura porque no tiene ningun pedido."
      );
    try {
      const idPedido = e.target.value;
      const pedido = await api.get(`pedidos/${idPedido}`);
      const caja = await api.get(`caja/${pedido.idCaja}`);
      const detalle = await api.get(`detallePedido/${idPedido}`);
      const comidas = await api.get("comidas")
      const bebidas = await api.get("bebidas")
      const cocteles = await api.get("cocteles")

      const buscarPrecioNombre = (id, lista) => {
        const item = lista.find((i) => i.id == id);
        return item
          ? { nombre: item.nombre, precio: parseInt(item.precio) }
          : { nombre: "???", precio: 0 };
      };

      let cuerpoFactura = "";
      let subtotal = parseInt(pedido.valorTotal);

      detalle.forEach((item) => {
        if (item.id_comida) {
          const { nombre, precio } = buscarPrecioNombre(
            item.id_comida,
            comidas
          );
          let total = precio * item.cantidad_comida;

          // Nota comida (si existe)
          const nota = item.nota_comida ? `\n  Nota: ${item.nota_comida}` : "";

          cuerpoFactura += `${item.cantidad_comida} x ${nombre.padEnd(
            25
          )} $${total.toLocaleString()}${nota}\n`;
        }
        if (item.id_bebida) {
          const { nombre, precio } = buscarPrecioNombre(
            item.id_bebida,
            bebidas
          );
          let total = precio * item.cantidad_bebida;

          // Nota bebida (si existe)
          const nota = item.nota_bebida ? `\n  Nota: ${item.nota_bebida}` : "";

          cuerpoFactura += `${item.cantidad_bebida} x ${nombre.padEnd(
            25
          )} $${total.toLocaleString()}${nota}\n`;
        }
        if (item.id_coctel) {
          const { nombre, precio } = buscarPrecioNombre(
            item.id_coctel,
            cocteles
          );
          let total = precio * item.cantidad_coctel;

          // Nota coctel (si existe)
          const nota = item.nota_coctel ? `\n  Nota: ${item.nota_coctel}` : "";

          cuerpoFactura += `${item.cantidad_coctel} x ${nombre.padEnd(
            25
          )} $${total.toLocaleString()}${nota}\n`;
        }
      });

      let total = parseInt(pedido.valorTotal);
      let textoReserva = "";

      if (pedido.idReserva) {
        const reserva = await api.get(`reservas/${pedido.idReserva}`);
        total = subtotal + parseInt(reserva.precio);
        textoReserva = `Reserva:                   $${parseInt(
          reserva.precio
        ).toLocaleString()}\n`;
      }

      const factura = `"QuickOrder"
Fecha: ${pedido.fecha}
Hora: ${pedido.hora}
Mesa: ${pedido.numeroMesa}
Cajero: ${caja.nombreApellidoTrabajador}
CC.Cliente: ${pedido.cedulaUsuario}
Cliente: ${pedido.nombreApellidoCliente}
------------------------------------
${cuerpoFactura}------------------------------------
Subtotal:                  $${subtotal.toLocaleString()}
${textoReserva}TOTAL A PAGAR:             $${total.toLocaleString()}
Método de pago: ${pedido.metodoPago.toUpperCase()}
------------------------------------`;

      await alertaMensaje(factura);
    } catch (error) {
      await alertaMensaje("Error al generar factura:", error);
    }
  };

  const facturar = async (e) => {
    const id = e.target.value;
    const mesa = e.target.dataset.idMesa;
    const total = parseFloat(e.target.dataset.idTotal);
    if (total == 0)
      return await alertaError("Error: no se puede facturar con Total 0$");
    const confirmacion = await alertaPregunta(
      `¿Desea facturar el pedido #${id}?`
    );
    if (confirmacion.isConfirmed) {
      const facturacion = await api.patch(`pedidos/facturar/${id}`);
      if (facturacion.Ok) {
        cambiarEstado(mesa);
        await alertaOK(facturacion.Ok);
        const fila = e.target.parentElement.parentElement.parentElement;
        const padreTabla = fila.parentElement;
        fila.remove();
        const cantidadTabla = padreTabla.querySelectorAll("tr").length;
        if (cantidadTabla == 1) {
          const padrePadre = padreTabla.parentElement;
          const parrafos = padrePadre.querySelectorAll("p");
          const pCaja = Array.from(parrafos).find(
            (el) => el.textContent.trim() === "Pedidos Sin Facturar"
          );
          pCaja.remove();
          padreTabla.remove();
          location.reload();
        }
      } else if (facturacion.Error) {
        await alertaError(facturacion.Error);
      }
    }
  };
  const cambiarEstado = async (id) => {
    const disponibles = { disponible: "1" };
    await api.patch(`mesas/${id}`, disponibles);
  };
  const eliminadoSuavePedido = async (e) => {
    console.log(e.target);
    const id = e.target.value;
    const eliminado = e.target.dataset.idEliminado;
    if (eliminado == "0") {
      const eliminadoSuaveSi = await api.patch(`pedidos/eliminadosi/${id}`);
      if (eliminadoSuaveSi.Ok) {
        await alertaOK(eliminadoSuaveSi.Ok);
        e.target.dataset.idEliminado = "1";
        e.target.textContent = "Incluir";
        let padre = e.target.parentElement.parentElement.parentElement;
        let textoEliminado = padre.querySelector(":nth-last-child(2)");
        textoEliminado.textContent = "Si";
      }
      if (eliminadoSuaveSi.Error) {
        await alertaOK(eliminadoSuaveSi.Error);
      }
    } else if (eliminado == "1") {
      const eliminadoSuaveNo = await api.patch(`pedidos/eliminadono/${id}`);
      if (eliminadoSuaveNo.Ok) {
        await alertaOK(eliminadoSuaveNo.Ok);
        e.target.dataset.idEliminado = "0";
        e.target.textContent = "Eliminado";
        let padre = e.target.parentElement.parentElement.parentElement;
        let textoEliminado = padre.querySelector(":nth-last-child(2)");
        textoEliminado.textContent = "No";
      }
      if (eliminadoSuaveNo.Error) {
        await alertaOK(eliminadoSuaveNo.Error);
      }
    }
  };
  app.append(
    tituloSinFactura,
    tablaSinFactura,
    tituloFacturados,
    tablaFacturados
  );

  window.addEventListener("click", async (e) => {
    if (e.target.matches("#BotonCrearPedido")) validarCrearPedido();
    else if (e.target.matches("#BotonEditarPedido"))
      window.location.href = `#/Pedido/Editar/id=${e.target.value}`;
    else if (e.target.matches("#BotonEditarPlatillosPedido"))
      window.location.href = `#/DetallePedido/Editar/id=${e.target.value}`;
    else if (e.target.matches("#BotonFacturarPedido")) facturar(e);
    else if (e.target.matches("#BotonVerFacturaPedido")) VerFacturaPedido(e);
    else if (e.target.matches("#BotonCrearClientePedido"))
      window.location.href = `#/Pedido/CrearCliente`;
    else if (e.target.matches("#BotonVerificarClientePedido"))
      window.location.href = `#/Pedido/VerificarCliente`;
    else if (e.target.matches("#BotonEliminarPedido")) eliminarPedido(e);
    else if (e.target.matches("#EliminadoSuavePedido")) eliminadoSuavePedido(e);
  });
};
