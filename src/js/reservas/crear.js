import { alertaOK, alertaError } from "../alertas.js";
import { cargarHeader } from "../header.js";

const formulario = document.querySelector(".form");
const correo = document.querySelector(".correo");
const cantidad = document.querySelector(".cantidad");
const fecha = document.querySelector(".fecha");
const hora = document.querySelector(".hora");
const comboMesa = document.querySelector(".numero");

const hasher = window.location.hash.slice(1);
const [hash, correoCliente] = hasher.split("/");

const volver = document.getElementById("volver");
volver.action = `reservasTablas.html#${hash}`;
const crearCliente = document.getElementById("crearCliente");
crearCliente.action = `../pedidos/clienteCrear.html#${hash}/rc`;
document.addEventListener("DOMContentLoaded", async () => {
  cargarHeader(hash);
  try {
    const res = await fetch("http://localhost:8080/ApiRestaurente/api/mesas");
    const mesas = await res.json();
    mesas.forEach(mesa => {
        const option = document.createElement("option");
        option.value = mesa.numero;
        option.textContent = `Mesa #${mesa.numero}`;
        comboMesa.appendChild(option);
    });
    if (correoCliente)
    {
      correo.value = correoCliente;  
    }
  } catch (err) {
    alertaError(err);
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
  const resultado = validarFechaHora(fecha.value, hora.value);

  if (!resultado.valido) {
        alertaError(resultado.mensaje);
        return;
  }
  const datos= {
    cantidadTentativa: cantidad.value,
    fechaTentativa: fecha.value,
    horaTentativa: hora.value + ":00",
  };

  try {
    const response = await fetch("http://localhost:8080/ApiRestaurente/api/reservas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    });

    const mensaje = await response.json();
    if (!response.ok) {
      throw new Error(mensaje);
    }
    
    const idReserva = mensaje.id;

    const datosPedido = {
      numeroMesa: comboMesa.value,
      numeroClientes: cantidad.value,
      idReserva: idReserva,
      correoCliente: correo.value,
    };
    
    const resPedido = await fetch("http://localhost:8080/ApiRestaurente/api/pedidos/reserva", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosPedido),
    });

    const mensajePedido = await resPedido.text();
    if (!resPedido.ok) throw new Error(mensajePedido);
    await alertaOK("Reserva y Pedido creados EXITOSAMENTE");
    formulario.action = `reservasTablas.html#${hash}`
    formulario.submit();
  } catch (err) {
    alertaError(err.message);
  }
});
