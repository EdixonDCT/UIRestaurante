import { alertaOK,alertaError } from "../../Helpers/alertas";
import * as api from "../../Helpers/api";
import validarPermiso from "../../Helpers/permisos";

export default async () => {
  const app = document.getElementById("app");

  const crear = validarPermiso("Pedido.crear");
  const editar = validarPermiso("Pedido.editar");
  if (crear) {
    const botonCrearComida = document.createElement("button");
    botonCrearComida.classList.add("boton");
    botonCrearComida.id = "BotonCrearComida";
    botonCrearComida.textContent = "Crear Comida";

    const botonCrearBebida = document.createElement("button");
    botonCrearBebida.classList.add("boton");
    botonCrearBebida.id = "BotonCrearBebida";
    botonCrearBebida.textContent = "Crear Bebida";

    const botonCrearCoctel = document.createElement("button");
    botonCrearCoctel.classList.add("boton");
    botonCrearCoctel.id = "BotonCrearCoctel";
    botonCrearCoctel.textContent = "Crear Coctel";

    app.append(botonCrearComida, botonCrearBebida, botonCrearCoctel);
  }

  const cargarPlatillos = async (tipo) => {
    const tabla = document.createElement("table");
    tabla.classList.add("tablas");

    // Encabezados
    const encabezado = document.createElement("tr");
    const columnas = ["ID", "Imagen", "Nombre", "Precio"];
    if (tipo === "comidas") columnas.push("Tipo");
    if (tipo === "bebidas") columnas.push("Tipo", "Unidad");
    columnas.push("Disponible", "Acciones");

    columnas.forEach((col) => {
      const th = document.createElement("th");
      th.textContent = col;
      encabezado.appendChild(th);
    });
    tabla.appendChild(encabezado);

    const datos = await api.get(tipo);

    datos.forEach(async (item) => {
      const fila = document.createElement("tr");

      // ID
      const tdId = document.createElement("td");
      tdId.textContent = item.id;
      fila.appendChild(tdId);

      // Imagen
      const tdImg = document.createElement("td");
      const img = document.createElement("img");
      img.src = await api.imagen(item.imagen);
      img.alt = item.nombre;
      tdImg.appendChild(img);
      fila.appendChild(tdImg);

      // Nombre
      const tdNombre = document.createElement("td");
      tdNombre.textContent = item.nombre;
      fila.appendChild(tdNombre);

      // Precio
      const tdPrecio = document.createElement("td");
      tdPrecio.textContent = `${item.precio}$`;
      fila.appendChild(tdPrecio);

      // Tipo y Unidad
      if (tipo === "comidas") {
        const tdTipo = document.createElement("td");
        tdTipo.textContent = item.tipo;
        fila.appendChild(tdTipo);
      }
      if (tipo === "bebidas") {
        const tdTipo = document.createElement("td");
        tdTipo.textContent = item.tipo;
        fila.appendChild(tdTipo);

        const tdUnidad = document.createElement("td");
        tdUnidad.textContent = item.unidad;
        fila.appendChild(tdUnidad);
      }

      // Disponible
      const tdDisponible = document.createElement("td");
      tdDisponible.dataset.clave = `${tipo}-${item.id}`;
      tdDisponible.textContent = item.disponible === "1" ? "Sí" : "No";
      fila.appendChild(tdDisponible);

      // Acciones
      const tdAcciones = document.createElement("td");
      const divAcciones = document.createElement("div");
      divAcciones.classList.add("tablaAcciones");
      if (editar) {
        // Botón Editar
        const btnEditar = document.createElement("button");
        btnEditar.classList.add("boton");
        btnEditar.textContent = "Editar";
        btnEditar.id = `BotonEditar${tipo}`
        btnEditar.value = item.id;
        divAcciones.appendChild(btnEditar);

        // Botón Editar Foto
        const btnFoto = document.createElement("button");
        btnFoto.classList.add("boton");
        btnFoto.textContent = "Editar Foto";
        btnFoto.id = `BotonEditarImagen${tipo}`
        btnFoto.value = item.id;
        divAcciones.appendChild(btnFoto);

        // Botón Editar Ingredientes (solo comidas y cocteles)
        if (tipo === "comidas" || tipo === "cocteles") {
          const btnIngredientes = document.createElement("button");
          btnIngredientes.classList.add("boton");
          btnIngredientes.textContent = "Editar Ingredientes";
          btnIngredientes.value = item.id;
          btnIngredientes.id = `BotonEditarIngredientes${tipo}`
          divAcciones.appendChild(btnIngredientes);
        }
      }
      // Checkbox cambiar estado
      const divCheck = document.createElement("div");
      divCheck.classList.add("TablaCheckbox");

      const check = document.createElement("input");
      check.type = "checkbox";
      check.classList.add("cambiarEstado");
      check.id = `cambiarEstado-${tipo}-${item.id}`;
      check.dataset.id = item.id;
      check.dataset.tipo = tipo;
      if (item.disponible === "1") check.checked = true;

      const lblCambiar = document.createElement("label");
      lblCambiar.htmlFor = check.id;
      lblCambiar.textContent = "Cambiar Estado";

      const lblEstado = document.createElement("label");
      lblEstado.dataset.estado = `${tipo}-${item.id}`;
      lblEstado.htmlFor = check.id;
      lblEstado.textContent = item.disponible === "1" ? "Activo" : "Inactivo";
      lblEstado.className =
        item.disponible === "1" ? "checkboxTrue" : "checkboxFalse";

      divCheck.append(check, lblCambiar, lblEstado);
      divAcciones.appendChild(divCheck);
      tdAcciones.appendChild(divAcciones);

      fila.appendChild(tdAcciones);

      tabla.appendChild(fila);
    });

    // Título
    const titulo = document.createElement("div");
    const p = document.createElement("p");
    p.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);
    titulo.classList.add("titulos");
    titulo.appendChild(p);

    app.append(titulo, tabla);
  };

  // Llamadas
  await cargarPlatillos("comidas");
  await cargarPlatillos("bebidas");
  await cargarPlatillos("cocteles");

  // Listener para checkbox
  document.addEventListener("change", async (e) => {
    if (e.target.classList.contains("cambiarEstado")) {
      const checkbox = e.target;
      const id = checkbox.dataset.id;
      const tipo = checkbox.dataset.tipo;
      const nuevoEstado = checkbox.checked ? "1" : "0";

      try {
        const objetoDisponible = { disponible: nuevoEstado };
        await api.patch(`${tipo}/${id}`, objetoDisponible);

        // Actualizar label
        const labelEstado = document.querySelector(
          `label[data-estado="${tipo}-${id}"]`
        );
        if (labelEstado) {
          labelEstado.textContent = nuevoEstado === "1" ? "Activo" : "Inactivo";
          labelEstado.className =
            nuevoEstado === "1" ? "checkboxTrue" : "checkboxFalse";
        }

        // Actualizar celda disponible
        const tdDisponible = document.querySelector(
          `td[data-clave="${tipo}-${id}"]`
        );
        if (tdDisponible) {
          tdDisponible.textContent = nuevoEstado === "1" ? "Sí" : "No";
        }
      } catch (error) {
        alertaError("Error al cambiar estado: " + (error.message || "Error desconocido"));
        checkbox.checked = !checkbox.checked; 
      }
    }
  })

  window.addEventListener("click", async (e) => {
    if (e.target.matches("#BotonCrearComida")) window.location.href = `#/Platillo/CrearComida`;
    else if (e.target.matches("#BotonCrearBebida")) window.location.href = `#/Platillo/CrearBebida`;
    else if (e.target.matches("#BotonCrearCoctel")) window.location.href = `#/Platillo/CrearCoctel`;
    else if (e.target.matches("#BotonEditarcomidas")) window.location.href = `#/Platillo/EditarComida/id=${e.target.value}`;
    else if (e.target.matches("#BotonEditarbebidas")) window.location.href = `#/Platillo/EditarBebida/id=${e.target.value}`;
    else if (e.target.matches("#BotonEditarcocteles")) window.location.href = `#/Platillo/EditarCoctel/id=${e.target.value}`;
    else if (e.target.matches("#BotonEditarImagencomidas")) window.location.href = `#/Platillo/EditarImagenComida/id=${e.target.value}`;
    else if (e.target.matches("#BotonEditarImagenbebidas")) window.location.href = `#/Platillo/EditarImagenBebida/id=${e.target.value}`;
    else if (e.target.matches("#BotonEditarImagencocteles")) window.location.href = `#/Platillo/EditarImagenCoctel/id=${e.target.value}`;
    else if (e.target.matches("#BotonEditarIngredientescomidas")) window.location.href = `#/Platillo/AsignarIngredienteComida/id=${e.target.value}`;
    else if (e.target.matches("#BotonEditarIngredientescocteles")) window.location.href = `#/Platillo/AsignarIngredienteCoctel/id=${e.target.value}`;
  });
};
