import { alertaOK, alertaError } from "./alertas.js";
import { cargarHeader } from "./header.js";

const formulario = document.querySelector(".form");
const correo = document.getElementById("correo");
const cantidad = document.getElementById("cantidad");
const fecha = document.getElementById("fecha");
const hora = document.getElementById("hora");
const comboMesa = document.getElementById("comboMesa");
const hash = window.location.hash.slice(1);

const volver = document.getElementById("volver");
volver.action = `reservas.html#${hash}`;
const crearCliente = document.querySelector(".formIr");
crearCliente.action = `clienteCrearReserva.html#${hash}`;
document.addEventListener("DOMContentLoaded", async () => {
  cargarHeader(hash);
  try {
    const res = await fetch("http://localhost:8080/ApiRestaurente/api/mesas");
    const mesas = await res.json();
    mesas.forEach(mesa => {
      if (mesa.disponible == "1") {
        const option = document.createElement("option");
        option.value = mesa.numero;
        option.textContent = `Mesa #${mesa.numero}`;
        comboMesa.appendChild(option);
      }
    });
  } catch (err) {
    alertaError(err);
  }
});
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
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
    
    // Crear el pedido
    const datosPedido = {
      numeroMesa: comboMesa.value,
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
    formulario.action = `reservas.html#${hash}`
    formulario.submit();
  } catch (err) {
    alertaError(err.message);
  }
});
