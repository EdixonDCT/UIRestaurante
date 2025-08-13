import { alertaError, alertaOK } from "../alertas.js";
import { cargarHeader } from "../header.js";

const hash = window.location.hash.slice(1);
const [idUser, idBebida] = hash.split("/");

const formulario = document.querySelector(".form");
const nombreBebida = document.querySelector(".nombre");
const precioBebida = document.querySelector(".precio");
const unidadBebida = document.querySelector(".unidad");
const tipoBebida = document.querySelector(".tipo");

const validar = async (e) => {
  e.preventDefault();

  const datos = {
    nombre: nombreBebida.value,
    precio: precioBebida.value,
    unidad: unidadBebida.value,
    tipo: tipoBebida.value,
  };

  try {
    const response = await fetch(`http://localhost:8080/ApiRestaurente/api/bebidas/${idBebida}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    const mensaje = await response.text();
    if (!response.ok) throw new Error(mensaje);

    await alertaOK(mensaje);
    formulario.action = `platillosTablas.html#${idUser}`;
    formulario.submit();
  } catch (error) {
    alertaError(error.message);
  }
};

const infoBebida = async () => {
  const botonVolver = document.getElementById("volver");
  botonVolver.action = `platillosTablas.html#${idUser}`;

  try {
    const res = await fetch(`http://localhost:8080/ApiRestaurente/api/bebidas/${idBebida}`);
    const data = await res.json();

    nombreBebida.value = data.nombre;
    precioBebida.value = data.precio;
    unidadBebida.value = data.unidad;
    tipoBebida.value = data.tipo;
  } catch (error) {
    console.error("Error al cargar la bebida:", error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  cargarHeader(idUser);
  infoBebida();
});
formulario.addEventListener("submit", validar);
