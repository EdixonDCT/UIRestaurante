// Importa funciones de alertas personalizadas
import { alertaError, alertaOK, alertaPregunta, alertaOpciones } from "../../Helpers/alertas";
// Importa funciones para interactuar con la API
import * as api from "../../Helpers/api";
// Importa función para validar permisos de usuario
import validarPermiso from "../../Helpers/permisos";

// Función principal exportada
export default async () => {
  // Selecciona el contenedor principal
  const app = document.getElementById("app");

  // Función para cargar y renderizar las tablas de trabajadores
  const cargarTabla = async () => {
    // Crear tabla principal de trabajadores activos
    const table = document.createElement("table");
    table.classList.add("tablas");

    // Crear fila de encabezados para la tabla principal
    const headerRow = document.createElement("tr");
    const headers = ["Cédula", "Nombre", "Apellido", "Nacimiento", "Rol", "Foto", "Estado", "Acciones"];
    headers.forEach(text => {
      const th = document.createElement("th");
      th.textContent = text;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Crear tabla para trabajadores inactivos o solicitudes
    const tableNuevosInactivos = document.createElement("table");
    tableNuevosInactivos.classList.add("tablas");
    const headerRowNuevosInactivos = document.createElement("tr");
    const headersNuevosInactivos = ["Cédula", "Nombre", "Apellido", "Nacimiento", "Rol", "Foto", "Acciones"];
    headersNuevosInactivos.forEach(text => {
      const th = document.createElement("th");
      th.textContent = text;
      headerRowNuevosInactivos.appendChild(th);
    });
    tableNuevosInactivos.appendChild(headerRowNuevosInactivos);

    // Crear títulos para las secciones
    const tituloNuevos = document.createElement("div");
    tituloNuevos.textContent = "Solicitudes de Registro:";
    tituloNuevos.classList.add("titulos");

    const titulo = document.createElement("div");
    titulo.textContent = "Trabajadores:";
    titulo.classList.add("titulos");

    // Contador de trabajadores sin activar
    let contadorSinActivar = 0;
    // Obtener datos de trabajadores desde la API
    const data = await api.get("trabajadores");

    // Iterar sobre cada trabajador para crear filas
    data.forEach(trabajador => {
      const row = document.createElement("tr");

      // Crear celdas comunes con datos del trabajador
      const celdaCedula = document.createElement("td");
      celdaCedula.textContent = trabajador.cedula;

      const celdaNombre = document.createElement("td");
      celdaNombre.textContent = trabajador.nombre;

      const celdaApellido = document.createElement("td");
      celdaApellido.textContent = trabajador.apellido;

      const celdaNacimiento = document.createElement("td");
      celdaNacimiento.textContent = trabajador.nacimiento;

      const celdaRol = document.createElement("td");
      celdaRol.textContent = trabajador.nombreRol;

      const celdaFoto = document.createElement("td");
      const img = document.createElement("img");
      img.src = api.imagen(trabajador.foto);
      img.alt = "Foto";
      celdaFoto.appendChild(img);

      row.append(celdaCedula, celdaNombre, celdaApellido, celdaNacimiento, celdaRol, celdaFoto);

      // Si el trabajador está activo
      if (trabajador.activo == "1") {
        // Crear celda de estado
        const celdaEstado = document.createElement("td");
        celdaEstado.dataset.valorId = trabajador.cedula;
        celdaEstado.textContent = trabajador.activo == "1" ? "Activo" : "Inactivo";

        // Crear celda de acciones
        const celdaAcciones = document.createElement("td");
        const divAcciones = document.createElement("div");
        divAcciones.classList.add("tablaAcciones");

        // Botón para editar datos del trabajador
        const botonEditar = document.createElement("button");
        botonEditar.classList.add("boton");
        botonEditar.id = "BotonEditarTrabajador";
        botonEditar.value = trabajador.cedula;
        botonEditar.textContent = "Editar Trabajador";

        // Botón para editar foto
        const botonEditarFoto = document.createElement("button");
        botonEditarFoto.classList.add("boton");
        botonEditarFoto.id = "BotonEditarFotoTrabajador";
        botonEditarFoto.value = trabajador.cedula;
        botonEditarFoto.textContent = "Editar Foto";

        // Checkbox para cambiar estado
        const divCheckbox = document.createElement("div");
        divCheckbox.classList.add("TablaCheckbox");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("cambiarEstadoTrabajador");
        checkbox.id = `cambiarEstado-${trabajador.cedula}`;
        checkbox.dataset.id = trabajador.cedula;
        if (trabajador.eliminado === "0") checkbox.checked = true;

        const labelCheckbox = document.createElement("label");
        labelCheckbox.htmlFor = `cambiarEstado-${trabajador.cedula}`;
        labelCheckbox.textContent = "Cambiar Estado";

        const labelEstado = document.createElement("label");
        labelEstado.setAttribute("boton-id", trabajador.cedula);
        labelEstado.htmlFor = `cambiarEstado-${trabajador.cedula}`;
        labelEstado.textContent = trabajador.eliminado === "0" ? "Activo" : "Inactivo";
        labelEstado.className = trabajador.eliminado === "0" ? "checkboxTrue" : "checkboxFalse";

        // Agregar checkbox y etiquetas
        divCheckbox.append(checkbox, labelCheckbox, labelEstado);
        if (trabajador.idRol == "1") divCheckbox.style.display = "none";
        if (trabajador.idRol == "1" && window.localStorage.getItem("cedula") != trabajador.cedula) 
        {
          botonEditar.disabled = true
          botonEditarFoto.disabled = true;
        }

        // Agregar botones y checkbox a la celda de acciones
        divAcciones.append(botonEditar, botonEditarFoto, divCheckbox);
        celdaAcciones.appendChild(divAcciones);

        // Agregar celdas a la fila y la fila a la tabla
        row.append(celdaEstado, celdaAcciones);
        table.appendChild(row);

      } else {
        // Si el trabajador no está activo
        contadorSinActivar++;

        const celdaAcciones = document.createElement("td");
        const divAcciones = document.createElement("div");
        divAcciones.classList.add("tablaAcciones");

        // Botón para activar trabajador
        const botonActivar = document.createElement("button");
        botonActivar.id = "BotonActivarTrabajador";
        botonActivar.classList.add("boton");
        botonActivar.value = trabajador.cedula;
        botonActivar.type = "button";
        botonActivar.textContent = "Activar";

        // Botón para eliminar trabajador
        const botonEliminar = document.createElement("button");
        botonEliminar.id = "BotonEliminarTrabajador";
        botonEliminar.classList.add("boton");
        botonEliminar.value = trabajador.cedula;
        botonEliminar.type = "button";
        botonEliminar.textContent = "Eliminar";

        // Agregar botones a la celda y la celda a la fila
        divAcciones.append(botonActivar, botonEliminar);
        celdaAcciones.appendChild(divAcciones);

        row.append(celdaAcciones);
        tableNuevosInactivos.appendChild(row);
      }
    });

    // Si no hay trabajadores sin activar, ocultar secciones
    if (contadorSinActivar == 0) {
      tituloNuevos.style.display = "none";
      tableNuevosInactivos.style.display = "none";
      titulo.style.display = "none";
    }

    // Agregar tablas y títulos al contenedor principal
    app.append(tituloNuevos, tableNuevosInactivos, titulo, table);
  };

  // Ejecutar la carga de tablas
  await cargarTabla();

  // Función para eliminar trabajador
  const EliminarTrabajador = async (e) => {
    const id = e.target.value;
    const foto = await consultarFoto(id);
    const pregunta = await alertaPregunta(`¿Desea eliminar al trabajador con cédula ${id}?`);
    if (pregunta.isConfirmed) {
      const eliminarTrabajador = await api.del(`trabajadores/${id}`);
      if (eliminarTrabajador.Ok) {
        const borarImagen = await api.imagendel(`imagen/${foto}`);
        console.log(borarImagen);
        alertaOK(eliminarTrabajador.Ok);
        location.reload();
      }
      if (eliminarTrabajador.Error) {
        alertaError(eliminarTrabajador.Error);
      }
    }
  };

  // Función para activar trabajador con selección de rol
  const activarTrabajador = async (e) => {
    const id = e.target.value;
    const data = await api.get(`trabajadores/${id}`);
    const respuesta = await alertaOpciones(data.idRol, data.nombre + " " + data.apellido);
    if (respuesta.isDismissed == true && respuesta.opcion) {
      const activo = { activo: "1", idRol: respuesta.opcion };
      const activar = await api.patch(`trabajadores/activar/${id}`, activo);
      await alertaOK(activar.Ok);
      location.reload();
    }
  };

  // Función para obtener la foto de un trabajador
  const consultarFoto = async (id) => {
    const trabajadores = await api.get(`trabajadores/${id}`);
    return trabajadores.foto;
  };

  // Función para cambiar estado de trabajador con checkbox
  const cambiarEstado = async (e) => {
    let id = e.target.dataset.id;
    let valor = e.target.checked ? "0" : "1";
    let checkbox = document.querySelector(`[data-valor-id="${id}"]`);
    let labelBoton = document.querySelector(`[boton-id="${id}"]`);
    const disponibles = { eliminado: valor };
    await api.patch(`trabajadores/estado/${id}`, disponibles);
    checkbox.textContent = e.target.checked ? "Activo" : "Inactivo";
    labelBoton.classList = e.target.checked ? "checkboxTrue" : "checkboxFalse";
    labelBoton.textContent = e.target.checked ? "Activo" : "Inactivo";
  };

  // Manejo de eventos globales de clic
  window.addEventListener("click", async (e) => {
    if (e.target.matches("#BotonEliminarTrabajador")) EliminarTrabajador(e);
    else if (e.target.matches("#BotonActivarTrabajador")) activarTrabajador(e);
    else if (e.target.matches(".cambiarEstadoTrabajador")) cambiarEstado(e);
    else if (e.target.matches("#BotonEditarTrabajador")) window.location.href = `#/Trabajadores/Editar/id=${e.target.value}`;
    else if (e.target.matches("#BotonEditarFotoTrabajador")) window.location.href = `#/Trabajadores/EditarImagen/id=${e.target.value}`;
  });
};
