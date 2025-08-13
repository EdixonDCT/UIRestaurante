import { alertaOK, alertaError, alertaPregunta, alertaMensaje } from "../alertas.js";
import { cargarHeader } from "../header.js";

const hash = window.location.hash.slice(1);
const section = document.querySelector(".main");

const cargarReservas = async () => {
  const botonVolver = document.getElementById("volver");
  botonVolver.action = `../menu.html#${hash}`;
  const nuevoForm = document.createElement("form");
  nuevoForm.action = `reservaCrear.html#${hash}`;
  nuevoForm.method = "post";
  nuevoForm.classList.add("botonTabla")
  nuevoForm.innerHTML = `<button class="boton" type="submit">Nuevo</button>`;
  section.appendChild(nuevoForm);

  const titulo = document.createElement("h2");
  titulo.textContent = "Reservas Actuales";
  titulo.classList.add("tituloTable");
  const tituloActivos = document.createElement("h2");
  tituloActivos.textContent = "Reservas Activas";
  tituloActivos.classList.add("tituloTable");
  const tabla = document.createElement("table");
  tabla.classList.add("tablas");
  const tablaActivos = document.createElement("table");
  tablaActivos.classList.add("tablas");
  const encabezados = [
    "ID", "Correo Cliente", "No.Mesa", "Cantidad", "Fecha",
    "Hora", "Acciones"
  ];
  const encabezadosActivos = [
    "ID", "Fecha", "Hora", "ID Caja", "No.Mesa",
    "No.Clientes", "Cli.Correo", "ID Reserva", "Método de Pago", "Total", "Acciones"
  ];
  const filaEncabezado = document.createElement("tr");
  encabezados.forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    filaEncabezado.appendChild(th);
  });
  const filaEncabezadoActivos = document.createElement("tr");
  encabezadosActivos.forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    filaEncabezadoActivos.appendChild(th);
  });
  tablaActivos.appendChild(filaEncabezadoActivos)
  tabla.appendChild(filaEncabezado);
  let contador = 0;
  let contadorActivos = 0;
  try {
    const resPedidos = await fetch("http://localhost:8080/ApiRestaurente/api/pedidos");
    const pedidos = await resPedidos.json();

    const resReservas = await fetch("http://localhost:8080/ApiRestaurente/api/reservas");
    const reservas = await resReservas.json();

    pedidos.forEach(pedido => {
      if (pedido.facturado == "0" && !pedido.idCaja) {
        const reserva = reservas.find(r => r.id === pedido.idReserva);
        if (reserva) {
          contador++;
          const fila = document.createElement("tr");
          fila.innerHTML = `
        <td>${pedido.id}</td>
        <td>${pedido.correoCliente}</td>
        <td>${pedido.numeroMesa}</td>
        <td>${reserva.cantidadTentativa}</td>
        <td>${reserva.fechaTentativa}</td>
        <td>${reserva.horaTentativa}</td>
        <td>
        <div class="tablaAcciones">
            <form action="reservaEditar.html#${hash}/${pedido.id}" method="post">
            <button class="boton" type="submit">Editar Reserva</button>
            </form>
            <form action="../pedidos/PedidoEditar.html#${hash}/${pedido.id}/rpe" method="post">
            <button class="boton" type="submit">Activar Reserva</button>
            </form>
            <button class="boton" data-id-reserva="${pedido.idReserva}" id="BotonBorrar" value="${pedido.id}" type="button">Eliminar</button>
          </div>
          </td>
      `;
          tabla.appendChild(fila);
        }
      }
      else if (pedido.facturado == "0" && pedido.idCaja) {
        contadorActivos++;
        const fila = document.createElement("tr");
        fila.innerHTML = `
        <td>${pedido.id}</td>
        <td>${pedido.fecha}</td>
        <td>${pedido.hora}</td>
        <td>${pedido.idCaja}</td>
        <td>#${pedido.numeroMesa}</td>
        <td>${pedido.numeroClientes}</td>
        <td>${pedido.correoCliente}</td>
        <td>${pedido.idReserva}</td>
        <td>${pedido.valorTotal}$</td>
        <td>${pedido.metodoPago}</td>
        <td>
          <div class="tablaAcciones">
            <form action="../pedidos/pedidoEditar.html#${hash}/${pedido.id}/repa" method="post">
            <input type="hidden" name="id" value="${pedido.id}">
            <button class="boton" type="submit">Editar Pedido</button>
          </form>
          <form action="../detallePedidos/detallePedidoEditar.html#${hash}/${pedido.id}/r" method="post">
            <input type="hidden" name="id" value="${pedido.id}">
            <button class="boton" type="submit">Editar Platillos</button>
          </form>
            <button class="boton" id="VerFactura" value="${pedido.id}" type="button">Ver Factura</button>
            <button class="boton" data-id-mesa="${pedido.numeroMesa}" id="Facturar" value="${pedido.id}" type="button">Pagar Factura</button>
            <button class="boton" data-id-reserva="${pedido.idReserva}" data-id-mesa="${pedido.numeroMesa}" id="BotonEliminar" value="${pedido.id}"  type="button">Eliminar</button>
          </div>
        </td>
      `;
        tablaActivos.appendChild(fila);
      }
    });
    if (contador == 0) {
      titulo.style.display = "none";
      tabla.style.display = "none";
    }
    if (contadorActivos == 0) {
      tituloActivos.style.display = "none";
      tablaActivos.style.display = "none";
    }
    section.append(titulo, tabla, tituloActivos, tablaActivos);
    if (contador == 0 && contadorActivos == 0) {
      const tituloNada = document.createElement("h2");
      tituloNada.textContent = "No hay reservas...";
      tituloNada.classList.add("tituloTable");
      section.append(tituloNada)
    }
  } catch (error) {
    section.innerHTML = "<p>Error al cargar los datos.</p>";
    console.error("Error:", error);
  }
};

const eliminarPedido = async (e) => {
  const id = e.target.value;
  const mesa = e.target.dataset.idMesa;
  const reserva = e.target.dataset.idReserva;
  const confirmacion = await alertaPregunta(`¿Desea eliminar el pedido #${id}?`);
  if (confirmacion.isConfirmed) {
    try {
      const res = await fetch(`http://localhost:8080/ApiRestaurente/api/pedidos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const mensaje = await res.text();
      if (!res.ok) throw new Error(mensaje);
      if (mesa)
      {
      await cambiarEstado(mesa)  
      }
      await eliminarReserva(reserva)
      await alertaOK(mensaje);
      location.reload();
    } catch (err) {
      alertaError(err.message);
    }
  }
};
const VerFactura = async (e) => {
  try {
    const idPedido = e.target.value;

    // 1. Obtener pedido
    const resPedido = await fetch(`http://localhost:8080/ApiRestaurente/api/pedidos/${idPedido}`);
    const pedido = await resPedido.json();

    // 2. Obtener caja
    const resCaja = await fetch(`http://localhost:8080/ApiRestaurente/api/caja/${pedido.idCaja}`);
    const caja = await resCaja.json();

    // 3. Obtener detalle del pedido
    const resDetalle = await fetch(`http://localhost:8080/ApiRestaurente/api/detallePedido/${idPedido}`);
    const detalle = await resDetalle.json();

    // 4. Obtener comidas
    const resComidas = await fetch(`http://localhost:8080/ApiRestaurente/api/comidas`);
    const comidas = await resComidas.json();

    // 5. Obtener bebidas
    const resBebidas = await fetch(`http://localhost:8080/ApiRestaurente/api/bebidas`);
    const bebidas = await resBebidas.json();

    // 6. Obtener cocteles
    const resCocteles = await fetch(`http://localhost:8080/ApiRestaurente/api/cocteles`);
    const cocteles = await resCocteles.json();

    // Función para buscar nombre y precio
    const buscarPrecioNombre = (id, lista) => {
      const item = lista.find(i => i.id == id);
      return item ? { nombre: item.nombre, precio: parseInt(item.precio) } : { nombre: "???", precio: 0 };
    };

    let cuerpoFactura = "";
    let subtotal = parseInt(pedido.valorTotal);

    detalle.forEach(item => {
      if (item.id_comida) {
        const { nombre, precio } = buscarPrecioNombre(item.id_comida, comidas);
        let total = precio * item.cantidad_comida;

        // Nota comida (si existe)
        const nota = item.nota_comida ? `\n  Nota: ${item.nota_comida}` : "";

        cuerpoFactura += `${item.cantidad_comida} x ${nombre.padEnd(25)} $${total.toLocaleString()}${nota}\n`;
      }
      if (item.id_bebida) {
        const { nombre, precio } = buscarPrecioNombre(item.id_bebida, bebidas);
        let total = precio * item.cantidad_bebida;

        // Nota bebida (si existe)
        const nota = item.nota_bebida ? `\n  Nota: ${item.nota_bebida}` : "";

        cuerpoFactura += `${item.cantidad_bebida} x ${nombre.padEnd(25)} $${total.toLocaleString()}${nota}\n`;
      }
      if (item.id_coctel) {
        const { nombre, precio } = buscarPrecioNombre(item.id_coctel, cocteles);
        let total = precio * item.cantidad_coctel;

        // Nota coctel (si existe)
        const nota = item.nota_coctel ? `\n  Nota: ${item.nota_coctel}` : "";

        cuerpoFactura += `${item.cantidad_coctel} x ${nombre.padEnd(25)} $${total.toLocaleString()}${nota}\n`;
      }
    });

    let total = parseInt(pedido.valorTotal);
    let textoReserva = "";

    if (pedido.idReserva) {
      const resReserva = await fetch(`http://localhost:8080/ApiRestaurente/api/reservas/${pedido.idReserva}`);
      const reserva = await resReserva.json();
      total = subtotal + parseInt(reserva.precio);
      textoReserva = `Reserva:                   $${parseInt(reserva.precio).toLocaleString()}\n`;
    }

    const factura =
      `"QuickOrder"
Fecha: ${pedido.fecha}
Hora: ${pedido.hora}
Mesa: ${pedido.numeroMesa}
Atendido por: ${caja.nombreCajero}
------------------------------------
${cuerpoFactura}------------------------------------
Subtotal:                  $${subtotal.toLocaleString()}
${textoReserva}TOTAL A PAGAR:             $${total.toLocaleString()}
Método de pago: ${pedido.metodoPago.toUpperCase()}
------------------------------------
¡Gracias por su visita!`;

    await alertaMensaje(factura);

  } catch (error) {
    await alertaMensaje("Error al generar factura:", error);
  }
};

const facturar = async (e) => {
  const id = e.target.value;
  const mesa = e.target.dataset.idMesa;
  const confirmacion = await alertaPregunta(`¿Desea facturar el pedido #${id}?`);
  if (confirmacion.isConfirmed) {
    try {
      const res = await fetch(`http://localhost:8080/ApiRestaurente/api/pedidos/facturar/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const mensaje = await res.text();
      if (!res.ok) throw new Error(mensaje);
      await cambiarEstado(mesa)
      await alertaOK(mensaje);
      location.reload();
    } catch (err) {
      alertaError(err.message);
    }
  }
};
const cambiarEstado = async (id) => {
  try {
    const disponibles = { disponible: "1" };
    const respuesta = await fetch(`http://localhost:8080/ApiRestaurente/api/mesas/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(disponibles)
    });

    if (!respuesta.ok) throw new Error("Error al cambiar el estado");
    const resultado = await respuesta.text();
    console.log(resultado);
  } catch (error) {
    console.error("Falló el cambio de estado:", error);
  }
}
const eliminarReserva = async (id) => {
  try {
    const respuesta = await fetch(`http://localhost:8080/ApiRestaurente/api/reservas/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      });

    if (!respuesta.ok) throw new Error("Error al cambiar el estado");
    const resultado = await respuesta.text();
    console.log(resultado);
  } catch (error) {
    console.log("Falló el borrado de Reserva", error);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  cargarHeader(hash);
  cargarReservas();
});
window.addEventListener("click", (e) => {
    if (e.target.matches("#BotonEliminar")) eliminarPedido(e);
    if (e.target.matches("#VerFactura")) VerFactura(e);
    if (e.target.matches("#Facturar")) facturar(e);
});
