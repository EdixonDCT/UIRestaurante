import { alertaError, alertaOK } from "./alertas.js";
import { cargarHeader } from "./header.js";

const hash = window.location.hash.slice(1);
const lista = hash.split("/");
const idUser = lista[0];
const idComida = lista[1];

const formulario = document.querySelector(".form");
const nombreComida = document.getElementById("nombreComida");
const precioComida = document.getElementById("precioComida");
const tipoComida = document.getElementById("tipoComida");
const disponibilidadComida = document.getElementById("disponibilidadComida");

const validar = async (e) => {
  e.preventDefault();

  const datos = {
    nombre: nombreComida.value,
    precio: precioComida.value,
    tipo: tipoComida.value,
    disponible: disponibilidadComida.checked ? "1" : "0"
  };

  try {
    const response = await fetch(`http://localhost:8080/ApiRestaurente/api/comidas/${idComida}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    const mensaje = await response.text();

    if (!response.ok) throw new Error(mensaje);

    await alertaOK(mensaje);
    formulario.action = `platillos.html#${idUser}`;
    formulario.submit();
  } catch (error) {
    alertaError(error.message);
  }
};

const infoComida = async () => {
  const botonVolver = document.getElementById("volver");
  botonVolver.action = `platillos.html#${idUser}`;

  try {
    const res = await fetch(`http://localhost:8080/ApiRestaurente/api/comidas/${idComida}`);
    const data = await res.json();

    nombreComida.value = data.nombre;
    precioComida.value = data.precio;
    tipoComida.value = data.tipo;
    disponibilidadComida.checked = data.disponible === "1";
  } catch (error) {
    console.error("Error al cargar la comida:", error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  cargarHeader(idUser);
  infoComida();
});
formulario.addEventListener("submit", validar);
