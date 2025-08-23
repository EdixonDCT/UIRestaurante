import { alertaError, alertaOK } from "../alertas.js"; // importar alertas
import { cargarHeader } from "../header.js"; // importar header

const hash = window.location.hash.slice(1); // obtener hash de la url
const [idUser, idCoctel] = hash.split("/"); // separar id usuario y cóctel

const formulario = document.querySelector(".form"); // seleccionar formulario
const nombreCoctel = document.querySelector(".nombre"); // input nombre
const precioCoctel = document.querySelector(".precio"); // input precio

const validar = async (e) => { // función validar
  e.preventDefault(); // prevenir recarga

  const datos = { // objeto datos
    nombre: nombreCoctel.value, // valor nombre
    precio: precioCoctel.value, // valor precio
  };

  try { // intentar enviar
    const response = await fetch(`http://localhost:8080/ApiRestaurente/api/cocteles/${idCoctel}`, { // petición put
      method: "PUT", // método put
      headers: { "Content-Type": "application/json" }, // cabecera json
      body: JSON.stringify(datos) // cuerpo datos
    });

    const mensaje = await response.text(); // leer respuesta

    if (!response.ok) throw new Error(mensaje); // lanzar error si falla

    await alertaOK(mensaje); // mostrar mensaje ok
    formulario.action = `platillosTablas.html#${idUser}`; // redirigir form
    formulario.submit(); // enviar form
  } catch (error) { // capturar error
    alertaError(error.message); // mostrar error
  }
};

const infoCoctel = async () => { // función cargar info
  const botonVolver = document.getElementById("volver"); // botón volver
  botonVolver.action = `platillosTablas.html#${idUser}`; // asignar acción

  try { // intentar obtener
    const res = await fetch(`http://localhost:8080/ApiRestaurente/api/cocteles/${idCoctel}`); // petición get
    const data = await res.json(); // convertir a json

    nombreCoctel.value = data.nombre; // asignar nombre
    precioCoctel.value = data.precio; // asignar precio
  } catch (error) { // si falla
    console.error("Error al cargar el cóctel:", error); // error consola
  }
};

document.addEventListener("DOMContentLoaded", () => { // al cargar
  cargarHeader(idUser); // cargar header
  infoCoctel(); // cargar cóctel
});
formulario.addEventListener("submit", validar); // validar submit
