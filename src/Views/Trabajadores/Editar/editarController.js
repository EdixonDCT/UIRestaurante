// Importa funciones de alertas
import { alertaError, alertaOK } from "../../../Helpers/alertas";
// Importa funciones para interactuar con la API
import * as api from "../../../Helpers/api";
// Importa funciones de validación
import * as validacion from "../../../Helpers/validaciones";

// Función principal exportada
export default async () => {
    // Selecciona el formulario
    const form = document.querySelector(".form");

    // Selecciona inputs del formulario
    const cedula = document.querySelector(".cedula");
    const nombre = document.querySelector(".nombre");
    const apellido = document.querySelector(".apellido");
    const fecha = document.querySelector(".fecha");
    const id = window.localStorage.getItem("cedula")

    // Trae los datos del trabajador
    const traerDatos = await api.get(`trabajadores/${id}`);
    cedula.value = traerDatos.cedula
    nombre.value = traerDatos.nombre;
    apellido.value = traerDatos.apellido;
    fecha.value = traerDatos.nacimiento;

    // Eventos de validación
    nombre.addEventListener("blur", () => { validacion.quitarError(nombre.parentElement) });
    nombre.addEventListener("keydown", (e) => {
        validacion.validarTextoKey(e);
        validacion.validarLimiteKey(e, 20);
    });
    apellido.addEventListener("blur", () => { validacion.quitarError(apellido.parentElement) });
    apellido.addEventListener("keydown", (e) => {
        validacion.validarTextoKey(e);
        validacion.validarLimiteKey(e, 20);
    });
    fecha.addEventListener("blur", () => { validacion.quitarError(fecha.parentElement) });
    // Evento submit del formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let validarNombre = validacion.validarCampo(nombre);
        let validarApellido = validacion.validarCampo(apellido);
        let validarFecha = validacion.validarMayorEdad(fecha);

        if (validarNombre && validarApellido && validarFecha) {
            // Objeto para actualizar
            const objetoActualizado = {
                nombre: nombre.value,
                apellido: apellido.value,
                nacimiento: fecha.value,
            }
            // Llamada a la API para actualizar
            const actualizacion = await api.put(`trabajadores/${id}`, objetoActualizado);
            if (actualizacion.Error) {
                alertaError(actualizacion.Error);
                return;
            } else {
                await alertaOK(actualizacion.Ok);
                window.localStorage.setItem("nombreApellido",`${nombre.value} ${apellido.value}`);
                window.location.href = '#/Trabajadores'; 
            }
        }
    })
}
