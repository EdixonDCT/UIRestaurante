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

  const listarSolicitudes = validarPermiso("Trabajadores.activar");
  // Función para cargar y renderizar las tablas de trabajadores
  // Cargar tabla de trabajadores activos
  const cargarTablaActivos = async () => {
    const table = document.createElement("table");
    table.classList.add("tablas");

    // Encabezados
    const headerRow = document.createElement("tr");
    const headers = ["Cédula", "Nombre", "Apellido", "Nacimiento", "Rol", "Foto", "Estado", "Acciones"];
    headers.forEach(text => {
      const th = document.createElement("th");
      th.textContent = text;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Título
    const titulo = document.createElement("div");
    titulo.textContent = "Trabajadores:";
    titulo.classList.add("titulos");

    const data = await api.get("trabajadores");

    data.forEach(trabajador => {
      if (listarSolicitudes || window.localStorage.getItem("cedula") == trabajador.cedula) {
        const row = document.createElement("tr");

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

        const celdaEstado = document.createElement("td");
        celdaEstado.dataset.valorId = trabajador.cedula;
        celdaEstado.textContent = "Activo";

        const celdaAcciones = document.createElement("td");
        const divAcciones = document.createElement("div");
        divAcciones.classList.add("tablaAcciones");
        divAcciones.classList.add("tablaAcciones--derecha");

        const botonEditar = document.createElement("button");
        botonEditar.classList.add("boton");
        botonEditar.id = "BotonEditarTrabajador";
        botonEditar.value = trabajador.cedula;
        botonEditar.textContent = "Editar Trabajador";

        const botonEditarFoto = document.createElement("button");
        botonEditarFoto.classList.add("boton");
        botonEditarFoto.id = "BotonEditarFotoTrabajador";
        botonEditarFoto.value = trabajador.cedula;
        botonEditarFoto.textContent = "Editar Foto";

        const botonEditarContrasena = document.createElement("button");
        botonEditarContrasena.classList.add("boton");
        botonEditarContrasena.id = "BotonEditarContrasenaTrabajador";
        botonEditarContrasena.value = trabajador.cedula;
        botonEditarContrasena.textContent = "Editar Contraseña";


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

        divCheckbox.append(checkbox, labelCheckbox, labelEstado);
        if (window.localStorage.getItem("cedula") != trabajador.cedula) {
          botonEditar.style.display = "none";
          botonEditarFoto.style.display = "none";
          botonEditarContrasena.style.display = "none";
        }
        if (!listarSolicitudes) {
          divCheckbox.style.display = "none";
        }
        if (listarSolicitudes) {
          if (trabajador.nombreRol == "Administrador") {
            checkbox.disabled = true;
          }
        }
        divAcciones.append(botonEditar, botonEditarFoto, botonEditarContrasena, divCheckbox);
        celdaAcciones.appendChild(divAcciones);

        row.append(celdaCedula, celdaNombre, celdaApellido, celdaNacimiento, celdaRol, celdaFoto, celdaEstado, celdaAcciones);
        table.appendChild(row);
      }
    });

    app.append(titulo, table);
  };


  // Cargar tabla de solicitudes / inactivos
  const cargarTablaSolicitudes = async () => {
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

    const tituloNuevos = document.createElement("div");
    tituloNuevos.textContent = "Solicitudes de Registro:";
    tituloNuevos.classList.add("titulos");

    const data = await api.get("trabajadores/inactivos");

    let contadorSinActivar = 0;

    data.forEach(trabajador => {
      contadorSinActivar++;

      const row = document.createElement("tr");

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

      const celdaAcciones = document.createElement("td");
      const divAcciones = document.createElement("div");
      divAcciones.classList.add("tablaAcciones");

      const botonActivar = document.createElement("button");
      botonActivar.id = "BotonActivarTrabajador";
      botonActivar.classList.add("boton");
      botonActivar.value = trabajador.cedula;
      botonActivar.type = "button";
      botonActivar.textContent = "Activar";

      const botonEliminar = document.createElement("button");
      botonEliminar.id = "BotonEliminarTrabajador";
      botonEliminar.classList.add("boton");
      botonEliminar.value = trabajador.cedula;
      botonEliminar.type = "button";
      botonEliminar.textContent = "Eliminar";

      divAcciones.append(botonActivar, botonEliminar);
      celdaAcciones.appendChild(divAcciones);

      row.append(celdaCedula, celdaNombre, celdaApellido, celdaNacimiento, celdaRol, celdaFoto, celdaAcciones);
      tableNuevosInactivos.appendChild(row);
    });

    if (contadorSinActivar > 0) {
      app.append(tituloNuevos, tableNuevosInactivos);
    }
  };
  if (listarSolicitudes) {
    await cargarTablaSolicitudes();
  }
  // Llamadas separadas según necesites
  await cargarTablaActivos();


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
    const respuesta = await alertaOpciones("Seleccione el rol para el trabajador");
    if (respuesta.isDismissed == true && respuesta.opcion) {
      const activo = { activo: "1", activo: respuesta.opcion };
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
    const checkboxInput = e.target; // el input checkbox que disparó el evento
    const respuesta = await alertaPregunta(`¿Desea cambiar el estado del trabajador con CC.${checkboxInput.dataset.id}?`);

    if (!respuesta.isConfirmed) {
      // Revertir el cambio si canceló
      checkboxInput.checked = !checkboxInput.checked;
      return;
    }

    let id = checkboxInput.dataset.id;
    let valor = checkboxInput.checked ? "0" : "1";

    let checkbox = document.querySelector(`[data-valor-id="${id}"]`);
    let labelBoton = document.querySelector(`[boton-id="${id}"]`);

    const disponibles = { eliminado: valor };
    await api.patch(`trabajadores/estado/${id}`, disponibles);

    checkbox.textContent = checkboxInput.checked ? "Activo" : "Inactivo";
    labelBoton.classList = checkboxInput.checked ? "checkboxTrue" : "checkboxFalse";
    labelBoton.textContent = checkboxInput.checked ? "Activo" : "Inactivo";
  };


  // Manejo de eventos globales de clic
  window.addEventListener("click", async (e) => {
    if (e.target.matches("#BotonEliminarTrabajador")) EliminarTrabajador(e);
    else if (e.target.matches("#BotonActivarTrabajador")) activarTrabajador(e);
    else if (e.target.matches(".cambiarEstadoTrabajador")) cambiarEstado(e);
    else if (e.target.matches("#BotonEditarTrabajador")) window.location.href = `#/Trabajadores/Editar`;
    else if (e.target.matches("#BotonEditarFotoTrabajador")) window.location.href = `#/Trabajadores/EditarImagen`;
    else if (e.target.matches("#BotonEditarContrasenaTrabajador")) window.location.href = `#/Trabajadores/EditarContrasena`;
  });
};
