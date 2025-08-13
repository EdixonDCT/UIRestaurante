import { alertaOK, alertaError, alertaPregunta, alertaMensaje } from "../alertas.js";
import { cargarHeader } from "../header.js";

const hash = window.location.hash.slice(1);
const section = document.querySelector(".main");

const cargarPedidos = async () => {
    const botonVolver = document.getElementById("volver");
    botonVolver.action = `../menu.html#${hash}`;

    const nuevoForm = document.createElement("form");
    nuevoForm.action = `pedidoCrear.html#${hash}`;
    nuevoForm.innerHTML = `<button class="boton" type="submit">Nuevo</button>`;
    nuevoForm.method = "post";
    nuevoForm.classList.add("botonTabla")
    section.appendChild(nuevoForm);

    const tituloIncompletos = document.createElement("h2");
    const tablaIncompletos = document.createElement("table");
    const tituloCompletos = document.createElement("h2");
    const tablaCompletos = document.createElement("table");

    tituloIncompletos.textContent = "Pedidos no Facturados";
    tituloCompletos.textContent = "Pedidos Facturados";
    tituloCompletos.classList.add("tituloTable");
    tituloIncompletos.classList.add("tituloTable");
    const encabezados = [
        "ID","Fecha", "Hora","ID Caja","No.Mesa",
        "No.Clientes","Cli.Correo","Reserva", "Método de Pago","Total","Eliminado","Acciones"
    ];

    const encabezadosIncompleto = [
        "ID","Fecha", "Hora", "ID Caja","No.Mesa",
        "No.Clientes","Cli.Correo", "Método de Pago","Total", "Acciones"
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
    tablaIncompletos.classList.add("tablas");
    tablaCompletos.classList.add("tablas");
    try {
        const res = await fetch("http://localhost:8080/ApiRestaurente/api/pedidos");
        const data = await res.json();
      let contadorNoFacturado = 0;
      data.forEach(pedido => {
        if (pedido.facturado == "0" && !pedido.idReserva)
          {
                contadorNoFacturado++
                const fila = document.createElement("tr");
                fila.innerHTML = `
                <td>${pedido.id}</td>
                <td>${pedido.fecha}</td>
                <td>${pedido.hora}</td>
                <td>${pedido.idCaja}</td>
                <td>#${pedido.numeroMesa}</td>
                <td>${pedido.numeroClientes}</td>
                <td>${pedido.correoCliente}</td>
                <td>${pedido.valorTotal}$</td>
                <td>${pedido.metodoPago}</td>
                <td>
                    <div class="tablaAcciones">
                    <form action="pedidoEditar.html#${hash}/${pedido.id}/pe" method="post">
                        <input type="hidden" name="id" value="${pedido.id}">
                        <button class="boton" type="submit">Editar Pedido</button>
                    </form>
                    <form action="../detallePedidos/detallePedidoEditar.html#${hash}/${pedido.id}/p" method="post">
                        <input type="hidden" name="id" value="${pedido.id}">
                        <button class="boton" type="submit">Editar Platillos</button>
                    </form>
                    <button class="boton" id="VerFactura" value="${pedido.id}" type="button">Ver Factura</button>
                    <button class="boton" data-id-mesa="${pedido.numeroMesa}" id="Facturar" value="${pedido.id}" type="button">Pagar Factura</button>
                    <button class="boton" data-id-mesa="${pedido.numeroMesa}" id="BotonEliminar" value="${pedido.id}"  type="button">Eliminar</button>
                    </div>
                </td>
            `;
                tablaIncompletos.appendChild(fila);
            }
            else if(pedido.facturado == "1" || pedido.facturado == "1" && pedido.idReserva){
                const fila = document.createElement("tr");
                fila.innerHTML = `
                <td>${pedido.id}</td>
                <td>${pedido.fecha}</td>
                <td>${pedido.hora}</td>
                <td>${pedido.idCaja}</td>
                <td>#${pedido.numeroMesa}</td>
                <td>${pedido.numeroClientes}</td>
                <td>${pedido.correoCliente}</td>
                <td>${pedido.idReserva || "-"}</td>
                <td>${pedido.metodoPago}</td>
                <td>${pedido.valorTotal}$</td>
                <td>${pedido.eliminado == "1" ? "Si" : "No"}</td>
                <td>
                <div class="tablaAcciones">
                    <button class="boton" id="VerFactura" value="${pedido.id}" type="button">Ver Factura</button>
                    <button class="boton" id="EliminadoSuave" data-id-eliminado="${pedido.eliminado}" value="${pedido.id}" type="button">${pedido.eliminado == "0" ? "Eliminado" : "Incluir"}</button>
                </div>
                </td>
            `;
                tablaCompletos.appendChild(fila);
            }
        });
        if (contadorNoFacturado == 0)
        {
          tituloIncompletos.style.display = "none";
          tablaIncompletos.style.display = "none";
        }
        section.append(tituloIncompletos, tablaIncompletos, tituloCompletos, tablaCompletos);
    } catch (error) {
        section.innerHTML = "<p>Error al cargar los pedidos.</p>";
        console.error("Error:", error);
    }
};

const eliminarPedido = async (e) => {
    const id = e.target.value;
    const mesa= e.target.dataset.idMesa;
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
            await cambiarEstado(mesa)
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
    const mesa= e.target.dataset.idMesa;
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
const EliminadoSuave = async (e) =>
{
    const id = e.target.value;
    const eliminado= e.target.dataset.idEliminado;
    if (eliminado == "0")
    {
        try {
        const respuesta = await fetch(`http://localhost:8080/ApiRestaurente/api/pedidos/eliminadosi/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
        });
        const resultado = await respuesta.text();
        if (!respuesta.ok) throw new Error(resultado);
        await alertaOK(resultado)
        location.reload();
    } catch (error) {
        await alertaError(error.message);
        location.reload();
    }
    }
    else if (eliminado == "1")
    {
        try {
        const respuesta = await fetch(`http://localhost:8080/ApiRestaurente/api/pedidos/eliminadono/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
        });
        const resultado = await respuesta.text();
        if (!respuesta.ok) throw new Error(resultado);
        await alertaOK(resultado)
        location.reload();
    } catch (error) {
        await alertaError(error.message);
    }
    }
    
}
document.addEventListener("DOMContentLoaded", () => {
  cargarHeader(hash);
  cargarPedidos();
});
window.addEventListener("click", (e) => {
    if (e.target.matches("#BotonEliminar")) eliminarPedido(e);
    if (e.target.matches("#VerFactura")) VerFactura(e);
    if (e.target.matches("#Facturar")) facturar(e);
    if (e.target.matches("#EliminadoSuave")) EliminadoSuave(e);
});
