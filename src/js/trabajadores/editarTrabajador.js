import { alertaError, alertaOK } from "../alertas.js"; // importar alertas
import { cargarHeader } from "../header.js"; // importar header

const hash = window.location.hash.slice(1); // obtener hash
const lista = hash.split("/"); // separar hash
const idUser = lista[0]; // id usuario
const cedulaTrabajador = lista[1]; // cédula trabajador

const formulario = document.querySelector(".form"); // form
const cedula = document.querySelector(".cedula"); // input cedula
const nombre = document.querySelector(".nombre"); // input nombre
const apellido = document.querySelector(".apellido"); // input apellido
const nacimiento = document.querySelector(".fecha"); // input fecha
const contrasena = document.querySelector(".contrasena"); // input contraseña
const contrasenaValidar = document.querySelector(".contrasenaValidar"); // input confirmar contraseña
const oficio = document.querySelector(".oficio"); // select oficio
const botonAdminTemporal = document.getElementById("adminTemporal") // botón admin temporal
let admin = false; // bandera admin
let adminTemporal = false; // bandera admin temporal
const validar = async (e) => { // validar formulario
    e.preventDefault(); // evitar reload
    if (!nacimiento.value == "") { // si hay fecha
        if (validarEdad(nacimiento.value)) return alertaError("Error: No es mayor de 18 Años") // menor a 18
        if (validarEdadMayor(nacimiento.value)) return alertaError("Error: La edad máxima permitida para trabajar es 70 años") // mayor a 70
    }
    if (contrasena.value !== contrasenaValidar.value) return alertaError("Error: Las contraseñas no coinciden"); // contraseñas distintas
    const datos = { // objeto datos
        cedula: cedula.value, // cédula
        nombre: nombre.value, // nombre
        apellido: apellido.value, // apellido
        nacimiento: nacimiento.value, // fecha
        contrasena: contrasena.value, // contraseña
        idOficio: admin ? "1" : oficio.value, // admin u oficio
    };
    ActualizarTrabajador(datos); // actualizar trabajador
};
const ActualizarTrabajador = async (datos) => { // actualizar datos trabajador
    try { // intentar
        const response = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${cedulaTrabajador}`, { // fetch PUT
            method: "PUT", // método
            headers: { // cabeceras
                "Content-Type": "application/json" // json
            },
            body: JSON.stringify(datos) // cuerpo
        });

        const mensaje = await response.text(); // mensaje respuesta
        if (!response.ok) { // si falla
            throw new Error(mensaje); // lanzar error
        }
        await alertaOK("Trabajador Creado con Exito."); // alerta ok
        formulario.action = `trabajadoresTablas.html#${idUser}`; // redirigir
        formulario.submit(); // enviar form
    } catch (error) { // error
        alertaError(error.message); // alerta error
    }
};
const validarEdad = (fechaNacimiento) => { // validar edad mínima
    const hoy = new Date(); // fecha actual
    const nacimiento = new Date(fechaNacimiento); // fecha nac

    let edad = hoy.getFullYear() - nacimiento.getFullYear(); // años
    const mes = hoy.getMonth() - nacimiento.getMonth(); // meses

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) { // ajuste
        edad--; // restar año
    }

    if (edad >= 18) { // mayor igual 18
        return false // válido
    } else { // menor
        return true; // inválido
    }
}
const validarEdadMayor = (fechaNacimiento) => { // validar edad máxima
    const hoy = new Date(); // fecha actual
    const nacimiento = new Date(fechaNacimiento); // fecha nac

    let edad = hoy.getFullYear() - nacimiento.getFullYear(); // años
    const mes = hoy.getMonth() - nacimiento.getMonth(); // meses

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) { // ajuste
        edad--; // restar
    }
    if (edad > 70) { // mayor 70
        return true // inválido
    } else { // válido
        return false; // ok
    }
}
const cargarOficios = async () => { // cargar oficios
    try { // intentar
        const res = await fetch("http://localhost:8080/ApiRestaurente/api/oficios"); // fetch oficios
        const data = await res.json(); // json
        oficio.innerHTML = data.map(o => `${o.codigo != 1 ? `<option value="${o.codigo}">${o.tipo}</option>` : ""}`).join(""); // llenar select
    } catch (error) { // error
        console.error("Error cargando oficios:", error); // log error
    }
};

const infoTrabajador = async () => { // cargar info trabajador
    const botonVolver = document.getElementById("volver"); // botón volver
    botonVolver.action = `trabajadoresTablas.html#${idUser}`; // ruta volver

    await cargarOficios(); // cargar oficios

    try { // intentar
        const res = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${cedulaTrabajador}`); // fetch trabajador
        const data = await res.json(); // json

        cedula.value = data.cedula; // set cedula
        nombre.value = data.nombre; // set nombre
        apellido.value = data.apellido; // set apellido
        nacimiento.value = data.nacimiento; // set fecha
        contrasena.value = data.contrasena; // set pass
        contrasenaValidar.value = data.contrasena; // set validar pass
        oficio.value = data.idOficio; // set oficio
        if (data.idOficio == "1") { // si admin
            oficio.parentElement.style.display = "none" // ocultar select
            admin = true; // admin true
        } 
        if (adminTemporal) { // si admin temporal
            oficio.parentElement.style.display = "none" // ocultar select
        }
        if (data.idOficio == "1" || data.idOficio == "3") botonAdminTemporal.style.display = "none"; // ocultar botón
        if (adminTemporal) { // si temporal
            botonAdminTemporal.style.display = "none" // ocultar botón
        }
    } catch (error) { // error
        console.error("Error:", error); // log error
    }
};
const ValidaradminTemporal = async () => { // validar admin temporal
    try { // intentar
        const res = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${idUser}`); // fetch usuario
        const data = await res.json(); // json
        data.adminTemporalFin && data.adminTemporalInicio ? adminTemporal = true : adminTemporal = false; // set flag
    } catch (error) { // error
        console.error("Error:", error); // log error
    }
}
document.addEventListener("DOMContentLoaded",async () => { // al cargar DOM
    cargarHeader(idUser); // cargar header
    await ValidaradminTemporal() // validar admin temp
    infoTrabajador(); // cargar info trabajador
    botonAdminTemporal.action = `trabajadorAdminTemporal.html#${idUser}/${cedulaTrabajador}`; // ruta admin temp
}
);
formulario.addEventListener("submit", validar); // evento submit
