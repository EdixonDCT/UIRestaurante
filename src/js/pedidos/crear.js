// Importa funciones de alertas y cargar el header
import { alertaOK, alertaError } from "../alertas.js";
import { cargarHeader } from "../header.js";

// Obtiene el hash de la URL (quitando el #) y lo divide en dos partes
const hasher = window.location.hash.slice(1);
const [hash, id] = hasher.split("/");

// Obtiene referencia al formulario
const form = document.querySelector(".form");

// Obtiene referencias a los elementos del formulario
const numeroMesa = document.querySelector(".numero");
const idCaja = document.querySelector(".caja");
const numeroClientes = document.querySelector(".numeroClientes");
const correoCliente = document.querySelector(".correoCliente");
const metodoPago = document.querySelector(".metodoPago");

// Cuando el DOM está cargado
document.addEventListener("DOMContentLoaded", async () => {
    // Carga la información del header
    cargarHeader(hash)

    // Configura el botón de volver para que redirija a la tabla de pedidos
    const botonVolver = document.getElementById("volver");
    botonVolver.action = `pedidosTablas.html#${hash}`;

    // Configura el botón de crear cliente para que lleve al formulario de creación
    const botonCrear = document.getElementById("crearCliente");
    botonCrear.action = `clienteCrear.html#${hash}/pc`;

    try {
        // Solicita la lista de mesas
        const resMesas = await fetch("http://localhost:8080/ApiRestaurente/api/mesas");
        const mesas = await resMesas.json();

        // Agrega las mesas disponibles al select
        mesas.forEach(m => {
            if (m.disponible == "1") {
                const opt = document.createElement("option");
                opt.value = m.numero;
                opt.textContent = `#${m.numero} (capacidad ${m.capacidad})`;
                numeroMesa.appendChild(opt);
            }
        });

        // Solicita la lista de cajas
        const resCajas = await fetch("http://localhost:8080/ApiRestaurente/api/caja");
        const cajas = await resCajas.json();

        // Agrega las cajas abiertas al select
        cajas.forEach(c => {
            if (!c.montoCierre && !c.horaCierre && !c.horaCierre) {
                const opt = document.createElement("option");
                opt.value = c.id;
                opt.textContent = `Caja #${c.id}:${c.nombreCajero}`;
                idCaja.appendChild(opt);
            }
        });

        // Si existe un id en el hash, lo coloca como correo del cliente
        if (id) {
            correoCliente.value = id;
        }
    } catch (err) {
        console.error("Error al cargar listas:", err);
    }
});

// Función para validar y enviar el formulario
const validar = async (e) => {
    e.preventDefault();

    // Crea el objeto con los datos del formulario
    const datos = {
        numeroMesa: numeroMesa.value,
        idCaja: idCaja.value,
        numeroClientes: numeroClientes.value,
        correoCliente: correoCliente.value,
        metodoPago: metodoPago.value
    };

    try {
        // Envía los datos del pedido al backend
        const res = await fetch("http://localhost:8080/ApiRestaurente/api/pedidos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        // Obtiene la respuesta como texto
        const texto = await res.text();

        try {
            // Intenta parsear la respuesta como JSON
            const mensaje = JSON.parse(texto);
            console.log("JSON recibido:", mensaje);

            // Cambia el estado de la mesa a ocupada
            cambiarEstado(mensaje.mensaje, numeroMesa.value, mensaje.id);
        } catch (e) {
            // Si no es JSON, muestra el texto plano
            console.log("Error o texto plano:", texto);
        }

        // Si hubo error en la petición, lanza excepción
        if (!res.ok) throw new Error(texto);
    } catch (error) {
        alertaError(error.message);
    }
};

// Función para cambiar el estado de una mesa y redirigir al detalle del pedido
const cambiarEstado = async (mensaje, id, pedido) => {
    try {
        // Cuerpo de la petición: mesa no disponible
        const disponibles = { disponible: "0" };

        // Envía PATCH para actualizar la mesa
        const respuesta = await fetch(`http://localhost:8080/ApiRestaurente/api/mesas/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(disponibles)
        });

        // Si falla la actualización, lanza error
        if (!respuesta.ok) throw new Error("Error al cambiar el estado");

        // Muestra la respuesta en consola
        const resultado = await respuesta.text();
        console.log(resultado);

        // Muestra alerta de éxito
        await alertaOK(mensaje);

        // Redirige automáticamente al detalle del pedido creado
        form.action = `../detallePedidos/detallePedidoCrear.html#${hash}/${pedido}`
        form.submit();
    } catch (error) {
        console.error("Falló el cambio de estado:", error);
    }
}

// Asocia el evento submit del formulario a la función validar
form.addEventListener("submit", validar);
