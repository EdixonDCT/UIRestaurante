import { alertaOK, alertaError } from "../alertas.js"; // Importa funciones de alertas
import { cargarHeader } from "../header.js"; // Importa función para cargar el header

const formulario = document.querySelector(".form"); // Obtiene el formulario
const id = document.querySelector(".id"); // Input id
const correo = document.querySelector(".correo"); // Input correo
const cantidad = document.querySelector(".cantidad"); // Input cantidad
const fecha = document.querySelector(".fecha"); // Input fecha
const hora = document.querySelector(".hora"); // Input hora
const comboMesa = document.querySelector(".numero"); // Select mesas
let idReserva = ""; // Variable para id de reserva
const hasher = window.location.hash.slice(1); // Obtiene hash de la URL
const [hash, idPedido,correoCliente] = hasher.split("/"); // Separa valores del hash

const volver = document.getElementById("volver"); // Botón volver
volver.action = `reservasTablas.html#${hash}`; // Redirige a reservasTablas con hash

const crearCliente = document.getElementById("crearCliente"); // Botón crear cliente
crearCliente.action = `../pedidos/clienteCrear.html#${hash}/re/${idPedido}`; // Redirige a crear cliente con datos

document.addEventListener("DOMContentLoaded", async () => { // Al cargar el DOM
    cargarHeader(hash); // Carga el header con hash

    try {
        const resMesas = await fetch("http://localhost:8080/ApiRestaurente/api/mesas"); // Trae mesas
        const mesas = await resMesas.json(); // Convierte a JSON
        mesas.forEach(mesa => { // Recorre mesas
            const option = document.createElement("option"); // Crea option
            option.value = mesa.numero; // Valor es el número de mesa
            option.textContent = `Mesa #${mesa.numero}`; // Texto visible
            comboMesa.appendChild(option); // Agrega option al select
        });
        const resPedido = await fetch(`http://localhost:8080/ApiRestaurente/api/pedidos/${idPedido}`); // Trae pedido
        if (!resPedido.ok) throw new Error("No se pudo obtener el pedido"); // Valida error
        const pedido = await resPedido.json(); // Convierte a JSON
        idReserva = pedido.idReserva; // Guarda idReserva
        const resReserva = await fetch(`http://localhost:8080/ApiRestaurente/api/reservas/${pedido.idReserva}`); // Trae reserva
        if (!resReserva.ok) throw new Error("No se pudo obtener la reserva"); // Valida error
        const reserva = await resReserva.json(); // Convierte a JSON
        id.value = pedido.id || ""; // Llena id
        correo.value = pedido.correoCliente || ""; // Llena correo
        cantidad.value = reserva.cantidadTentativa || ""; // Llena cantidad
        fecha.value = reserva.fechaTentativa || ""; // Llena fecha
        hora.value = reserva.horaTentativa ? reserva.horaTentativa.slice(0,5) : ""; // Llena hora
        comboMesa.value = pedido.numeroMesa || "0"; // Llena mesa
        if (correoCliente) { // Si hay correoCliente en hash
            correo.value = correoCliente; // Sobrescribe correo
        }
    } catch (err) {
        alertaError(err.message); // Muestra error
    }
});
const validarFechaHora = (fechaInput, horaInput) => { // Función validar fecha/hora
    const fechaSeleccionada = new Date(fechaInput); // Convierte fecha
    const horaSeleccionada = horaInput; // Guarda hora

    // Obtener fecha y hora actual
    const ahora = new Date(); // Fecha actual
    const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()); // 00:00 de hoy

    // Convertir fecha y hora seleccionada a Date completo
    const [hh, mm] = horaSeleccionada.split(":"); // Separa hora y minutos
    fechaSeleccionada.setHours(parseInt(hh), parseInt(mm), 0, 0); // Setea hora

    // Validar que la fecha no sea pasada ni hoy
    if (fechaSeleccionada < hoy) { // Si es antes de hoy
        return { valido: false, mensaje: "La fecha no puede ser hoy, ayer ni un día pasado." }; // Retorna error
    }
    if (fechaSeleccionada.getTime() === hoy.getTime()) { // Si es hoy
        return { valido: false, mensaje: "La fecha no puede ser hoy." }; // Retorna error
    }
    if (parseInt(hh) <= 8) { // Hora menor o igual a 8
        return { valido: false, mensaje: `Si es mañana, debe ser después de las 8:00 a.m.` }; // Retorna error
    }
    if (parseInt(hh) >= 22) { // Hora mayor o igual a 22
        return { valido: false, mensaje: `Si es en la noche, debe ser antes de las 10:00 p.m.` }; // Retorna error
    }
    return { valido: true }; // Si pasa validación
};

formulario.addEventListener("submit", async (e) => { // Evento submit
    e.preventDefault(); // Previene recarga
    e.preventDefault(); // Previene recarga (duplicado)
      const resultado = validarFechaHora(fecha.value, hora.value); // Valida fecha/hora
    
      if (!resultado.valido) { // Si no es válido
            alertaError(resultado.mensaje); // Muestra error
            return; // Sale
      }
    const datosReserva = { // Datos de reserva
        cantidadTentativa: cantidad.value, // Cantidad
        fechaTentativa: fecha.value, // Fecha
        horaTentativa: hora.value + ":00" // Hora
    };

    try {
        const resReserva = await fetch(`http://localhost:8080/ApiRestaurente/api/reservas/${idReserva}`, { // PUT reserva
            method: "PUT", // Método PUT
            headers: { "Content-Type": "application/json" }, // Tipo JSON
            body: JSON.stringify(datosReserva) // Datos
        });
        if (!resReserva.ok) throw new Error(await resReserva.text()); // Valida error

        const datosPedido = { // Datos de pedido
            numeroMesa: comboMesa.value, // Mesa
            numeroClientes: cantidad.value, // Cantidad
            correoCliente: correo.value // Correo
        };
        const resPedido = await fetch(`http://localhost:8080/ApiRestaurente/api/pedidos/reservaEditar/${idPedido}`, { // PUT pedido
            method: "PUT", // Método PUT
            headers: { "Content-Type": "application/json" }, // Tipo JSON
            body: JSON.stringify(datosPedido) // Datos
        });
        if (!resPedido.ok) throw new Error(await resPedido.text()); // Valida error

        await alertaOK("Reserva y Pedido actualizados correctamente"); // Muestra OK
        formulario.action = `reservasTablas.html#${hash}`; // Redirige
        formulario.submit(); // Envía
    } catch (err) {
        alertaError(err.message); // Muestra error
    }
});
