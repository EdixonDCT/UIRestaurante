// Importamos las funciones de alertas necesarias desde el módulo "alertas.js"
import { alertaOK, alertaError, alertaPregunta, alertaMensaje } from "../alertas.js";
// Importamos la función para cargar el header desde el módulo "header.js"
import { cargarHeader } from "../header.js";

// Obtenemos el hash de la URL (después del #) quitando el símbolo #
const hash = window.location.hash.slice(1);
// Seleccionamos la sección principal donde se van a mostrar los pedidos
const section = document.querySelector(".main");
// Variable para saber si el usuario es administrador o no
let esAdmin = false;

// Función que carga los pedidos desde la API y los muestra en tablas
const cargarPedidos = async () => {
    // Configuramos el botón "volver" para regresar al menú
    const botonVolver = document.getElementById("volver");
    botonVolver.action = `../menu.html#${hash}`;

    // Creamos un formulario con un botón "Nuevo" para crear pedidos
    const nuevoForm = document.createElement("form");
    nuevoForm.action = `pedidoCrear.html#${hash}`;
    nuevoForm.innerHTML = `<button class="boton" type="submit">Nuevo</button>`;
    nuevoForm.method = "post";
    nuevoForm.classList.add("botonTabla")
    section.appendChild(nuevoForm);

    // Creamos títulos y tablas para los pedidos incompletos y completos
    const tituloIncompletos = document.createElement("h2");
    const tablaIncompletos = document.createElement("table");
    const tituloCompletos = document.createElement("h2");
    const tablaCompletos = document.createElement("table");

    // Textos de los títulos
    tituloIncompletos.textContent = "Pedidos no Facturados";
    tituloCompletos.textContent = "Pedidos Facturados";
    // Les agregamos clases CSS
    tituloCompletos.classList.add("tituloTable");
    tituloIncompletos.classList.add("tituloTable");

    // Definimos encabezados para la tabla de pedidos completos
    const encabezados = [
        "ID","Fecha", "Hora","ID Caja","No.Mesa",
        "No.Clientes","Cli.Correo","Reserva", "Método de Pago","Total"
    ];
    // Si es administrador, agregamos columnas extra
    esAdmin ? encabezados.push("Eliminado", "Acciones") : encabezados.push("Acciones"); 

    // Definimos encabezados para la tabla de pedidos incompletos
    const encabezadosIncompleto = [
        "ID","Fecha", "Hora", "ID Caja","No.Mesa",
        "No.Clientes","Cli.Correo", "Método de Pago","Total", "Acciones"
    ];

    // Función que genera una fila de encabezado de pedidos completos
    const crearEncabezado = () => {
        const fila = document.createElement("tr");
        encabezados.forEach(text => {
            const th = document.createElement("th");
            th.textContent = text;
            fila.appendChild(th);
        });
        return fila;
    };

    // Función que genera una fila de encabezado de pedidos incompletos
    const crearEncabezadoIncompleto = () => {
        const fila = document.createElement("tr");
        encabezadosIncompleto.forEach(text => {
            const th = document.createElement("th");
            th.textContent = text;
            fila.appendChild(th);
        });
        return fila;
    };

    // Insertamos encabezados a las tablas
    tablaIncompletos.appendChild(crearEncabezadoIncompleto());
    tablaCompletos.appendChild(crearEncabezado());

    // Les damos clases CSS
    tablaIncompletos.classList.add("tablas");
    tablaCompletos.classList.add("tablas");

    try {
        // Hacemos petición para traer todos los pedidos
        const res = await fetch("http://localhost:8080/ApiRestaurente/api/pedidos");
        const data = await res.json();

        // Contador para saber si hay pedidos incompletos
        let contadorNoFacturado = 0;

        // Recorremos todos los pedidos
        data.forEach(pedido => {
            // Si el pedido NO está facturado y no es de reserva → va en tabla incompletos
            if (pedido.facturado == "0" && !pedido.idReserva) {
                contadorNoFacturado++;
                const fila = document.createElement("tr");
                // Rellenamos la fila con datos del pedido
                fila.innerHTML = `
                <td>${pedido.id}</td>
                <td>${pedido.fecha}</td>
                <td>${pedido.hora}</td>
                <td>${pedido.idCaja}</td>
                <td>#${pedido.numeroMesa}</td>
                <td>${pedido.numeroClientes}</td>
                <td>${pedido.correoCliente}</td>
                <td>${pedido.metodoPago}</td>
                <td>${pedido.valorTotal}$</td>
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
                    <button class="boton" id="VerFactura" value="${pedido.id}" data-id-total="${pedido.valorTotal}" type="button">Ver Factura</button>
                    <button class="boton" data-id-mesa="${pedido.numeroMesa}" data-id-total="${pedido.valorTotal}" id="Facturar" value="${pedido.id}" type="button">Pagar Factura</button>
                    <button class="boton" data-id-mesa="${pedido.numeroMesa}" id="BotonEliminar" value="${pedido.id}"  type="button">Eliminar</button>
                    </div>
                </td>
            `;
                // Agregamos la fila a la tabla de incompletos
                tablaIncompletos.appendChild(fila);
            }
            // Si el pedido está facturado (con o sin reserva) → va en tabla completos
            else if (pedido.facturado == "1" || pedido.facturado == "1" && pedido.idReserva) {
                // Se muestran si no están eliminados o si es admin
                if (pedido.eliminado != "1" || pedido.eliminado == "1" && esAdmin) {
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
                        ${esAdmin ? `<td>${pedido.eliminado == "1" ? "Si" : "No"}</td>` : ""}
                        <td>
                        <div class="tablaAcciones">
                            <button class="boton" id="VerFactura" value="${pedido.id}" type="button">Ver Factura</button>
                            ${esAdmin ? `<button class="boton" id="EliminadoSuave" data-id-eliminado="${pedido.eliminado}" value="${pedido.id}" type="button">${pedido.eliminado == "0" ? "Eliminado" : "Incluir"}</button>` : ""}
                        </div>
                        </td>
                    `;
                    // Agregamos la fila a la tabla de completos
                    tablaCompletos.appendChild(fila);
                }
            }
        });

        // Si no hay pedidos incompletos, escondemos esa sección
        if (contadorNoFacturado == 0) {
          tituloIncompletos.style.display = "none";
          tablaIncompletos.style.display = "none";
        }

        // Agregamos todo al section
        section.append(tituloIncompletos, tablaIncompletos, tituloCompletos, tablaCompletos);
    } catch (error) {
        // En caso de error mostramos mensaje
        section.innerHTML = "<p>Error al cargar los pedidos.</p>";
        console.error("Error:", error);
    }
};

// ⚡ Función para eliminar un pedido
const eliminarPedido = async (e) => {
  const id = e.target.value;
  const mesa = e.target.dataset.idMesa;
  // Preguntamos confirmación
  const confirmacion = await alertaPregunta(`¿Desea eliminar el pedido #${id}?`);
  if (confirmacion.isConfirmed) {
      try {
          // Hacemos DELETE al API
          const res = await fetch(`http://localhost:8080/ApiRestaurente/api/pedidos/${id}`, {
              method: "DELETE",
              headers: {
                  "Content-Type": "application/json"
              }
          });
          const mensaje = await res.text();
          if (!res.ok) throw new Error(mensaje);
          // Liberamos mesa
          await cambiarEstado(mesa)
          // Mostramos mensaje
          await alertaOK(mensaje);
          location.reload();
      } catch (err) {
          alertaError(err.message);
      }
  }
};

// ⚡ Función para ver la factura de un pedido
const VerFactura = async (e) => {
  const total = parseFloat(e.target.dataset.idTotal);
  if (total == 0) return await alertaError("Error: no se puede mostrar factura porque no tiene ningun pedido.");
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

    // Función auxiliar para buscar nombre y precio en listas
    const buscarPrecioNombre = (id, lista) => {
      const item = lista.find(i => i.id == id);
      return item ? { nombre: item.nombre, precio: parseInt(item.precio) } : { nombre: "???", precio: 0 };
    };

    let cuerpoFactura = "";
    let subtotal = parseInt(pedido.valorTotal);

    // Recorremos cada item del detalle para armar la factura
    detalle.forEach(item => {
      if (item.id_comida) {
        const { nombre, precio } = buscarPrecioNombre(item.id_comida, comidas);
        let total = precio * item.cantidad_comida;
        const nota = item.nota_comida ? `\n  Nota: ${item.nota_comida}` : "";
        cuerpoFactura += `${item.cantidad_comida} x ${nombre.padEnd(25)} $${total.toLocaleString()}${nota}\n`;
      }
      if (item.id_bebida) {
        const { nombre, precio } = buscarPrecioNombre(item.id_bebida, bebidas);
        let total = precio * item.cantidad_bebida;
        const nota = item.nota_bebida ? `\n  Nota: ${item.nota_bebida}` : "";
        cuerpoFactura += `${item.cantidad_bebida} x ${nombre.padEnd(25)} $${total.toLocaleString()}${nota}\n`;
      }
      if (item.id_coctel) {
        const { nombre, precio } = buscarPrecioNombre(item.id_coctel, cocteles);
        let total = precio * item.cantidad_coctel;
        const nota = item.nota_coctel ? `\n  Nota: ${item.nota_coctel}` : "";
        cuerpoFactura += `${item.cantidad_coctel} x ${nombre.padEnd(25)} $${total.toLocaleString()}${nota}\n`;
      }
    });

    let total = parseInt(pedido.valorTotal);
    let textoReserva = "";

    // Si hay reserva sumamos el precio
    if (pedido.idReserva) {
      const resReserva = await fetch(`http://localhost:8080/ApiRestaurente/api/reservas/${pedido.idReserva}`);
      const reserva = await resReserva.json();
      total = subtotal + parseInt(reserva.precio);
      textoReserva = `Reserva:                   $${parseInt(reserva.precio).toLocaleString()}\n`;
    }

    // Texto de la factura
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

    // Mostramos factura en alerta
    await alertaMensaje(factura);

  } catch (error) {
    await alertaMensaje("Error al generar factura:", error);
  }
};

// ⚡ Función para facturar un pedido
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
          await cambiarEstado(mesa)
          await alertaOK(mensaje);
          location.reload();
      } catch (err) {
          alertaError(err.message);
      }
  }
};

// ⚡ Cambiar estado de una mesa a disponible
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

// ⚡ Eliminado suave: marcar pedido como eliminado o restaurarlo
const EliminadoSuave = async (e) => {
    const id = e.target.value;
    const eliminado= e.target.dataset.idEliminado;
    if (eliminado == "0") {
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
    else if (eliminado == "1") {
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

// ⚡ Validar si el usuario actual es administrador
const validarAdmin = async () => {
    try {
        const res = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${hash}`);
        const data = await res.json();
        data.idOficio == "1" ? esAdmin = true : esAdmin = false;
    } catch (error) {
        console.error("Error:", error);
    }
}

// Evento que se ejecuta cuando la página carga
document.addEventListener("DOMContentLoaded",async () => {
  cargarHeader(hash);
  await validarAdmin()    
  cargarPedidos();
});

// Delegación de eventos para manejar clicks en botones dinámicos
window.addEventListener("click", (e) => {
    if (e.target.matches("#BotonEliminar")) eliminarPedido(e);
    if (e.target.matches("#VerFactura")) VerFactura(e);
    if (e.target.matches("#Facturar")) facturar(e);
    if (e.target.matches("#EliminadoSuave")) EliminadoSuave(e);
});
