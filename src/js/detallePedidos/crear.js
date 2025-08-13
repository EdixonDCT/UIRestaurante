import { alertaOK,alertaError, alertaWarning } from "../alertas";
import { cargarHeader } from "../header";

const formulario = document.getElementById("form");

const comidas = document.querySelector(".comidas");
const bebidas = document.querySelector(".bebidas");
const cocteles = document.querySelector(".cocteles");
const hash = window.location.hash.slice(1);
const lista = hash.split("/");
const idUser = lista[0];
const idPedido = lista[1];

const cargarComidas = async () => {
    try {
            const res = await fetch("http://localhost:8080/ApiRestaurente/api/comidas");
            if (!res.ok) throw new Error("Error cargando");
            const lista = await res.json();
            lista.forEach(async(item)=> {
              if (item.disponible == "1") {
                try {
                    const ingredientesComida = await fetch(`http://localhost:8080/ApiRestaurente/api/ingredientesComida/comida/${item.id}`);
                    const listas = await ingredientesComida.json();
                    if (!ingredientesComida.ok) throw new Error(listas);
                    let ingrediente = "Ingredientes: ";
                    let contadorComas = 0;
                    listas.forEach(ingredientes => {
                    if (contadorComas == 0)
                    {
                      contadorComas++;
                      ingrediente += ingredientes.nombreIngrediente;    
                    }
                    else
                    {
                      ingrediente += ", "+ingredientes.nombreIngrediente;   
                    }
                    });
                    const divHijo = document.createElement("div");
                    divHijo.className =   "item";
                    divHijo.classList.add(`itemComida`);
                    divHijo.dataset.valorId = item.id;

                    divHijo.innerHTML = `
                <p>${item.nombre}</p>
                <img src=http://localhost:8080/ApiRestaurente/IMAGENES/${item.imagen}>
                <p class="descripcion">
                Tipo: ${item.tipo},
                ${ingrediente},
                Precio: ${item.precio}$
                </p> 
                <div class="itemBotones">
                <button type="button" class="btn-restar">-</button>
                <button type="button" class="btn-sumar">+</button>
                </div>
                <input class="cantidad" type="text" value="0" autocomplete="off">
                <p class="descripcion">Nota:(opcional)</p>
                <textarea class="nota" type="text" autocomplete="off" value=""></textarea>
                `;
                comidas.appendChild(divHijo);
                  } catch (error) {
                     alertaError(error.message);
                  }
                }
            })
        } catch (e) {
             alertaError(error.message);
        }
}
const cargarBebidas = async () => {
    try {
            const res = await fetch("http://localhost:8080/ApiRestaurente/api/bebidas");
            if (!res.ok) throw new Error("Error cargando");
      const lista = await res.json();      
            lista.forEach(async(item)=> {
              if (item.disponible == "1") {
                    const divHijo = document.createElement("div");
                    divHijo.className =   "item";
                    divHijo.classList.add(`itemBebida`);
                    divHijo.dataset.valorId = item.id;

                    divHijo.innerHTML = `
                <p>${item.nombre}</p>
                <img src=http://localhost:8080/ApiRestaurente/IMAGENES/${item.imagen}>
                <p class="descripcion">
                Unidad: ${item.unidad},Tipo: ${item.tipo},Precio: ${item.precio}$
                </p> 
                <div class="itemBotones">
                <button type="button" class="btn-restar">-</button>
                <button type="button" class="btn-sumar">+</button>
                </div>
                <input class="cantidad" type="text" value="0" autocomplete="off">
                <p class="descripcion">Nota:(opcional)</p>
                <textarea class="nota" type="text" autocomplete="off" value=""></textarea>
                `;
                bebidas.appendChild(divHijo);
                }
            })
        } catch (e) {
             alertaError(error.message);
        }
}
const cargarCocteles = async () => {
    try {
            const res = await fetch("http://localhost:8080/ApiRestaurente/api/cocteles");
            if (!res.ok) throw new Error("Error cargando");
            const lista = await res.json();
            lista.forEach(async(item)=> {
              if (item.disponible == "1") {
                try {
                    const ingredientesComida = await fetch(`http://localhost:8080/ApiRestaurente/api/ingredientesCoctel/coctel/${item.id}`);
                    const listas = await ingredientesComida.json();
                    if (!ingredientesComida.ok) throw new Error(listas);
                    let ingrediente = "Ingredientes: ";
                    let contadorComas = 0;
                    listas.forEach(ingredientes => {
                    if (contadorComas == 0)
                    {
                      contadorComas++;
                      ingrediente += ingredientes.nombreIngrediente;    
                    }
                    else
                    {
                      ingrediente += ", "+ingredientes.nombreIngrediente;   
                    }
                    });
                    const divHijo = document.createElement("div");
                    divHijo.className =   "item";
                    divHijo.classList.add(`itemCoctel`);
                    divHijo.dataset.valorId = item.id;

                    divHijo.innerHTML = `
                <p>${item.nombre}</p>
                <img src=http://localhost:8080/ApiRestaurente/IMAGENES/${item.imagen}>
                <p class="descripcion">
                ${ingrediente},
                Precio: ${item.precio}$
                </p> 
                <div class="itemBotones">
                <button type="button" class="btn-restar">-</button>
                <button type="button" class="btn-sumar">+</button>
                </div>
                <input class="cantidad" type="text" value="0" autocomplete="off">
                <p class="descripcion">Nota:(opcional)</p>
                <textarea class="nota" type="text" autocomplete="off" value=""></textarea>
                `;
                cocteles.appendChild(divHijo);
                  } catch (error) {
                     alertaError(error.message);
                  }
                }
            })
        } catch (e) {
             alertaError(error.message);
        }
}

window.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-sumar") || e.target.classList.contains("btn-restar")) {
        const padre = e.target.closest(".item");
        const spanCantidad = padre.querySelector(".cantidad");
      let cantidad = spanCantidad.value;
      
        if (e.target.classList.contains("btn-sumar") && cantidad < 90) {
          cantidad++;
        }
        else if (e.target.classList.contains("btn-restar") && cantidad > 0) {
          cantidad--;
        }
        else if (cantidad == 90)
        {
          await alertaWarning("Cuidado: el limite es 90")
        }
        spanCantidad.value = cantidad;
    }
});

const validarTeclado = (e) => {
    const tecla = e.key;

    // Permitir borrar y mover el cursor
    if (["Backspace", "ArrowLeft", "ArrowRight", "Tab"].includes(tecla)) return;

    // Bloquear si no es número
    if (!/^[0-9]$/.test(tecla)) {
      e.preventDefault();
      return;
    }

    // Predecir el nuevo valor si se escribe la tecla
    const nuevoValor = e.target.value + tecla;

    // Evitar más de dos dígitos
    if (nuevoValor.length > 2) {
      e.preventDefault();
      return;
    }

    // Bloquear si es mayor a 90
    if (parseInt(nuevoValor) > 90) {
      e.preventDefault();
    }
  };
const validarTeclado255 = (e) => {
  const tecla = e.key;

  // Permitir borrar y mover el cursor
  if (["Backspace", "ArrowLeft", "ArrowRight", "Tab"].includes(tecla)) return;

  // Predecir el nuevo valor si se escribe la tecla
  const nuevoValor = e.target.value + tecla;

  // Evitar más de 250 caracteres
  if (nuevoValor.length > 250) {
    e.preventDefault();
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  cargarHeader(idUser)
  cargarComidas();
  cargarBebidas();
  cargarCocteles();
  const botonVolver = document.getElementById("volver");
  botonVolver.action = `../pedidos/pedidosTablas.html#${idUser}`;
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
        const cantidad = item.querySelector(".cantidad").value;
        const nota = item.querySelector(".nota").value;
        if (cantidad >= 1) {
            listaComidas.push({
                id: item.dataset.valorId,
                cantidad: cantidad,
                nota: nota
            });
        }
    });
  
    document.querySelectorAll(".itemBebida").forEach(item => {
        const cantidad = item.querySelector(".cantidad").value;
        const nota = item.querySelector(".nota").value;
        if (cantidad >= 1) {
            listaBebidas.push({
                id: item.dataset.valorId,
                cantidad: cantidad,
                nota: nota
            });
        }
    });
    
    document.querySelectorAll(".itemCoctel").forEach(item => {
        const cantidad = item.querySelector(".cantidad").value;
        const nota = item.querySelector(".nota").value;
        if (cantidad >= 1) {
            listaCocteles.push({
                id: item.dataset.valorId,
                cantidad: cantidad,
                nota: nota
            });
        }
    });  
  if (listaComidas.length == 0 && listaBebidas.length == 0 && listaCocteles == 0)
  {
    return await alertaError("Error: seleccione almenos un platillo: Comida,Bebida o Coctel")  
  }
  let mayor = Math.max(listaComidas.length, listaBebidas.length, listaCocteles.length);
  
    for (let cont = 0; cont < mayor; cont++) {
        const datos = {
            id_pedido: idPedido,
            id_comida: !listaComidas[cont] ? "" : listaComidas[cont].id,
            cantidad_comida: !listaComidas[cont] ? "" : listaComidas[cont].cantidad,
            nota_comida: !listaComidas[cont] ? "" : listaComidas[cont].nota,
            id_bebida: !listaBebidas[cont] ? "" : listaBebidas[cont].id,
            cantidad_bebida: !listaBebidas[cont] ? "" : listaBebidas[cont].cantidad,
            nota_bebida: !listaBebidas[cont] ? "" : listaBebidas[cont].nota,
            id_coctel: !listaCocteles[cont] ? "" : listaCocteles[cont].id,
            cantidad_coctel: !listaCocteles[cont] ? "" : listaCocteles[cont].cantidad,
            nota_coctel: !listaCocteles[cont] ? "" : listaCocteles[cont].nota
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
            console.log(mensaje);
            if (!response.ok) {
                throw new Error(mensaje);
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    await actualizarTotal(idPedido)
    await alertaOK(`Pedido #${idPedido}: Añadido platillos con ÉXITO.`);
    formulario.action = `../pedidos/pedidosTablas.html#${idUser}`;
    formulario.submit();
});
const actualizarTotal = async idPedido => {
   try {
            const res = await fetch(`http://localhost:8080/ApiRestaurente/api/pedidos/${idPedido}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const mensaje = await res.text();
        if (!res.ok) throw new Error(mensaje);
            console.log(mensaje);
        } catch (error) {
            mensaje.log(error.message);
        }
}
