import { alertaError, alertaOK } from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import * as validacion from "../../../Helpers/validaciones";
export default async () => {
    //formulario
    const form = document.querySelector(".form");

    //valores a postear
    const cedula = document.querySelector(".cedula");
    const nombre = document.querySelector(".nombre");
    const apellido = document.querySelector(".apellido");
    const fecha = document.querySelector(".fecha");
    const contrasena = document.querySelector(".contrasena");
    const contrasenaConfirm = document.querySelector(".contrasenaConfirmar");
    const comboRoles = document.querySelector(".comboRoles");

    const rellenarRoles = async () => {
        const roles = await api.getPublic("roles")
        roles.forEach(rol => {
            // if (rol.id == "1") return;
            let option = document.createElement("option");
            option.value = rol.id;
            option.textContent = rol.nombre;
            comboRoles.appendChild(option);
        });
    }
    await rellenarRoles();
    const hash = location.hash.slice(1);
    const [url, id] = hash.split("=");

    const traerDatos = await api.get(`trabajadores/${id}`);
    cedula.value = traerDatos.cedula
    nombre.value = traerDatos.nombre;
    apellido.value = traerDatos.apellido;
    fecha.value = traerDatos.nacimiento;
    contrasena.value = traerDatos.contrasena;
    contrasenaConfirm.value = traerDatos.contrasena;
    comboRoles.value = traerDatos.idRol;

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
    contrasena.addEventListener("blur", () => { validacion.quitarError(contrasena.parentElement) });
    contrasena.addEventListener("keydown", (e) => {
        validacion.validarLimiteKey(e, 20);
    });
    contrasenaConfirm.addEventListener("blur", () => { validacion.quitarError(contrasenaConfirm.parentElement) });
    contrasenaConfirm.addEventListener("keydown", (e) => {
        validacion.validarLimiteKey(e, 20);
    });
    comboRoles.addEventListener("blur", () => { validacion.quitarError(comboRoles.parentElement) });
    form.addEventListener("submit", async (e) => {

        e.preventDefault();
        let validarNombre = validacion.validarCampo(nombre);
        let validarApellido = validacion.validarCampo(apellido);
        let validarFecha = validacion.validarMayorEdad(fecha);
        let validarContrasena = validacion.validarContrasena(contrasena);
        let validarIgualdad = validacion.validarContrasenaIgual(contrasenaConfirm, contrasena);
        let validarRol = validacion.validarCampo(comboRoles);

        if (validarNombre && validarApellido && validarFecha && validarContrasena && validarIgualdad && validarRol) {
            const objetoActualizado = {
                nombre: nombre.value,
                apellido: apellido.value,
                nacimiento: fecha.value,
                contrasena: contrasena.value,
                idRol: comboRoles.value
            }
            const actualizacion = await api.put(`trabajadores/${cedula.value}`, objetoActualizado);
            if (actualizacion.Error) {
                alertaError(registro.Error);
                return;
            }
            else {
                await alertaOK(actualizacion.Ok);
                window.location.href = '#/Trabajadores';
            }
        }
    })
}
