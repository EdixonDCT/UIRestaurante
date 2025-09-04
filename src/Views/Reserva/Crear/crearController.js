// ==================== Imports ====================
// Funciones de alertas (éxito, error)
import { alertaError, alertaOK } from "../../../Helpers/alertas";
// Funciones para interactuar con la API
import * as api from "../../../Helpers/api";
// Funciones para validar campos del formulario
import * as validacion from "../../../Helpers/validaciones";

// ==================== Función principal ====================
export default async () => {

  // ==================== Selección de elementos del DOM ====================
  const form = document.querySelector(".form"); // Formulario principal
  const correoCliente = document.querySelector(".correoCliente"); // Input correo del cliente
  const numeroMesa = document.querySelector(".numeroMesa"); // Selector de mesas
  const cantidadTentativa = document.querySelector(".cantidadTentativa"); // Número de clientes previstos
  const fechaTentativa = document.querySelector(".fechaTentativa"); // Fecha tentativa de reserva
  const horaTentativa = document.querySelector(".horaTentativa"); // Hora tentativa de reserva

  // ==================== Llenar las mesas disponibles ====================
  const rellenarMesas = async () => {
    const mesasExisten = await api.get("mesas");
    mesasExisten.forEach((mesas) => {
      let option = document.createElement("option");
      option.value = mesas.numero;
      option.textContent = `Mesa #${mesas.numero}(capacidad:${mesas.capacidad})`;
      numeroMesa.appendChild(option);
    });
  };
  rellenarMesas(); // Ejecutar llenado de mesas

  // ==================== Validaciones en tiempo real ====================
  correoCliente.addEventListener("blur", () => { validacion.quitarError(correoCliente.parentElement); });
  correoCliente.addEventListener("keydown", (e) => { validacion.validarLimiteKey(e, 30); });

  numeroMesa.addEventListener("blur", () => { validacion.quitarError(numeroMesa.parentElement) });

  cantidadTentativa.addEventListener("blur", () => { validacion.quitarError(cantidadTentativa.parentElement) });
  cantidadTentativa.addEventListener("keydown", (e) => {
    validacion.validarNumeroKey(e); // Solo permite números
    validacion.validarLimiteKey(e, 2); // Máximo 2 dígitos
  });

  fechaTentativa.addEventListener("blur", () => { validacion.quitarError(fechaTentativa.parentElement); });
  horaTentativa.addEventListener("blur", () => { validacion.quitarError(horaTentativa.parentElement); });

  // ==================== Enviar formulario ====================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validar todos los campos
    let validarCorreoCliente = validacion.validarCorreo(correoCliente);
    let validarNumeroMesa = validacion.validarCampo(numeroMesa);
    let validarCantidadTentativa = validacion.validarCampo(cantidadTentativa);
    let validarFechaTentativa = validacion.validarFecha(fechaTentativa);
    let validarHoraTentativa = validacion.validarHora(horaTentativa, fechaTentativa);

    // Si todos son válidos, se crea la reserva
    if (validarCorreoCliente && validarNumeroMesa && validarCantidadTentativa && validarFechaTentativa && validarHoraTentativa) {

      // Obtener capacidad de la mesa seleccionada
      const { capacidad } = await api.get(`mesas/${numeroMesa.value}`);

      // Objeto para crear la reserva
      const objetoReserva = {
        cantidadTentativa: `${cantidadTentativa.value}/${capacidad}/${correoCliente.value}`,
        fechaTentativa: fechaTentativa.value,
        horaTentativa: horaTentativa.value + ":00",
      };

      const creado = await api.post("reservas", objetoReserva); // Crear reserva
      if (creado.Error) {
        alertaError(creado.Error);
        return;
      }

      // Si la reserva se creó, crear el pedido vinculado
      if (creado.Ok) {
        const objetoPedidoReserva = {
          numeroMesa: numeroMesa.value,
          numeroClientes: cantidadTentativa.value,
          correoCliente: correoCliente.value,
          idReserva: creado.id,
        };

        const crearPedidoConReserva = await api.post("pedidos/reserva", objetoPedidoReserva);

        // Manejo de respuestas
        if (crearPedidoConReserva.Ok) {
          await alertaOK(creado.Ok); // Mensaje de éxito
          window.location.href = '#/Reserva'; // Redirigir a la lista de reservas
        }

        if (crearPedidoConReserva.Error) {
          alertaError(crearPedidoConReserva.Error); // Mostrar error del pedido
          alertaOK(creado.Ok); // Aun así mostrar éxito de reserva
          window.location.href = '#/Reserva'; // Redirigir
        }
      }
    }
  })
}
