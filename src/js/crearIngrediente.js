import { alertaError, alertaOK } from "./alertas.js";
import { cargarHeader } from "./header.js";

const hash = window.location.hash.slice(1);
const formulario = document.querySelector(".form");
const nombreIngrediente = document.getElementById("nombreIngrediente");

const validar = async (e) => {
  e.preventDefault();

  const datos = {
    nombre: nombreIngrediente.value
  };

  try {
    const response = await fetch("http://localhost:8080/ApiRestaurente/api/ingredientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    });

    const mensaje = await response.text();

    if (!response.ok) {
      throw new Error(mensaje);
    }

    await alertaOK(mensaje);
    formulario.action = `ingredientes.html#${hash}`;
    formulario.submit();
  } catch (error) {
    alertaError(error.message);
  }
};

formulario.addEventListener("submit", validar);

document.addEventListener("DOMContentLoaded", () => {
  cargarHeader(hash)
  const botonVolver = document.getElementById("volver");
  botonVolver.action = `ingredientes.html#${hash}`;
});
