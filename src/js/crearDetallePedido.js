import { alertaOK } from "./alertas";
import { cargarHeader } from "./header";

const contenedor = document.getElementById("contenedorItems");
const formulario = document.getElementById("formularioDetalle");

const hash = window.location.hash.slice(1);
const lista = hash.split("/");
const idUser = lista[0];
const idPedido = lista[1];

const endpoints = [
    { url: "http://localhost:8080/ApiRestaurente/api/comidas", tipo: "Comida" },
    { url: "http://localhost:8080/ApiRestaurente/api/bebidas", tipo: "Bebida" },
    { url: "http://localhost:8080/ApiRestaurente/api/cocteles", tipo: "Coctel" }
];

// Cargar todas las categorías
const cargarItems = async () => {
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

                divHijo.innerHTML = `
                    <p><strong>${endpoint.tipo}:</strong> ${item.nombre}</p>
                    <button type="button" class="btn-restar">-</button>
                    <span class="cantidad">0</span>
                    <button type="button" class="btn-sumar">+</button>
                `;
                divPadre.appendChild(divHijo);
            })
            contenedor.append(divPadre);
        } catch (e) {
            console.error("Error:", e);
        }
    }
};

// Manejar clics para sumar/restar
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

// Al enviar el formulario
formulario.addEventListener("submit", async (e) => {
    e.preventDefault();
    const listaComidas = [];
    const listaBebidas = [];
    const listaCocteles = [];
    document.querySelectorAll(".itemComida").forEach(item => {
        const cantidad = parseInt(item.querySelector(".cantidad").textContent);
        if (cantidad >= 1) {
            listaComidas.push({
                id: item.dataset.valorId,
                cantidad: cantidad
            });
        }
    });
    document.querySelectorAll(".itemBebida").forEach(item => {
        const cantidad = parseInt(item.querySelector(".cantidad").textContent);
        if (cantidad >= 1) {
            listaBebidas.push({
                id: item.dataset.valorId,
                cantidad: cantidad
            });
        }
    });
    document.querySelectorAll(".itemCoctel").forEach(item => {
        const cantidad = parseInt(item.querySelector(".cantidad").textContent);
        if (cantidad >= 1) {
            listaCocteles.push({
                id: item.dataset.valorId,
                cantidad: cantidad
            });
        }
    })
    let mayor = Math.max(listaComidas.length, listaBebidas.length, listaCocteles.length);
    
    for (let cont = 0; cont < mayor; cont++) {
        const datos = {
            id_pedido: idPedido,
            id_comida: !listaComidas[cont] ? "":listaComidas[cont].id,
            cantidad_comida: !listaComidas[cont] ? "":listaComidas[cont].cantidad,
            id_bebida: !listaBebidas[cont] ? "":listaBebidas[cont].id,
            cantidad_bebida: !listaBebidas[cont] ? "":listaBebidas[cont].cantidad,
            id_coctel: !listaCocteles[cont] ? "":listaCocteles[cont].id,
            cantidad_coctel: !listaCocteles[cont] ? "":listaCocteles[cont].cantidad,
        };
        try {
            const response = await fetch("http://localhost:8080/ApiRestaurente/api/detallePedido", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });

            const mensaje = await response.text();

            if (!response.ok) {
                throw new Error(mensaje);
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    await alertaOK(`Pedido #${idPedido}: Añadido platillos con EXITO.`);
        formulario.action = `pedidos.html#${idUser}`
        formulario.submit();
    ;
});

document.addEventListener("DOMContentLoaded", () => {
    cargarHeader(idUser)
    cargarItems();
    const botonVolver = document.getElementById("volver");
    botonVolver.action = `pedidos.html#${idUser}`;
});
