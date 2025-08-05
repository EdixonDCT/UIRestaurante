import { alertaError, alertaOK } from "./alertas.js";
import { cargarHeader } from "./header.js";

const hash = window.location.hash.slice(1);
const [idUser, idBebida] = hash.split("/");

const formulario = document.querySelector(".form");
const nombreBebida = document.getElementById("nombreBebida");
const precioBebida = document.getElementById("precioBebida");
const unidadBebida = document.getElementById("unidadBebida");
const tipoBebida = document.getElementById("tipoBebida");
const disponibilidadBebida = document.getElementById("disponibilidadBebida");

const validar = async (e) => {
  e.preventDefault();

  const datos = {
    nombre: nombreBebida.value,
    precio: precioBebida.value,
    unidad: unidadBebida.value,
    tipo: tipoBebida.value,
    disponible: disponibilidadBebida.checked ? "1" : "0"
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
    formulario.action = `platillos.html#${idUser}`;
    formulario.submit();
  } catch (error) {
    alertaError(error.message);
  }
};

const infoBebida = async () => {
  const botonVolver = document.getElementById("volver");
  botonVolver.action = `platillos.html#${idUser}`;

  try {
    const res = await fetch(`http://localhost:8080/ApiRestaurente/api/bebidas/${idBebida}`);
    const data = await res.json();

    nombreBebida.value = data.nombre;
    precioBebida.value = data.precio;
    unidadBebida.value = data.unidad;
    tipoBebida.value = data.tipo;
    disponibilidadBebida.checked = data.disponible === "1";
  } catch (error) {
    console.error("Error al cargar la bebida:", error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  cargarHeader(idUser);
  infoBebida();
});
formulario.addEventListener("submit", validar);
