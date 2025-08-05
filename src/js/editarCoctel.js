import { alertaError, alertaOK } from "./alertas.js";
import { cargarHeader } from "./header.js";

const hash = window.location.hash.slice(1);
const [idUser, idCoctel] = hash.split("/");

const formulario = document.querySelector(".form");
const nombreCoctel = document.getElementById("nombreCoctel");
const precioCoctel = document.getElementById("precioCoctel");
const disponibleCoctel = document.getElementById("disponibleCoctel");

const validar = async (e) => {
  e.preventDefault();

  const datos = {
    nombre: nombreCoctel.value,
    precio: precioCoctel.value,
    disponible: disponibleCoctel.checked ? "1" : "0"
  };

  try {
    const response = await fetch(`http://localhost:8080/ApiRestaurente/api/cocteles/${idCoctel}`, {
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

const infoCoctel = async () => {
  const botonVolver = document.getElementById("volver");
  botonVolver.action = `platillos.html#${idUser}`;

  try {
    const res = await fetch(`http://localhost:8080/ApiRestaurente/api/cocteles/${idCoctel}`);
    const data = await res.json();

    nombreCoctel.value = data.nombre;
    precioCoctel.value = data.precio;
    disponibleCoctel.checked = data.disponible === "1" || data.disponible === 1;
  } catch (error) {
    console.error("Error al cargar el cóctel:", error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  cargarHeader(idUser);
  infoCoctel();
});
formulario.addEventListener("submit", validar);
