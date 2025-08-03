import { alertaOK, alertaError } from "./alertas.js";

const hash = window.location.hash.slice(1);
const [idUser, idPedido,proviene] = hash.split("/");
let  volverIrse = "";
if (proviene == "r") volverIrse = `reservas.html#${idUser}`;
else if (proviene == "p") volverIrse = `pedidos.html#${idUser}`;
const form = document.querySelector(".form");

const id = document.getElementById("id");
const numeroMesa = document.getElementById("numeroMesa");
const idCaja = document.getElementById("idCaja");
const numeroClientes = document.getElementById("numeroClientes");
const nota = document.getElementById("nota");
const correoCliente = document.getElementById("correoCliente");
const fecha = document.getElementById("fecha");
const hora = document.getElementById("hora");
const metodoPago = document.getElementById("metodoPago");

const cargarMesasYCajas = async () => {
    try {
        const resMesas = await fetch("http://localhost:8080/ApiRestaurente/api/mesas");
        const mesas = await resMesas.json();
        mesas.forEach(m => {
            const opt = document.createElement("option");
            opt.value = m.numero;
            opt.textContent = `#${m.numero} (capacidad ${m.capacidad})`;
            numeroMesa.appendChild(opt);
        });

        const resCajas = await fetch("http://localhost:8080/ApiRestaurente/api/caja");
        const cajas = await resCajas.json();
        cajas.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = `Caja #${c.id}: ${c.nombreCajero}`;
            idCaja.appendChild(opt);
        });
    } catch (err) {
        alertaError("Error al cargar mesas o cajas: " + err.message);
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
        fecha.value = data.fecha;
        hora.value = data.hora;
        metodoPago.value = data.metodoPago;
    } catch (err) {
        alertaError("Error al cargar pedido: " + err.message);
    }
};

const validar = async (e) => {
    e.preventDefault();

    const datos = {
        numeroMesa: numeroMesa.value,
        idCaja: idCaja.value,
        numeroClientes: numeroClientes.value,
        nota: nota.value,
        correoCliente: correoCliente.value,
        fecha: fecha.value,
        hora: hora.value,
        metodoPago: metodoPago.value
    };

    try {
        const res = await fetch(`http://localhost:8080/ApiRestaurente/api/pedidos/${idPedido}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        const mensaje = await res.text();
        if (!res.ok) throw new Error(mensaje);

        await alertaOK("Pedido: " + mensaje);
        form.action = volverIrse;
        form.submit();
    } catch (error) {
        alertaError("Error al actualizar pedido: " + error.message);
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    const botonVolver = document.getElementById("volver");
    botonVolver.action = volverIrse;

    await cargarMesasYCajas();
    await cargarPedido();
});

form.addEventListener("submit", validar);
