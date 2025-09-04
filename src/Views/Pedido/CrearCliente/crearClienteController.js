// Importa funciones para mostrar alertas de éxito o error
import { alertaError, alertaOK } from "../../../Helpers/alertas";

// Importa funciones para hacer peticiones a la API
import * as api from "../../../Helpers/api";

// Importa funciones de validación de formularios
import * as validacion from "../../../Helpers/validaciones";

// Exporta por defecto una función anónima que contiene toda la lógica del formulario
export default () => {
    // Obtiene el formulario del DOM
    const form = document.querySelector(".form");

    // Obtiene los campos de entrada (inputs) del DOM
    const correo = document.querySelector(".correo");
    const cedula = document.querySelector(".cedula");
    const telefono = document.querySelector(".telefono");
  
    // Evento blur para quitar errores cuando el usuario sale del input de correo
    correo.addEventListener("blur", () => { 
        validacion.quitarError(correo.parentElement) 
    });

    // Evento keydown para limitar el correo a 30 caracteres
    correo.addEventListener("keydown", (e) => {
        validacion.validarLimiteKey(e, 30);
    });

    // Evento blur para quitar errores cuando el usuario sale del input de cédula
    cedula.addEventListener("blur", () => { 
        validacion.quitarError(cedula.parentElement) 
    });

    // Evento keydown para permitir solo números y limitar la cédula a 10 dígitos
    cedula.addEventListener("keydown", (e) => {
        validacion.validarNumeroKey(e);
        validacion.validarLimiteKey(e, 10);
    });

    // Evento blur para quitar errores cuando el usuario sale del input de teléfono
    telefono.addEventListener("blur", () => { 
        validacion.quitarError(telefono.parentElement) 
    });

    // Evento keydown para permitir solo números y limitar el teléfono a 10 dígitos
    telefono.addEventListener("keydown", (e) => {
        validacion.validarNumeroKey(e);
        validacion.validarLimiteKey(e, 10);
    });

    // Evento submit del formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Evita que se recargue la página al enviar el formulario

        // Valida el correo con la función de validación específica
        let validarCorreo = validacion.validarCorreo(correo);

        // Inicialmente se asume que cédula y teléfono son válidos
        let validarCedula = true;
        let validarTelefono = true;

        // Si se ingresaron valores en cédula y teléfono, se validan sus campos
        if (cedula.value != "" && telefono.value != "") {
            validarCedula = validacion.validarCampo(cedula);
            validarTelefono = validacion.validarCampo(telefono);
        }

        // Si todas las validaciones pasan, se prepara el objeto a enviar a la API
        if (validarCorreo && validarCedula && validarTelefono) {
            const objetoMesa = {
                correo: correo.value,
                cedula: cedula.value,
                telefono: telefono.value,
            };

            // Envía los datos a la API para crear un nuevo cliente
            const creado = await api.post("clientes", objetoMesa);

            // Si la API devuelve un error, se muestra en pantalla
            if (creado.Error) {
                alertaError(creado.Error);
                return;
            }

            // Si la API devuelve éxito, se muestra alerta y se redirige a la página de pedidos
            if (creado.Ok) {
                await alertaOK(creado.Ok);
                window.location.href = '#/Pedido';
            }
        }
    })
}
