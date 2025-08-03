import { alertaOK, alertaError, alertaPregunta, alertaMensaje } from "./alertas.js";

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
                    <form action="pedidoEditar.html#${hash}/${pedido.id}/p" method="post">
                        <input type="hidden" name="id" value="${pedido.id}">
                        <button type="submit">Editar Pedido</button>
                    </form>
                    <form action="detallePedidoEditar.html#${hash}/${pedido.id}/p" method="post">
                        <input type="hidden" name="id" value="${pedido.id}">
                        <button type="submit">Editar Platos</button>
                    </form>
                    <button id="BotonCobrar" value="${pedido.id}" type="button">Pagar</button>

                    
                </td>
            `;
                tablaIncompletos.appendChild(fila);
            }
            else if(pedido.valorTotal > 0){
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
                cuerpoFactura += `${item.cantidad_comida} x ${nombre.padEnd(25)} $${total.toLocaleString()}\n`;
            }
            if (item.id_bebida) {
                const { nombre, precio } = buscarPrecioNombre(item.id_bebida, bebidas);
                let total = precio * item.cantidad_bebida;
                cuerpoFactura += `${item.cantidad_bebida} x ${nombre.padEnd(25)} $${total.toLocaleString()}\n`;
            }
            if (item.id_coctel) {
                const { nombre, precio } = buscarPrecioNombre(item.id_coctel, cocteles);
                let total = precio * item.cantidad_coctel;
                cuerpoFactura += `${item.cantidad_coctel} x ${nombre.padEnd(25)} $${total.toLocaleString()}\n`;
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
            `FACTURACION RESTAURANTE
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

document.addEventListener("DOMContentLoaded", cargarPedidos);
window.addEventListener("click", (e) => {
    if (e.target.matches("#BotonEliminar")) eliminarPedido(e);
    if (e.target.matches("#BotonCobrar")) CobrarPedido(e);
    if (e.target.matches("#VerFactura")) VerFactura(e);
});
