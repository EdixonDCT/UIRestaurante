import { alertaOK, alertaError } from "../alertas.js";
import { cargarHeader } from "../header.js";

const hasher = window.location.hash.slice(1);
const [hash, id, metodo, corCli] = hasher.split("/");
let rutaVolverIrse = ""
let rutaFetch = "";
if (metodo == "pe")
{
    rutaVolverIrse = `pedidosTablas.html#${hash}`
    rutaFetch = `http://localhost:8080/ApiRestaurente/api/pedidos/${id}`
}
else if(metodo == "rpe")
{ 
    rutaVolverIrse = `../reservas/reservasTablas.html#${hash}`;
    rutaFetch = `http://localhost:8080/ApiRestaurente/api/pedidos/reserva/${id}`
}
else if(metodo == "repa")
{ 
    rutaVolverIrse = `../reservas/reservasTablas.html#${hash}`;
    rutaFetch = `http://localhost:8080/ApiRestaurente/api/pedidos/${id}`
}
const form = document.querySelector(".form");

const numeroMesa = document.querySelector(".numero");
const idCaja = document.querySelector(".caja");
const numeroClientes = document.querySelector(".numeroClientes");
const correoCliente = document.querySelector(".correoCliente");
const metodoPago = document.querySelector(".metodoPago");
let numeroMesaViejo = "";
document.addEventListener("DOMContentLoaded", async () => {
    cargarHeader(hash);

    const botonVolver = document.getElementById("volver");
    botonVolver.action = rutaVolverIrse;

    const botonCrear = document.getElementById("crearCliente");
    botonCrear.action = `clienteCrear.html#${hash}/${metodo}/${id}`;

    try {
        // Cargar mesas disponibles
        const resMesas = await fetch("http://localhost:8080/ApiRestaurente/api/mesas");
        const mesas = await resMesas.json();
        mesas.forEach((m) => {
            if (m.disponible == "1") {
                const opt = document.createElement("option");
                opt.value = m.numero;
                opt.textContent = `#${m.numero} (capacidad ${m.capacidad})`;
                numeroMesa.appendChild(opt);
            }
        });

        // Cargar cajas disponibles
        const resCajas = await fetch("http://localhost:8080/ApiRestaurente/api/caja");
        const cajas = await resCajas.json();
        cajas.forEach((c) => {
            if (!c.montoCierre && !c.horaCierre) {
                const opt = document.createElement("option");
                opt.value = c.id;
                opt.textContent = `Caja #${c.id}: ${c.nombreCajero}`;
                idCaja.appendChild(opt);
            }
        });

        // Si hay id, cargar datos del pedido para edición
        if (id) {
            await cargarDatosPedido(id);
        }
    } catch (err) {
        console.error("Error al cargar listas:", err);
        alertaError("Error al cargar listas: " + err.message);
    }
});

async function cargarDatosPedido(idPedido) {
    try {
        const res = await fetch(`http://localhost:8080/ApiRestaurente/api/pedidos/${idPedido}`);
        if (!res.ok) throw new Error("No se pudo obtener el pedido");
        const pedido = await res.json();

        const resMesas = await fetch("http://localhost:8080/ApiRestaurente/api/mesas/"+pedido.numeroMesa);
        const mesas = await resMesas.json();

        const opt = document.createElement("option");
        opt.value = mesas.numero;
        opt.textContent = `#${mesas.numero} (capacidad ${mesas.capacidad})`;
        ![...numeroMesa.options].some(o => o.value == mesas.numero) && numeroMesa.appendChild(opt);
        numeroMesaViejo = mesas.numero;
        numeroMesa.value = pedido.numeroMesa || "";
        idCaja.value = pedido.idCaja || "";
        numeroClientes.value = pedido.numeroClientes || "";
        correoCliente.value = pedido.correoCliente || "";
        if (corCli) {
           correoCliente.value = corCli;  
        }
        metodoPago.value = pedido.metodoPago || "";
    } catch (error) {
        alertaError("Error al cargar datos del pedido: " + error.message);
    }
}

const validar = async (e) => {
    e.preventDefault();
    const datos = {
        numeroMesa: numeroMesa.value,
        idCaja: idCaja.value,
        numeroClientes: numeroClientes.value,
        correoCliente: correoCliente.value,
        metodoPago: metodoPago.value,
    };
    try {
        let res;
        res = await fetch(rutaFetch, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
        const texto = await res.text();
        if (!res.ok) throw new Error(texto);
        await cambiarEstado(numeroMesa.value, numeroMesaViejo);
        await alertaOK(texto);
        form.action = rutaVolverIrse;
        form.submit();

    } catch (error) {
        alertaError(error.message);
    }
}

const cambiarEstado = async (nuevo, viejo) => {
    if (nuevo == viejo) return;
    try {
        const disponibles = { disponible: "0" };
        const respuesta = await fetch(`http://localhost:8080/ApiRestaurente/api/mesas/${nuevo}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(disponibles),
        });
        if (!respuesta.ok) throw new Error("Error al cambiar el estado mesa nueva");
        const resultado = await respuesta.text();
        console.log(resultado);
        try {
            const disponibles = { disponible: "1" };
            const respuesta = await fetch(`http://localhost:8080/ApiRestaurente/api/mesas/${viejo}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(disponibles),
            });
            if (!respuesta.ok) throw new Error("Error al cambiar el estado mesa anterior");
            const resultado = await respuesta.text();
            console.log(resultado);
        } catch (error) {
            console.error("Falló el cambio de estado:", error);
        }
    } catch (error) {
        console.error("Falló el cambio de estado:", error);
    }
};

form.addEventListener("submit", validar);
