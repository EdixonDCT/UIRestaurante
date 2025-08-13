import { alertaOK, alertaError, alertaWarning } from "../alertas.js";
import { cargarHeader } from "../header.js";

const formulario = document.getElementById("form");

const comidas = document.querySelector(".comidas");
const bebidas = document.querySelector(".bebidas");
const cocteles = document.querySelector(".cocteles");
const hash = window.location.hash.slice(1);
const [idUser, idPedido, metodo] = hash.split("/");
let rutaVolverIrse = ""
if (metodo == "p") rutaVolverIrse = `../pedidos/pedidosTablas.html#${idUser}`
else if (metodo == "r") rutaVolverIrse = `../reservas/reservasTablas.html#${idUser}`
// Funciones para cargar productos con await y for..of para garantizar carga ordenada

const cargarComidas = async () => {
    try {
        const res = await fetch("http://localhost:8080/ApiRestaurente/api/comidas");
        if (!res.ok) throw new Error("Error cargando comidas");
        const lista = await res.json();

        for (const item of lista) {
            if (item.disponible == "1") {
                try {
                    const ingredientesRes = await fetch(`http://localhost:8080/ApiRestaurente/api/ingredientesComida/comida/${item.id}`);
                    if (!ingredientesRes.ok) throw new Error("Error cargando ingredientes");
                    const ingredientes = await ingredientesRes.json();

                    let ingredienteTexto = "Ingredientes: " + ingredientes.map(i => i.nombreIngrediente).join(", ");

                    const divHijo = document.createElement("div");
                    divHijo.className = "item itemComida";
                    divHijo.dataset.valorId = item.id;

                    divHijo.innerHTML = `
            <p>${item.nombre}</p>
            <img src="http://localhost:8080/ApiRestaurente/IMAGENES/${item.imagen}" alt="${item.nombre}" />
            <p class="descripcion">Tipo: ${item.tipo}, ${ingredienteTexto}, Precio: ${item.precio}$</p>
            <div class="itemBotones">
              <button type="button" class="btn-restar">-</button>
              <button type="button" class="btn-sumar">+</button>
            </div>
            <input class="cantidad" type="text" value="0" autocomplete="off" />
            <p class="descripcion">Nota:(opcional)</p>
            <textarea class="nota" autocomplete="off"></textarea>
          `;

                    comidas.appendChild(divHijo);
                } catch (error) {
                    alertaError(error.message);
                }
            }
        }
    } catch (error) {
        alertaError(error.message);
    }
};

const cargarBebidas = async () => {
    try {
        const res = await fetch("http://localhost:8080/ApiRestaurente/api/bebidas");
        if (!res.ok) throw new Error("Error cargando bebidas");
        const lista = await res.json();

        for (const item of lista) {
            if (item.disponible == "1") {
                const divHijo = document.createElement("div");
                divHijo.className = "item itemBebida";
                divHijo.dataset.valorId = item.id;

                divHijo.innerHTML = `
          <p>${item.nombre}</p>
          <img src="http://localhost:8080/ApiRestaurente/IMAGENES/${item.imagen}" alt="${item.nombre}" />
          <p class="descripcion">Unidad: ${item.unidad}, Tipo: ${item.tipo}, Precio: ${item.precio}$</p>
          <div class="itemBotones">
            <button type="button" class="btn-restar">-</button>
            <button type="button" class="btn-sumar">+</button>
          </div>
          <input class="cantidad" type="text" value="0" autocomplete="off" />
          <p class="descripcion">Nota:(opcional)</p>
          <textarea class="nota" autocomplete="off"></textarea>
        `;

                bebidas.appendChild(divHijo);
            }
        }
    } catch (error) {
        alertaError(error.message);
    }
};

const cargarCocteles = async () => {
    try {
        const res = await fetch("http://localhost:8080/ApiRestaurente/api/cocteles");
        if (!res.ok) throw new Error("Error cargando cocteles");
        const lista = await res.json();

        for (const item of lista) {
            if (item.disponible == "1") {
                try {
                    const ingredientesRes = await fetch(`http://localhost:8080/ApiRestaurente/api/ingredientesCoctel/coctel/${item.id}`);
                    if (!ingredientesRes.ok) throw new Error("Error cargando ingredientes coctel");
                    const ingredientes = await ingredientesRes.json();

                    let ingredienteTexto = "Ingredientes: " + ingredientes.map(i => i.nombreIngrediente).join(", ");

                    const divHijo = document.createElement("div");
                    divHijo.className = "item itemCoctel";
                    divHijo.dataset.valorId = item.id;

                    divHijo.innerHTML = `
            <p>${item.nombre}</p>
            <img src="http://localhost:8080/ApiRestaurente/IMAGENES/${item.imagen}" alt="${item.nombre}" />
            <p class="descripcion">${ingredienteTexto}, Precio: ${item.precio}$</p>
            <div class="itemBotones">
              <button type="button" class="btn-restar">-</button>
              <button type="button" class="btn-sumar">+</button>
            </div>
            <input class="cantidad" type="text" value="0" autocomplete="off" />
            <p class="descripcion">Nota:(opcional)</p>
            <textarea class="nota" autocomplete="off"></textarea>
          `;

                    cocteles.appendChild(divHijo);
                } catch (error) {
                    alertaError(error.message);
                }
            }
        }
    } catch (error) {
        alertaError(error.message);
    }
};

// Función para cargar los detalles actuales del pedido y setear cantidades y notas
const cargarDetallePedido = async () => {
    try {
        const res = await fetch(`http://localhost:8080/ApiRestaurente/api/detallePedido/${idPedido}`);
        if (!res.ok) throw new Error("Error al cargar detalle del pedido");
        const detalles = await res.json();

        detalles.forEach(detalle => {
            if (detalle.id_comida) {
                const item = comidas.querySelector(`.itemComida[data-valor-id="${detalle.id_comida}"]`);
                if (item) {
                    item.querySelector(".cantidad").value = detalle.cantidad_comida;
                    item.querySelector(".nota").value = detalle.nota_comida || "";
                }
            }
            if (detalle.id_bebida) {
                const item = bebidas.querySelector(`.itemBebida[data-valor-id="${detalle.id_bebida}"]`);
                if (item) {
                    item.querySelector(".cantidad").value = detalle.cantidad_bebida;
                    item.querySelector(".nota").value = detalle.nota_bebida || "";
                }
            }
            if (detalle.id_coctel) {
                const item = cocteles.querySelector(`.itemCoctel[data-valor-id="${detalle.id_coctel}"]`);
                if (item) {
                    item.querySelector(".cantidad").value = detalle.cantidad_coctel;
                    item.querySelector(".nota").value = detalle.nota_coctel || "";
                }
            }
        });
    } catch (error) {
        alertaError(error.message);
    }
};

// Botones + y - para cantidades
window.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-sumar") || e.target.classList.contains("btn-restar")) {
        const padre = e.target.closest(".item");
        const inputCantidad = padre.querySelector(".cantidad");
        let cantidad = parseInt(inputCantidad.value) || 0;

        if (e.target.classList.contains("btn-sumar") && cantidad < 90) {
            cantidad++;
        } else if (e.target.classList.contains("btn-restar") && cantidad > 0) {
            cantidad--;
        } else if (cantidad == 90) {
            await alertaWarning("Cuidado: el límite es 90");
        }

        inputCantidad.value = cantidad;
    }
});

// Validar solo números y max 2 dígitos (max 90)
const validarTeclado = (e) => {
    const tecla = e.key;
    if (["Backspace", "ArrowLeft", "ArrowRight", "Tab"].includes(tecla)) return;

    if (!/^[0-9]$/.test(tecla)) {
        e.preventDefault();
        return;
    }

    const nuevoValor = e.target.value + tecla;
    if (nuevoValor.length > 2 || parseInt(nuevoValor) > 90) {
        e.preventDefault();
    }
};

// Validar nota max 250 caracteres
const validarTeclado255 = (e) => {
    const tecla = e.key;
    if (["Backspace", "ArrowLeft", "ArrowRight", "Tab"].includes(tecla)) return;

    const nuevoValor = e.target.value + tecla;
    if (nuevoValor.length > 250) {
        e.preventDefault();
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    await cargarHeader(idUser);
    await cargarComidas();
    await cargarBebidas();
    await cargarCocteles();
    await cargarDetallePedido();

    const botonVolver = document.getElementById("volver");
    botonVolver.action = rutaVolverIrse;
});

document.addEventListener("keydown", (e) => {
    if (e.target.classList.contains("cantidad")) {
        validarTeclado(e);
    }
});

document.addEventListener("keydown", (e) => {
    if (e.target.classList.contains("nota")) {
        validarTeclado255(e);
    }
});

formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const listaComidas = [];
    const listaBebidas = [];
    const listaCocteles = [];

    document.querySelectorAll(".itemComida").forEach(item => {
        const cantidad = parseInt(item.querySelector(".cantidad").value) || 0;
        const nota = item.querySelector(".nota").value.trim();
        if (cantidad >= 1) {
            listaComidas.push({
                id: item.dataset.valorId,
                cantidad,
                nota
            });
        }
    });

    document.querySelectorAll(".itemBebida").forEach(item => {
        const cantidad = parseInt(item.querySelector(".cantidad").value) || 0;
        const nota = item.querySelector(".nota").value.trim();
        if (cantidad >= 1) {
            listaBebidas.push({
                id: item.dataset.valorId,
                cantidad,
                nota
            });
        }
    });

    document.querySelectorAll(".itemCoctel").forEach(item => {
        const cantidad = parseInt(item.querySelector(".cantidad").value) || 0;
        const nota = item.querySelector(".nota").value.trim();
        if (cantidad >= 1) {
            listaCocteles.push({
                id: item.dataset.valorId,
                cantidad,
                nota
            });
        }
    });
    if (listaComidas.length == 0 && listaBebidas.length == 0 && listaCocteles == 0) {
        return await alertaError("Error: seleccione almenos un platillo: Comida,Bebida o Coctel")
    }
    // Guardar todos los nuevos detalles
    const maxLen = Math.max(listaComidas.length, listaBebidas.length, listaCocteles.length);
    try {
        const response = await fetch(`http://localhost:8080/ApiRestaurente/api/detallePedido/${idPedido}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        const mensaje = await response.text();
        if (!response.ok) {
            throw new Error(mensaje);
        }
    } catch (error) {
        console.log(error.message);
    }
    for (let i = 0; i < maxLen; i++) {
        const datos = {
            id_pedido: idPedido,
            id_comida: listaComidas[i] ? listaComidas[i].id : "",
            cantidad_comida: listaComidas[i] ? listaComidas[i].cantidad : "",
            nota_comida: listaComidas[i] ? listaComidas[i].nota : "",

            id_bebida: listaBebidas[i] ? listaBebidas[i].id : "",
            cantidad_bebida: listaBebidas[i] ? listaBebidas[i].cantidad : "",
            nota_bebida: listaBebidas[i] ? listaBebidas[i].nota : "",

            id_coctel: listaCocteles[i] ? listaCocteles[i].id : "",
            cantidad_coctel: listaCocteles[i] ? listaCocteles[i].cantidad : "",
            nota_coctel: listaCocteles[i] ? listaCocteles[i].nota : ""
        };
        try {
            const response = await fetch("http://localhost:8080/ApiRestaurente/api/detallePedido", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            const mensaje = await response.text();
            console.log(mensaje);
            if (!response.ok) {
                throw new Error(mensaje);
            }
        } catch (error) {
            alertaError(error.message);
            return;
        }
    }

    try {
        const res = await fetch(`http://localhost:8080/ApiRestaurente/api/pedidos/${idPedido}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" }
        });
        if (!res.ok) {
            const msg = await res.text();
            throw new Error(msg);
        }
    } catch (error) {
        console.error(error.message);
    }

    await alertaOK(`Pedido #${idPedido}: Detalles actualizados con éxito.`);
    formulario.action = rutaVolverIrse;
    formulario.submit();
});
