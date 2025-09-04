import { alertaError, alertaOK, alertaPregunta, alertaWarning } from "../../Helpers/alertas"; 
// Importa funciones para mostrar distintos tipos de alertas: error, éxito, pregunta y warning

import * as api from "../../Helpers/api"; 
// Importa funciones para llamadas a la API (GET, POST, PATCH, DELETE)

// 👇 bandera para no duplicar listeners de los botones + y -
let listenerSumarRestar = false;

export default async () => {
  const app = document.getElementById("app"); // Contenedor principal de la vista

  const form = document.querySelector(".formDetallePedido"); // Formulario de detalle de pedido
  const contComidas = document.querySelector(".comidas"); // Contenedor de comidas
  const contBebidas = document.querySelector(".bebidas"); // Contenedor de bebidas
  const contCocteles = document.querySelector(".cocteles"); // Contenedor de cocteles

  // ---- HASH: #/DetallePedido=idUser,idPedido,metodo
  const hash = location.hash.slice(1); // Quita el #
  const [url, id] = hash.split("="); // Extrae la ID del pedido

  // ---- FUNCIONES AUXILIARES PARA RENDERIZAR ITEMS ----
  const crearItem = (tipo, item, ingredientesTexto = "") => {
    const div = document.createElement("div");
    div.className = `item item${tipo}`; // Clase según el tipo
    div.dataset.valorId = item.id; // Guardar id del item

    // Texto extra según el tipo de item
    let extra = "";
    if (tipo == "Comida") extra = `Tipo: ${item.tipo}, ${ingredientesTexto}`;
    if (tipo == "Bebida") extra = `Unidad: ${item.unidad}, Tipo: ${item.tipo}`;
    if (tipo == "Coctel") extra = ingredientesTexto;

    // Estructura interna del item
    div.innerHTML = `
      <p>${item.nombre}</p>
      <img src="http://localhost:8080/ApiRestaurante/IMAGENES/${item.imagen}" alt="${item.nombre}" />
      <p class="descripcion">${extra}, Precio: ${item.precio}$</p>
      <div class="itemBotones">
        <button type="button" class="btn-restar">-</button>
        <button type="button" class="btn-sumar">+</button>
      </div>
      <input class="cantidad" type="text" value="0" autocomplete="off" />
      <p class="descripcion">Nota:(opcional)</p>
      <textarea class="nota" autocomplete="off"></textarea>
    `;
    return div; // Devuelve el div creado
  };

  // Cargar comidas desde la API
  const cargarComidas = async () => {
    const comidas = await api.get("comidas"); 
    for (const c of comidas) {
      if (c.disponible != "1") continue; // Saltar si no está disponible
      const ingredientes = await api.get(`ingredientesComida/comida/${c.id}`);
      const textoIng = "Ingredientes: " + ingredientes.map(i => i.nombreIngrediente).join(", ");
      contComidas.appendChild(crearItem("Comida", c, textoIng)); // Añadir al contenedor
    }
  };

  // Cargar bebidas desde la API
  const cargarBebidas = async () => {
    const bebidas = await api.get("bebidas");
    bebidas.forEach(b => {
      if (b.disponible != "1") return;
      contBebidas.appendChild(crearItem("Bebida", b));
    });
  };

  // Cargar cocteles desde la API
  const cargarCocteles = async () => {
    const cocteles = await api.get("cocteles");
    for (const c of cocteles) {
      if (c.disponible != "1") continue;
      const ingredientes = await api.get(`ingredientesCoctel/coctel/${c.id}`);
      const textoIng = "Ingredientes: " + ingredientes.map(i => i.nombreIngrediente).join(", ");
      contCocteles.appendChild(crearItem("Coctel", c, textoIng));
    }
  };

  // Cargar los detalles del pedido y rellenar cantidades y notas
  const cargarDetallePedido = async () => {
    const detalles = await api.get(`detallePedido/${id}`);
    detalles.forEach(d => {
      if (d.id_comida) {
        const item = contComidas.querySelector(`[data-valor-id="${d.id_comida}"]`);
        if (item) {
          item.querySelector(".cantidad").value = d.cantidad_comida;
          item.querySelector(".nota").value = d.nota_comida || "";
        }
      }
      if (d.id_bebida) {
        const item = contBebidas.querySelector(`[data-valor-id="${d.id_bebida}"]`);
        if (item) {
          item.querySelector(".cantidad").value = d.cantidad_bebida;
          item.querySelector(".nota").value = d.nota_bebida || "";
        }
      }
      if (d.id_coctel) {
        const item = contCocteles.querySelector(`[data-valor-id="${d.id_coctel}"]`);
        if (item) {
          item.querySelector(".cantidad").value = d.cantidad_coctel;
          item.querySelector(".nota").value = d.nota_coctel || "";
        }
      }
    });
  };

  // ---- BOTONES SUMAR / RESTAR ----
  if (!listenerSumarRestar) { // Solo agregar listener una vez
    app.addEventListener("click", async (e) => {
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

        inputCantidad.value = cantidad; // Actualiza el input
      }
    });

    listenerSumarRestar = true; // Evita duplicar listeners
  }

  // Validar que input de cantidad solo acepte números hasta 90
  const validarTeclado = (e) => {
    const tecla = e.key;
    if (["Backspace", "ArrowLeft", "ArrowRight", "Tab"].includes(tecla)) return;

    if (!/^[0-9]$/.test(tecla)) e.preventDefault();

    const nuevoValor = e.target.value + tecla;
    if (nuevoValor.length > 2 || parseInt(nuevoValor) > 90) e.preventDefault();
  };

  // Validar nota max 250 caracteres
  const validarTeclado255 = (e) => {
    const tecla = e.key;
    if (["Backspace", "ArrowLeft", "ArrowRight", "Tab"].includes(tecla)) return;

    const nuevoValor = e.target.value + tecla;
    if (nuevoValor.length > 250) e.preventDefault();
  };

  document.addEventListener("keydown", (e) => {
    if (e.target.classList.contains("cantidad")) validarTeclado(e);
    if (e.target.classList.contains("nota")) validarTeclado255(e);
  });

  // ---- CARGAR DATOS ----
  await cargarComidas();
  await cargarBebidas();
  await cargarCocteles();
  await cargarDetallePedido();

  // ---- ENVÍO DEL FORMULARIO ----
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const listaComidas = [];
    const listaBebidas = [];
    const listaCocteles = [];

    // Recorre los items y arma arrays solo con los que tienen cantidad >= 1
    document.querySelectorAll(".itemComida").forEach(item => {
      const cantidad = parseInt(item.querySelector(".cantidad").value) || 0;
      const nota = item.querySelector(".nota").value.trim();
      if (cantidad >= 1) listaComidas.push({ id: item.dataset.valorId, cantidad, nota });
    });
    document.querySelectorAll(".itemBebida").forEach(item => {
      const cantidad = parseInt(item.querySelector(".cantidad").value) || 0;
      const nota = item.querySelector(".nota").value.trim();
      if (cantidad >= 1) listaBebidas.push({ id: item.dataset.valorId, cantidad, nota });
    });
    document.querySelectorAll(".itemCoctel").forEach(item => {
      const cantidad = parseInt(item.querySelector(".cantidad").value) || 0;
      const nota = item.querySelector(".nota").value.trim();
      if (cantidad >= 1) listaCocteles.push({ id: item.dataset.valorId, cantidad, nota });
    });

    if (listaComidas.length == 0 && listaBebidas.length == 0 && listaCocteles.length == 0) {
      return await alertaError("Seleccione al menos un platillo (Comida, Bebida o Coctel)");
    }

    // Eliminar detalles existentes
    await api.del(`detallePedido/${id}`);

    // Insertar nuevos detalles (alineando arrays)
    const maxLen = Math.max(listaComidas.length, listaBebidas.length, listaCocteles.length);
    for (let i = 0; i < maxLen; i++) {
      const datos = {
        id_pedido: id,
        id_comida: listaComidas[i]?.id || "",
        cantidad_comida: String(listaComidas[i]?.cantidad || ""),
        nota_comida: listaComidas[i]?.nota || "",
        id_bebida: listaBebidas[i]?.id || "",
        cantidad_bebida: String(listaBebidas[i]?.cantidad || ""),
        nota_bebida: listaBebidas[i]?.nota || "",
        id_coctel: listaCocteles[i]?.id || "",
        cantidad_coctel: String(listaCocteles[i]?.cantidad || ""),
        nota_coctel: listaCocteles[i]?.nota || ""
      };
      await api.post("detallePedido", datos);
    }

    // Marcar pedido como actualizado
    await api.patch(`pedidos/${id}`, {});

    await alertaOK(`Pedido #${id}: Detalles actualizados con éxito.`);
    window.location.href = '#/Pedido'; // Redirigir al listado de pedidos
  });
};
