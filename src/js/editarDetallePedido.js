import { alertaOK } from "./alertas.js";
import { cargarHeader } from "./header.js";

const contenedor = document.getElementById("contenedorItems");
const formulario = document.getElementById("formularioDetalle");

const hash = window.location.hash.slice(1);
const lista = hash.split("/");
const idUser = lista[0];
const idPedido = lista[1];
const proviene = lista[2]
let  volverIrse = "";
if (proviene == "r") volverIrse = `reservas.html#${idUser}`;
else if (proviene == "p") volverIrse = `pedidos.html#${idUser}`;

const endpoints = [
    { url: "http://localhost:8080/ApiRestaurente/api/comidas", tipo: "Comida" },
    { url: "http://localhost:8080/ApiRestaurente/api/bebidas", tipo: "Bebida" },
    { url: "http://localhost:8080/ApiRestaurente/api/cocteles", tipo: "Coctel" }
];

let detalleActual = [];

const cargarDetalleExistente = async () => {
    try {
        const res = await fetch(`http://localhost:8080/ApiRestaurente/api/detallePedido/${idPedido}`);
        if (!res.ok) throw new Error("Error cargando detalle actual");
        detalleActual = await res.json();
    } catch (e) {
        console.error("Error cargando detalles:", e);
    }
};

const cargarItems = async () => {
    contenedor.innerHTML = ""; //Esta línea limpia los datos viejos

    for (const endpoint of endpoints) {
        try {
            const res = await fetch(endpoint.url);
            if (!res.ok) throw new Error("Error cargando " + endpoint.tipo);
            const lista = await res.json();
            const divPadre = document.createElement("div");
            const textPadre = document.createElement("h2");
            textPadre.textContent = endpoint.tipo;
            divPadre.appendChild(textPadre);

            lista.forEach(item => {
                const divHijo = document.createElement("div");
                divHijo.className = "item";
                divHijo.classList.add(`item${endpoint.tipo}`);
                divHijo.dataset.valorId = item.id;

                const cantidadExistente = obtenerCantidadExistente(endpoint.tipo.toLowerCase(), item.id);

                divHijo.innerHTML = `
                    <p><strong>${endpoint.tipo}:</strong> ${item.nombre}</p>
                    <button type="button" class="btn-restar">-</button>
                    <span class="cantidad">${cantidadExistente}</span>
                    <button type="button" class="btn-sumar">+</button>
                `;
                divPadre.appendChild(divHijo);
            });
            contenedor.append(divPadre);
        } catch (e) {
            console.error("Error:", e);
        }
    }
};

const obtenerCantidadExistente = (tipo, idItem) => {
    const campo = {
        comida: "id_comida",
        bebida: "id_bebida",
        coctel: "id_coctel"
    }[tipo];

    const cantidadCampo = `cantidad_${tipo}`;

    const encontrado = detalleActual.find(d =>
        d[campo] && d[campo].toString() === idItem.toString()
    );

    return encontrado ? encontrado[cantidadCampo] : 0;
};

window.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-sumar") || e.target.classList.contains("btn-restar")) {
        const padre = e.target.closest(".item");
        const spanCantidad = padre.querySelector(".cantidad");
        let cantidad = parseInt(spanCantidad.textContent);

        if (e.target.classList.contains("btn-sumar")) {
            cantidad++;
        } else if (cantidad > 0) {
            cantidad--;
        }

        spanCantidad.textContent = cantidad;
    }
});

formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        await fetch(`http://localhost:8080/ApiRestaurente/api/detallePedido/${idPedido}`, {
            method: "DELETE"
        });
    } catch (err) {
        console.error("Error borrando detalles antiguos:", err);
    }

    const listaComidas = [];
    const listaBebidas = [];
    const listaCocteles = [];

    document.querySelectorAll(".itemComida").forEach(item => {
        const cantidad = parseInt(item.querySelector(".cantidad").textContent);
        if (cantidad >= 1) {
            listaComidas.push({ id: item.dataset.valorId, cantidad });
        }
    });
    document.querySelectorAll(".itemBebida").forEach(item => {
        const cantidad = parseInt(item.querySelector(".cantidad").textContent);
        if (cantidad >= 1) {
            listaBebidas.push({ id: item.dataset.valorId, cantidad });
        }
    });
    document.querySelectorAll(".itemCoctel").forEach(item => {
        const cantidad = parseInt(item.querySelector(".cantidad").textContent);
        if (cantidad >= 1) {
            listaCocteles.push({ id: item.dataset.valorId, cantidad });
        }
    });

    const mayor = Math.max(listaComidas.length, listaBebidas.length, listaCocteles.length);

    for (let i = 0; i < mayor; i++) {
        const datos = {
            id_pedido: idPedido,
            id_comida: listaComidas[i]?.id || "",
            cantidad_comida: listaComidas[i]?.cantidad || "",
            id_bebida: listaBebidas[i]?.id || "",
            cantidad_bebida: listaBebidas[i]?.cantidad || "",
            id_coctel: listaCocteles[i]?.id || "",
            cantidad_coctel: listaCocteles[i]?.cantidad || ""
        };

        try {
            const res = await fetch("http://localhost:8080/ApiRestaurente/api/detallePedido", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            const mensaje = await res.text();
            if (!res.ok) throw new Error(mensaje);
        } catch (error) {
            console.error("Error al enviar:", error.message);
        }
    }

    await alertaOK(`Pedido #${idPedido}: Editado con ÉXITO.`);
    formulario.action = volverIrse;
    formulario.submit();
});

document.addEventListener("DOMContentLoaded", async () => {
    cargarHeader(idUser)
    await cargarDetalleExistente();
    await cargarItems();
    const botonVolver = document.getElementById("volver");
    botonVolver.action = volverIrse;
});

