import { alertaOK, alertaError, alertaPregunta, alertaMensaje } from "./alertas.js";

const hash = window.location.hash.slice(1);
const section = document.querySelector(".main");

const cargarReservas = async () => {
  const botonVolver = document.getElementById("volver");
  botonVolver.action = `menu.html#${hash}`;
  const nuevoForm = document.createElement("form");
  nuevoForm.action = `reservaCrear.html#${hash}`;
  nuevoForm.method = "post";
  nuevoForm.innerHTML = `<button type="submit">Nuevo</button>`;
  section.appendChild(nuevoForm);

  const titulo = document.createElement("h2");
  titulo.textContent = "Reservas Activas";

  const tabla = document.createElement("table");
  const encabezados = [
    "ID", "Mesa", "Fecha", "Hora", "ID Caja",
    "Clientes","Id Reserva", "Nota", "Correo", "Método de Pago", "Acciones"
  ];

  const filaEncabezado = document.createElement("tr");
  encabezados.forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    filaEncabezado.appendChild(th);
  });
  tabla.appendChild(filaEncabezado);

  try {
    const res = await fetch("http://localhost:8080/ApiRestaurente/api/pedidos");
    const data = await res.json();

    data.forEach(pedido => {
      if (pedido.idReserva && pedido.valorTotal == 0) {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${pedido.id}</td>
          <td>${pedido.numeroMesa}</td>
          <td>${pedido.fecha || "-"}</td>
          <td>${pedido.hora || "-"}</td>
          <td>${pedido.idCaja || "-"}</td>
          <td>${pedido.numeroClientes || "-"}</td>
          <td>${pedido.idReserva || "-"}</td>
          <td>${pedido.nota || "-"}</td>
          <td>${pedido.correoCliente || "-"}</td>
          <td>${pedido.metodoPago || "-"}</td>
          <td>
            <form action="pedidoEditarReserva.html#${hash}/${pedido.id}" method="post">
              <button type="submit">Activar Reserva</button>
            </form>
            <form action="pedidoEditar.html#${hash}/${pedido.id}/r" method="post">
              <button type="submit">Editar Pedido</button>
            </form>
            <form action="detallePedidoEditar.html#${hash}/${pedido.id}/r" method="post">
              <button type="submit">Cambiar Platillos</button>
            </form>
            <button id="BotonCobrar" value="${pedido.id}" type="button">Cobrar</button>
            <button id="BotonBorrar" value="${pedido.id}" type="button">Eliminar</button>
          </td>
        `;
        tabla.appendChild(fila);
      }
    });

    section.append(titulo, tabla);
  } catch (error) {
    section.innerHTML = "<p>Error al cargar las reservas.</p>";
    console.error("Error:", error);
  }
};

const eliminarPedido = async (e) => {
    const id = e.target.value;
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
            await alertaOK(mensaje);
            location.reload();
        } catch (err) {
            alertaError(err.message);
        }
    }
};

const CobrarPedido = async (e) => {
    const id = e.target.value;
    const confirmacion = await alertaPregunta(`¿Desea cobrar el pedido #${id}?`);
    if (confirmacion.isConfirmed) {
        try {
            const res = await fetch(`http://localhost:8080/ApiRestaurente/api/pedidos/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const mensaje = await res.text();
            if (!res.ok) throw new Error(mensaje);
            await alertaOK(mensaje);
            location.reload();
        } catch (err) {
            alertaError(err.message);
        }
    }
};
document.addEventListener("DOMContentLoaded", cargarReservas);
window.addEventListener("click", (e) => {
    if (e.target.matches("#BotonBorrar")) eliminarPedido(e);
    if (e.target.matches("#BotonCobrar")) CobrarPedido(e);
});
