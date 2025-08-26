// Importa funciones de alertas y de header
import { alertaOK, alertaError, alertaPregunta, alertaMensaje } from "../alertas.js";
import { cargarHeader } from "../header.js";

// Extrae el hash de la URL (#usuario, #admin, etc.)
const hash = window.location.hash.slice(1);
const section = document.querySelector(".main");

// ----------------------
// CARGAR RESERVAS
// ----------------------
const cargarReservas = async () => {
  // Botón "volver" al menú principal
  const botonVolver = document.getElementById("volver");
  botonVolver.action = `../menu.html#${hash}`;

  // Botón "nuevo" para crear una reserva
  const nuevoForm = document.createElement("form");
  nuevoForm.action = `reservaCrear.html#${hash}`;
  nuevoForm.method = "post";
  nuevoForm.classList.add("botonTabla")
  nuevoForm.innerHTML = `<button class="boton" type="submit">Nuevo</button>`;
  section.appendChild(nuevoForm);

  // Títulos de tablas
  const titulo = document.createElement("h2");
  titulo.textContent = "Reservas Actuales";  // reservas aún no activas
  titulo.classList.add("tituloTable");

  const tituloActivos = document.createElement("h2");
  tituloActivos.textContent = "Reservas Activas"; // ya con caja y mesa
  tituloActivos.classList.add("tituloTable");

  // Tablas
  const tabla = document.createElement("table");
  tabla.classList.add("tablas");

  const tablaActivos = document.createElement("table");
  tablaActivos.classList.add("tablas");

  // Encabezados tabla reservas
  const encabezados = [
    "ID", "Correo Cliente", "No.Mesa", "Cantidad", "Fecha",
    "Hora", "Acciones"
  ];

  // Encabezados tabla reservas activas
  const encabezadosActivos = [
    "ID", "Fecha", "Hora", "ID Caja", "No.Mesa",
    "No.Clientes", "Cli.Correo", "ID Reserva", "Método de Pago", "Total", "Acciones"
  ];

  // Crear encabezado de cada tabla
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

  // Contadores para ocultar tablas si no hay registros
  let contador = 0;
  let contadorActivos = 0;

  try {
    // Fetch pedidos y reservas
    const resPedidos = await fetch("http://localhost:8080/ApiRestaurente/api/pedidos");
    const pedidos = await resPedidos.json();

    const resReservas = await fetch("http://localhost:8080/ApiRestaurente/api/reservas");
    const reservas = await resReservas.json();

    // Recorre pedidos y separa en "actuales" o "activos"
    pedidos.forEach(pedido => {
      // Reservas pendientes (sin caja, no facturadas)
      if (pedido.facturado == "0" && !pedido.idCaja) {
        const reserva = reservas.find(r => r.id === pedido.idReserva);
        if (reserva) {
          contador++;
          // Crear fila en la tabla de reservas actuales
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
            <button class="boton" data-id-reserva="${pedido.idReserva}" id="BotonEliminar" value="${pedido.id}" type="button">Eliminar</button>
          </div>
          </td>
      `;
          tabla.appendChild(fila);
        }
      }
      // Reservas activas (ya tienen caja, mesa asignada, pero no facturadas)
      else if (pedido.facturado == "0" && pedido.idCaja && pedido.idReserva) {
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
            <button class="boton" id="VerFactura" value="${pedido.id}" data-id-total="${pedido.valorTotal}" type="button">Ver Factura</button>
            <button class="boton" data-id-mesa="${pedido.numeroMesa}" data-id-total="${pedido.valorTotal}" id="Facturar" value="${pedido.id}" type="button">Pagar Factura</button>
            <button class="boton" data-id-reserva="${pedido.idReserva}" data-id-mesa="${pedido.numeroMesa}" id="BotonEliminar" value="${pedido.id}"  type="button">Eliminar</button>
          </div>
        </td>
      `;
        tablaActivos.appendChild(fila);
      }
    });

    // Ocultar tabla si no hay registros
    if (contador == 0) {
      titulo.style.display = "none";
      tabla.style.display = "none";
    }
    if (contadorActivos == 0) {
      tituloActivos.style.display = "none";
      tablaActivos.style.display = "none";
    }

    // Agregar tablas al DOM
    section.append(titulo, tabla, tituloActivos, tablaActivos);

    // Si no hay nada en ambas → mostrar mensaje
    if (contador == 0 && contadorActivos == 0) {
      const tituloNada = document.createElement("h2");
      tituloNada.textContent = "No hay reservas...";
      tituloNada.classList.add("tituloTable");
      section.append(tituloNada)
    }
  } catch (error) {
    // En caso de error en fetch
    section.innerHTML = "<p>Error al cargar los datos.</p>";
    console.error("Error:", error);
  }
};

// ----------------------
// ELIMINAR PEDIDO
// ----------------------
const eliminarPedido = async (e) => {
  const id = e.target.value;                  // id del pedido
  const mesa = e.target.dataset.idMesa;       // mesa asociada
  const reserva = e.target.dataset.idReserva; // reserva asociada
  const confirmacion = await alertaPregunta(`¿Desea eliminar el pedido #${id}?`);
  if (confirmacion.isConfirmed) {
    try {
      // Elimina pedido
      const res = await fetch(`http://localhost:8080/ApiRestaurente/api/pedidos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const mensaje = await res.text();
      if (!res.ok) throw new Error(mensaje);

      // Liberar mesa si tiene
      if (mesa) {
        await cambiarEstado(mesa);
      }

      // Eliminar reserva asociada
      await eliminarReserva(reserva);

      await alertaOK(mensaje);
      location.reload(); // refrescar página
    } catch (err) {
      alertaError(err.message);
    }
  }
};

// ----------------------
// VER FACTURA (mostrar ticket)
// ----------------------
const VerFactura = async (e) => {
    const total = parseFloat(e.target.dataset.idTotal);
    if (total == 0) return await alertaError("Error: no se puede mostrar factura porque no tiene ningun pedido.");
    try {
        const idPedido = e.target.value;

        // Obtener datos del pedido (trae valorTotal, fecha, hora, mesa, idReserva, etc.)
        const resPedido = await fetch(`http://localhost:8080/ApiRestaurente/api/pedidos/${idPedido}`);
        const pedido = await resPedido.json();

        // Obtener detalle del pedido (este endpoint ya trae comidas, bebidas, cocteles con precios y notas)
        const resDetalle = await fetch(`http://localhost:8080/ApiRestaurente/api/detallePedido/pedido/${idPedido}`);
        const data = await resDetalle.json();
        
        let caja = pedido.idCaja;

        const cajeroDetalle = await fetch(`http://localhost:8080/ApiRestaurente/api/caja/${caja}`);
        const cajaDatos = await cajeroDetalle.json();
        
        let cajero = cajaDatos.nombreCajero;

        let cuerpoFactura = "";
        let subtotal = parseInt(pedido.valorTotal);
        //Recorremos el detalle y construimos las líneas de la factura
        data.forEach(item => {
            if (item.id_comida) {
                let valoresComida = item.cantidad_comida.split("/");
                let total = valoresComida[0] * valoresComida[1];
                const nota = item.nota_comida ? `\n  Nota: ${item.nota_comida}` : "";
                cuerpoFactura += `${valoresComida[0]} x ${item.id_comida.padEnd(25)} $${total.toLocaleString()}${nota}\n`;
            }
            if (item.id_bebida) {
                let valoresBebidas = item.cantidad_bebida.split("/");
                let total = valoresBebidas[0] * valoresBebidas[1];
                const nota = item.nota_bebida ? `\n  Nota: ${item.nota_bebida}` : "";
                cuerpoFactura += `${valoresBebidas[0]} x ${item.id_bebida.padEnd(25)} $${total.toLocaleString()}${nota}\n`;
            }
            if (item.id_coctel) {
                let valoresCoctel = item.cantidad_coctel.split("/");
                let total = valoresCoctel[0] * valoresCoctel[1];
                const nota = item.nota_coctel ? `\n  Nota: ${item.nota_coctel}` : "";
                cuerpoFactura += `${valoresCoctel[0]} x ${item.id_coctel.padEnd(25)} $${total.toLocaleString()}${nota}\n`;
            }
        });

        //Calculamos el total (considerando la reserva si existe)
        let total = subtotal;
        let textoReserva = "";
        if (pedido.idReserva) {
            // Hacemos un fetch de la reserva porque el pedido solo tiene el id
            const resReserva = await fetch(`http://localhost:8080/ApiRestaurente/api/reservas/${pedido.idReserva}`);
            const reserva = await resReserva.json();
            total = subtotal + parseInt(reserva.precio);
            textoReserva = `Reserva:                   $${parseInt(reserva.precio).toLocaleString()}\n`;
        }

        //Construimos el texto final de la factura
        const factura =
            `"QuickOrder"
Fecha: ${pedido.fecha}
Hora: ${pedido.hora}
Mesa: ${pedido.numeroMesa}
Atendido por: ${cajero}
------------------------------------
${cuerpoFactura}------------------------------------
Subtotal:                  $${subtotal.toLocaleString()}
${textoReserva}TOTAL A PAGAR:             $${total.toLocaleString()}
Método de pago: ${pedido.metodoPago.toUpperCase()}
------------------------------------
¡Gracias por su visita!`;

        // Mostramos factura en alerta
        await alertaMensaje(factura);
    } catch (error) {
        await alertaMensaje("Error al generar factura: " + error.message);
    }
};

// ----------------------
// FACTURAR (pagar)
// ----------------------
const facturar = async (e) => {
  const id = e.target.value;
  const mesa = e.target.dataset.idMesa;
  const total = parseFloat(e.target.dataset.idTotal);

  if (total == 0) return await alertaError("Error: no se puede facturar con Total 0$");

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

      // Liberar mesa al facturar
      await cambiarEstado(mesa)

      await alertaOK(mensaje);
      location.reload();
    } catch (err) {
      alertaError(err.message);
    }
  }
};

// ----------------------
// CAMBIAR ESTADO DE MESA
// ----------------------
const cambiarEstado = async (id) => {
  try {
    const disponibles = { disponible: "1" }; // la mesa vuelve a estar disponible
    const respuesta = await fetch(`http://localhost:8080/ApiRestaurente/api/mesas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(disponibles)
    });

    if (!respuesta.ok) throw new Error("Error al cambiar el estado");
    const resultado = await respuesta.text();
    console.log(resultado);
  } catch (error) {
    console.error("Falló el cambio de estado:", error);
  }
}

// ----------------------
// ELIMINAR RESERVA
// ----------------------
const eliminarReserva = async (id) => {
  try {
    const respuesta = await fetch(`http://localhost:8080/ApiRestaurente/api/reservas/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!respuesta.ok) throw new Error("Error al cambiar el estado");
    const resultado = await respuesta.text();
    console.log(resultado);
  } catch (error) {
    console.log("Falló el borrado de Reserva", error);
  }
}

// ----------------------
// EVENTOS
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
  cargarHeader(hash);   // Cargar encabezado según hash
  cargarReservas();     // Mostrar reservas
});

window.addEventListener("click", (e) => {
  // Delegación de eventos para botones
  if (e.target.matches("#BotonEliminar")) eliminarPedido(e);
  if (e.target.matches("#VerFactura")) VerFactura(e);
  if (e.target.matches("#Facturar")) facturar(e);
});
