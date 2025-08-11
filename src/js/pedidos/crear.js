import { alertaOK, alertaError } from "../alertas.js";
import { cargarHeader } from "../header.js";

const hasher = window.location.hash.slice(1);
const [hash, id] = hasher.split("/");
const form = document.querySelector(".form");

const numeroMesa = document.querySelector(".numero");
const idCaja = document.querySelector(".caja");
const numeroClientes = document.querySelector(".numeroClientes");
const correoCliente = document.querySelector(".correoCliente");
const metodoPago = document.querySelector(".metodoPago");

document.addEventListener("DOMContentLoaded", async () => {
    cargarHeader(hash)
    const botonVolver = document.getElementById("volver");
    botonVolver.action = `pedidosTablas.html#${hash}`;
    
    const botonCrear = document.getElementById("crearCliente");
    botonCrear.action = `clienteCrear.html#${hash}`;
    try {
        const resMesas = await fetch("http://localhost:8080/ApiRestaurente/api/mesas");
        const mesas = await resMesas.json();
        mesas.forEach(m => {
            if (m.disponible == "1") {
                const opt = document.createElement("option");
                opt.value = m.numero;
                opt.textContent = `#${m.numero} (capacidad ${m.capacidad})`;
                numeroMesa.appendChild(opt);
            }
        });
        const resCajas = await fetch("http://localhost:8080/ApiRestaurente/api/caja");
        const cajas = await resCajas.json();
        cajas.forEach(c => {
            if (!c.montoCierre && !c.horaCierre && !c.horaCierre)
            {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = `Caja #${c.id}:${c.nombreCajero}`;
            idCaja.appendChild(opt);
            }

        });
        if (id)
        {
            correoCliente.value = id;    
        }
    } catch (err) {
        console.error("Error al cargar listas:", err);
    }
});

const validar = async (e) => {
    e.preventDefault();
    const datos = {
        numeroMesa: numeroMesa.value,
        idCaja: idCaja.value,
        numeroClientes: numeroClientes.value,
        correoCliente: correoCliente.value,
        metodoPago: metodoPago.value
    };
    console.log(datos);
    
    try {
        const res = await fetch("http://localhost:8080/ApiRestaurente/api/pedidos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        const mensaje = await res.json();
        
        if (!res.ok) throw new Error(mensaje);

        await alertaOK(mensaje.mensaje);
        form.action = `../detallePedidos/detallePedidoCrear.html#${hash}/${mensaje.id}`
        form.submit();
    } catch (error) {
        alertaError(error.message);
    }
};

form.addEventListener("submit", validar);
