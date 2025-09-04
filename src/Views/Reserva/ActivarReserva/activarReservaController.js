// ==================== Imports ====================
// Funciones de alertas
import { alertaError, alertaOK } from "../../../Helpers/alertas";
// Funciones para interactuar con la API
import * as api from "../../../Helpers/api";
// Funciones de validación de campos
import * as validacion from "../../../Helpers/validaciones";

// ==================== Función principal ====================
export default async () => {

  // ==================== Selección de elementos del DOM ====================
  const form = document.querySelector(".form"); // Formulario principal
  const numeroMesa = document.querySelector(".numeroMesa"); // Selector de mesa
  const numeroClientes = document.querySelector(".numeroClientes"); // Input de número de clientes
  const correoCliente = document.querySelector(".correoCliente"); // Input correo del cliente
  const idCaja = document.querySelector(".idCaja"); // Selector de caja
  const metodoPago = document.querySelector(".metodoPago"); // Selector de método de pago

  // ==================== Llenar mesas disponibles ====================
  const listaMesas = [];
  const rellenarMesas = async () => {
    const mesasDisponibles = await api.get("mesas");
    mesasDisponibles.forEach(mesas => {
      let option = document.createElement("option");
      option.value = mesas.numero;
      option.textContent = `Mesa #${mesas.numero}(capacidad:${mesas.capacidad})`;
      numeroMesa.appendChild(option);
      listaMesas.push(mesas.numero);
    });
  }

  // ==================== Llenar cajas disponibles ====================
  const rellenarCajas = async () => {
    const cajasDisponibles = await api.get("caja");
    cajasDisponibles.forEach(caja => {
      // Si la caja ya está cerrada, no la agregamos
      if (caja.fechaCierre && caja.horaCierre && caja.montoCierre) return;
      let option = document.createElement("option");
      option.value = caja.id;
      option.textContent = `Caja #${caja.id}`;
      idCaja.appendChild(option);
    });
  }

  // Ejecutamos la carga de mesas y cajas
  await rellenarMesas();
  await rellenarCajas();

  // ==================== Traer datos del pedido existente ====================
  const hash = location.hash.slice(1);
  const [url, id] = hash.split("=");
  const traerDatos = await api.get(`pedidos/reserva/${id}`);
  let idPedido = traerDatos.id;
  numeroMesa.value = traerDatos.numeroMesa;
  numeroClientes.value = traerDatos.numeroClientes;
  correoCliente.value = traerDatos.correoCliente;

  // ==================== Validaciones de campos en tiempo real ====================
  numeroMesa.addEventListener("blur", () => { validacion.quitarError(numeroMesa.parentElement) });
  idCaja.addEventListener("blur", () => { validacion.quitarError(idCaja.parentElement) });
  numeroClientes.addEventListener("blur", () => { validacion.quitarError(numeroClientes.parentElement) });
  numeroClientes.addEventListener("keydown", (e) => {
    validacion.validarNumeroKey(e);
    validacion.validarLimiteKey(e, 2); // Máximo 2 dígitos
  });
  correoCliente.addEventListener("blur", () => { validacion.quitarError(correoCliente.parentElement) });
  correoCliente.addEventListener("keydown", (e) => { validacion.validarLimiteKey(e, 30) }); // Max 30 caracteres
  metodoPago.addEventListener("blur", () => { validacion.quitarError(metodoPago.parentElement) });

  // ==================== Enviar formulario ====================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validar todos los campos antes de enviar
    let validarNumeroMesa = validacion.validarCampo(numeroMesa);
    let validaridCaja = validacion.validarCampo(idCaja);
    let validarNumeroClientes = validacion.validarCampo(numeroClientes);
    let validarCorreoCliente = validacion.validarCorreo(correoCliente);
    let validarMetodoPago = validacion.validarCampo(metodoPago);

    // Si todos los campos son válidos, actualizamos el pedido
    if (validarNumeroMesa && validaridCaja && validarNumeroClientes && validarCorreoCliente && validarMetodoPago) {
      const objetoPedido = {
        idCaja: idCaja.value,
        metodoPago: metodoPago.value
      }

      const activado = await api.put(`pedidos/reserva/${idPedido}`, objetoPedido);

      if (activado.Error) {
        alertaError(activado.Error); // Mostrar error si ocurre
        return;
      }

      if (activado.Ok) {
        await alertaOK(activado.Ok); // Mostrar mensaje de éxito
        window.location.href = '#/Reserva'; // Redirigir a la lista de reservas
      }
    }
  })
}
