import { alertaOK, alertaError } from "../alertas.js"; // Importa funciones de alerta
import { cargarHeader } from "../header.js"; // Importa función para cargar header

const hasher = window.location.hash.slice(1); // Obtiene hash de la URL
const [hash, id, metodo, corCli] = hasher.split("/"); // Separa hash en partes
let rutaVolverIrse = "" // Inicializa ruta de retorno
let rutaFetch = ""; // Inicializa ruta para fetch
if (metodo == "pe") // Si método es pe
{
    rutaVolverIrse = `pedidosTablas.html#${hash}` // Ruta de volver pe
    rutaFetch = `http://localhost:8080/ApiRestaurente/api/pedidos/${id}` // Ruta fetch pedido
}
else if(metodo == "rpe") // Si método es rpe
{ 
    rutaVolverIrse = `../reservas/reservasTablas.html#${hash}`; // Ruta de volver rpe
    rutaFetch = `http://localhost:8080/ApiRestaurente/api/pedidos/reserva/${id}` // Ruta fetch pedido reserva
}
else if(metodo == "repa") // Si método es repa
{ 
    rutaVolverIrse = `../reservas/reservasTablas.html#${hash}`; // Ruta de volver repa
    rutaFetch = `http://localhost:8080/ApiRestaurente/api/pedidos/${id}` // Ruta fetch pedido normal
}
const form = document.querySelector(".form"); // Selecciona formulario

const numeroMesa = document.querySelector(".numero"); // Selecciona input mesa
const idCaja = document.querySelector(".caja"); // Selecciona input caja
const numeroClientes = document.querySelector(".numeroClientes"); // Selecciona input clientes
const correoCliente = document.querySelector(".correoCliente"); // Selecciona input correo
const metodoPago = document.querySelector(".metodoPago"); // Selecciona input pago
let numeroMesaViejo = ""; // Guarda mesa anterior
document.addEventListener("DOMContentLoaded", async () => { // Al cargar DOM
    cargarHeader(hash); // Carga header

    const botonVolver = document.getElementById("volver"); // Botón volver
    botonVolver.action = rutaVolverIrse; // Asigna acción volver

    const botonCrear = document.getElementById("crearCliente"); // Botón crear cliente
    botonCrear.action = `clienteCrear.html#${hash}/${metodo}/${id}`; // Asigna acción crear cliente

    try {
        // Cargar mesas disponibles
        const resMesas = await fetch("http://localhost:8080/ApiRestaurente/api/mesas"); // Fetch mesas
        const mesas = await resMesas.json(); // Convierte a JSON
        mesas.forEach((m) => { // Recorre mesas
            if (m.disponible == "1") { // Si mesa disponible
                const opt = document.createElement("option"); // Crea opción
                opt.value = m.numero; // Valor mesa
                opt.textContent = `#${m.numero} (capacidad ${m.capacidad})`; // Texto opción
                numeroMesa.appendChild(opt); // Añade al select
            }
        });

        // Cargar cajas disponibles
        const resCajas = await fetch("http://localhost:8080/ApiRestaurente/api/caja"); // Fetch cajas
        const cajas = await resCajas.json(); // Convierte a JSON
        cajas.forEach((c) => { // Recorre cajas
            if (!c.montoCierre && !c.horaCierre) { // Si caja no cerrada
                const opt = document.createElement("option"); // Crea opción
                opt.value = c.id; // Valor id caja
                opt.textContent = `Caja #${c.id}: ${c.nombreCajero}`; // Texto caja
                idCaja.appendChild(opt); // Añade al select
            }
        });

        // Si hay id, cargar datos del pedido para edición
        if (id) { // Si hay id
            await cargarDatosPedido(id); // Llama cargar pedido
        }
    } catch (err) { // Si error
        console.error("Error al cargar listas:", err); // Muestra error
        alertaError("Error al cargar listas: " + err.message); // Alerta error
    }
});

async function cargarDatosPedido(idPedido) { // Función cargar datos pedido
    try {
        const res = await fetch(`http://localhost:8080/ApiRestaurente/api/pedidos/${idPedido}`); // Fetch pedido
        if (!res.ok) throw new Error("No se pudo obtener el pedido"); // Si error
        const pedido = await res.json(); // Convierte a JSON

        const resMesas = await fetch("http://localhost:8080/ApiRestaurente/api/mesas/"+pedido.numeroMesa); // Fetch mesa
        const mesas = await resMesas.json(); // Convierte a JSON

        const opt = document.createElement("option"); // Crea opción
        opt.value = mesas.numero; // Valor mesa
        opt.textContent = `#${mesas.numero} (capacidad ${mesas.capacidad})`; // Texto mesa
        ![...numeroMesa.options].some(o => o.value == mesas.numero) && numeroMesa.appendChild(opt); // Añade si no existe
        numeroMesaViejo = mesas.numero; // Guarda mesa anterior
        numeroMesa.value = pedido.numeroMesa || 0; // Asigna mesa
        idCaja.value = pedido.idCaja || 0; // Asigna caja
        numeroClientes.value = pedido.numeroClientes || ""; // Asigna clientes
        correoCliente.value = pedido.correoCliente || ""; // Asigna correo
        if (corCli) { // Si hay corCli
           correoCliente.value = corCli;  // Sobrescribe correo
        }
        metodoPago.value = pedido.metodoPago || 0; // Asigna pago
    } catch (error) { // Si error
        alertaError("Error al cargar datos del pedido: " + error.message); // Alerta error
    }
}

const validar = async (e) => { // Función validar formulario
    e.preventDefault(); // Previene envío
    const datos = { // Objeto datos
        numeroMesa: numeroMesa.value, // Valor mesa
        idCaja: idCaja.value, // Valor caja
        numeroClientes: numeroClientes.value, // Valor clientes
        correoCliente: correoCliente.value, // Valor correo
        metodoPago: metodoPago.value, // Valor pago
    };
    try {
        let res; // Variable respuesta
        res = await fetch(rutaFetch, { // Fetch editar pedido
            method: "PUT", // Método PUT
            headers: { "Content-Type": "application/json" }, // Encabezado JSON
            body: JSON.stringify(datos), // Datos JSON
        });
        const texto = await res.text(); // Convierte respuesta texto
        if (!res.ok) throw new Error(texto); // Si error lanza
        await cambiarEstado(numeroMesa.value, numeroMesaViejo); // Cambia estado mesa
        await alertaOK(texto); // Alerta ok
        form.action = rutaVolverIrse; // Acción volver
        form.submit(); // Envía form

    } catch (error) { // Si error
        alertaError(error.message); // Alerta error
    }
}

const cambiarEstado = async (nuevo, viejo) => { // Función cambiar estado mesa
    if (nuevo == viejo) return; // Si son iguales no hace nada
    try {
        const disponibles = { disponible: "0" }; // Estado no disponible
        const respuesta = await fetch(`http://localhost:8080/ApiRestaurente/api/mesas/${nuevo}`, { // Fetch mesa nueva
            method: "PATCH", // Método PATCH
            headers: {
                "Content-Type": "application/json", // Encabezado JSON
            },
            body: JSON.stringify(disponibles), // Cuerpo datos
        });
        if (!respuesta.ok) throw new Error("Error al cambiar el estado mesa nueva"); // Error si falla
        const resultado = await respuesta.text(); // Respuesta texto
        console.log(resultado); // Imprime resultado
        try {
            const disponibles = { disponible: "1" }; // Estado disponible
            const respuesta = await fetch(`http://localhost:8080/ApiRestaurente/api/mesas/${viejo}`, { // Fetch mesa vieja
                method: "PATCH", // Método PATCH
                headers: {
                    "Content-Type": "application/json", // Encabezado JSON
                },
                body: JSON.stringify(disponibles), // Cuerpo datos
            });
            if (!respuesta.ok) throw new Error("Error al cambiar el estado mesa anterior"); // Error si falla
            const resultado = await respuesta.text(); // Respuesta texto
            console.log(resultado); // Imprime resultado
        } catch (error) {
            console.error("Falló el cambio de estado:", error); // Error mesa anterior
        }
    } catch (error) {
        console.error("Falló el cambio de estado:", error); // Error mesa nueva
    }
};

form.addEventListener("submit", validar); // Evento submit form
