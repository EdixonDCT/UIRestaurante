import { alertaOK, alertaError } from "./alertas.js";

const hash = window.location.hash.slice(1);
const [cedula, idPedido] = hash.split("/");

const form = document.querySelector(".form");

const id = document.getElementById("id");
const numeroMesa = document.getElementById("numeroMesa");
const idCaja = document.getElementById("idCaja");
const numeroClientes = document.getElementById("numeroClientes");
const nota = document.getElementById("nota");
const correoCliente = document.getElementById("correoCliente");
const metodoPago = document.getElementById("metodoPago");
const idReservaInput = document.getElementById("idReserva");

const cargarCajas = async () => {
    try {
        const resCajas = await fetch("http://localhost:8080/ApiRestaurente/api/caja");
        const cajas = await resCajas.json();
        cajas.forEach(c => {
            if (!c.montoCierre && !c.horaCierre && !c.horaCierre) {
                const opt = document.createElement("option");
                opt.value = c.id;
                opt.textContent = `Caja #${c.id}: ${c.nombreCajero}`;
                idCaja.appendChild(opt);
            }
        });
    } catch (err) {
        alertaError("Error al cargar cajas: " + err.message);
    }
};

const cargarPedido = async () => {
    try {
        const res = await fetch(`http://localhost:8080/ApiRestaurente/api/pedidos/${idPedido}`);
        if (!res.ok) throw new Error("Error al obtener el pedido");
        const data = await res.json();

        id.value = data.id;
        numeroMesa.value = data.numeroMesa;
        idCaja.value = data.idCaja;
        numeroClientes.value = data.numeroClientes;
        nota.value = data.nota;
        correoCliente.value = data.correoCliente;
        metodoPago.value = data.metodoPago;
        idReservaInput.value = data.idReserva;
    } catch (err) {
        alertaError("Error al cargar pedido: " + err.message);
    }
};

const validar = async (e) => {
    e.preventDefault();

    const datos = {
        idCaja: idCaja.value,
        numeroClientes: numeroClientes.value,
        nota: nota.value,
        metodoPago: metodoPago.value,
    };

    try {
        const res = await fetch(`http://localhost:8080/ApiRestaurente/api/pedidos/reserva/${idPedido}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        const mensaje = await res.text();
        if (!res.ok) throw new Error(mensaje);

        await alertaOK(mensaje);
        form.action = `reservas.html#${cedula}`;
        form.submit();
    } catch (error) {
        alertaError("Error al actualizar pedido: " + error.message);
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    const botonVolver = document.getElementById("volver");
    botonVolver.action = `pedidos.html#${cedula}`;

    await cargarCajas();
    await cargarPedido();
});

form.addEventListener("submit", validar);
