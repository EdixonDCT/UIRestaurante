// Importa funciones de alerta de error y éxito
import { alertaError, alertaOK } from "../../../Helpers/alertas";

// Importa funciones para interactuar con la API
import * as api from "../../../Helpers/api";

// Importa funciones de validación de campos
import * as validacion from "../../../Helpers/validaciones";

// Exporta por defecto una función asíncrona para manejar la edición de pedidos
export default async () => {
  // Obtiene el formulario del DOM
  const form = document.querySelector(".form");

  // Obtiene los inputs del DOM
  const numeroMesa = document.querySelector(".numeroMesa");
  const idCaja = document.querySelector(".idCaja");
  const numeroClientes = document.querySelector(".numeroClientes");
  const correoCliente = document.querySelector(".correoCliente");
  const metodoPago = document.querySelector(".metodoPago");

  // Lista para almacenar las mesas disponibles
  const listaMesas = [];

  // Función para rellenar el select de mesas
  const rellenarMesas = async () => {
    const mesasDisponibles = await api.get("mesas"); // Trae todas las mesas
    mesasDisponibles.forEach(mesas => {
      if (mesas.disponible == "0") return; // Ignora mesas ocupadas
      let option = document.createElement("option"); // Crea un option
      option.value = mesas.numero;
      option.textContent = `Mesa #${mesas.numero}(capacidad:${mesas.capacidad})`;
      numeroMesa.appendChild(option); // Añade al select
      listaMesas.push(mesas.numero); // Guarda la mesa en la lista
    });
  }

  // Función para rellenar el select de cajas
  const rellenarCajas = async () => {
    const cajasDisponibles = await api.get("caja"); // Trae todas las cajas
    cajasDisponibles.forEach(caja => {
      if (caja.fechaCierre && caja.horaCierre && caja.montoCierre) return; // Ignora cajas cerradas
      let option = document.createElement("option"); // Crea un option
      option.value = caja.id;
      option.textContent = `Caja #${caja.id}`;
      idCaja.appendChild(option); // Añade al select
    });
  }

  // Ejecuta las funciones para rellenar selects
  await rellenarMesas();
  await rellenarCajas();

  // Obtiene el ID del pedido desde el hash de la URL
  const hash = location.hash.slice(1);
  const [url, id] = hash.split("=");

  // Trae los datos del pedido desde la API
  const traerDatos = await api.get(`pedidos/${id}`);
  idCaja.value = traerDatos.idCaja;
  numeroClientes.value = traerDatos.numeroClientes;
  correoCliente.value = traerDatos.correoCliente;
  metodoPago.value = traerDatos.metodoPago;

  // Verifica si la mesa original del pedido sigue disponible
  const mesaEsta = listaMesas.includes(traerDatos.numeroMesa);
  if (!mesaEsta) {
    const mesa = await api.get(`mesas/${traerDatos.numeroMesa}`); // Trae la mesa específica
    let option = document.createElement("option");
    option.value = mesa.numero;
    option.textContent = `Mesa #${mesa.numero}(capacidad:${mesa.capacidad})`;
    numeroMesa.appendChild(option); // La agrega al select para que pueda seleccionarse
  }
  numeroMesa.value = traerDatos.numeroMesa; // Selecciona la mesa del pedido

  // Eventos blur y keydown para validar los campos mientras el usuario escribe
  numeroMesa.addEventListener("blur", () => { validacion.quitarError(numeroMesa.parentElement) });
  idCaja.addEventListener("blur", () => { validacion.quitarError(idCaja.parentElement) });
  numeroClientes.addEventListener("blur", () => { validacion.quitarError(numeroClientes.parentElement) });
  numeroClientes.addEventListener("keydown", (e) => {
    validacion.validarNumeroKey(e); // Solo números
    validacion.validarLimiteKey(e, 2); // Máx 2 dígitos
  });
  correoCliente.addEventListener("blur", () => { validacion.quitarError(correoCliente.parentElement) });
  correoCliente.addEventListener("keydown", (e) => { validacion.validarLimiteKey(e, 30); });
  metodoPago.addEventListener("blur", () => { validacion.quitarError(metodoPago.parentElement) });

  // Evento submit para actualizar el pedido
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que se recargue la página

    // Validaciones de campos
    let validarNumeroMesa = validacion.validarCampo(numeroMesa);
    let validaridCaja = validacion.validarCampo(idCaja);
    let validarNumeroClientes = validacion.validarCampo(numeroClientes);
    let validarCorreoCliente = validacion.validarCorreo(correoCliente);
    let validarMetodoPago = validacion.validarCampo(metodoPago);

    // Si todos los campos son válidos
    if (validarNumeroMesa && validaridCaja && validarNumeroClientes && validarCorreoCliente && validarMetodoPago) {
      const objetoPedido = {
        numeroMesa: numeroMesa.value,
        idCaja: idCaja.value,
        numeroClientes: numeroClientes.value,
        correoCliente: correoCliente.value,
        metodoPago: metodoPago.value
      }

      // Actualiza el pedido en la API
      const creado = await api.put(`pedidos/${id}`, objetoPedido);
      if (creado.Error) {
        alertaError(creado.Error); // Muestra error si falla
        return;
      }

      if (creado.Ok) {
        // Si se cambió la mesa del pedido, actualiza disponibilidad
        const cambiarMesa = objetoPedido.numeroMesa == traerDatos.numeroMesa;
        if (!cambiarMesa) {
          const objetoOcupado = { disponible: "0" }; // Ocupa la nueva mesa
          await api.patch(`mesas/${objetoPedido.numeroMesa}`, objetoOcupado);
          const objetoDesocupado = { disponible: "1" }; // Libera la antigua mesa
          await api.patch(`mesas/${traerDatos.numeroMesa}`, objetoDesocupado);
        }

        await alertaOK(creado.Ok); // Muestra mensaje de éxito
        window.location.href = '#/Pedido'; // Redirige a la lista de pedidos
      }
    }
  })
}
