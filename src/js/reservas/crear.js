import { alertaOK, alertaError } from "../alertas.js"; // Importa funciones de alertas
import { cargarHeader } from "../header.js"; // Importa función para cargar encabezado

const formulario = document.querySelector(".form"); // Selecciona formulario
const correo = document.querySelector(".correo"); // Selecciona input correo
const cantidad = document.querySelector(".cantidad"); // Selecciona input cantidad
const fecha = document.querySelector(".fecha"); // Selecciona input fecha
const hora = document.querySelector(".hora"); // Selecciona input hora
const comboMesa = document.querySelector(".numero"); // Selecciona select mesas

const hasher = window.location.hash.slice(1); // Obtiene hash sin #
const [hash, correoCliente] = hasher.split("/"); // Separa id y correoCliente

const volver = document.getElementById("volver"); // Botón volver
volver.action = `reservasTablas.html#${hash}`; // Redirige a reservasTablas
const crearCliente = document.getElementById("crearCliente"); // Botón crear cliente
crearCliente.action = `../pedidos/clienteCrear.html#${hash}/rc`; // Redirige a crear cliente
document.addEventListener("DOMContentLoaded", async () => { // Al cargar DOM
  cargarHeader(hash); // Carga encabezado
  try {
    const res = await fetch("http://localhost:8080/ApiRestaurente/api/mesas"); // Consulta mesas
    const mesas = await res.json(); // Convierte respuesta a JSON
    mesas.forEach(mesa => { // Recorre mesas
        const option = document.createElement("option"); // Crea opción
        option.value = mesa.numero; // Valor = número de mesa
        option.textContent = `Mesa #${mesa.numero}`; // Texto opción
        comboMesa.appendChild(option); // Agrega opción al select
    });
    if (correoCliente) // Si hay correoCliente
    {
      correo.value = correoCliente;  // Lo asigna al input correo
    }
  } catch (err) {
    alertaError(err); // Muestra error
  }
});
const validarFechaHora = (fechaInput, horaInput) => { // Función validación fecha/hora
    const fechaSeleccionada = new Date(fechaInput); // Convierte fecha
    const horaSeleccionada = horaInput; // Hora en string

    // Obtener fecha y hora actual
    const ahora = new Date(); // Fecha/hora actual
    const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()); // Hoy a 00:00

    // Convertir fecha y hora seleccionada a Date completo
    const [hh, mm] = horaSeleccionada.split(":"); // Separa hora y minutos
    fechaSeleccionada.setHours(parseInt(hh), parseInt(mm), 0, 0); // Setea hora a fecha
    
    // Validar que la fecha no sea pasada ni hoy
    if (fechaSeleccionada < hoy) { // Fecha antes de hoy
        return { valido: false, mensaje: "La fecha no puede ser hoy, ayer ni un día pasado." };
    }
    if (fechaSeleccionada.getTime() === hoy.getTime()) { // Si es hoy
        return { valido: false, mensaje: "La fecha no puede ser hoy." };
    }
    if (parseInt(hh) <= 8) { // Hora menor o igual a 8am
        return { valido: false, mensaje: `Si es mañana, debe ser después de las 8:00 a.m.` };
    }
    if (parseInt(hh) >= 22) { // Hora mayor o igual a 10pm
        return { valido: false, mensaje: `Si es en la noche, debe ser antes de las 10:00 p.m.` };
    }
    return { valido: true }; // Si todo está correcto
};

formulario.addEventListener("submit", async (e) => { // Evento submit formulario
  e.preventDefault(); // Evita recargar página
  const resultado = validarFechaHora(fecha.value, hora.value); // Valida fecha/hora

  if (!resultado.valido) { // Si no es válido
        alertaError(resultado.mensaje); // Muestra error
        return;
  }
  const datos= { // Datos de la reserva
    cantidadTentativa: cantidad.value,
    fechaTentativa: fecha.value,
    horaTentativa: hora.value + ":00",
  };

  try {
    const response = await fetch("http://localhost:8080/ApiRestaurente/api/reservas", { // Crea reserva
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    });
    let mensaje;
if (response.ok) { // Si respuesta OK
  mensaje = await response.json(); // Obtiene JSON
} else {
  const errorText = await response.text(); // Lee error
  throw new Error(errorText); // Lanza error
}  
    const idReserva = mensaje.id; // Id de la reserva creada

    const datosPedido = { // Datos del pedido
      numeroMesa: comboMesa.value,
      numeroClientes: cantidad.value,
      idReserva: idReserva,
      correoCliente: correo.value,
    };
    
    const resPedido = await fetch("http://localhost:8080/ApiRestaurente/api/pedidos/reserva", { // Crea pedido
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosPedido),
    });

    const mensajePedido = await resPedido.text(); // Mensaje del pedido
    if (!resPedido.ok) throw new Error(mensajePedido); // Error si falla
    await alertaOK("Reserva y Pedido creados EXITOSAMENTE"); // Alerta éxito
    formulario.action = `reservasTablas.html#${hash}` // Redirige al listado
    formulario.submit(); // Envía formulario
  } catch (error) {
    alertaError(error.message); // Muestra error
  }
});
