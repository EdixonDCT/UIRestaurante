import { alertaError, alertaOK } from "../alertas.js"; // importar funciones de alerta
import { cargarHeader } from "../header.js"; // importar función para cargar el header

const hash = window.location.hash.slice(1); // obtener hash de la URL (sin "#")
const lista = hash.split("/"); // separar valores por "/"
const idUser = lista[0]; // primer valor es id del usuario
const idComida = lista[1]; // segundo valor es id de la comida

const formulario = document.querySelector(".form"); // referencia al formulario
const nombreComida = document.querySelector(".nombre"); // input nombre
const precioComida = document.querySelector(".precio"); // input precio
const tipoComida = document.querySelector(".tipo"); // input tipo

const validar = async (e) => { // función para validar y actualizar
  e.preventDefault(); // evitar recarga del formulario

  const datos = { // objeto con los valores del formulario
    nombre: nombreComida.value, // nombre ingresado
    precio: precioComida.value, // precio ingresado
    tipo: tipoComida.value // tipo ingresado
  };

  try { // intentar enviar datos al backend
    const response = await fetch(`http://localhost:8080/ApiRestaurente/api/comidas/${idComida}`, { // petición PUT
      method: "PUT", // método de actualización
      headers: { "Content-Type": "application/json" }, // se envía JSON
      body: JSON.stringify(datos) // convertir objeto a JSON
    });

    const mensaje = await response.text(); // leer respuesta del servidor

    if (!response.ok) throw new Error(mensaje); // lanzar error si la respuesta no es ok

    await alertaOK(mensaje); // mostrar mensaje de éxito
    formulario.action = `platillosTablas.html#${idUser}`; // redirigir formulario a página de tablas
    formulario.submit(); // enviar formulario para cambiar de vista
  } catch (error) { // si ocurre un error
    alertaError(error.message); // mostrar mensaje de error
  }
};

const infoComida = async () => { // función para cargar información de la comida
  const botonVolver = document.getElementById("volver"); // botón volver
  botonVolver.action = `platillosTablas.html#${idUser}`; // acción para volver con el idUser

  try { // intentar obtener datos
    const res = await fetch(`http://localhost:8080/ApiRestaurente/api/comidas/${idComida}`); // petición GET
    const data = await res.json(); // convertir respuesta a JSON

    nombreComida.value = data.nombre; // asignar nombre al input
    precioComida.value = data.precio; // asignar precio al input
    tipoComida.value = data.tipo; // asignar tipo al input
  } catch (error) { // si ocurre error
    console.error("Error al cargar la comida:", error); // mostrar error en consola
  }
};

document.addEventListener("DOMContentLoaded", () => { // cuando el DOM esté listo
  cargarHeader(idUser); // cargar header con id del usuario
  infoComida(); // cargar información de la comida
});
formulario.addEventListener("submit", validar); // validar formulario al enviar
