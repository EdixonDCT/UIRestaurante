import { alertaError, alertaOK } from "../alertas.js"; // importar funciones de alerta
import { cargarHeader } from "../header.js"; // importar función para cargar header

const hash = window.location.hash.slice(1); // obtener hash de la url
const [idUser, idBebida] = hash.split("/"); // separar en id de usuario y bebida

const formulario = document.querySelector(".form"); // seleccionar formulario
const nombreBebida = document.querySelector(".nombre"); // input nombre
const precioBebida = document.querySelector(".precio"); // input precio
const unidadBebida = document.querySelector(".unidad"); // input unidad
const tipoBebida = document.querySelector(".tipo"); // input tipo

const validar = async (e) => { // función validar formulario
  e.preventDefault(); // prevenir recarga

  const datos = { // objeto datos
    nombre: nombreBebida.value, // valor nombre
    precio: precioBebida.value, // valor precio
    unidad: unidadBebida.value, // valor unidad
    tipo: tipoBebida.value, // valor tipo
  };

  try { // intentar enviar datos
    const response = await fetch(`http://localhost:8080/ApiRestaurente/api/bebidas/${idBebida}`, { // petición put
      method: "PUT", // método put
      headers: { "Content-Type": "application/json" }, // cabecera json
      body: JSON.stringify(datos) // cuerpo en json
    });

    const mensaje = await response.text(); // leer respuesta
    if (!response.ok) throw new Error(mensaje); // lanzar error si falla

    await alertaOK(mensaje); // mostrar mensaje ok
    formulario.action = `platillosTablas.html#${idUser}`; // redirigir formulario
    formulario.submit(); // enviar formulario
  } catch (error) { // capturar error
    alertaError(error.message); // mostrar error
  }
};

const infoBebida = async () => { // función para cargar info bebida
  const botonVolver = document.getElementById("volver"); // seleccionar botón volver
  botonVolver.action = `platillosTablas.html#${idUser}`; // asignar acción

  try { // intentar obtener bebida
    const res = await fetch(`http://localhost:8080/ApiRestaurente/api/bebidas/${idBebida}`); // petición get
    const data = await res.json(); // convertir a json

    nombreBebida.value = data.nombre; // asignar nombre
    precioBebida.value = data.precio; // asignar precio
    unidadBebida.value = data.unidad; // asignar unidad
    tipoBebida.value = data.tipo; // asignar tipo
  } catch (error) { // si falla
    console.error("Error al cargar la bebida:", error); // mostrar error
  }
};

document.addEventListener("DOMContentLoaded", () => { // cuando cargue
  cargarHeader(idUser); // cargar header
  infoBebida(); // cargar bebida
});
formulario.addEventListener("submit", validar); // validar al enviar
