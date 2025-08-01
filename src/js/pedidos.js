import { alertaOK, alertaError, alertaPregunta } from "./alertas.js";

const hash = window.location.hash.slice(1);
const section = document.querySelector(".main");

const cargarPedidos = async () => {
    const botonVolver = document.getElementById("volver");
    botonVolver.action = `menu.html#${hash}`;

      const nuevoForm = document.createElement("form");
  nuevoForm.action = `clienteCrear.html#${hash}`;
  nuevoForm.innerHTML = `<button type="submit">Nuevo</button>`;
  section.appendChild(nuevoForm);

    const tituloIncompletos = document.createElement("h2");
    const tablaIncompletos = document.createElement("table");
    const tituloCompletos = document.createElement("h2");
    const tablaCompletos = document.createElement("table");

    tituloIncompletos.textContent = "Pedidos Incompletos";
    tituloCompletos.textContent = "Pedidos Completos";

    const encabezados = [
        "ID", "Mesa", "Fecha", "Hora", "Total", "ID Caja",
        "Clientes", "Reserva", "Nota", "Correo", "Método de Pago", "Acciones"
    ];

    const encabezadosIncompleto = [
        "ID", "Mesa", "Fecha", "Hora", "ID Caja",
        "Clientes", "Nota", "Correo", "Método de Pago", "Acciones"
    ];
    const crearEncabezado = () => {
        const fila = document.createElement("tr");
        encabezados.forEach(text => {
            const th = document.createElement("th");
            th.textContent = text;
            fila.appendChild(th);
        });
        return fila;
    };
    const crearEncabezadoIncompleto = () => {
        const fila = document.createElement("tr");
        encabezadosIncompleto.forEach(text => {
            const th = document.createElement("th");
            th.textContent = text;
            fila.appendChild(th);
        });
        return fila;
    };
    tablaIncompletos.appendChild(crearEncabezadoIncompleto());
    tablaCompletos.appendChild(crearEncabezado());

    try {
        const res = await fetch("http://localhost:8080/ApiRestaurente/api/pedidos");
        const data = await res.json();

        data.forEach(pedido => {
            if (!pedido.idReserva && pedido.valorTotal == 0) {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                <td>${pedido.id}</td>
                <td>${pedido.numeroMesa}</td>
                <td>${pedido.fecha}</td>
                <td>${pedido.hora}</td>
                <td>${pedido.idCaja}</td>
                <td>${pedido.numeroClientes}</td>
                <td>${pedido.nota || "-"}</td>
                <td>${pedido.correoCliente || "-"}</td>
                <td>${pedido.metodoPago || "-"}</td>
                <td>
                    <form action="pedidoEditar.html#${hash}/${pedido.id}" method="post">
                        <input type="hidden" name="id" value="${pedido.id}">
                        <button type="submit">Editar Pedido</button>
                    </form>
                    <form action="pedidoPlatos.html#${hash}/${pedido.id}" method="post">
                        <input type="hidden" name="id" value="${pedido.id}">
                        <button type="submit">Editar Platos</button>
                    </form>
                    <button id="Pagar" value="${pedido.id}" type="button">Pagar</button>

                    
                </td>
            `;
                tablaIncompletos.appendChild(fila);
            }
            else {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                <td>${pedido.id}</td>
                <td>${pedido.numeroMesa}</td>
                <td>${pedido.fecha}</td>
                <td>${pedido.hora}</td>
                <td>${pedido.valorTotal}$</td>
                <td>${pedido.idCaja}</td>
                <td>${pedido.numeroClientes}</td>
                <td>${pedido.idReserva}</td>
                <td>${pedido.nota || "-"}</td>
                <td>${pedido.correoCliente || "-"}</td>
                <td>${pedido.metodoPago || "-"}</td>
                <td>
                    <button id="VerFactura" value="${pedido.id}" type="button">Ver Factura</button>
                    <button id="BotonEliminar" value="${pedido.id}" type="button">Eliminar</button>

                </td>
            `;
                tablaCompletos.appendChild(fila);
            }
        });

        section.append(tituloIncompletos, tablaIncompletos, tituloCompletos, tablaCompletos);
    } catch (error) {
        section.innerHTML = "<p>Error al cargar los pedidos.</p>";
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

document.addEventListener("DOMContentLoaded", cargarPedidos);
window.addEventListener("click", (e) => {
    if (e.target.matches("#BotonEliminar")) eliminarPedido(e);
    if (e.target.matches("#BotonCobrar")) {
        const id = e.target.value;
        // Aquí puedes redirigir a una vista de cobro o mostrar algo tipo modal
        window.location.href = `pedidoCobrar.html#${hash}/${id}`;
    }
});
