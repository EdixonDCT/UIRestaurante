import { alertaOK, alertaError } from "../alertas.js";
import { cargarHeader } from "../header.js";

const formulario = document.querySelector(".form");
const id = document.querySelector(".id");
const correo = document.querySelector(".correo");
const cantidad = document.querySelector(".cantidad");
const fecha = document.querySelector(".fecha");
const hora = document.querySelector(".hora");
const comboMesa = document.querySelector(".numero");
let idReserva = "";
const hasher = window.location.hash.slice(1);
const [hash, idPedido,correoCliente] = hasher.split("/");

const volver = document.getElementById("volver");
volver.action = `reservasTablas.html#${hash}`;

const crearCliente = document.getElementById("crearCliente");
crearCliente.action = `../pedidos/clienteCrear.html#${hash}/re/${idPedido}`;

document.addEventListener("DOMContentLoaded", async () => {
    cargarHeader(hash);

    try {
        const resMesas = await fetch("http://localhost:8080/ApiRestaurente/api/mesas");
        const mesas = await resMesas.json();
        mesas.forEach(mesa => {
            const option = document.createElement("option");
            option.value = mesa.numero;
            option.textContent = `Mesa #${mesa.numero}`;
            comboMesa.appendChild(option);
        });
        const resPedido = await fetch(`http://localhost:8080/ApiRestaurente/api/pedidos/${idPedido}`);
        if (!resPedido.ok) throw new Error("No se pudo obtener el pedido");
        const pedido = await resPedido.json();
        idReserva = pedido.idReserva;
        const resReserva = await fetch(`http://localhost:8080/ApiRestaurente/api/reservas/${pedido.idReserva}`);
        if (!resReserva.ok) throw new Error("No se pudo obtener la reserva");
        const reserva = await resReserva.json();
        id.value = pedido.id || "";
        correo.value = pedido.correoCliente || "";
        cantidad.value = reserva.cantidadTentativa || "";
        fecha.value = reserva.fechaTentativa || "";
        hora.value = reserva.horaTentativa ? reserva.horaTentativa.slice(0,5) : "";
        comboMesa.value = pedido.numeroMesa || "0";
        if (correoCliente) {
            correo.value = correoCliente;
        }
    } catch (err) {
        alertaError(err.message);
    }
});
const validarFechaHora = (fechaInput, horaInput) => {
    const fechaSeleccionada = new Date(fechaInput);
    const horaSeleccionada = horaInput;

    // Obtener fecha y hora actual
    const ahora = new Date();
    const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()); // 00:00 hoy

    // Convertir fecha y hora seleccionada a Date completo
    const [hh, mm] = horaSeleccionada.split(":");
    fechaSeleccionada.setHours(parseInt(hh), parseInt(mm), 0, 0);
    
    // Validar que la fecha no sea pasada ni hoy
    if (fechaSeleccionada < hoy) {
        return { valido: false, mensaje: "La fecha no puede ser hoy, ayer ni un día pasado." };
    }
    if (fechaSeleccionada.getTime() === hoy.getTime()) {
        return { valido: false, mensaje: "La fecha no puede ser hoy." };
    }
    if (parseInt(hh) <= 8) {
        return { valido: false, mensaje: `Si es mañana, debe ser después de las 8:00 a.m.` };
    }
    if (parseInt(hh) >= 22) {
        return { valido: false, mensaje: `Si es en la noche, debe ser antes de las 10:00 p.m.` };
    }
    return { valido: true };
};

formulario.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.preventDefault();
      const resultado = validarFechaHora(fecha.value, hora.value);
    
      if (!resultado.valido) {
            alertaError(resultado.mensaje);
            return;
      }
    const datosReserva = {
        cantidadTentativa: cantidad.value,
        fechaTentativa: fecha.value,
        horaTentativa: hora.value + ":00"
    };

    try {
        const resReserva = await fetch(`http://localhost:8080/ApiRestaurente/api/reservas/${idReserva}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosReserva)
        });
        if (!resReserva.ok) throw new Error(await resReserva.text());

        const datosPedido = {
            numeroMesa: comboMesa.value,
            numeroClientes: cantidad.value,
            correoCliente: correo.value
        };
        const resPedido = await fetch(`http://localhost:8080/ApiRestaurente/api/pedidos/reservaEditar/${idPedido}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosPedido)
        });
        if (!resPedido.ok) throw new Error(await resPedido.text());

        await alertaOK("Reserva y Pedido actualizados correctamente");
        formulario.action = `reservasTablas.html#${hash}`;
        formulario.submit();
    } catch (err) {
        alertaError(err.message);
    }
});
